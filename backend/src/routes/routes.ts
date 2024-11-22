import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import UserHandler from '../handlers/users';
import ResumeHandler from '../handlers/resumes';
import DescriptionHandler from '../handlers/descriptions';

const router = Router();

const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb: FileFilterCallback) => {
        const allowedMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PDF or DOCX files are allowed.'));
        }
        cb(null, true);
    },
});

router.post('/register', UserHandler.register);

router.post('/login', UserHandler.login);

router.post('/resume-upload', upload.single('resume_file'), ResumeHandler.resume_upload);

router.post('/job-description', DescriptionHandler.job_description);

router.get('/resume', ResumeHandler.get_resume)

export default router;