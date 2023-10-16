import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import UsersHandler from "./handler";
import { routes } from "./routes";

export const users = {
  version: "1.0.0",
  name: "users",
  register: async (server : Server, { container } : { container : Container }) => {
    const usersHandler = new UsersHandler(container);
    server.route(routes(usersHandler));
  },
};
