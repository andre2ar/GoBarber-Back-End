import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProvidersController from "@modules/appointments/infra/http/controllers/ProvidersControllers";
import ProviderDayAvailabilityController from "@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController";
import ProviderMonthAvailabilityController from "@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController";

const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providersRouter = Router();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/month-availability', providerMonthAvailabilityController.index);
providersRouter.get('/:provider_id/day-availability', providerDayAvailabilityController.index);

export default providersRouter;
