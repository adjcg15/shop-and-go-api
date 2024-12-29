import { getDistance } from "geolib";
import { InferAttributes } from "sequelize";
import Store from "../models/Store";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";

function getDistanceInMetersBetweenTwoPoints(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
): number {
    return getDistance(point1, point2);
}

function findNearestStore(
    latitude: number,
    longitude: number,
    stores: InferAttributes<Store>[]
) {
    let nearestStore = stores[0];
    let minDistance = getDistanceInMetersBetweenTwoPoints(
        { latitude, longitude },
        { latitude: nearestStore.latitude, longitude: nearestStore.longitude }
    );

    for (const store of stores) {
        const distance = getDistanceInMetersBetweenTwoPoints(
            { latitude, longitude },
            { latitude: store.latitude, longitude: store.longitude }
        );

        if (distance < minDistance) {
            nearestStore = store;
            minDistance = distance;
        }
    }
    
    return { nearestStore, minDistance };
}

function validateNearestStoreDistance(distance: number) {
    const MAX_DISTANCE_IN_METERS = 5000;
    if (distance > MAX_DISTANCE_IN_METERS) {
        throw new BusinessLogicException(
            ErrorMessages.NO_STORE_NEARBY
        );
    }
}

export { 
    findNearestStore, 
    validateNearestStoreDistance 
};


export { 
    getDistanceInMetersBetweenTwoPoints
};
