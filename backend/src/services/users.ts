import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { User } from '../models/users'; // Assuming you have a User model for MongoDB

class UserService {
    static async register(email: string, password: string, username: string) {
        try {
            // Check if the email already exists in the database
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already in use');
            }

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds of hashing

            // Create a new user object and save to the database
            const newUser = new User({
                email,
                password: hashedPassword,
                username
            });

            await newUser.save(); // Save to MongoDB

            return { message: 'User registered successfully' };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during registration');
        }
    }

    static async login(email: string, password: string) {
        try {
            // Check if the user exists in the database
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate a JWT token with an expiration of 1 hour
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET || 'default_secret', // Store the secret in .env for security
                { expiresIn: '1h' }
            );

            return { token };
        } catch (error) {
            throw new Error((error as Error).message || 'Error during login');
        }
    }
}

export default UserService;
