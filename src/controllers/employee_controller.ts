import { NextFunction, Request, Response } from "express";
import { HttpStatusCodes } from "../types/enums/http";
import { IEmployeeBody } from "../types/interfaces/request_bodies";
import { createEmployee } from "../services/employees_service";

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

export {
    createEmployeeController
};