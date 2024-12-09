import { Request, Response } from 'express';
import UserService from '../services/users';
import ms from "ms";

class UserHandler {
    static async register(req: Request, res: Response) {
        try {
            const { email, password, username } = req.body;
            if (!email || !password || !username) {
                res.status(400).json({ error: 'Missing required fields.' });
                return;
            }

            const result = await UserService.register(email, password, username);
            res.status(201).json({ message: result.message });
            return;
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
            return;
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                console.log("Missing email or password")
                res.status(400).json({ error: 'Missing required fields.' });
                return;
            }

            const result = await UserService.login(email, password);

            // Parse JWT_EXPIRATION from env
            const jwtExpiration = process.env.JWT_EXPIRATION || "1h";
            const maxAge = ms(jwtExpiration); // Convert to milliseconds

            if (!maxAge) {
                throw new Error("Invalid JWT_EXPIRATION format.");
            }
            
            res.cookie("token", result.token, {
                httpOnly: true, 
                secure: false,
                sameSite: 'lax', 
                maxAge,  // Set cookie lifespan based on JWT_EXPIRATION

            });
            
            
            //console.log("Logged in successfully.")
            res.status(200).json({ message: "Login successful" });
            return;
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: (error as Error).message });
            return;
        }
    }
}

export default UserHandler;
