import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import AuthsHandler from "./handler";
import { routes } from "./routes";

export const auths = {
  version: "1.0.0",
  name: "authentications",
  register: async (server : Server, { container } : { container : Container}) => {
    const authsHandler = new AuthsHandler(container);
    server.route(routes(authsHandler));
  },
};
