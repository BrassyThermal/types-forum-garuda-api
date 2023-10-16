import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import ThreadsHandler from "./handler";
import { routes } from "./routes";

export const threads = {
  version: "1.0.0",
  name: "threads",
  register: async (server : Server, { container } : { container : Container }) => {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};
