import AppError from "@shared/errors/AppError";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";
import {differenceInHours} from "date-fns";
import IUsersTokenRepository from "@modules/users/respositories/IUsersTokenRepository";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UsersTokenRepository')
        private usersTokenRepository: IUsersTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.usersTokenRepository.findByToken(token);

        if(!userToken) {
            throw new AppError('User token does not exists');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user) {
            throw new AppError('User does not exists');
        }

        if(differenceInHours(Date.now(), userToken.created_at) > 2) {
            throw new AppError('Token expired');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}
