import { FastifyInstance } from "fastify";
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
} from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref(`createUserResponseSchema`),
        },
      },
    },
    registerUserHandler
  );

  server.get(
    "/",
    {
      preHandler: [server.authenticate],
    },
    getUsersHandler
  );

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          200: $ref(`loginResponseSchema`),
        },
      },
    },
    loginHandler
  );
}

export default userRoutes;
