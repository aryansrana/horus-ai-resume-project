import { Router, Request, Response } from 'express';
import multer, { Multer } from 'multer'; // Import multer and types
import UserHandler from '../handlers/users';
import ResumeHandler from '../handlers/resumes';

const router = Router();

// Set up Multer for file upload
const upload = multer({
    limits: { fileSize: 2 * 1024 * 1024 }, // Max file size 2MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only PDF or DOCX are allowed.'));
        }
        cb(null, true);
    },
});

router.post('/register', UserHandler.register);

router.post('/login', UserHandler.login);

// Resume upload endpoint
router.post('/resume-upload', upload.single('resume_file'), (req: Request, res: Response) => {
    if (req.file) {
        ResumeHandler.resume_upload(req, res);
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

// Job description endpoint
router.post('/job-description', ResumeHandler.job_description);

export default router;
