import { Request, Response } from 'express';
import ResumeService from '../services/resumes';

class ResumeHandler {
    static async resume_upload(req: Request, res: Response) {
        try {
            // Check if file is provided
            const { resume_file } = req.files as { resume_file: Express.Multer.File[] }; // Expecting file as 'resume_file'
            if (!resume_file || resume_file.length === 0) {
                res.status(400).json({ error: 'No resume file uploaded.' });
                return;
            }

            const result = await ResumeService.resume_upload(resume_file[0]);
            
            res.status(result.status === 'success' ? 200 : 400).json(result);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }

    static async job_description(req: Request, res: Response) {
        try {
            const { job_description } = req.body;
            if (!job_description || typeof job_description !== 'string') {
                res.status(400).json({ error: 'Invalid job description.' });
                return;
            }

            // Validate length
            if (job_description.length > 5000) {
                res.status(400).json({ error: 'Job description exceeds character limit of 5000.' });
                return;
            }

            const result = await ResumeService.job_description(job_description);
            res.status(200).json(result);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
}

export default ResumeHandler;
