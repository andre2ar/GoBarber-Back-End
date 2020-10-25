import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUserTokensRepository from "@modules/users/respositories/fakes/FakeUserTokensRepository";
import ResetPasswordService from "@modules/users/services/ResetPasswordService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;
let createUser: CreateUserService;

describe('Reset password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it('should be able to reset password', async function () {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
        await resetPassword.execute({
            token: userToken.token,
            password: '123123'
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset password with a non-existing token', async function () {
        await expect(resetPassword.execute({
            token: 'non-existing-token',
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with a non-existing user', async function () {
        const {token} = await fakeUserTokensRepository
            .generate('non-existing-user');

        await expect(resetPassword.execute({
            token,
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if 2 hours passed', async function () {
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const userToken = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({
            token: userToken.token,
            password: '123123'
        })).rejects.toBeInstanceOf(AppError);
    });
});
