import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { Sequelize } from "sequelize";
import { insertE2EgetUserProfileTestData } from "../../../test_data/e2e/sessions_test_data";

describe("/api/sessions/profile", () => {
    let app: Express;
    let tokenClient: string = "";
    let tokenEmployee: string = "";

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2EgetUserProfileTestData();

        const clientSessionBody = {phoneNumber: "1234567890", password: "password12345"};
        const clientResponse = await request(app).post(`/api/sessions`).send(clientSessionBody);
        const client = clientResponse.body;
        tokenClient = client.token;

        const employeeSessionBody = {username: "jamon12345", password: "password12345"};
        const employeeResponse = await request(app).post(`/api/sessions`).send(employeeSessionBody);
        const employee = employeeResponse.body;
        tokenEmployee = employee.token;
    });

    it("Should return a client data registered in database", async () => {
        const response = await request(app).get(`/api/sessions/profile`).set("Authorization", `Bearer ${tokenClient}`);
        const client = response.body;
        
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(client.id).toEqual(expect.any(Number));
        expect(client.fullName).toEqual(expect.any(String));
        expect(client.birthdate).toEqual(expect.any(String));
        expect(client.phoneNumber).toEqual(expect.any(String));
    });

    it("Should return an employee data registered in database", async () => {
        const response = await request(app).get(`/api/sessions/profile`).set("Authorization", `Bearer ${tokenEmployee}`);
        const employee = response.body;
        
        expect(response.status).toBe(HttpStatusCodes.OK);
        expect(employee.id).toEqual(expect.any(Number));
        expect(employee.fullName).toEqual(expect.any(String));
        expect(employee.user).toEqual(expect.any(String));
        expect(employee.registrationDate).toEqual(expect.any(String));
        expect(employee.isAvailableForWork).toEqual(expect.any(Boolean));
        expect(employee.isActive).toEqual(expect.any(Boolean));
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const body = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).get(`/api/sessions/profile`).set("Authorization", `Bearer ${tokenClient}`);
        
        expect(response.status).toBe(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    });

    afterAll(async () => {
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            port: 1433,
            dialect: 'mssql',
        });
        await db.sequelize.close();
    });
});