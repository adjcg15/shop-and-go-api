import { getDistance } from "geolib";

function getDistanceInMetersBetweenTwoPoints(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
): number {
    return getDistance(point1, point2);
}

export { 
    getDistanceInMetersBetweenTwoPoints
};
