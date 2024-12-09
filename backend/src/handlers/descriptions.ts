import { Request, Response } from 'express';
import DescriptionService from '../services/descriptions';

class DescriptionHandler {
    static async job_description(req: Request, res: Response) {
        try {
            const { email, name, job_description } = req.body;
            if(!email || typeof email !== 'string'){
                res.status(400).json({ error: 'Invalid email.' });
                return;
            }
            if(!name || typeof name !== 'string'){
                res.status(400).json({ error: 'Invalid job name.' });
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
            if (name.length > 50) {
                res.status(400).json({ error: 'Job name exceeds character limit of 50.' });
                return;
            }

            const result = await DescriptionService.job_description(email, name, job_description);
            res.status(201).json(result);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
    static async get_descriptions(req: Request, res: Response){
        try{
            const {email} = req.params
            if (!email || typeof email !== 'string' ){
                res.status(400).json({ error: 'Invalid email.' });
                return;
            }
            const result = await DescriptionService.get_descriptions(email);
            const count = result.length;
            res.status(200).json({descriptions: result, count: count});
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async update_name(req: Request, res: Response){
        try{
            const {id, name} = req.body
            const cleanedName = name.trim();
            if (!id || typeof id !== 'string' ){
                res.status(400).json({ error: 'Invalid ID.' });
                return;
            }
            if (!cleanedName || typeof name !== 'string' || typeof cleanedName !== 'string'){
                res.status(400).json({ error: 'Invalid name.' });
                return;
            }
            if(cleanedName.length > 50){
                res.status(400).json({ error: 'Name is too long.' });
                return;
            }
            const result = await DescriptionService.update_name(id, name);
            res.status((result.status == 'success') ? 200: 400).json(result);
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }   
    }
    static async delete_name(req: Request, res: Response){
        try{
            const {id} = req.body
            if (!id || typeof id !== 'string' ){
                res.status(400).json({ error: 'Invalid ID.' });
                return;
            }
            const result = await DescriptionService.delete_name(id);
            res.status((result.status == 'success') ? 200: 400).json(result);
            
            return;
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }   
    }
}

export default DescriptionHandler;
