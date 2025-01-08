import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import SQLException from "../exceptions/services/SQLException";
import { hashString } from "../lib/security_service";
import db from "../models";
import EmployeePosition from "../models/EmployeePosition";
import Employee from "../models/Employee";
import Store from "../models/Store";
import { CreateEmployeeErrorCodes, UpdateEmployeeErrorCodes } from "../types/enums/error_codes";
import { ErrorMessages } from "../types/enums/error_messages";
import UserRoles from "../types/enums/user_roles";
import { IEmployeeWithPosition } from "../types/interfaces/response_bodies";
import { InferAttributes } from "sequelize";
import { HttpStatusCodes } from "../types/enums/http";

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

async function updateEmployee(
    idEmployee: number,
    newEmployee: {
        fullName?: string,
        password?: string,
        idStore?: number,
        idPosition?: number,
    }
) {
    let updatedEmployee; 

    try {
        const employee = await Employee.findByPk(idEmployee);

        if (employee === null) {
            throw new BusinessLogicException(
              ErrorMessages.EMPLOYEE_NOT_FOUND,
              UpdateEmployeeErrorCodes.EMPLOYEE_NOT_FOUND
            );
        }

        const { fullName, password, idStore, idPosition } = newEmployee;

        const store = await Store.findByPk(idStore);

        if (store === null) {
            throw new BusinessLogicException(
            ErrorMessages.STORE_NOT_FOUND,
            UpdateEmployeeErrorCodes.STORE_NOT_FOUND
            );
        }

        const position = await EmployeePosition.findByPk(idPosition);

        if (position === null) {
            throw new BusinessLogicException(
                ErrorMessages.EMPLOYEE_POSITION_NOT_FOUND,
                UpdateEmployeeErrorCodes.EMPLOYEE_POSITION_NOT_FOUND
            );
        }

        let passwordHash;

        if (password) {
            passwordHash = hashString(password);
        }

        await employee.update(
            {
                fullName,
                passwordHash,
                idStore,
                idPosition
            },
            {
                where: { id: idEmployee },
            }    
        );

        updatedEmployee = employee.toJSON();
    } catch (error: any) {
        if (error.isTrusted) {
          throw error;
        } else {
          throw new SQLException(error);
        }
    }

    return updatedEmployee;
}

async function getDeliveryMenAvailableForWorkOnStore(idStore: number) {
    const deliveryMen: Omit<InferAttributes<Employee>, "passwordHash">[] = [];

    try {
        const dbDeliveryManPositon = await db.EmployeePosition.findOne({
            where: { title: UserRoles.DELIVERY_MAN },
        });
        if (!dbDeliveryManPositon) {
            throw new BusinessLogicException(
                "The employee position DELIVERY_MAN is not registered on database and is needed",
                undefined,
                HttpStatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        const dbDeliveryMen = await db.Employee.findAll({
            where: { isAvailableForWork: true, idStore, idPosition: dbDeliveryManPositon.id }
        });


        dbDeliveryMen.forEach(employee => {
            const { passwordHash, ...employeeWithoutPassword} = employee.toJSON();

            deliveryMen.push(employeeWithoutPassword);
        });
    } catch (error: any) {
        throw new SQLException(error);
    }

    return deliveryMen;
}

export {
    getEmployeeById,
    createEmployee,
    updateEmployee,
    getDeliveryMenAvailableForWorkOnStore
};