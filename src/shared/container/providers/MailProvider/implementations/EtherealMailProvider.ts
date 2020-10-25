import nodemailer, {Transporter} from 'nodemailer';
import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";

interface IMessage {
    to: string;
    body: string;
}

export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;
    constructor() {
        nodemailer.createTestAccount().then(account => {
            this.client = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
        });
    }

    public async sendMail(to: string, body: string): Promise<void> {
        const message = await this.client.sendMail({
            from: 'GoBarber Team <team@gobarber.com>',
            to,
            subject: 'Password recover',
            text: body,
        });

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
