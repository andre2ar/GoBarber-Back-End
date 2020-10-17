import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import AppError from "@shared/errors/AppError";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";

describe('Create User', () => {
    it('should be able to create a new user', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with an used email', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});
