import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";

interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        await this.mailProvider.sendMail(email, 'Password recover');
    }
}

export default SendForgotPasswordEmailService;
