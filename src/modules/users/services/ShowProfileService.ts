import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";

@injectable()
export default class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(user_id: string): Promise<User> {
        const user = await this.usersRepository.findById(user_id);
        if(!user) {
            throw new AppError('User not fount');
        }

        return user;
    }
}
