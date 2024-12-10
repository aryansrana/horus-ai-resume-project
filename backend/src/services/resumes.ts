import { Resume } from "../models/resumes";
import pdfParse from 'pdf-parse';
import mammoth from "mammoth";
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

class ResumeService {
    static async resume_upload(email :string, resume_file: Express.Multer.File) {
        try {
            const newResume = new Resume({
                email: email,
                name: resume_file.originalname.trim().slice(0, 50),
                data: resume_file.buffer,
                contentType: resume_file.mimetype,
            });

            await newResume.save();

            return { message: "Resume uploaded successfully.", status: "success" };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during resume upload');
        }
    }
    // Holding off on making endpoint for this function for now, unsure of whether to use in frontend or backend
    static async extract_text_from_resume(id: string) {
        try {
            // Retrieve resume from MongoDB
            const resume = await Resume.findById(id);

            if (!resume) {
                throw new Error("Resume not found.");
            }

            const { data, contentType } = resume;

            // Ensure data exists
            if (!data || !contentType) {
                throw new Error("Invalid resume data.");
            }

            // Convert binary data back to plain text based on contentType
            if (contentType === "application/pdf") {
                const pdfData = await pdfParse(data);
                return pdfData.text;
            }

            if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const docxData = await mammoth.extractRawText({ buffer: data });
                return docxData.value;
            }

            throw new Error("Unsupported file type.");
        } catch (error) {
            console.log(error)
            throw new Error((error as Error).message || "Error during resume text extraction");
            
        }
    }

    static async get_feedback(resume_text: string, job_description: string){
        const token = process.env.HUGGINGFACE_API_KEY
        const prompt = `You are an expert resume evaluator. Feedback should have 4-5 concise, and actionable feedback as sentences seperated by new line characters. Matching Keywords should have at most 5 words that strongly relate the Resume and Job Description.

        Resume: ${resume_text}
        Job Description: ${job_description}

        Feedback:
        
        Matching Keywords:
        You are an expert resume evaluator. Feedback should have 4-5 concise, and actionable feedback as sentences seperated by new line characters. Matching Keywords should have at most 5 words that strongly relate the Resume and Job Description. This should always be the last item in the output.

        Resume: ${resume_text}
        Job Description: ${job_description}

        Feedback:
        
        Matching Keywords:`

        const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY +"");

        const model = client.getGenerativeModel({model: 'gemini-1.5-flash'});



        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        const load = {
            inputs:{
                "source_sentence": resume_text,
                "sentences": [job_description]
            }
        };
        
        try{
            const response = await axios.post('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', load, {headers, timeout: 10000});
            const fitScore = response.data;
            const response2 = await model.generateContent(prompt)
            const feedback = response2.response.text().split("\n").map(item => item.trim()).filter(item => item !== '');
            const feed = feedback.slice(0, -1)
            const keyWords = feedback[feedback.length - 1].split(' ').slice(2,)
            return { "fit_score": fitScore[0], "feedback": feed, "matching_keywords": keyWords};
        } catch (error) {
            if (axios.isAxiosError(error)){
                console.error(error.response?.data)
            }
            throw new Error((error as Error).message || 'Error during resume upload');
        }
    }
    static async get_resumes(email: string) {
        try {
            const resumes = await Resume.find({email: email}).sort({dateAdded: 1}); // -1 means reverse sorted, most recent will be on top
            return resumes;
        } catch (error) {
            throw new Error((error as Error).message || 'Error during resumes retrieval.');
        }
    }
    static async update_name(id: string, name: string){
        try{
            const cleanedName = name.trim();
            const resume = await Resume.findByIdAndUpdate(id, {name: cleanedName}, {new: true});
            if(resume){
                return { status: 'success', message: 'Resume\'s name updated successfully.' };
            }
            else{
                return { status: 'error', message: 'Resume not found.'};
            }
        }catch (error) {
            throw new Error((error as Error).message || 'Error during resume name\'s update.');
        }
    }
    static async delete_name(id: string){
        try{
            const resume = await Resume.findByIdAndDelete(id);
            if(resume){
                return { status: 'success', message: 'Resume deleted successfully.' };
            }
            else{
                return { status: 'error', message: 'Resume not found.'};
            }
        }catch (error) {
            throw new Error((error as Error).message || 'Error during resume\'s deletion.');
        }
    }
}

export default ResumeService;