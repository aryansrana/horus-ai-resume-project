import { Resume } from "../models/resumes";
import { Document, Schema } from 'mongoose';
import pdfParse from 'pdf-parse';


class ResumeService {
    static async resume_upload(resume_file: Express.Multer.File) {
        try {
            // Validate file type (Only PDF or DOCX are allowed)
            const allowedMimeTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedMimeTypes.includes(resume_file.mimetype)) {
                return { status: 'error', message: 'Invalid file type. Only PDF or DOCX files are allowed.' };
            }

            // Validate file size (Max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (resume_file.size > maxSize) {
                return { status: 'error', message: 'File size exceeds the 2MB limit.' };
            }

            // Process PDF file (if it's a PDF)
            if (resume_file.mimetype === 'application/pdf') {
                const pdfData = await pdfParse(resume_file.buffer);
                // You can extract text or other data from the PDF if needed
                console.log(pdfData.text); // Just for logging the extracted text
            }

            // Process DOCX file (if it's a DOCX) - you can use libraries like 'mammoth' or 'docxtemplater'
            if (resume_file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // Process DOCX file (Add processing logic as needed)
            }

            // For now, returning success as we don't store the file in DB
            return { status: 'success', message: 'Resume uploaded successfully.' };
        } catch (error) {
            return { status: 'error', message: (error as Error).message };
        }
    }

    static async job_description(job_description: string) {
        try {
            // Clean up and trim the job description text
            const cleanedDescription = job_description.trim();

            // Additional validation or processing could go here if needed
            return { status: 'success', message: 'Job description submitted successfully.' };
        } catch (error) {
            return { status: 'error', message: (error as Error).message };
        }
    }
}

export default ResumeService;
