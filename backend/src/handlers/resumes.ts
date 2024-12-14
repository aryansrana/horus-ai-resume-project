import { Request, Response } from 'express';
import ResumeService from '../services/resumes';
import { Description } from '../models/descriptions';
class ResumeHandler {
    static async resume_upload(req: Request, res: Response) {
        try {
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