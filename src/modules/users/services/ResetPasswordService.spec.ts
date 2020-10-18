import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "@modules/users/respositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "@modules/users/services/ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;

let resetPassword: ResetPasswordService;

describe('Send forgot password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository
        );
    });

    it('should be able to reset password', async function () {
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        await resetPassword.execute({token: userToken.token, password: '123123'});

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe('123123');
    });
});
