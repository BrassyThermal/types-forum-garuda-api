// External Agency
import dotenv from "dotenv";
import * as Hapi from "@hapi/hapi";
import * as Jwt from "@hapi/jwt";
import { Container } from "instances-container";

// Importing Routes and Handler
import { users } from "../../Interfaces/http/api/users";
import { auths } from "../../Interfaces/http/api/auths";
import { threads } from "../../Interfaces/http/api/threads";
import { comments } from "../../Interfaces/http/api/comments";
import { replies } from "../../Interfaces/http/api/replies";

// Importing an Error
import ClientError from "../../Commons/exceptions/ClientError";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/naming-convention
export const CreateServer = async (
  container : Container
) : Promise<Hapi.Server> => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({ plugin: Jwt });

  server.auth.strategy("forum_garuda_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate: (artifacts : any) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: auths,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
  ]);

  server.route({
    method: "GET",
    path: "/",
    handler: (request, h) => {
      const htmlResponse = `<html>
          <head>
            <title>Forum Garuda API</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to bottom, blue, white);"
          >
            <h1 style="
              font-family: sans-serif;
              font-size: calc(8vw + 5px);
              font-weight: 400;
              color: #E91E63;"
            >
              Hello World!
            </h1>
          </body>
        </html>`;
      return h.response(htmlResponse).type("text/html").code(200);
    },
  });

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: translatedError.message,
          })
          .code(translatedError.statusCode);
      }

      if (!(translatedError as { isServer : boolean }).isServer) {
        return h.continue;
      }

      return h
        .response({
          status: "error",
          message: "terjadi kegagalan pada server kami",
        })
        .code(500);
    }

    return h.continue;
  });

  return server;
};
