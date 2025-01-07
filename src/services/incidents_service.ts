import { InferAttributes, Transaction } from "sequelize";
import Incident from "../models/Incident";
import SQLException from "../exceptions/services/SQLException";
import db from "../models";
import { OrderStatus } from "../types/enums/order_status";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { HttpStatusCodes } from "../types/enums/http";

async function getIncidentsList(pagination: { offset: number; limit: number; }) {
    const incidentsSummary: {
        incidents: InferAttributes<Incident>[],
        count: number
    } = { incidents: [], count: 0 };

    try {
        const { limit, offset } = pagination;
        const { rows, count } = await db.Incident.findAndCountAll({
            offset,
            limit,
            order: [["creationDate", "DESC"]]
        });

        incidentsSummary.incidents = rows.map(incident => incident.toJSON());
        incidentsSummary.count = count;
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return incidentsSummary;
}

async function createIncident(idDeliveryMan: number, incidentInfo: Omit<InferAttributes<Incident>, "id">) {
    let transaction: Transaction | null = null;
    let newIncident = null;

    try {
        const dbCanceledOrderStatus = await db.OrderStatus.findOne({ 
            where: { title: OrderStatus.CANCELED }
        });
        if(!dbCanceledOrderStatus) {
            throw new BusinessLogicException(
                "The order status CANCELED is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        transaction = await db.sequelize.transaction();

        const dbIncident = await db.Incident.create(incidentInfo, { transaction });
        
        const dbOrder = await db.Order.findByPk(incidentInfo.idOrder);
        dbOrder!.idStatus = dbCanceledOrderStatus.id;
        await dbOrder!.save({ transaction });

        const dbDeliveryMan = await db.Employee.findByPk(idDeliveryMan);
        dbDeliveryMan!.isAvailableForWork = true;
        await dbDeliveryMan!.save({ transaction });

        await transaction.commit();

        newIncident = dbIncident.toJSON();
    } catch(error: any) {
        if(transaction) await transaction.rollback();
        
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return newIncident;
}

async function isOrderBeingDeliveredByDeliveryMan(idOrder: number, idDeliveryMan: number) {
    let isOwner = false;

    try {
        const dbSentOrderStatus = await db.OrderStatus.findOne({ 
            where: { title: OrderStatus.SENT }
        });
        if(!dbSentOrderStatus) {
            throw new BusinessLogicException(
                "The order status SENT is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const dbOrder = await db.Order.findOne({
            where: { id: idOrder, idDeliveryMan, idStatus: dbSentOrderStatus.id }
        });
        
        if(dbOrder) isOwner = true;
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return isOwner;
}

export {
    getIncidentsList,
    createIncident,
    isOrderBeingDeliveredByDeliveryMan
};