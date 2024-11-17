import request from "supertest";
import { type Express } from "express";
import { createApp } from "../createApp";
import { User } from "../models/users";
import mongoose from "mongoose";
import dotenv from "dotenv";


describe("/api", () => {
    let app : Express;
    beforeAll(() => {
        app = createApp();
        dotenv.config();
        const dbUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.gsref.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0`
        mongoose.connect(dbUri)
        .then(() => {
            console.log("Connected to MongoDB successfully");
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
            expect(response.body.result).toStrictEqual({"message": "User registered successfully"})
        });

    
        it('register duplicate user', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "securePassword",
                    "username": "user123"
                  })
                .expect(400);
            expect(response.body.result).toStrictEqual({"error": "Email already in use"})
        });
    
        it('register incomplete user', async () => {
            const response = await request(app)
                .post('/api/register')
                .send({
                    "email": "user@example.com",
                    "password": "",
                    "username": "user123"
                  })
                .expect(400);
            expect(response.body.result).toStrictEqual({"error": "Missing required fields."})
        });

    });

    describe("/login", () => {
        it('login user', async () => {
            const response = await request(app)
                .post('/api/login')
                .send({ "email": "user@example.com", "password": "securePassword" })
                .expect(201);
            expect(response.body.result).toStrictEqual({
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNhNjg4ODNkZDJiYzlkNmNiODZkYjkiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzE4ODY2NTMsImV4cCI6MTczMTg5MDI1M30.PFmIoh1rVuoUfRZulvzGMdDqhj0pGMfhBNDF1BSu6u4"
            })
        });
    })
})
