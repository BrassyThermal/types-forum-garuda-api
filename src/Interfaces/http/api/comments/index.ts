import { Server } from "@hapi/hapi";
import { Container } from "instances-container";
import CommentsHandler from "./handler";
import { routes } from "./routes";

export const comments = {
  version: "1.0.0",
  name: "comments",
  register: async (server : Server, { container } : { container : Container }) => {
    const commentsHandler = new CommentsHandler(container);
    server.route(routes(commentsHandler));
  },
};
