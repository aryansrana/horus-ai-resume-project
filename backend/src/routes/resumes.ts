import router from './router';
import ResumeHandler from '../handlers/resumes';
import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';

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

function multerErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                error: 'File size exceeds the 2MB limit.',
                status: 'error',
            });
            return;
        }
    }

    // Handle missing file
    if (!req.file) {
        res.status(400).json({
            error: 'No file uploaded.',
            status: 'error',
        });
        return;
    }

    // Handle invalid file type
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(400).json({
            error: 'Invalid file type. Only PDF or DOCX files are allowed.',
            status: 'error',
        });
        return;
    }

    // If no issues, pass to the next middleware
    next();
}


router.post('/resume-upload', upload.single('resume_file'), multerErrorHandler, ResumeHandler.resume_upload);

router.get('/resume', ResumeHandler.extract_resume)

router.post('/analyze', ResumeHandler.analyze);