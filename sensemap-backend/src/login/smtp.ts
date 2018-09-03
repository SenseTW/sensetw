
const debug = require('debug')('sensemap-backend:smtp');
import { context } from '../context';
import * as SMTPClient from 'nodemailer/lib/smtp-connection';

type EmailAddress = string;
type MessageBody = string;

const { env } = context();

const connectionOptions = {
  host: env.MAILGUN_HOST,
  port: env.MAILGUN_PORT,
  name: env.MAILGUN_NAME,
  secure: true,
  authMethod: 'PLAIN',
  debug: env.NODE_ENV === 'development',
};

const loginCredentials = {
  credentials: {
    user: env.MAILGUN_USER,
    pass: env.MAILGUN_PASS,
  },
};

export const sendEmail = (to: EmailAddress, subject: string, message: MessageBody) => {
  if (!env.MAILGUN_USER || !env.MAILGUN_PASS) {
    debug('skipped email without credential settings');
    return Promise.resolve();
  }

  debug(`connecting to ${connectionOptions.host}:${connectionOptions.port}`);
  const conn = new SMTPClient(connectionOptions);
  return new Promise((resolve, reject) => {
    conn.on('error', reject);
    conn.connect(() => {
      debug(`login as ${env.MAILGUN_USER}`);
      conn.login(loginCredentials, (err) => {
        if (err) {
          conn.quit();
          return reject(err);
        }

        const envelope = {
          from: 'hello@sense.tw',
          to,
        };

        debug(`sending mail`);
        conn.send(envelope, `Subject: ${subject}\n\n${message}`, (err, info) => {
          if (err) {
            conn.quit();
            return reject(err);
          }

          debug('message sent');

          conn.quit();
          return resolve();
        });
      });
    });
  });
};
