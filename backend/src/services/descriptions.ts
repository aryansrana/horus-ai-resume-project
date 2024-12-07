import { Description } from '../models/descriptions';

class DescriptionService {
    static async job_description(email: string, name: string, job_description: string) {
        try {
            // Clean up and trim the job description text
            const cleanedDescription = job_description.trim();
            const cleanedName = name.trim();
            const newDescription = new Description({
                email: email,
                name: cleanedName,
                job_description: cleanedDescription,
            });
            
            await newDescription.save();

            // Additional validation or processing could go here if needed
            return { status: 'success', message: 'Job description submitted successfully.' };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during job description upload');
        }
    }
    static async get_descriptions(email: string) {
        try {
            const descriptions = await Description.find({email: email}).sort({dateAdded: -1}); // -1 means reverse sorted, most recent will be on top
            return descriptions;
        } catch (error) {
            throw new Error((error as Error).message || 'Error during job description retrieval.');
        }
    }
    static async update_name(id: string, name: string){
        try{
            const cleanedName = name.trim();
            const description = await Description.findByIdAndUpdate(id, {name: cleanedName}, {new: true});
            if(description){
                return { status: 'success', message: 'Job description\'s name updated successfully.' };
            }
            else{
                return { status: 'error', message: 'Job description not found.'};
            }
        }catch (error) {
            throw new Error((error as Error).message || 'Error during job description name\'s update.');
        }
    }
    static async delete_name(id: string){
        try{
            const description = await Description.findByIdAndDelete(id);
            if(description){
                return { status: 'success', message: 'Job description deleted successfully.' };
            }
            else{
                return { status: 'error', message: 'Job description not found.'};
            }
        }catch (error) {
            throw new Error((error as Error).message || 'Error during job description\'s deletion.');
        }
    }
}

export default DescriptionService;
