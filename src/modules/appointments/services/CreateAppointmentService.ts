import "reflect-metadata"; //JEST
import Appointment from "../infra/typeorm/entities/Appointment";
import { inject, injectable } from "tsyringe";
import {getHours, isBefore, startOfHour} from "date-fns";
import AppError from "@shared/errors/AppError";
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

interface IRequest {
    user_id: string;
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}


    public async execute({user_id, provider_id, date}: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate);
        if(findAppointmentInSameDate) {
            throw new AppError("This appointment is already booked");
        }

        if(isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't create an appointment in a past date");
        }

        if(user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError('You can only create appointments between 8am and 5pm');
        }

        return await this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate
        });
    }
}

export default CreateAppointmentService;
