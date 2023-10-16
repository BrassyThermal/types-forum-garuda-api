/* istanbul ignore file */
import dotenv from "dotenv";
import Jwt from "@hapi/jwt";
import { usersTableTestHelper } from "./usersTable";

dotenv.config();

export const accessTestHelper = {
  async getToken() {
    const userPayload = {
      username: "access",
      id: "user-121",
    };
    await usersTableTestHelper.addUser(userPayload);
    return Jwt.token.generate(
      userPayload,
      process.env.ACCESS_TOKEN_KEY as string
    );
  },
};
