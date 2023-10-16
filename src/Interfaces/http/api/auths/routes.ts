import AuthsHandler from "./handler";

export const routes = (handler : AuthsHandler) => ([
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthHandler,
  },
  {
    method: "DELETE",
    path: "/authentications",
    handler: handler.deleteAuthHandler,
  },
]);
