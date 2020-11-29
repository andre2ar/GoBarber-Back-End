import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import {inject, injectable} from "tsyringe";
import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import {classToClass} from "class-transformer";

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
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ provider_id, day, month, year}: IRequest): Promise<Appointment[]> {
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            `provider-appointments:${provider_id}:${year}-${month}-${day}`
        );

        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id,
                day,
                month,
                year
            });

            await this.cacheProvider.save(
                `provider-appointments:${provider_id}:${year}-${month}-${day}`,
                classToClass(appointments)
            );
        }

        return appointments;
    }
}
