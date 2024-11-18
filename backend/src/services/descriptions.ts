import { Description } from '../models/descriptions';
import { Document, Schema } from 'mongoose';
import pdfParse from 'pdf-parse';


class DescriptionService {
    static async job_description(job_description: string) {
        try {
            // Clean up and trim the job description text
            const cleanedDescription = job_description.trim();

            const newDescription = new Description({
                job_description: cleanedDescription,
            });
            
            await newDescription.save();

            // Additional validation or processing could go here if needed
            return { status: 'success', message: 'Job description submitted successfully.' };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during job description upload');
        }
    }
}

export default DescriptionService;
