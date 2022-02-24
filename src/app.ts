import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { withRefResolver } from "fastify-zod";
import swagger from "fastify-swagger";
import fjwt from "fastify-jwt";

import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import prisma from "./utils/prisma";

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: { id: number }; // payload type is used for signing and verifying
    user: {
      id: number;
      email: string;
      name: string;
    }; // user type is return type of `request.user` object
  }
}

export const server = Fastify();

server.register(fjwt, {
  secret: "supersecret",
});

server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

server.get("/healthcheck", async (request, reply) => {
  return { status: "ok" };
});

async function main() {
  /*
   * Add schemas to the server
   * must be done before we register the routes
   */
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: `/openapi`,
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: `Zod Fastify Test Server`,
          description: `API for Zod Fastify Test Server`,
          version: `0.0.0`,
        },
      },
    })
  );

  server.register(userRoutes, { prefix: "api/users" });
  server.register(productRoutes, { prefix: "api/products" });

  try {
    await server.listen(3000, "0.0.0.0");

    const address = server.server.address();

    const port = typeof address === "string" ? address : address?.port;

    console.log(
      `Server listening at http://${
        typeof address === "string" ? address : address.address
      }:${port}`
    );
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
