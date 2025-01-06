import { NextFunction, Request, Response } from "express";
import { IPaginationQuery } from "../types/interfaces/request_queries";
import { getIncidentsList } from "../services/incidents_service";
import { HttpStatusCodes } from "../types/enums/http";

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

export {
    getIncidentsListController
};