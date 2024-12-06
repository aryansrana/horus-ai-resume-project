import { Request, Response } from 'express';
import ResumeService from '../services/resumes';
import multer from 'multer';

class ResumeHandler {
    static async resume_upload(req: Request, res: Response) {
        try {
            const resume_file = req.file;
            if (!resume_file) {
                res.status(400).json({ error: 'No file uploaded.', status: 'error' });
                return;
            }
            const result = await ResumeService.resume_upload(resume_file);
            res.status(200).json({ message: 'Resume uploaded successfully.', status: 'success' });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async get_resume(req: Request, res: Response) {
        try {
            const {resume_name} = req.body;
            if (!resume_name) {
                res.status(400).json({ error: 'File name not given.', status: 'error' });
                return;
            }
            const result = await ResumeService.extract_text_from_resume(resume_name);
            res.status(200).json({ text: result, status: 'success' });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async analyze(req: Request, res: Response){
        try{
            const {resume_text, job_description} = req.body
            if (resume_text.length > 10000 || job_description.length > 10000){
                res.status(400).json({ error: 'Either Resume or Job description exceeds character limit of 10000.' });
                return;
            }
            const result = await ResumeService.get_feedback(resume_text, job_description);
            res.status(200).json({fit_score: result.fit_score, feedback: result.feedback});
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