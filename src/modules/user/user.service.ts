import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

function omit(key: string, obj: any) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

// Prisma.UserCreateArgs["data"]
export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const data = { ...rest, password: hash, salt };

  const user = await prisma.user.create({
    data,
  });

  return user;
}

export function getUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}
