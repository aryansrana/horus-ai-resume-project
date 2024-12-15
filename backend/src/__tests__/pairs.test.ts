import request from "supertest";
import { Express } from "express";
import { createApp } from "../createApp";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios, {AxiosError} from "axios";
import MockAdapter from "axios-mock-adapter"
import {Description} from "../models/descriptions"
import {Resume} from "../models/resumes"
import fs from "fs";
import path from "path";


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
    afterAll(async () =>{
        //await Resume.deleteMany({})
        //await Description.deleteMany({})
        await mongoose.connection.close();
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
    describe("Input data and run cases", () =>{
        it('insert exampleCopy.pdf', async () =>{
            const filePath = path.resolve("./src/__tests__/", "testFiles", "exampleCopy.pdf");
            const file = fs.readFileSync(filePath)
            const response3= await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@proton.com')
                .attach('resume_file', file, 'exampleCopy.pdf')
                .expect(201)
            expect(response3.body).toStrictEqual({ message: 'Resume uploaded successfully.', status: 'success' })
        })

        it ('insert desc1', async () =>{
            const response2 = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@got.com",
                    "name": "ChildCare",
                    "job_description": "Requires experience in early childhood development..."
                })
                .expect(201)
            expect(response2.body).toStrictEqual({"message": "Job description submitted successfully.", "status": "success"})
        })

        it ('insert example2.pdf', async () =>{
            const filePath = path.resolve("./src/__tests__/", "testFiles", "example2.pdf");
            const file = fs.readFileSync(filePath)
            const response3= await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@proton.com')
                .attach('resume_file', file, 'example2.pdf')
                .expect(201)
            expect(response3.body).toStrictEqual({ message: 'Resume uploaded successfully.', status: 'success' })
        })

        it ('insert desc2', async () =>{
            const response2 = await request(app)
                .post('/api/job-description')
                .send({
                    "email": "test@got.com",
                    "name": "ChildCare2",
                    "job_description": "Requires experience in early childhood development and other things..."
                })
                .expect(201)
            expect(response2.body).toStrictEqual({"message": "Job description submitted successfully.", "status": "success"})
        })



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

        it("error response", async () => {
            const mockResponse = {
                error: "Unable to process the request. Please try again later.",
            };
        
            const endpoint =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText?key=test-api-key";
            mockAxios.onGet(endpoint).reply(400, mockResponse);
        
            try {
                await axios.get(endpoint);
            } catch (error) {
                const axiosErr = error as AxiosError;
                expect(axiosErr.response?.data).toEqual(mockResponse); // Check if the error response matches the mock

            }
        });

        it ('/analyze test 3. Missing field', async () =>{
            const resume_id = ""
            const desc = await Description.findOne({name: "ChildCare"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const desc_id = desc._id;

            const response = await request(app)
                .post('/api/analyze')
                .send({resume_id : resume_id, description_id : desc_id})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Resume Id not given.', status: 'error' })
            
        })
    })

    

    describe("compare function", () =>{
        it("test high accuracy", async () =>{
            const desc = await Description.findOne({name: "ChildCare"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const desc_id = desc._id;
            console.log(desc_id)

                    
            const resume = await Resume.findOne({name: "exampleCopy.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const resume_id = resume._id;

            console.log(resume_id)
            
            const response = await request(app)
                .post('/api/comparison')
                .send({resume_id : resume_id, description_id : desc_id})
                .expect(200)
            expect(response.body).toStrictEqual({"fit_score": 0.8333333333333334})
        })

        it("test low accuracy", async () =>{
        
            const desc = await Description.findOne({name: "ChildCare2"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const desc_id = desc._id;
            console.log(desc_id)

                    
            const resume = await Resume.findOne({name: "example2.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const resume_id = resume._id;

            console.log(resume_id)
            
            const response = await request(app)
                .post('/api/comparison')
                .send({resume_id : resume_id, description_id : desc_id})
                .expect(200)
            expect(response.body).toStrictEqual({"fit_score": 0})
        })
    })


    
})