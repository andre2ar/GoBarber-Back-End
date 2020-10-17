import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";

describe('Create User', () => {
    it('should be able to create a new appointment', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const createUser = new CreateUserService(fakeUsersRepository);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
    });
});
