import { hash, compare } from "bcrypt";
import { sign, verify, decode } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { join } from "path";

//handlebars
const hbs = require("nodemailer-express-handlebars");

export const customPayloadResponse = (
  status: boolean,
  payload: any
): object => {
  return {
    status: status,
    payload: payload,
  };
};

export const randomStringGenerator = (length: number) => {
  let result = "";
  const characters = "A0B1C2D3E4F5G6H7I8J9K0LMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const hashPassword = async (password: string, rounds: number) => {
  try {
    const hashedPassword = await hash(password, rounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const result = await compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getAuthAccessToken = (user: object, token: any) => {
  const accessToken = sign(JSON.parse(JSON.stringify(user)), token, {
    expiresIn: "1d",
  });
  return accessToken;
};

export const getAuthRefreshToken = (user: object, token: any) => {
  const refreshToken = sign(JSON.parse(JSON.stringify(user)), token, {
    expiresIn: "2d",
  });
  return refreshToken;
};

export const verifyAuthAccessToken = (token: any, secret: any) => {
  const verifiedToken = verify(token, secret);
  return verifiedToken;
};

export const invalidateToken = (modifiedLoad: any, secret: any) => {
  const newToken = sign(modifiedLoad, secret);
  return newToken;
};

export const decodeToken = (token: any) => {
  const decodeToken = decode(token);
  return decodeToken;
};

export const setTokenExpiryToZero = (decodedToken: any) => {
  const modifiedPayload = { ...decodedToken, exp: 0 };
  return modifiedPayload;
};

//mail configs
export const mailTransporter = (email: any, password: any) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".handlebars",
        defaultLayout: false,
        partialsDir: join(__dirname, "..", "Views/"),
      },
      viewPath: join(__dirname, "..", "Views/"),
      extName: ".handlebars",
    })
  );
  return transporter;
};

export const extraLatestArrayIndex = (array: any) => {
  let lastIndexItem = null;
  for (let i = 0; i < array.length; i++) {
    if (array.length - 1 === i) {
      lastIndexItem = array[i];
    }
  }
  return lastIndexItem;
};

//sending emails
export const sendingMail = (options: object) => {
  let new_options = { ...options, from: process.env.MAIL_USER };
  const mailTransport = mailTransporter(
    process.env.MAIL_USER,
    process.env.MAIL_PASSWORD
  );
  mailTransport
    .sendMail(new_options)
    .then(() => console.log("Message sent!!"))
    .catch((err: unknown) => console.log(err));
};