import db from "../models";
import SQLException from "../exceptions/services/SQLException";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";
import { IEmployeeWithPosition, IClientWithOptionalPassword } from "../types/interfaces/response_bodies";
import UserRoles from "../types/enums/user_roles";

async function getUserByPhoneNumber(phoneNumber?: string) {
    let userInformation: IClientWithOptionalPassword | IEmployeeWithPosition;

    try {
        const client = await db.Client.findOne({
            where: {
                phoneNumber
            }
        });

        if (client === null) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        userInformation = client.toJSON();
        
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return userInformation;
}

async function getUserByUsername(userName?: string) {
    let userInformation: IClientWithOptionalPassword | IEmployeeWithPosition;

    try {
        const employee = await db.Employee.findOne({
            where: {
                user: userName
            },
            include: [{
                association: db.Employee.associations.position
            }]
        });

        if (employee === null) {
            throw new BusinessLogicException(ErrorMessages.INVALID_CREDENTIALS);
        }

        const position: UserRoles = employee.position!.title as UserRoles; 
        userInformation = { 
            ...employee.toJSON(), 
            position
        };
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return userInformation;
}

export {
    getUserByPhoneNumber,
    getUserByUsername
}