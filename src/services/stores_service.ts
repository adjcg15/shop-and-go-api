import { InferAttributes, Op, UniqueConstraintError } from "sequelize";
import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import Store from "../models/Store";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { CreateStoreErrorCodes, GetStoreErrorCodes, UpdateStoreErrorCodes } from "../types/enums/error_codes";
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

async function updateStore(store: InferAttributes<Store>) {
    let updatedStore: InferAttributes<Store> | null = null;

    try {
        const dbStore = await db.Store.findByPk(store.id);

        if (dbStore === null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NOT_FOUND,
                undefined,
                HttpStatusCodes.NOT_FOUND
            );
        }

        const duplicatedStore = await db.Store.findOne({
            where: { 
                id: { [Op.ne]: store.id },
                latitude: store.latitude, 
                longitude: store.longitude 
            }
        });

        if(duplicatedStore) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_LOCATION_DUPLICATED,
                UpdateStoreErrorCodes.STORE_LOCATION_DUPLICATED
            );
        }

        await dbStore.update(store);
        updatedStore = dbStore.toJSON();
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else if(error instanceof UniqueConstraintError) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NAME_DUPLICATED, 
                UpdateStoreErrorCodes.STORE_NAME_DUPLICATED
            );
        } else {
            throw new SQLException(error);
        }
    }

    return updatedStore;
}

async function createStore(storeInformation: Omit<InferAttributes<Store>, "id">) {
    let newStore: InferAttributes<Store> | null = null;

    try {
        let dbStore = await db.Store.findOne({
            where: { 
                latitude: storeInformation.latitude, 
                longitude: storeInformation.longitude 
            }
        });

        if(dbStore !== null) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_LOCATION_DUPLICATED,
                CreateStoreErrorCodes.STORE_LOCATION_DUPLICATED
            );
        }

        dbStore = await db.Store.create(storeInformation);
        newStore = dbStore.toJSON();
    } catch (error: any) {
        if (error.isTrusted) {
            throw error;
        } else if(error instanceof UniqueConstraintError) {
            throw new BusinessLogicException(
                ErrorMessages.STORE_NAME_DUPLICATED, 
                CreateStoreErrorCodes.STORE_NAME_DUPLICATED
            );
        } else {
            throw new SQLException(error);
        }
    }

    return newStore;
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

async function getStoreWhereEmployeeWorks(idEmployee: number) {
    let store: InferAttributes<Store> | null = null;

    try {
        const employee = await db.Employee.findByPk(idEmployee);
        if(employee) {
            const dbStore = await db.Store.findByPk(employee.idStore);

            if(dbStore) {
                store = dbStore?.toJSON();
            }
        }
    } catch (error: any) {
        throw new SQLException(error);
    }

    return store;
}

export { updateStore, getStores, getStore, createStore, getStoreWhereEmployeeWorks };
