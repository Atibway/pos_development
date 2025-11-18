declare module "nodemailer" {
  import { TransportOptions } from "nodemailer";
  const createTransport: (options: TransportOptions) => any;
  export { createTransport };
}
