import { Request, Response } from 'express';
import ResumeService from '../services/resumes';
import { Description } from '../models/descriptions';
import multer from 'multer';
import axios from 'axios';
class ResumeHandler {
    static async resume_upload(req: Request, res: Response) {
        try {
            console.log('hi')
            const resume_file = req.file;
            const { email } = req.body;
            if(!email || typeof email !== 'string'){
                res.status(400).json({ error: 'Invalid email.' });
                console.log("email not found")
                return;
            }
            if (!resume_file) {
                res.status(400).json({ error: 'No file uploaded.', status: 'error' });
                console.log("resume_file not found");
                return;
            }
            const result = await ResumeService.resume_upload(email, resume_file);
            res.status(201).json({ message: 'Resume uploaded successfully.', status: 'success' });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async extract_resume(req: Request, res: Response) {
        try {
            const {id} = req.params;
            if (!id) {
                res.status(400).json({ error: 'Id not given.', status: 'error' });
                return;
            }
            const result = await ResumeService.extract_text_from_resume(id);
            res.status(200).json({ text: result, status: 'success' });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async analyze(req: Request, res: Response){
        try{
            const {resume_id, description_id} = req.body
            const response = await axios.get(`http://localhost:8080/resume/`, { 
                params: { id: resume_id }
            })
            if(response.status === 200){
                const resume_text = response.data.text;
                if(!resume_text){
                    console.error('Resume text is empty or doesn\'t exist')
                    res.status(400).json({error: 'Resume text is empty or doesn\'t exist'})
                    return
                }
                if(resume_text.length > 10000){
                    console.error('Resume exceeds character limit of 10000.')
                    res.status(400).json({error: 'Resume exceeds character limit of 10000.'})
                }
                const job_description = await Description.findById(description_id);
                if(!job_description){
                    console.error('Job Description not found in database.')
                    res.status(400).json({error: 'Job Description not found in database.'})
                    return;
                }
                const description_text = job_description.job_description;
                if(!description_text){
                    console.error('Job description text is empty or doesn\'t exist')
                    res.status(400).json({error: 'Job description text is empty or doesn\'t exist'})
                    return;
                }
                console.error('Job description exceeds character limit of 10000.')
                if(description_text.length > 10000){
                    res.status(400).json({error: 'Job description exceeds character limit of 10000.'})
                    return;
                }
                const result = await ResumeService.get_feedback(resume_text, description_text);
                console.log(result);
                res.status(200).json({fit_score: result.fit_score, feedback: result.feedback, matching_keywords: []});
                return;
            }
            else{
                res.status(400).json({error: "Resume not found during text extraction.", status: 'error'});
                return;
            }
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async get_resumes(req: Request, res: Response){
        try{
            const {email} = req.params
            if (!email || typeof email !== 'string' ){
                res.status(400).json({ error: 'Invalid email.' });
                return;
            }
            const result = await ResumeService.get_resumes(email);
            const count = result.length;
            res.status(200).json({resumes: result, count: count});
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async update_name(req: Request, res: Response){
        try{
            const {id, name} = req.body
            const cleanedName = name.trim();
            if (!id || typeof id !== 'string' ){
                res.status(400).json({ error: 'Invalid ID.' });
                return;
            }
            if (!cleanedName || typeof name !== 'string' || typeof cleanedName !== 'string'){
                res.status(400).json({ error: 'Invalid name.' });
                return;
            }
            if(cleanedName.length > 50){
                res.status(400).json({ error: 'Name is too long.' });
                return;
            }
            const result = await ResumeService.update_name(id, name);
            res.status((result.status == 'success') ? 200: 400).json(result);
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }   
    }
    static async delete_name(req: Request, res: Response){
        try{
            const {id} = req.body
            if (!id || typeof id !== 'string' ){
                res.status(400).json({ error: 'Invalid ID.' });
                return;
            }
            const result = await ResumeService.delete_name(id);
            res.status((result.status == 'success') ? 200: 400).json(result);
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }   
    }
}

export default ResumeHandler;