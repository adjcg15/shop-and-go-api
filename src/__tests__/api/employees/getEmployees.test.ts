import request from 'supertest';
import createApp from '../../../lib/app';
import { Express } from 'express';
import db from '../../../models';
import { HttpStatusCodes } from '../../../types/enums/http';
import { insertE2EGetEmployeesTestData } from '../../../test_data/e2e/employees_test_data';
import { Sequelize } from "sequelize";

describe ("GET api/employees", () => {
    let app: Express;        
    let token: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EGetEmployeesTestData();

        const session = {username: "mlopez1234", password: "hola"};
        const response = await request(app).post(`/api/sessions`).send(session);
        const administrator = response.body;
        token = administrator.token;
    });

    it("Should get the employees from database", async () => {
        const response = await request(app).get(`/api/employees`)
                .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(response.body).not.toBeNull;
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
            
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
    
        const response = await request(app).get(`/api/employees`)
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