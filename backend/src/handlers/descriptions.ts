import { Request, Response } from 'express';
import DescriptionService from '../services/descriptions';

class DescriptionHandler {
    static async job_description(req: Request, res: Response) {
        try {
            const { email, job_description } = req.body;
            if(!email || typeof email !== 'string'){
                res.status(400).json({ error: 'Invalid email.' });
                return;
            }
            if (!job_description || typeof job_description !== 'string') {
                res.status(400).json({ error: 'Invalid job description.' });
                return;
            }

            // Validate length
            if (job_description.length > 5000) {
                res.status(400).json({ error: 'Job description exceeds character limit of 5000.' });
                return;
            }

            const result = await DescriptionService.job_description(email, job_description);
            res.status(200).json(result);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
}

export default DescriptionHandler;
