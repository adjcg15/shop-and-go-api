import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import SQLException from "../exceptions/services/SQLException";
import { hashString } from "../lib/security_service";
import db from "../models";
import EmployeePosition from "../models/EmployeePosition";
import Employee from "../models/Employee";
import Store from "../models/Store";
import { CreateEmployeeErrorCodes } from "../types/enums/error_codes";
import { ErrorMessages } from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import { IEmployeeWithPosition } from "../types/interfaces/response_bodies";

async function getEmployeeById(id: number) {
    let employee: IEmployeeWithPosition;

    try {
        const dbEmployee = await db.Employee.findByPk(id, {
            include: [{
                association: db.Employee.associations.position
            }]
        });

        if (dbEmployee === null) {
            throw new BusinessLogicException(ErrorMessages.EMPLOYEE_NOT_FOUND);
        }

        const position: UserRoles = dbEmployee.position!.title as UserRoles; 
        employee = { 
            ...dbEmployee.toJSON(), 
            position
        };
        delete employee.passwordHash;
    } catch (error: any) {
        if(error.isTrusted) {
            throw error;
        } else {
            throw new SQLException(error);
        }
    }

    return employee;
}

async function createEmployee( 
    employee: {
        fullName: string,
        user: string,
        password: string,
        registrationDate: string,
        idStore: number,
        idPosition: number,
    }
) {
    try {
        const { fullName, user, password, registrationDate, idStore, idPosition } = employee

        const store = await Store.findByPk(idStore);

        if (store === null) {
            throw new BusinessLogicException(
              ErrorMessages.STORE_NOT_FOUND,
              CreateEmployeeErrorCodes.STORE_NOT_FOUND
            );
        }

        const position = await EmployeePosition.findByPk(idPosition);

        if (position === null) {
            throw new BusinessLogicException(
                ErrorMessages.EMPLOYEE_POSITION_NOT_FOUND,
                CreateEmployeeErrorCodes.EMPLOYEE_POSITION_NOT_FOUND
            );
        }

        const existingUser = await Employee.findOne({
            where: { user },
        });

        if (existingUser !== null) {
            throw new BusinessLogicException(
                ErrorMessages.EMPLOYEE_ALREADY_EXISTS,
                CreateEmployeeErrorCodes.EMPLOYEE_ALREADY_EXISTS
            );
        }

        const passwordHash = hashString(password);

        await db.Employee.create({
            fullName,
            user,
            passwordHash,
            registrationDate,
            isAvailableForWork: true,
            isActive: true,
            idStore,
            idPosition
        });
    } catch (error: any) {
        if (error.isTrusted) {
          throw error;
        } else {
          throw new SQLException(error);
        }
    }
}

export {
    getEmployeeById,
    createEmployee
};