import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Store from "../models/Store";

async function getStores() {
    const storesList: InferAttributes<Store>[] = [];
    try {
        const stores = await db.Store.findAll({
            order: [["name", "ASC"]]
        });

        stores.forEach(store => {
            storesList.push(store.toJSON());
        });
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return storesList;
}

export {
    getStores
}