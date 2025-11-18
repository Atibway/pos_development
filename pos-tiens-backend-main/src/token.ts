import { decrypt, encrypt } from "./Helpers/Hash";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from 'process';
import chalk from "chalk"

const log = console.log;

async function generateHash() {
  const rl = readline.createInterface({ input, output });
  const question = `Enter date in of expiry for the token:
  Format MUST be: ${chalk.underline("YYYY-MM-DD")}
  >>>> `
  const answer = await rl.question(question);

  rl.close();

  const dateRegex = new RegExp(/\d{4}-\d{2}-\d{2}/);
  if (!dateRegex.test(answer)) {
    console.log("Invalid date format");
    return;
  }

  try {
    const hash = encrypt(answer);
    log(chalk.green("Token generated successfully!"))
    log(`TOKEN: ${chalk.gray(hash)}`)
  } catch (error) {
    log(chalk.red("Error generating token"))
  }
}
generateHash();



