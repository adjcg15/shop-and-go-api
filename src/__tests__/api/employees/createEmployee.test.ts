import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { ErrorMessages } from '../../../types/enums/error_messages';
import { HttpStatusCodes } from '../../../types/enums/http';
import { CreateEmployeeErrorCodes } from '../../../types/enums/error_codes';
import { insertE2ECreateEmployeeTestData } from '../../../test_data/e2e/employees_test_data';
import { Sequelize } from "sequelize";

describe ("POST api/employees", () => {
    let app: Express;        
    let token: string = "";
    let idStore: number;
    let idPosition: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testDataResult = await insertE2ECreateEmployeeTestData();
        idStore = testDataResult.idStore;
        idPosition = testDataResult.idPosition;

        const session = {username: "mlopez1234", password: "hola"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const administrator = response.body;
        token = administrator.token;
    });

    it("Should register the employee in database", async () => {
        const employeeData = {
            fullName: "María Pérez",
            user: "mperez123",
            password: "Hola123-",
            registrationDate: "2023-01-19",
            idStore: idStore,
            idPosition: idPosition
        };
        const response = await request(app).post(`/api/employees`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
        
    });

    it("Should display an error message indicating that the store does not exist", async () => {
        const employeeData = {
            fullName: "María Pérez",
            user: "mperez123",
            password: "Hola123-",
            registrationDate: "2023-01-19",
            idStore: 1000,
            idPosition: idPosition
        };

        const response = await request(app).post(`/api/employees`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.STORE_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreateEmployeeErrorCodes.STORE_NOT_FOUND);
    });

    it("Should display an error message indicating that the employee position does not exist", async () => {
        const employeeData = {
            fullName: "María Pérez",
            user: "mperez123",
            password: "Hola123-",
            registrationDate: "2023-01-19",
            idStore: idStore,
            idPosition: 1000
        };

        const response = await request(app).post(`/api/employees`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.EMPLOYEE_POSITION_NOT_FOUND);
        expect(response.body.errorCode).toBe(CreateEmployeeErrorCodes.EMPLOYEE_POSITION_NOT_FOUND);
    });

    it("Should display an error message indicating that the employee already exists", async () => {
        const employeeData = {
            fullName: "María Pérez",
            user: "mperez123",
            password: "Hola123-",
            registrationDate: "2023-01-19",
            idStore: idStore,
            idPosition: idPosition,
        };

        const response = await request(app).post(`/api/employees`)
            .set("Authorization", `Bearer ${token}`)
            .send(employeeData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.EMPLOYEE_ALREADY_EXISTS);
        expect(response.body.errorCode).toBe(CreateEmployeeErrorCodes.EMPLOYEE_ALREADY_EXISTS);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
    
            db.sequelize = new Sequelize('database', 'username', 'password', {
                host: 'invalid-host',
                port: 9999,
                dialect: 'mssql',
            });
    
            const employeeData = {
                fullName: "María Pérez",
                user: "mperez123",
                password: "Hola123-",
                registrationDate: "2023-01-19",
                idStore: idStore,
                idPosition: idPosition,
            };
        
            const response = await request(app).post(`/api/employees`)
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
})