import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

class AnalysisService {
    static async get_feedback(resume_text: string, job_description: string){
        const token = process.env.HUGGINGFACE_API_KEY
        const prompt = `
        You are an expert resume evaluator tasked to evaluate a resume against a job description. You are to provide relevant matching keywords that strongly relate the resume and job description if such keywords exist. Also find the relevant missing keywords but do not ouptut these. You are also to provide concise, actionable feedback based on these missing keywords where the feedback is either categorized by "skills" or by "experience". Try to get at least 2 "skills" feedback and at least 2 "experience" feedback. Your output should only be the json formatted like this so I can run JSON.parse() on it. 
        {
        "matching_keywords": ["example1", "example2"],
        "feedback": [
            { "category": "skills", "text": "Include experience with AWS services." },
            { "category": "experience", "text": "Add projects demonstrating REST API development." }
        ]
        }

        This is the resume: ${resume_text}

        This is the job description: ${job_description}
        `

        const getFitScore = await AnalysisService.compare(resume_text, job_description)

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
            const response2 = await model.generateContent(prompt);
            const invalidJsonString = response2.response.text()
            const validJsonString = invalidJsonString.replace(/^[^{]*|[^}]*$/g, '');
            const parsedData = JSON.parse(validJsonString);
            parsedData.matching_keywords = parsedData.matching_keywords.filter((keyword: string) => keyword !== '').map((keyword: string) => keyword.charAt(0).toUpperCase() + keyword.slice(1));
            return { fit_score: Math.floor(getFitScore.fit_score * 100), feedback: parsedData.feedback, matching_keywords: parsedData.matching_keywords};          
        } catch (error) {
            if (axios.isAxiosError(error)){
                console.error(error.response?.data)
            }
            throw new Error((error as Error).message || 'Error during resume upload');
        }
    }

    static async compare(resume_text: string, job_description: string){
        try{
            var tokenize_resume = resume_text.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).filter(token => token.length > 0);
        
            var tokenize_desc = job_description.replace(/[^\w\s]/g, '').toLowerCase().split(/\s+/).filter(token => token.length > 0);
            var c = 0;
            for (var i = 0; i < tokenize_desc.length; i++){
                if (tokenize_resume.includes(tokenize_desc[i])){
                    c++
                }
            }
            return { fit_score: c / tokenize_desc.length};
        }catch(error){
            throw new Error((error as Error).message)
        }
    }
}

export default AnalysisService;
