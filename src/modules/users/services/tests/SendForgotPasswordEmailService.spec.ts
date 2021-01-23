import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import AppError from "@shared/errors/AppError";
import FakeUserTokensRepository from "@modules/users/respositories/fakes/FakeUserTokensRepository";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeCacheProvider: FakeCacheProvider;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Send forgot password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeCacheProvider = new FakeCacheProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository
        );
    });

    it('should be able to recover the password using the email', async function () {
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const senEmail = jest.spyOn(fakeMailProvider, 'sendMail');
        await sendForgotPasswordEmail.execute({email: user.email});

        expect(senEmail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async function () {
        await expect(sendForgotPasswordEmail.execute({email: 'johndoe@example.com'}))
            .rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async function () {
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        await sendForgotPasswordEmail.execute({email: user.email});

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
