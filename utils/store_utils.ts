import { InferAttributes } from "sequelize";
import { getDistanceInMetersBetweenTwoPoints } from "../src/lib/distance_service";
import Store from "../src/models/Store";
import BusinessLogicException from "../src/exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../src/types/enums/error_messages";

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
