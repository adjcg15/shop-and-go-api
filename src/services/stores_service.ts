import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Store from "../models/Store";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { HttpStatusCodes } from "../types/enums/http";

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

async function updateStore(store: InferAttributes<Store>) {
    let updatedStore: InferAttributes<Store> | null = null;

    try {
        const dbStore = await db.Store.findByPk(store.id);

        if(dbStore === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND, 
                undefined, 
                HttpStatusCodes.NOT_FOUND
            );
        }

        await dbStore.update(store);

        updatedStore = dbStore.toJSON();
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return updatedStore;
}

export {
    getStores,
    updateStore
}