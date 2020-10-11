import fs from 'fs';
import path from 'path';

import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        /*Delete avatar if it exists*/
        if(user.avatar) {
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFilename;

        return await this.usersRepository.save(user);
    }
}

export default UpdateUserAvatarService;
