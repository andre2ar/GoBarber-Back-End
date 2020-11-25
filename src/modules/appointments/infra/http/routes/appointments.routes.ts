import { Router } from "express";
import {celebrate, Joi, Segments} from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "@modules/appointments/infra/http/controllers/AppointmentsController";
import ProviderAppointmentsController
    from "@modules/appointments/infra/http/controllers/ProviderAppointmentsController";

const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();
const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post('/', celebrate({
    [Segments.BODY]: {
        provider_id: Joi.string().uuid().required(),
        date: Joi.date().required(),
    }
}), appointmentsController.create);

appointmentsRouter.get('/me', celebrate({
    [Segments.BODY]: {
        year: Joi.number().required(),
        month: Joi.number().required(),
        day: Joi.number().required(),
    }
}), providerAppointmentsController.index);

export default appointmentsRouter;
