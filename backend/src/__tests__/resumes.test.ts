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

    describe("/resume_upload", () =>{
        it('insert into database pdf', async () => {
            const filePath = path.resolve("./src/__tests__/", "testFiles", "example.pdf");
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@gmail.com')
                .attach('resume_file', file, 'example.pdf')
                .expect(201)
            expect(response.body).toStrictEqual({ message: 'Resume uploaded successfully.', status: 'success' })
        });
        
        it('insert into database docx', async () => {
            const filePath = path.resolve("./src/__tests__/", 'testFiles', 'example.docx');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test1@example.com')
                .attach('resume_file', file, 'example.docx')
                .expect(201)
            expect(response.body).toStrictEqual({ message: 'Resume uploaded successfully.', status: 'success' })
        });

        it('general error', async () => {
            const filePath = path.resolve("./src/__tests__/", 'testFiles', 'example.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@example.com')
                .attach('resume_file', Buffer.alloc(0), 'example.pdf')
                .expect(500)
        });

        it('no file', async () => {
            const filePath = path.resolve("./src/__tests__/", 'testFiles', 'example.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@example.com')
                .attach('resume_file', file, '')
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'No file uploaded.', status: 'error' })
        });

        it('wrong file type', async () =>{
            const filePath = path.resolve("./src/__tests__/", 'testFiles', 'test.txt');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@example.com')
                .attach('resume_file', file, 'test.txt')
                .expect(400)
        })

        it('file is too big', async () =>{
            const filePath = path.resolve("./src/__tests__/", 'testFiles', 'largeFile.pdf');
            const file = fs.readFileSync(filePath)
            const response = await request(app)
                .post('/api/resume-upload')
                .set('Content-Type', 'multipart/form-data')
                .field('email', 'test@example.com')
                .attach('resume_file', file, 'largeFile.pdf')
                .expect(400)
        })
    })

    describe("/resume", () =>{

        it('extract from pdf', async () => {
            const resume = await Resume.findOne({name: "example.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            const response = await request(app)
                .get(`/api/resume/${id}`)
                .expect(200)
            expect(response.body).toStrictEqual({
                "text": "\n\nFunctional Resume Sample \n \nJohn W. Smith  \n2002 Front Range Way Fort Collins, CO 80525  \njwsmith@colostate.edu \n \nCareer Summary \n \nFour years experience in early childhood development with a diverse background in the care of \nspecial needs children and adults.  \n \n \nAdult Care Experience \n \n• Determined work placement for 150 special needs adult clients.  \n• Maintained client databases and records.  \n• Coordinated client contact with local health care professionals on a monthly basis.     \n• Managed 25 volunteer workers.     \n \nChildcare Experience \n \n• Coordinated service assignments for 20 part-time counselors and 100 client families. \n• Oversaw daily activity and outing planning for 100 clients.  \n• Assisted families of special needs clients with researching financial assistance and \nhealthcare. \n• Assisted teachers with managing daily classroom activities.    \n• Oversaw daily and special student activities.     \n \nEmployment History  \n \n1999-2002 Counseling Supervisor, The Wesley Center, Little Rock, Arkansas.    \n1997-1999 Client Specialist, Rainbow Special Care Center, Little Rock, Arkansas  \n1996-1997 Teacher’s Assistant, Cowell Elementary, Conway, Arkansas     \n \nEducation \n \nUniversity of Arkansas at Little Rock, Little Rock, AR  \n \n• BS in Early Childhood Development (1999) \n• BA in Elementary Education (1998) \n• GPA (4.0 Scale):  Early Childhood Development – 3.8, Elementary Education – 3.5, \nOverall 3.4.  \n• Dean’s List, Chancellor’s List \n ",
                "status": "success"
            })
        });

        it('extract from docx', async () => {
            const resume = await Resume.findOne({name: "example.docx"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            const response = await request(app)
                .get(`/api/resume/${id}`)
                .expect(200)
            expect(response.body).toStrictEqual({
                "text": "SAMPLE RESUME #1 – Optional format with no objective\n\n\n\nYour Name\n\nStreet Address • City, State, Zip • Telephone number • E-mail\n\n\n\n\n\n\n\nEDUCATION\n\n\n\nUniversity of California, Santa Cruz \tSanta Cruz, CA Master of Science in Applied Economics and Finance \tExpected June 2017\n\nCurrent GPA\n\n\tList any honors or awards\n\n\tThesis or special project title can be listed here\n\n\n\nRelated Course Work (Add left tabs at 4 1/4 and 4 1/2)\n\n•   Course Name \t•   Course Name\n\n•   Course Name \t•   Course Name\n\n\n\nList Undergraduate College or University \tCity, State\n\nDegree \tDate Received\n\n•   Related awards or honors can be mentioned here\n\n\n\nRELATED EXPERIENCE\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n•   Information about what you did and accomplished\n\n•   Start each phrase with action words\n\n•   If job is current use present tense -  If job is over use past tense\n\n\n\nName of Company (Don’t forget academic experience) \tCity, State\n\nTitle \tDates\n\n•   What you did for company or client\n\n•   More information about what you did\n\nPrior Title (if you have held two different positions at the same company) \tDates\n\n\n\nADDITIONAL EXPERIENCE\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n\n\nACTIVITIES\n\n\n\n•   List extracurricular activities and volunteer work here\n\n\n\nSKILLS\n\n\n\nComputer: Knowledge of PC and Macintosh formats:  Word, Excel, PowerPoint, Dreamweaver, FileMaker Pro\n\nLanguages: Fluent in Chinese, basic knowledge of French\n\n\n\nHONORS AND AWARDS\n\n\tList any relevant honors or awards\n\n\n\nSAMPLE RESUME #2 – Optional format for people with extensive full time experience\n\n\n\nYour Name\n\nStreet Address • City, State, Zip • Telephone number • E-mail\n\n\n\n\n\n\n\nQUALIFICATIONS\n\n•   Eighteen years of varied industry experience in senior level corporate communications\n\n•   Demonstrated management leadership ability with staff and budgets\n\n•   Sole spokesperson, lobbyist, and avenue of last resort for internal and external conflict resolution\n\n•   Possess strong resilient sense of confidence\n\n•   Superior written, verbal and interpersonal communication skills\n\n•   Provide strategy, counsel and guidance to CEO and senior management\n\n\n\nPROFESSIONAL EXPERIENCE\n\nName of Company \tCity, State\n\nTitle \tDates\n\n•   Information about what you did and accomplished\n\n•   Start each phrase with action words\n\n•   If job is current use present tense -  If job is over use past tense\n\n•\n\n•\n\n•\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n•   What you did for company or client\n\n•   More information about what you did\n\n•\n\nPrior Title (if you have held two different positions at the same company \tDates\n\n•\n\n•\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n•\n\n•\n\n\n\nName of Company \tCity, State\n\nTitle \tDates\n\n•\n\n•\n\n\n\nEDUCATION\n\nUniversity of California, Santa Cruz \tSanta Cruz, CA Master of Science in Applied Economics and Finance \tExpected June 2017\n\nCurrent GPA\n\n\tList any honors or awards\n\n\tThesis or special project title can be listed here\n\n\n\n\n\n\n\nSKILLS\n\nComputer:   Knowledge of PC and Macintosh formats: Word, Excel, PowerPoint, Dreamweaver, FileMaker Pro\n\nLanguages:   Fluent in Spanish, basic knowledge of French\n\n",
                "status": "success"
            })
        });

        it('extract from pdf with large file', async () => {
            const id = "675b76ad8a9e4eaeff32dc6e"
            const response = await request(app)
                .get(`/api/resume/${id}`)
                .expect(500)
            expect(response.body).toStrictEqual({ error: 'Resume not found.', status: 'error' })
        });

        
        it ('try no file', async ()=>{
            const id = ""
            const response = await request(app)
                .get(`/api/resume/${id}`)
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Id not given.', status: 'error' })
        })
    })
    
    describe("/resumes/:email", ()=>{
        it ('get_resumes test 1', async ()=>{
            const email = "test@gmail.com"
            const response = await request(app)
                .get(`/api/resumes/${email}`)
                .expect(200)
            expect(response.body.count).toStrictEqual(1)
        })

        it ('get_resumes test 2', async ()=>{
            const email = "test@hotmail.com"
            const response = await request(app)
                .get(`/api/resumes/${email}`)
                .expect(200)
            expect(response.body).toStrictEqual({"count": 0, "resumes": []})
        })

        it ('get_resumes test 3. Invalid email', async ()=>{
            const email = ""
            const response = await request(app)
                .get(`/api/resumes/${email}`)
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid email.' })
        })
    })
        
    describe( "PUT /resume", () =>{
        it ('update_name test 1 - correct', async () =>{
            const resume = await Resume.findOne({name: "example.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            var newName = "Changed name"

            const response = await request(app)
                .put('/api/resume')
                .send({id: id, name: newName})
                .expect(200)
            expect(response.body).toStrictEqual({ status: 'success', message: 'Resume\'s name updated successfully.' })

            // change name back to original 
            newName = "example.pdf"
            const response2 = await request(app)
                .put('/api/resume')
                .send({id: id, name: newName})
                .expect(200)
            expect(response2.body).toStrictEqual({ status: 'success', message: 'Resume\'s name updated successfully.' })
        })

        it ('update_name test 2 - invalid. Longer than 50 chars', async () =>{
            const resume = await Resume.findOne({name: "example.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            const newName = "Changed name that is more characters than fifty which is too long to be accepted"

            const response = await request(app)
                .put('/api/resume')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Name is too long.' })
        })

        it ('update_name test 3 - invalid. Missing id', async () =>{
    
            const id = "";
            const newName = "Acceptable"

            const response = await request(app)
                .put('/api/resume')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid ID.' })
        })

        it ('update_name test 4 - invalid. Not a string', async () =>{
            const resume = await Resume.findOne({name: "example.pdf"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            const newName = ""

            const response = await request(app)
                .put('/api/resume')
                .send({id: id, name: newName})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid name.' })
        })
    })
        
    describe("Delete /resume", ()=>{
        it ('delete_name test 1 - Valid', async() =>{
            const resume = await Resume.findOne({name: "example.docx"});
            if(!resume){
                throw new Error("Resume not found.")
            }
            const id = resume._id;
            const response = await request(app)
                .delete('/api/resume')
                .send({id: id})
                .expect(200)
            expect(response.body).toStrictEqual({ status: 'success', message: 'Resume deleted successfully.' })

            // check if it was deleted

            const email = "test1@example.com"
            const response2 = await request(app)
                .get(`/api/resumes/${email}`)
                .expect(200)
            expect(response2.body.count).toStrictEqual(0)
             
        })

        it ('delete_name test 2 - Invalid. Bad id', async () =>{
            const id = "";
            const response = await request(app)
                .delete('/api/resume')
                .send({id: id})
                .expect(400)
            expect(response.body).toStrictEqual({ error: 'Invalid ID.' })
        })

        it ('delete_name test 3 - Invalid. No resume', async () =>{
            const id = "675b76ad8a9e4eaeeeeeeeee"; // id does not match any entry
            const response = await request(app)
                .delete('/api/resume')
                .send({id: id})
                .expect(400)
            expect(response.body).toStrictEqual({ status: 'error', message: 'Resume not found.'})
        })
    })
     
})