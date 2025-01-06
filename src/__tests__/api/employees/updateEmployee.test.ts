import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { ErrorMessages } from '../../../types/enums/error_messages';
import { HttpStatusCodes } from '../../../types/enums/http';
import {  UpdateEmployeeErrorCodes } from '../../../types/enums/error_codes';
import { insertE2EUpdateEmployeeData } from '../../../test_data/e2e/employees_test_data';
import { Sequelize } from "sequelize";

describe ("PUT api/employees/:idEmployee", () => {
    let app: Express;        
    let token: string = "";
    let idStore: number;
    let idPosition: number;
    let idEmployee: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2EUpdateEmployeeData();
        idEmployee = testDataResult.idEmployee;
        idStore = testDataResult.idStore;
        idPosition = testDataResult.idPosition;

        const session = {username: "mlopez1234", password: "hola"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const client = response.body;
        token = client.token;
    });

    it("Should update an Employee", async () => {
        const employeeData = {
            fullName: "John Doe",
            password: "Password123-",
            idStore,
            idPosition
        }

        const response = await request(app).put(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);
    
        expect(response.status).toBe(HttpStatusCodes.OK);

        expect(response.body).toMatchObject({
            id: idEmployee,
            fullName: employeeData.fullName,
            passwordHash: expect.any(String),
            idStore: employeeData.idStore,
            idPosition: employeeData.idPosition,
        });
    });

    it("Should display an error message indicating that the store does not exist", async () => {
        const employeeData = {
            fullName: "John Doe",
            password: "Password123-",
            idStore: 1000,
            idPosition: idPosition
        };

        const response = await request(app).put(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.STORE_NOT_FOUND);
        expect(response.body.errorCode).toBe(UpdateEmployeeErrorCodes.STORE_NOT_FOUND);
    });

    it("Should display an error message indicating that the employee position does not exist", async () => {
        const employeeData = {
            fullName: "John Doe",
            password: "Password123-",
            idStore: idStore,
            idPosition: 1000
        };

        const response = await request(app).put(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.EMPLOYEE_POSITION_NOT_FOUND);
        expect(response.body.errorCode).toBe(UpdateEmployeeErrorCodes.EMPLOYEE_POSITION_NOT_FOUND);
    });

    it("Should display an error message indicating that the employee does not exist", async () => {
        const employeeData = {
            fullName: "John Doe",
            password: "Password123-",
            idStore: idStore,
            idPosition: idPosition,
        };

        const response = await request(app).put(`/api/employees/1000`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.EMPLOYEE_NOT_FOUND);
        expect(response.body.errorCode).toBe(UpdateEmployeeErrorCodes.EMPLOYEE_NOT_FOUND);
    });
    
    it("should display an error message indicating that the database server connection failed", async () => {
            await db.sequelize.close();
        
            db.sequelize = new Sequelize('database', 'username', 'password', {
                host: 'invalid-host',
                port: 9999,
                dialect: 'mssql',
            });
    
            const employeeData = {
                fullName: "John Doe",
                password: "Password123-",
                idStore: idStore,
                idPosition: idPosition,
            };
        
            const response = await request(app).put(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);
            
            expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        });

    afterAll(async () => {
        db.sequelize = new Sequelize("database", "username", "password", {
            host: "localhost",
            port: 1433,
            dialect: "mssql",
        });
        
        await db.sequelize.close();
    });
});