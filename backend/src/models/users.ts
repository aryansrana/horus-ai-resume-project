import mongoose, { Document, Schema } from 'mongoose';

// Define the IUser interface
interface IUser extends Document {
  email: string;
  password: string;
  username: string;
}

// Define the user schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true
  }
});

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);
//await User.createCollection();
export { IUser, User };
