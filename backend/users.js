import bcrypt from "bcryptjs";

import dotenv from "dotenv";

dotenv.config();

const { ADMIN_PASSWORD, TEST_USER_PASSWORD } = process.env;

let USERS = [
  {
    name: "admin",
    email: "admin@test.pl",
    password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    isAdmin: true,
  },
];

export default USERS;
