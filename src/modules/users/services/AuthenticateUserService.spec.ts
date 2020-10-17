import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import AppError from "@shared/errors/AppError";
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";

describe('Authenticate User', () => {
    it('should be able to authenticate', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        const response = await authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        await expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        await expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: 'wrong-password'
        })).rejects.toBeInstanceOf(AppError);
    });
});
