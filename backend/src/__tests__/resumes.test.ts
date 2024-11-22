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
        await Resume.deleteMany({});
        await mongoose.connection.close();
      }); 

    describe("/resume", () =>{
        it('insert into database', async () => {
            const filePath = path.resolve(__dirname, 'testFiles', 'file1.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('resume_file', file, 'file1.pdf')
                .expect(200)
            expect(response.body).toStrictEqual({ message: 'Resume uploaded successfully.', status: 'success' })
        });

        it('general error', async () => {
            const filePath = path.resolve(__dirname, 'testFiles', 'file1.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('resume_file', Buffer.alloc(0), 'file1.pdf')
                .expect(500)
            
        });

        it('no file', async () => {
            const filePath = path.resolve(__dirname, 'testFiles', 'file1.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('resume_file', file, '')
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'No file uploaded.', status: 'error' })
        });

        it('wrong file type', async () =>{
            const filePath = path.resolve(__dirname, 'testFiles', 'test.txt');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('resume_file', file, 'test.txt')
                .expect(500)
        })

        it('file is too big', async () =>{
            const filePath = path.resolve(__dirname, 'testFiles', 'test.txt');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .attach('resume_file', file, 'test.txt')
                .expect(500)
        })


    })

    
})