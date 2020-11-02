import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import {inject, injectable} from "tsyringe";
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ provider_id, day, month, year}: IRequest): Promise<Appointment[]> {
        return await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            month,
            year
        });
    }
}
