import LikesHandler from "./handler";

export const routes = ( handler : LikesHandler ) => [
  {
    method: "PUT",
    path: "/threads/{threadId}/comments/{commentId}/likes",
    handler: handler.putLikeHandler,
    options: {
      auth: "forum_garuda_jwt",
    },
  },
];
