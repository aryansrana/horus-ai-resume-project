import { Request, Response } from 'express';
import AnalysisService from '../services/pairs';
import ResumeService from '../services/resumes'
import { Description } from '../models/descriptions';

class AnalysisHandler{

    static async analyze(req: Request, res: Response){
        try{
            const {resume_id, description_id} = req.body
            if(!resume_id){
                res.status(400).json({ error: 'Resume Id not given.', status: 'error' })
                return;
            }
            if(!description_id){
                res.status(400).json({ error: 'Job Description Id not given.', status: 'error' })
                return;
            }

            try{
                const resume_text = await ResumeService.extract_text_from_resume(resume_id);
                if(!resume_text){
                    res.status(400).json({ error: 'Resume text is empty.', status: 'error' })
                    return;
                }
                if(resume_text.length > 10000){
                    res.status(400).json({ error: 'Resume text exceeds the maximum of 10000 characters.', status: 'error' })
                    return;
                }
                const description = await Description.findById(description_id);
                if(!description){
                    res.status(400).json({ error: 'Description not found.', status: 'error' })
                    return;
                }
                const description_text = description.job_description;
                if(!description_text){
                    res.status(400).json({ error: 'Job Description text is empty.', status: 'error' })
                    return;
                }
                if(description_text.length > 10000){
                    res.status(400).json({ error: 'Resume text exceeds the maximum of 10000 characters.', status: 'error' })
                    return;
                }
                const result = await AnalysisService.get_feedback(resume_text, description_text);
                res.status(200).json({fit_score: result.fit_score, feedback: result.feedback, matching_keywords: result.matching_keywords});

            }
            catch(error){
                res.status(500).json({ error: (error as Error).message, status: 'error' });
                return;
            }
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
    static async comparison(req: Request, res: Response){
        try{
            const {resume_id, description_id} = req.body
            if(!resume_id){
                res.status(400).json({ error: 'Resume Id not given.', status: 'error' })
                return;
            }
            if(!description_id){
                res.status(400).json({ error: 'Job Description Id not given.', status: 'error' })
                return;
            }
            try{
                const resume_text = await ResumeService.extract_text_from_resume(resume_id);
                if(!resume_text){
                    res.status(400).json({ error: 'Resume text is empty.', status: 'error' })
                    return;
                }
                if(resume_text.length > 10000){
                    res.status(400).json({ error: 'Resume text exceeds the maximum of 10000 characters.', status: 'error' })
                    return;
                }
                const description = await Description.findById(description_id);
                if(!description){
                    res.status(400).json({ error: 'Description not found.', status: 'error' })
                    return;
                }
                const description_text = description.job_description;
                if(!description_text){
                    res.status(400).json({ error: 'Job Description text is empty.', status: 'error' })
                    return;
                }
                if(description_text.length > 10000){
                    res.status(400).json({ error: 'Resume text exceeds the maximum of 10000 characters.', status: 'error' })
                    return;
                }
                const result = await AnalysisService.compare(resume_text, description_text);
                res.status(200).json({fit_score: result.fit_score});
                return;
            }
            catch(error){
                res.status(500).json({ error: (error as Error).message, status: 'error' });
                return;
            }
        }
        catch(error){
            console.error(error);
            res.status(500).json({ error: (error as Error).message, status: 'error' });
            return;
        }
    }
}

export default AnalysisHandler;