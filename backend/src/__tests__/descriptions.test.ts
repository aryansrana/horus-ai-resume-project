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

    describe("/job-descriptions/:email", () =>{
        it('Get job descriptions test 1 - invalid email.', async () =>{
            const email = ""
            const response = await request(app)
                .get(`/api/job-descriptions/${email}`)
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid email.' })
        })

        it ('Get job descriptions test 2 - valid', async () => {
            const email = "test@example.com"
            const response = await request(app)
                .get(`/api/job-descriptions/${email}`)
                .expect(200)
            expect(response.body.count).toStrictEqual(1)
        })
    })

    describe("PUT /job-description", () =>{
        it ('Update Name test 1 - invalid name', async () =>{
            const desc = await Description.findOne({name: "SWE"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const id = desc._id;
            const newName = ""
            const response = await request(app)
                .put('/api/job-description')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid name.' })
        })

        it ('Update Name test 2 - invalid id', async () =>{
            const id = "";
            const newName = "valid"
            const response = await request(app)
                .put('/api/job-description')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid ID.' })
        })

        it ('Update Name test 3 - invalid length', async () =>{
            const desc = await Description.findOne({name: "SWE"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const id = desc._id;
            const newName = "sdjlfjdksfj dsjklfdsjkfjk sdjf jdsfj kdsjkgnjkfhgn fdngjjknfdkj ngkdfjng jkndfgjkn gdfjnk sdfsdgdfhgfdh jhfghjj"
            const response = await request(app)
                .put('/api/job-description')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Name is too long.' })
        })

        it ('Update Name test 4 - invalid', async () =>{
            const desc = await Description.findOne({name: "SWE"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const id = desc._id;
            var newName = "Something new"
            const response = await request(app)
                .put('/api/job-description')
                .send({id: id, name: newName})
                .expect(200)
            expect(response.body).toStrictEqual({ status: 'success', message: 'Job description\'s name updated successfully.' })

            //change it back
            newName = "SWE"
            const response2 = await request(app)
                .put('/api/job-description')
                .send({id: id, name: newName})
                .expect(200)
            expect(response2.body).toStrictEqual({ status: 'success', message: 'Job description\'s name updated successfully.' })
        })
    })

    describe("Delete /job-description", () =>{
        it ('Delete job description test 1 - invalid id', async () =>{
            const id = ""
            const response = await request(app)
                .delete('/api/job-description')
                .send({id: id})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid ID.' })
        })

        it ('Delete job description test 2 - no description', async () =>{
            const id = "675b76ad8a9e4eaeeeeeeeee"
            const response = await request(app)
                .delete('/api/job-description')
                .send({id: id})
                .expect(400)
            expect(response.body).toStrictEqual({ status: 'error', message: 'Job description not found.'})
        })

        it ('Delete job description test 3 - valid', async () =>{
            const desc = await Description.findOne({name: "SWE"});
            if(!desc){
                throw new Error("Description not found.")
            }
            const id = desc._id;
            const response = await request(app)
                .delete('/api/job-description')
                .send({id: id})
                .expect(200)
            expect(response.body).toStrictEqual({ status: 'success', message: 'Job description deleted successfully.' })

            // check if it was deleted
            const email = "test@example.com"
            const response2 = await request(app)
                .get(`/api/job-descriptions/${email}`)
                .expect(200)
            expect(response2.body.count).toStrictEqual(0)
        })
        
    })
})