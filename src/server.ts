import express from 'express';
import 'reflect-metadata';
import routes from "./routes";
import path from 'path';
import dotenv from 'dotenv';
import './database';
import uploadConfig from "./config/upload";

dotenv.config({path: path.resolve(__dirname, '..', '.env')});

const app = express();

app.use(express.json());

app.use('/files', express.static(uploadConfig.directory));
app.use('/', routes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
