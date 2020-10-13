import "reflect-metadata"; //JEST
import Appointment from "../infra/typeorm/entities/Appointment";
import { inject, injectable } from "tsyringe";
import { startOfHour } from "date-fns";
import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}


    public async execute({provider_id, date}: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate
        );

        if(findAppointmentInSameDate) {
            throw new AppError("This appointment is already booked");
        }

        return await this.appointmentsRepository.create({
            provider_id, date: appointmentDate
        });
    }
}

export default CreateAppointmentService;
