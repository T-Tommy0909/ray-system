import { User } from "@prisma/client";

declare module "fastify" {
  interface PassportUser extends User {
    id: number;
    email: string;
  }
}
