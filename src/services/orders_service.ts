import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { IOrderProductsBody } from "../types/interfaces/request_bodies";
import { ErrorMessages } from "../types/enums/error_messages";
import { CreateOrderErrorCodes, CreateOrderToDeliverErrorCodes } from "../types/enums/error_codes";
import { getCurrentDateTimeSQL } from "../lib/datetime_service";
import { OrderStatus } from "../types/enums/order_status";
import { InferAttributes, Transaction } from "sequelize";
import Order from "../models/Order";
import { HttpStatusCodes } from "../types/enums/http";

async function createOrder(order: {
    idStore: number;
    idClient: number;
    idDeliveryAddress: number;
    idPaymentMethod: number;
    products: IOrderProductsBody[];
}) {
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
        const {
            idStore,
            idClient,
            idDeliveryAddress,
            idPaymentMethod,
            products,
        } = order;

        const client = await db.Client.findByPk(idClient);

        if (client === null) {
            throw new BusinessLogicException(
                ErrorMessages.CLIENT_NOT_FOUND,
                CreateOrderErrorCodes.CLIENT_NOT_FOUND
            );
        }

        const deliveryAddress = await db.Address.findByPk(idDeliveryAddress);

        if (deliveryAddress === null) {
            throw new BusinessLogicException(
                ErrorMessages.DELIVERY_ADDRESS_NOT_FOUND,
                CreateOrderErrorCodes.DELIVERY_ADDRESS_NOT_FOUND
            );
        }

        const paymentMethod = await db.PaymentMethod.findByPk(idPaymentMethod);

        if (paymentMethod === null) {
            throw new BusinessLogicException(
                ErrorMessages.PAYMENT_METHOD_NOT_FOUND,
                CreateOrderErrorCodes.PAYMENT_METHOD_NOT_FOUND
            );
        }

        const store = await db.Store.findByPk(idStore);

        if (store === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                CreateOrderErrorCodes.STORE_NOT_FOUND
            );
        }

        const orderStatus = await db.OrderStatus.findOne({
            where: {
                title: OrderStatus.CREATED,
            },
        });

        if (orderStatus === null) {
            throw new BusinessLogicException(
                ErrorMessages.ORDER_STATUS_NOT_FOUND,
                CreateOrderErrorCodes.ORDER_STATUS_NOT_FOUND
            );
        }

        for (const product of products) {
            const existingProduct = await db.Product.findByPk(
                product.idProduct
            );

            if (existingProduct === null) {
                throw new BusinessLogicException(
                    ErrorMessages.PRODUCT_NOT_FOUND,
                    CreateOrderErrorCodes.PRODUCT_NOT_FOUND
                );
            }

            const inventory = await db.Inventory.findOne({
                where: {
                    idProduct: product.idProduct,
                    idStore,
                },
            });

            if (inventory === null) {
                throw new BusinessLogicException(
                    ErrorMessages.INVENTORY_DOES_NOT_EXIST,
                    CreateOrderErrorCodes.INVENTORY_DOES_NOT_EXIST
                );
            }

            if (product.amount > existingProduct.maximumAmount) {
                throw new BusinessLogicException(
                    ErrorMessages.MAXIMUM_AMOUNT_IS_EXCEEDED,
                    CreateOrderErrorCodes.MAXIMUM_AMOUNT_IS_EXCEEDED
                );
            }

            if (product.amount > inventory.stock) {
                throw new BusinessLogicException(
                    ErrorMessages.STOCK_NOT_AVAILABLE,
                    CreateOrderErrorCodes.STOCK_NOT_AVAILABLE
                );
            }
        }

        const currentDate = getCurrentDateTimeSQL();

        const orderInDB = await db.Order.create(
            {
                dateOfPurchase: currentDate,
                idClient,
                idDeliveryAddress,
                idPaymentMethod,
                idStore,
                idStatus: orderStatus.id,
            },
            {
                transaction,
            }
        );

        for (const product of products) {
            await db.OrderProduct.create(
                {
                    idOrder: orderInDB.id,
                    idProduct: product.idProduct,
                    amount: product.amount,
                },
                {
                    transaction,
                }
            );
            await db.Inventory.update(
                {
                    stock: sequelize.literal(`cantidad - ${product.amount}`),
                },
                {
                    where: {
                        idProduct: product.idProduct,
                        idStore,
                    },
                    transaction,
                }
            );
        }

        await transaction.commit();
    } catch (error: any) {
        await transaction.rollback();
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

async function getOrdersByEmployeeAndStatus(
    idEmployee: number,
    status: string
) {
    const ordersList: InferAttributes<Order>[] = [];

    try {
        const existingStatus = await db.OrderStatus.findOne({
            where: { title: status },
        });

        if (existingStatus === null) {
            throw new BusinessLogicException(
                ErrorMessages.ORDER_STATUS_NOT_FOUND
            );
        }

        const orders = await Order.findAll({
            where: { idDeliveryMan: idEmployee, idStatus: existingStatus.id },
            include: [
                {
                    association: "deliveryAddress",
                },
                {
                    association: "client",
                },
                {
                    association: "products",
                },
            ],
        });

        orders.forEach((order) => {
            ordersList.push({
                ...order.toJSON(),
            });
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return ordersList;
}

async function getOrdersToAssign(idStore: number) {
    const ordersList: InferAttributes<Order>[] = [];

    try {
        const dbCreatedOrderStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.CREATED },
        });
        if (!dbCreatedOrderStatus) {
            throw new BusinessLogicException(
                "The order status CREATED is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const orders = await db.Order.findAll({
            where: { idStore, idStatus: dbCreatedOrderStatus.id },
            include: [{ association: db.Order.associations.deliveryAddress }],
            order: [["dateOfPurchase", "ASC"]],
        });

        orders.forEach((order) => ordersList.push(order.toJSON()));
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return ordersList;
}

async function getOrderToAssignByIdInStore(idStore: number, idOrder: number) {
    let order: InferAttributes<Order>;

    try {
        const dbCreatedOrderStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.CREATED },
        });
        if (!dbCreatedOrderStatus) {
            throw new BusinessLogicException(
                "The order status CREATED is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const dbOrder = await db.Order.findOne({
            where: { id: idOrder, idStore, idStatus: dbCreatedOrderStatus.id },
            include: [
                { association: db.Order.associations.deliveryAddress },
                { association: db.Order.associations.client },
                { association: db.Order.associations.products }
            ],
            order: [["dateOfPurchase", "ASC"]],
        });

        if(!dbOrder) {
            throw new BusinessLogicException(
                ErrorMessages.ORDER_NOT_FOUND,
                undefined,
                HttpStatusCodes.NOT_FOUND
            );
        }

        order = dbOrder.toJSON();
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return order;
}

