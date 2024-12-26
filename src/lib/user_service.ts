import { IClientWithOptionalPassword, IEmployeeWithPosition } from "../types/interfaces/response_bodies";

function isEmployeeWithPosition(user: IClientWithOptionalPassword | IEmployeeWithPosition): user is IEmployeeWithPosition {
    return (user as IEmployeeWithPosition).position !== undefined;
}

export {
    isEmployeeWithPosition
}