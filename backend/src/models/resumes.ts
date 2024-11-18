import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the resume document
interface IResume extends Document {
  fileName: string;
  data: Buffer;
  contentType: string;
}

// Create the Mongoose schema based on the interface
const resumeSchema = new Schema<IResume>({
  fileName: { type: String, required: true },
  data: { type: Buffer, required: true }, // Store file as binary data
  contentType: { type: String, required: true },
});

// Create the Mongoose model using the schema
const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export { IResume, Resume };
