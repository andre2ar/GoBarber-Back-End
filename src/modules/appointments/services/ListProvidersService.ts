import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/respositories/IUsersRepository";
import {inject, injectable} from "tsyringe";

@injectable()
export default class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute(user_id: string): Promise<User[]> {
        return await this.usersRepository.findAllProviders({
            except_user_id: user_id
        });
    }
}
