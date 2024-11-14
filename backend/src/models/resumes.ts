import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the resume document
interface IResume extends Document {
  fileName: string;
  data: Buffer; // Store file as binary data (Buffer)
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
}

// Create the Mongoose schema based on the interface
const resumeSchema = new Schema<IResume>({
  fileName: { type: String, required: true },
  data: { type: Buffer, required: true }, // Store file as binary data
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Create the Mongoose model using the schema
const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export { IResume, Resume };
