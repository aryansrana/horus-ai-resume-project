import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import {Description} from "../models/descriptions"
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
        await Description.deleteMany({});
        await mongoose.connection.close();
      }); 

    describe("/job-description", () =>{
        it('insert into database', async () => {
            const response = await request(app)
                .post('/api/job-description')
                .send({
                    "job_description": "This Job ..."
                })
                .expect(200)
            expect(200)
        });
    })
    
})