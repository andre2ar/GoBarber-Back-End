import AppError from "@shared/errors/AppError";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import IUsersTokenRepository from "@modules/users/respositories/IUsersTokenRepository";

interface IRequest {
    email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokensRepository')
        private usersTokenRepository: IUsersTokenRepository,
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new AppError('User does not exists');
        }

        const {token} = await this.usersTokenRepository.generate(user.id);

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Password recovery',
            templateData: {
                template: 'Hello, {{name}}: {{token}}',
                variables: {
                    name: user.name,
                    token: token,
                }
            }
        });
    }
}
