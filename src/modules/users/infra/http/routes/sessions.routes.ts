import { Router } from "express";
import SessionsController from "@modules/users/controllers/SessionsController";

const sessionsController = new SessionsController();
const sessionsRouter = Router();

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;
