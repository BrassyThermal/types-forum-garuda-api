import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import RepliesHandler from "./handler";
import { routes } from "./routes";

export const replies = {
  version: "1.0.0",
  name: "replies",
  register: async (server : Server, { container } : { container : Container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};
