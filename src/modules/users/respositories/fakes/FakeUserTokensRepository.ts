import IUsersTokenRepository from "@modules/users/respositories/IUsersTokenRepository";
import UserToken from "@modules/users/infra/typeorm/entities/UserToken";
import {v4 as uuid} from "uuid";

export default class FakeUserTokensRepository implements IUsersTokenRepository {
    private userTokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
        });

        this.userTokens.push(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        return this.userTokens.find(findToken => findToken.token === token);
    }
}
