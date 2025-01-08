import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IEmployeeBody } from "../types/interfaces/request_bodies";
import { createEmployee, getDeliveryMenAvailableForWorkOnStore, getEmployee, getEmployeePositions, getEmployees, updateEmployee } from "../services/employees_service";
import { IEmployeeByIdParams } from "../types/interfaces/request_parameters";
import { getStoreWhereEmployeeWorks } from "../services/stores_service";
import BusinessLogicException from "../exceptions/business/BusinessLogicException";
import { ErrorMessages } from "../types/enums/error_messages";

async function createEmployeeController(
    req: Request<{}, {}, IEmployeeBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { fullName, user, password, registrationDate, idStore, idPosition } = req.body;

        await createEmployee(
            {
                fullName: fullName!,
                user: user!,
                password: password!,
                registrationDate: registrationDate!,
                idStore: idStore!,
                idPosition: idPosition!
            },
        );
        
        res.status(HttpStatusCodes.CREATED).json();
    } catch (error) {
        next(error);
    }
}

async function updateEmployeeController(
    req: Request<IEmployeeByIdParams, {}, IEmployeeBody, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const idEmployee = req.params.idEmployee;
        const { fullName, password, idStore, idPosition } = req.body;

        const updatedEmployee = await updateEmployee(
            idEmployee!,
            {
                fullName,
                password,
                idStore,
                idPosition
            }
        );

        res.status(HttpStatusCodes.OK).json(updatedEmployee);
    } catch (error) {
        next(error);
    }
}

async function getActiveDeliveryMenController(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const idEmployee = req.user.id;
        const workplace = await getStoreWhereEmployeeWorks(idEmployee);

        if(!workplace) {
            throw new BusinessLogicException(ErrorMessages.STORE_OF_EMPLOYEE_NOT_FOUNT);
        }

        const deliveryMenList = await getDeliveryMenAvailableForWorkOnStore(workplace.id);
        res.status(HttpStatusCodes.OK).json(deliveryMenList);
    } catch (error) {
        next(error);
    }
}

async function getEmployeePositionsController(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const positions = await getEmployeePositions();

        res.status(HttpStatusCodes.OK).json(positions);
    } catch (error) {
        next(error);
    }
}

async function getEmployeesController(
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const employees = await getEmployees();

        res.status(HttpStatusCodes.OK).json(employees);
    } catch (error) {
        next(error);
    }  
}

async function getEmployeeController(
    req: Request<IEmployeeByIdParams, {}, {}, {}>,
    res: Response,
    next: NextFunction
) {
    try {
        const { idEmployee } = req.params;

        const store = await getEmployee(idEmployee!);

        res.status(HttpStatusCodes.OK).json(store);
    } catch (error) {
        next(error);
    }  
}

export {
    createEmployeeController,
    updateEmployeeController,
    getActiveDeliveryMenController,
    getEmployeePositionsController,
    getEmployeesController,
    getEmployeeController
};