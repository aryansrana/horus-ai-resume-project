import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
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
    

    describe("test invalid or missing API keys", () =>{
        it('missing API key', async () => {
            if (process.env.HUGGINGFACE_API_KEY === ""){
                return false;
            }
            if (process.env.GEMINI_API_KEY === ""){
                return false;
            }
        });
    })


    
})