import { Request, Response } from 'express';
import UserService from '../services/users';

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
                res.status(400).json({ error: 'Missing required fields.' });
                return;
            }

            const result = await UserService.login(email, password);
            res.status(200).json({ token: result.token });
            return;
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
            return;
        }
    }
}

export default UserHandler;
