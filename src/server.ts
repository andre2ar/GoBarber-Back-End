import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import routes from "./routes";
import path from 'path';
import dotenv from 'dotenv';
import AppError from "./errors/AppError";
import './database';
import uploadConfig from "./config/upload";

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));
app.use('/', routes);

app.use((err: Error, request:Request, response: Response, next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    console.error(err);
    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
