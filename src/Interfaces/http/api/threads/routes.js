const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.addNewThread,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadDetails,
  },
];

module.exports = routes;
