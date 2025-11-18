
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from 'process';
import { hashPassword } from "./Helpers/Helpers";
import { DatabaseConnection } from "./Database/database";
import { createUser, setUserRoles } from "./Entities/user";


async function createStaffinDB() {
    // ask for first name
    const rl = readline.createInterface({ input, output });
    const question = `Enter first name:
    >>>> `
    const first_name = await rl.question(question);

    // ask for middle name
    const question2 = `Enter middle name:
    >>>> `
    const middle_name = await rl.question(question2);

    // ask for last name
    const question3 = `Enter last name:
    >>>> `
    const last_name = await rl.question(question3);

    // ask for email
    const question4 = `Enter email:
    >>>> `
    const email = await rl.question(question4);

    // ask for password
    const question5 = `Enter password:
    >>>> `
    const password = await rl.question(question5);

    // hash the password
    const hashedPassword = await hashPassword(password, 10);

    if (!hashedPassword) {
        console.log("Error hashing password");
        return;
    }

    // create staff
    const staff = await createUser(first_name, middle_name, last_name, email, hashedPassword);
    await setUserRoles(staff.id, ["admin"]);
    rl.close();

    console.log("Staff created successfully!");
    console.log("Staff created successfully!");

}
 
DatabaseConnection.initialize()
  .then(() => {
    console.log("Database Connection Successful");
    createStaffinDB();
  })
  .catch((error) => {
    console.log(error);
  });
