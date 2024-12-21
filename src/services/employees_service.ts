import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import SQLException from "../exceptions/services/SQLException";
import db from "../models";
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

export {
    getEmployeeById
};