import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import {Resume} from "../models/resumes"
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

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
        await mongoose.connection.close();
      }); 

    
      
})