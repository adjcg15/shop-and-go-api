import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";
import { insertE2ELoginTestData } from "../../../test_data/e2e/sessions_test_data";

describe("/api/sessions", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();

        await db.sequelize.sync({ force: true });

        await insertE2ELoginTestData();
    });

    it("Should return an token and client data registered in database", async () => {
        const body = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(body);
        const client = response.body;
        
        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(client.token).toEqual(expect.any(String));
        expect(client.id).toEqual(expect.any(Number));
        expect(client.fullName).toEqual(expect.any(String));
        expect(client.birthdate).toEqual(expect.any(String));
        expect(client.phoneNumber).toEqual(expect.any(String));
    });

    it("Should return an token and employee data registered in database", async () => {
        const body = {username: "jamon12345", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(body);
        const employee = response.body;
        
        expect(response.status).toBe(HttpStatusCodes.CREATED);
        expect(employee.token).toEqual(expect.any(String));
        expect(employee.id).toEqual(expect.any(Number));
        expect(employee.fullName).toEqual(expect.any(String));
        expect(employee.user).toEqual(expect.any(String));
        expect(employee.registrationDate).toEqual(expect.any(String));
        expect(employee.isAvailableForWork).toEqual(expect.any(Boolean));
        expect(employee.isActive).toEqual(expect.any(Boolean));
    });

    it("should display an error message indicating that the credentials are invalid", async () => {
        const body = {phoneNumber: "1234567891", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(body);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.INVALID_CREDENTIALS);
    });

    it("should display an error message indicating that the credentials are invalid", async () => {
        const body = {username: "jamin3284f2d41", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(body);
        
        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.INVALID_CREDENTIALS);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();
        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });
        
        const body = {phoneNumber: "1234567890", password: "password12345"};
        const response = await request(app).post(`/api/sessions`).send(body);
        
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