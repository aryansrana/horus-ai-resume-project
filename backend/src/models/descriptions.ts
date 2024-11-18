import mongoose, { Document, Schema } from 'mongoose';

interface IDescription extends Document {
    job_description: string;
}

const jobDescriptionSchema = new Schema<IDescription>({
    job_description: {type: String, required: true},
  });

const Description = mongoose.model<IDescription>('Description', jobDescriptionSchema);
export { IDescription, Description };