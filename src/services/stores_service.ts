import { InferAttributes } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Store from "../models/Store";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { GetStoreErrorCodes } from "../types/enums/error_codes";
import { HttpStatusCodes } from "../types/enums/http";

async function getStores() {
    const storesList: InferAttributes<Store>[] = [];
    try {
        const stores = await db.Store.findAll({
            order: [["name", "ASC"]],
        });

        stores.forEach((store) => {
            storesList.push(store.toJSON());
        });
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return storesList;
}

async function getStore(idStore: number) {
    let store: InferAttributes<Store> | null = null;
    try {
        const storeDB = await db.Store.findByPk(idStore);

        if (storeDB === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                GetStoreErrorCodes.STORE_NOT_FOUND,
                HttpStatusCodes.NOT_FOUND
            );
        }

        store = storeDB.toJSON();
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return store;
}

export { getStores, getStore };
