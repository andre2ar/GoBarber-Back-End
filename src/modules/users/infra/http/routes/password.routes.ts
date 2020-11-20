import { Router } from "express";
import ForgotPasswordController from "@modules/users/controllers/ForgotPasswordController";
import ResetPasswordController from "@modules/users/controllers/ResetPasswordController";
import {celebrate, Joi, Segments} from "celebrate";

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();
const passwordRouter = Router();

passwordRouter.post('/forgot', celebrate({
    [Segments.BODY]: {
        email: Joi.string().email().required(),
    },
}), forgotPasswordController.create);

passwordRouter.post('/reset', celebrate({
    [Segments.BODY]: {
        token: Joi.string().uuid().required(),
        password: Joi.string().required(),
        password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
}), resetPasswordController.create);

export default passwordRouter;
