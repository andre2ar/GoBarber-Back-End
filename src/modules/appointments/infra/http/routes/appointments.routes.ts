import { Router } from "express";
import { parseISO }  from 'date-fns';
import { container } from "tsyringe";

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "@modules/appointments/infra/http/controllers/AppointmentsController";

const appointmentsController = new AppointmentsController();
const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);
/*appointmentsRouter.get('/', async (request, response) => {
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});*/

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
