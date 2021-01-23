import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
export default class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageRepository: IStorageProvider
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user) {
            throw new AppError('Only authenticated users can change avatar.', 401);
        }

        /*Delete avatar if it exists*/
        if(user.avatar) {
            await this.storageRepository.deleteFile(user.avatar);
        }

        user.avatar = await this.storageRepository.saveFile(avatarFilename);

        return await this.usersRepository.save(user);
    }
}
