import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import MockAdapter from "axios-mock-adapter"


const mockAxios = new MockAdapter(axios)

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

    describe("mock test case for API endpoint", () =>{
        it("should return a successful response", async () => {
            const mockResponse = {
                fit_score: "100",
                feedback: [
                    {
                        category: "skills",
                        text: "some text",
                    },
                ],
                matching_keywords: [],
            };
    
            const endpoint =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText?key=test-api-key";
            mockAxios.onGet(endpoint).reply(200, mockResponse);
    
            const response = await axios.get(endpoint);
    
            expect(response.data).toEqual(mockResponse); // Check if the response matches the mock
            expect(mockAxios.history.get.length).toBe(1);
            expect(mockAxios.history.get[0].url).toBe(endpoint); 
        });

    })


    
})