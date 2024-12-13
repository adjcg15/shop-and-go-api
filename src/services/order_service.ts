import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { IOrderProducts } from "../types/interfaces/request_bodies";
import { ErrorMessages } from "../types/enums/error_messages";
import { CreateOrderErrorCodes } from "../types/enums/error_codes";
import { getCurrentDateTimeSQL } from "../lib/datetime_service";

async function createOrder(
    order: { 
        idStore: number, 
        idClient: number, 
        idDeliveryAddress: number, 
        idPaymentMethod: number, 
        idStatus: number, 
        products: IOrderProducts[] }
    ) {

    const sequelize = db.sequelize;
    const transaction = await sequelize.transaction();

    try {
        const {
            idStore, 
            idClient, 
            idDeliveryAddress, 
            idPaymentMethod, 
            idStatus, 
            products 
        } = order;

        const client = await db.Client.findByPk(idClient);

        if(client === null) {
            throw new BusinessLogicException(
                ErrorMessages.CLIENT_NOT_FOUND,
                CreateOrderErrorCodes.CLIENT_NOT_FOUND
            );
        }

        const deliveryAddress = await db.Address.findByPk(idDeliveryAddress);

        if(deliveryAddress === null) {
            throw new BusinessLogicException(
                ErrorMessages.DELIVERY_ADDRESS_NOT_FOUND,
                CreateOrderErrorCodes.DELIVERY_ADDRESS_NOT_FOUND
            );
        }

        const paymentMethod = await db.PaymentMethod.findByPk(idPaymentMethod);

        if(paymentMethod === null) {
            throw new BusinessLogicException(
                ErrorMessages.PAYMENT_METHOD_NOT_FOUND,
                CreateOrderErrorCodes.PAYMENT_METHOD_NOT_FOUND
            );
        }

        const store = await db.Store.findByPk(idStore);

        if(store === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                CreateOrderErrorCodes.STORE_NOT_FOUND
            );
        }

        const orderStatus = await db.OrderStatus.findByPk(idStatus);

        if(orderStatus === null) {
            throw new BusinessLogicException(
                ErrorMessages.ORDER_STATUS_NOT_FOUND,
                CreateOrderErrorCodes.ORDER_STATUS_NOT_FOUND
            );
        }

        for(const product of products) {
            const existingProduct = await db.Product.findByPk(product.idProduct);

            if(existingProduct === null) {
                throw new BusinessLogicException(
                    ErrorMessages.PRODUCT_NOT_FOUND,
                    CreateOrderErrorCodes.PRODUCT_NOT_FOUND
                );
            }

            const inventory = await db.Inventory.findOne({
                where: {
                    idProduct: product.idProduct, idStore
                }
            });

            if(inventory === null) {
                throw new BusinessLogicException(
                    ErrorMessages.INVENTORY_DOES_NOT_EXIST,
                    CreateOrderErrorCodes.INVENTORY_DOES_NOT_EXIST
                );
            }

            if(product.amount > existingProduct.maximumAmount) {
                throw new BusinessLogicException(
                    ErrorMessages.MAXIMUM_AMOUNT_IS_EXCEEDED,
                    CreateOrderErrorCodes.MAXIMUM_AMOUNT_IS_EXCEEDED
                );
            }

            if(product.amount > inventory.stock) {
                throw new BusinessLogicException(
                    ErrorMessages.STOCK_NOT_AVAILABLE,
                    CreateOrderErrorCodes.STOCK_NOT_AVAILABLE
                );
            }
        }

        const currentDateTime = getCurrentDateTimeSQL();

        const orderInDB = await db.Order.create({
            dateOfPurchase: currentDateTime,
            idClient,
            idDeliveryAddress,
            idPaymentMethod,
            idStatus
        },
        {
            transaction
        });

        for(const product of products) {
            await db.OrderProduct.create({
                idOrder: orderInDB.id,
                idProduct: product.idProduct,
                amount: product.amount
            },
            {
                transaction
            });
        }

        await transaction.commit();
    } catch (error: any) {
        await transaction.rollback();
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }
}

export {
    createOrder
}