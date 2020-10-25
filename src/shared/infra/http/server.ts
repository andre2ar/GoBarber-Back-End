import 'reflect-metadata';

import express, {NextFunction, Request, Response} from 'express';
import cors from "cors";
import path from 'path';
import 'express-async-errors';
import dotenv from 'dotenv';

import AppError from "@shared/errors/AppError";
import uploadConfig from "@config/upload";
import '@shared/infra/typeorm';
import '@shared/container';

import routes from "./routes";

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', express.static(uploadConfig.tmpFolder));
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
