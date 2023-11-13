import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import LikesHandler from "./handler";
import { routes } from "./route";

export const likes = {
  version: "1.0.0",
  name: "likes",
  register: async (server : Server, { container } : { container : Container }) => {
    const likesHandler = new LikesHandler(container);
    server.route(routes(likesHandler));
  }
};

