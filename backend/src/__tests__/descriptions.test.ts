import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import {Description} from "../models/descriptions"
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
            //console.log("Connected to MongoDB successfully");
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error);
        });
    });
    afterAll(async () => {
        // Close the test database connection
        await Description.deleteMany({});
        await mongoose.connection.close();
      }); 

    describe("/job-description", () =>{
        it('insert into database', async () => {
            const response = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@example.com",
                    "name": "SWE",
                    "job_description": "This Job ..."
                })
                .expect(201)
            expect(response.body).toStrictEqual({"message": "Job description submitted successfully.", "status": "success"})
        });

        it('check type', async () =>{
            const response = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@example.com",
                    "name": "SWE",
                    "job_description": 35
                })
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid job description.'})
        } )

        it ('invalid length', async () =>{
            const response = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@example.com",
                    "name": "SWE",
                    "job_description" : "abcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrstabcdefghiklmnopqrst"
                })
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Job description exceeds character limit of 5000.' })
        })
        
        it ('empty description', async () =>{
            const response = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@example.com",
                    "name": "SWE",
                    "job_description" : ""
                })
                .expect(400)
            expect(response.body).toStrictEqual( { error: 'Invalid job description.' })
        })
    })
})