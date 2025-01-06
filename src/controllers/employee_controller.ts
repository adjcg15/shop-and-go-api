import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IEmployeeBody } from "../types/interfaces/request_bodies";
import { createEmployee, updateEmployee } from "../services/employees_service";
import { IEmployeeByIdParams } from "../types/interfaces/request_parameters";

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

export {
    createEmployeeController,
    updateEmployeeController,
};