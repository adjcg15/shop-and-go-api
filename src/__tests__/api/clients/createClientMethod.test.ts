import request from "supertest";
import createApp from "../../../lib/app";
import { Express } from "express";
import { HttpStatusCodes } from "../../../types/enums/http";
import db from "../../../models";
import { CreateClientErrorCodes } from "../../../types/enums/error_codes";
import { ErrorMessages } from "../../../types/enums/error_messages";
import { Sequelize } from "sequelize";

describe("/api/clients", () => {
    let app: Express;

    beforeAll(async () => {
        app = createApp();
        await db.sequelize.sync({ force: true });
    });

    it("Should register a client in database", async () => {
        const clientData = {
            password: "Password123-",
            birthdate: "1995-08-15",
            fullName: "John Doe",
            phoneNumber: "1234567890"
        };
        const response = await request(app).post(`/api/clients`).send(clientData);
        expect(response.status).toBe(HttpStatusCodes.CREATED);
    });

    it("Should display an error message indicating that the phone number already exists", async () => {
        const clientData = {
            password: "Password123-",
            birthdate: "1995-08-15",
            fullName: "John Doe",
            phoneNumber: "1234567890"
        };
        const response = await request(app).post(`/api/clients`).send(clientData);

        expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST);
        expect(response.body.details).toBe(ErrorMessages.CLIENT_ALREADY_EXISTS);
        expect(response.body.errorCode).toBe(CreateClientErrorCodes.CLIENT_ALREADY_EXISTS);
    });

    it("should display an error message indicating that the database server connection failed", async () => {
        await db.sequelize.close();

        db.sequelize = new Sequelize('database', 'username', 'password', {
            host: 'invalid-host',
            port: 9999,
            dialect: 'mssql',
        });

        const clientData = {
            password: "Password123-",
            birthdate: "1995-08-15",
            fullName: "John Doe",
            phoneNumber: "1234567890"
        };
    
        const response = await request(app).post(`/api/clients`).send(clientData);
        
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