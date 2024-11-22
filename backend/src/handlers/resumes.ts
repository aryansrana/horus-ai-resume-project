import { Request, Response } from 'express';
import ResumeService from '../services/resumes';

class ResumeHandler {
    static async resume_upload(req: Request, res: Response) {
        try {
            console.log(req.file?.mimetype)
            const resume_file = req.file;
            if (!resume_file) {
                res.status(400).json({ error: 'No file uploaded.', status: 'error' });
                return;
            }
            const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedMimeTypes.includes(resume_file.mimetype)) {
                res.status(400).json({ error: 'Invalid file type. Only PDF or DOCX files are allowed.', status: 'error' });
                return;
            }
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (resume_file.size > maxSize) {
                res.status(400).json({  error: 'File size exceeds the 2MB limit.', status: 'error' });
                return;
            }
            const result = await ResumeService.resume_upload(resume_file);
            res.status(200).json({ message: 'Resume uploaded successfully.', status: 'success' });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
}

export default ResumeHandler;