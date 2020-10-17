import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import CreateUserService from "@modules/users/services/CreateUserService";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";

describe('Send forgot password', () => {
    it('should be able to recover the password using the email', async function () {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeMailProvider = new FakeMailProvider();

        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const senEmail = jest.spyOn(fakeMailProvider, 'sendMail');
        const sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider);
        await sendForgotPasswordEmail.execute({email: user.email});

        expect(senEmail).toHaveBeenCalled();
    });
});
