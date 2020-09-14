import sendgrid, { MailDataRequired } from '@sendgrid/mail';
import { User } from 'entities/User';
import UserService from 'services/User';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');

const sendEmail = (data: MailDataRequired) => {
  return sendgrid.send(data);
};

const sendEmailWithAutoLoginUrl = (user: User) => {
  if (!user) {
    throw new Error('No user provided');
  }

  const autoLoginUrl = UserService.buildAutoLoginUrl(user);

  const data = {
    to: user.email,
    from: 'no-reply@gigwindow.com',
    subject: 'Your login for GigWindow',
    text: `You can use this link to log in to GigWindow: ${autoLoginUrl}. It will be valid for the next 15 minutes. If you didn't request this, you can ignore this email.`,
  };

  return sendEmail(data);
};

export default {
  sendEmail,
  sendEmailWithAutoLoginUrl,
};
