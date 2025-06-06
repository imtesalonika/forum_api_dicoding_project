const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.addComment,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteComment,
    options: {
      auth: "jwt",
    },
  },
];

module.exports = routes;
