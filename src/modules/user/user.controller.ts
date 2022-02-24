import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, getUsers } from "./user.service";
import { verifyPassword } from "../../utils/hash";
import { server } from "../../app";

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function getUsersHandler() {
  const users = await getUsers();
  return users;
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(404).send({
      message: "User not found",
    });
  }

  const correctPassword = verifyPassword({
    password: body.password,
    salt: user.salt,
    hash: user.password,
  });

  const { password, salt, ...rest } = user;

  if (correctPassword) {
    return { accessToken: server.jwt.sign(rest) };
  }

  return "jwkj";
}
