import {Router} from "express";

import ProfileController from "@modules/users/controllers/ProfileController";
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import {celebrate, Joi, Segments} from "celebrate";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        old_password: Joi.string().min(6).allow(null, ''),
        password: Joi.string().min(6).allow(null, ''),
        password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
}), profileController.update);

export default profileRouter;
