import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";
import IHashProvider from "@modules/users/providers/HashProvider/models/IHashProvider";

interface IRequest {
    name: string;
    email: string;
    password: string;
}

@injectable()
export default class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(email);

        if(checkUserExists) {
            throw new AppError('Email address already used');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        return this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });
    }
}
