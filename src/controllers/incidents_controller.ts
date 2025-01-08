import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { createIncident, getIncidentsList, isOrderBeingDeliveredByDeliveryMan } from "../services/incidents_service";
import { HttpStatusCodes } from "../types/enums/http";
import { InferAttributes } from "sequelize";
import Incident from "../models/Incident";
import { getCurrentDateTimeSQL } from "../lib/datetime_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";

async function getIncidentsListController(
    req: Request<{}, {}, {}, IPaginationQuery>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const { limit, offset } = req.query;

        const incidentsSummary = await getIncidentsList({
            limit: limit!,
            offset: offset!
        });

        res.status(HttpStatusCodes.OK).json(incidentsSummary);
    } catch (error) {
        next(error);
    }
}

async function createIncidentController(
    req: Request<{}, {}, Omit<InferAttributes<Incident>, "id">, {}>, 
    res: Response, 
    next: NextFunction
) {
    try {
        const { idOrder, reason } = req.body;
        const { id: idDeliveryMan } = req.user;

        const isOrderOwner = await isOrderBeingDeliveredByDeliveryMan(idOrder, idDeliveryMan);
        if(!isOrderOwner) {
            throw new BusinessLogicException(
                ErrorMessages.ORDER_NOT_FOUND,
                undefined,
                HttpStatusCodes.NOT_FOUND
            );
        }

        const incident = await createIncident(
            idDeliveryMan, 
            {
                idOrder: idOrder,
                reason,
                creationDate: getCurrentDateTimeSQL()
            }
        );

        res.status(HttpStatusCodes.CREATED).send(incident);
    } catch (error) {
        next(error);
    }
}

export {
    getIncidentsListController,
    createIncidentController
};