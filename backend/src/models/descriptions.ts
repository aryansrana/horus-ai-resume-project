import mongoose, { Document, Schema } from 'mongoose';

interface IDescription extends Document {
    email: string;
    name: string;
    job_description: string;
    dateAdded: Date;
}

const jobDescriptionSchema = new Schema<IDescription>({
    email: { type: String, required: true },
    name: { type: String, required: true },
    job_description: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
});

const Description = mongoose.model<IDescription>('Description', jobDescriptionSchema);
export { IDescription, Description };
