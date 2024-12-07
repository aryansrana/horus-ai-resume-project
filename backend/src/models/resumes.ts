import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the resume document
interface IResume extends Document {
  email: string;
  name: string;
  data: Buffer;
  contentType: string;
  dateAdded: Date;
}

// Create the Mongoose schema based on the interface
const resumeSchema = new Schema<IResume>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  data: { type: Buffer, required: true }, // Store file as binary data
  contentType: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

// Create the Mongoose model using the schema
const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export { IResume, Resume };
