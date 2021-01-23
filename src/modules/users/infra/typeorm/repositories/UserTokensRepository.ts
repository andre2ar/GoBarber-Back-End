import {getRepository, Repository} from "typeorm";

import IUsersTokenRepository from "@modules/users/respositories/IUsersTokenRepository";
import UserToken from "@modules/users/infra/typeorm/entities/UserToken";

export default class UserTokensRepository implements IUsersTokenRepository {
    private ormRepository: Repository<UserToken>;
    constructor() {
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.ormRepository.findOne({
            where: {token}
        })
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id
        });

        return await this.ormRepository.save(userToken);
    }
}