async function deliverOrder(idEmployee: number, idOrder: number) {
    let deliveredOrder = null;
    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
        const deliveredStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.DELIVERED },
        });

        if (!deliveredStatus) {
            throw new BusinessLogicException(
                "The order status DELIVERED is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        await db.Employee.update(
            {
                isAvailableForWork: true,
            },
            {
                where: { id: idEmployee },
                transaction,
            }
        );

        const orderToDeliver = await db.Order.findByPk(idOrder);

        if (!orderToDeliver) {
            throw new BusinessLogicException(
                "Order is not registered on database and is needed",
                undefined,
                HttpStatusCodes.NOT_FOUND
            );
        }

        const deliveryDate = getCurrentDateTimeSQL();

        await orderToDeliver.update(
            {
                idStatus: deliveredStatus.id,
                deliveryDate: deliveryDate,
            },
            {
                where: { id: idOrder },
                transaction,
            }
        );

        await transaction.commit();

        deliveredOrder = orderToDeliver.toJSON();
    } catch (error: any) {
        await transaction.rollback();

        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return deliveredOrder;
}

async function assignOrderToDeliveryMan({
    idOrder, idStore, idDeliveryMan
}: { idOrder: number, idDeliveryMan: number, idStore: number }) {
    let assignedOrder: InferAttributes<Order>;
    let transaction: Transaction | null = null;

    try {
        const sentOrderStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.SENT },
        });
        if (!sentOrderStatus) {
            throw new BusinessLogicException(
                "The order status SENT is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }
        const createdOrderStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.CREATED },
        });
        if (!createdOrderStatus) {
            throw new BusinessLogicException(
                "The order status CREATED is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const order = await db.Order.findOne(
            { where: { idStore, id: idOrder, idStatus: createdOrderStatus.id } }
        );
        if(!order) {
            throw new BusinessLogicException(
                "The order was not found, maybe it is already assigned",
                CreateOrderToDeliverErrorCodes.ORDER_NOT_FOUND
            );
        }

        const deliveryMan = await db.Employee.findOne(
            { where: { idStore, id: idDeliveryMan, isAvailableForWork: true, isActive: true } }
        );
        if(!deliveryMan) {
            throw new BusinessLogicException(
                "The employee was not found, maybe it is already full of work",
                CreateOrderToDeliverErrorCodes.EMPLOYEE_NOT_FOUND
            );
        }
        const totalAssignedOrdersToDeliveryMan = await db.Order.count(
            { where: { idDeliveryMan: deliveryMan.id, idStatus: sentOrderStatus.id } }
        );
        const MAXIMUM_ORDERS_PER_DELIVERY_MAN = 3;
        if(totalAssignedOrdersToDeliveryMan >= MAXIMUM_ORDERS_PER_DELIVERY_MAN) {
            throw new BusinessLogicException(
                "This delivery man has reached their maximum orders to deliver allowed",
                CreateOrderToDeliverErrorCodes.EMPLOYEE_NOT_FOUND
            );
        }

        transaction = await db.sequelize.transaction();

        order.idStatus = sentOrderStatus.id;
        order.idDeliveryMan = deliveryMan.id;
        await order.save({ transaction });

        deliveryMan.isAvailableForWork = (totalAssignedOrdersToDeliveryMan + 1) < MAXIMUM_ORDERS_PER_DELIVERY_MAN;
        await deliveryMan.save({ transaction });

        await transaction.commit();

        assignedOrder = order.toJSON();
    } catch (error: any) {
        if(transaction) await transaction.rollback();

        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return assignedOrder;
}

async function isOrderBeingDeliveredByDeliveryMan(
    idOrder: number,
    idDeliveryMan: number
) {
    let isOwner = false;

    try {
        const dbSentOrderStatus = await db.OrderStatus.findOne({
            where: { title: OrderStatus.SENT },
        });
        if (!dbSentOrderStatus) {
            throw new BusinessLogicException(
                "The order status SENT is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const dbOrder = await db.Order.findOne({
            where: {
                id: idOrder,
                idDeliveryMan,
                idStatus: dbSentOrderStatus.id,
            },
        });

        if (dbOrder) isOwner = true;
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return isOwner;
}

export {
    createOrder,
    getOrdersByEmployeeAndStatus,
    getOrdersToAssign,
    deliverOrder,
    isOrderBeingDeliveredByDeliveryMan,
    getOrderToAssignByIdInStore,
    assignOrderToDeliveryMan
};
