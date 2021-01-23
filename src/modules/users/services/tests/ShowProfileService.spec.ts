import "reflect-metadata";

import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import AppError from "@shared/errors/AppError";
import ShowProfileService from "@modules/users/services/ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();

        showProfile = new ShowProfileService(
            fakeUsersRepository,
        );
    });

    it('should be able to recover user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await showProfile.execute(user.id);

        expect(updatedUser.name).toBe('John Doe');
        expect(updatedUser.email).toBe('johndoe@example.com');
    });

    it('should be able to recover a non-existing user profile', async () => {
        await expect(showProfile.execute('non-existent-user')).rejects
            .toBeInstanceOf(AppError);
    });
});
