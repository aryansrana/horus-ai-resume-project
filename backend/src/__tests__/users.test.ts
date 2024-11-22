import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import { User } from "../models/users";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";


describe("/api", () => {
    let app : Express;
    beforeAll(() => {
        app = createApp();
        dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
        const dbUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.gsref.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`
        mongoose.connect(dbUri)
        .then(() => {
            //console.log("Connected to MongoDB successfully");
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error);
        });
    });
    afterAll(async () => {
        // Close the test database connection
        await User.deleteMany({});
        await mongoose.connection.close();
      }); 
    describe("/register", () => {
        it('register user', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "securePassword",
                    "username": "user123"
                  })
                .expect(201);
            expect(response.body).toStrictEqual({"message": "User registered successfully"})
        });
        it('register duplicate email', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "securePassword",
                    "username": "seconduser123"
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Email already in use"})
        });
        it('register duplicate username', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user2@example.com",
                    "password": "securePassword",
                    "username": "user123"
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Username already in use"})
        });
        it('register missing password', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "",
                    "username": "user123"
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
        it('register missing email', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "",
                    "password": "securepassword",
                    "username": "user123"
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
        it('register missing username', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "securepassword",
                    "username": ""
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
        it('register empty fields', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "",
                    "password": "",
                    "username": ""
                  })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
    });
    describe("/login", () => {
        it('login user', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ "email": "user@example.com", "password": "securePassword" })
                .expect(200);
            expect(response.body).toHaveProperty('token');
            const token = response.body.token;
            expect(token).toMatch(
            /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
            );
        });
        it('login missing email', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ "email": "", "password": "securePassword" })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
        it('login missing password', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ "email": "user@example.com", "password": "" })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
        it('login empty fields', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ "email": "", "password": "" })
                .expect(400);
            expect(response.body).toStrictEqual({"error": "Missing required fields."})
        });
    })
})
