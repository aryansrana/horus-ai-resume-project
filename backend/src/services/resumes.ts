import { Resume } from "../models/resumes";
import pdfParse from 'pdf-parse';
import mammoth from "mammoth";


class ResumeService {
    static async resume_upload(resume_file: Express.Multer.File) {
        try {
            const newResume = new Resume({
                fileName: resume_file.originalname,
                data: resume_file.buffer,
                contentType: resume_file.mimetype,
            });
            await newResume.save();

            return { message: "Resume uploaded successfully.", status: "success" };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during resume upload');
        }
    }
    // Holding off on making endpoint for this function for now, unsure of whether to use in frontend or backend
    static async extract_text_from_resume(resume_name: string) {
        try {
            // Retrieve resume from MongoDB
            const resume = await Resume.findOne({fileName : resume_name});
            if (!resume) {
                throw new Error("Resume not found.");
            }
            const { data, contentType } = resume;
            // Ensure data exists
            if (!data || !contentType) {
                throw new Error("Invalid resume data.");
            }

            // Convert binary data back to plain text based on contentType
            if (contentType === "application/pdf") {
                const pdfData = await pdfParse(data);
                return pdfData.text;
            }

            if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ buffer: data });
                return result;
            }

            throw new Error("Unsupported file type.");
        } catch (error) {
            throw new Error((error as Error).message || "Error during resume text extraction");
        }
    }
}

export default ResumeService;
