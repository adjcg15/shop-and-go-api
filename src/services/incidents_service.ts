import { InferAttributes } from "sequelize";
import Incident from "../models/Incident";
import SQLException from "../exceptions/services/SQLException";
import db from "../models";

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

export {
    getIncidentsList
};