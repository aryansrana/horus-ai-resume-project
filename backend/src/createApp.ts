import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'

import './routes/users';
import './routes/descriptions';
import './routes/resumes';
import router from "./routes/router";

export function createApp() {
    const app = express();
    
    app.use(cors())
    app.use(express.json())
    app.use(cookieParser())
    app.use('/api', router);
    return app;
}