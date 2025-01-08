import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { HttpStatusCodes } from '../../../types/enums/http';
import { insertE2EGetEmployeeTestData } from '../../../test_data/e2e/employees_test_data';
import { Sequelize } from "sequelize";
import { ErrorMessages } from '../../../types/enums/error_messages';
import { GetEmployeeErrorCodes } from '../../../types/enums/error_codes';

describe ("GET api/employees", () => {
    let app: Express;        
    let token: string = "";
    let idEmployee: number;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        const testData = await insertE2EGetEmployeeTestData();

        idEmployee = testData.idEmployee;

        const session = {username: "mlopez1234", password: "hola"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const administrator = response.body;
        token = administrator.token;
    });

    it("Should get one employee from database", async () => {
        const response = await request(app).get(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body.id).toBe(idEmployee);
    });

    it("Should display and error message indicating that the employee does not exist", async () => {
        const response = await request(app).get(`/api/employees/1000`)
            .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
            expect(response.body.details).toBe(ErrorMessages.EMPLOYEE_NOT_FOUND);
            expect(response.body.errorCode).toBe(GetEmployeeErrorCodes.EMPLOYEE_NOT_FOUND);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
            
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
    
        const response = await request(app).get(`/api/employees/${idEmployee}`)
            .set("Authorization", `Bearer ${token}`);
        
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