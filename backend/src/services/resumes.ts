import { Resume } from "../models/resumes";
import pdfParse from 'pdf-parse';
import mammoth from "mammoth";
import axios from 'axios';

class ResumeService {
    static async resume_upload(resume_file: Express.Multer.File) {
        try {
            const newResume = new Resume({
                fileName: resume_file.originalname,
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
    static async extract_text_from_resume(resume_name: string) {
        try {
            // Retrieve resume from MongoDB
            const resume = await Resume.findOne({fileName : resume_name});

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
            throw new Error((error as Error).message || "Error during resume text extraction");
        }
    }

    static async get_feedback(resume_text: string, job_description: string){
        const token = process.env.HUGGINGFACE_API_KEY
        const prompt = `
        You are an expert resume evaluator. Based on the provided job description and resume, give constructive, actionable feedback on how the resume can be improved to better match the job description. Provide at most five suggestions. Do not repeat the resume or job description in the feedback. Only give the feedback, formatted as a list of concise, actionable points. Avoid including any extra text, such as explanations or repetitions of the prompt.

        Resume: ${resume_text}
        Job Description: ${job_description}

        Feedback:`
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
            const response2 = await axios.post('https://api-inference.huggingface.co/models/openai-community/gpt2', { inputs: prompt }, {headers});
            const feedback = response2.data[0].generated_text
            return { "fit_score": fitScore[0], "feedback": feedback};
        } catch (error) {
            if (axios.isAxiosError(error)){
                console.error(error.response?.data)
            }
            throw new Error((error as Error).message || 'Error during resume upload');
        }
    }
}

export default ResumeService;