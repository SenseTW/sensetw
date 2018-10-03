const debug = require("debug")("sensemap-backend:smtp");
import { context } from "../context";
import * as nodemailer from "nodemailer";

type EmailAddress = string | { name: string; address: string };
type MessageBody = string;
type Message = {
  from?: EmailAddress;
  to: EmailAddress;
  subject: string;
  text: MessageBody;
  html?: MessageBody;
};

const { env } = context();

const transporterOptions = {
  host: env.MAILGUN_HOST,
  port: env.MAILGUN_PORT,
  name: env.MAILGUN_NAME,
  secure: true,
  authMethod: "PLAIN",
  auth: {
    type: "login",
    user: env.MAILGUN_USER,
    pass: env.MAILGUN_PASS
  },
  debug: env.NODE_ENV === "development"
};

export const sendEmail = (message: Message) => {
  if (!message.from) {
    message.from = { name: "Sense.tw", address: "no-reply@sense.tw" };
  }

  if (!env.MAILGUN_USER || !env.MAILGUN_PASS) {
    debug("skipped email without credential settings");
    return Promise.resolve();
  }

  debug(`connecting to ${transporterOptions.host}:${transporterOptions.port}`);

  const transporter = nodemailer.createTransport(transporterOptions);

  return new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        debug("SMTP server connection error");
        return reject(error);
      }

      debug(`login as ${env.MAILGUN_USER}`);

      transporter.sendMail(message, (error, info) => {
        if (error) {
          debug("error sending mail");
          return reject(error);
        }
        resolve(info);
      });
    });
  });
};
