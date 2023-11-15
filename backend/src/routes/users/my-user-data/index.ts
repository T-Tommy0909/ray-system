import { FastifyPluginAsync, PassportUser } from "fastify";
import { UserBasePayload } from "../../../types/user";
import { prisma } from "../../../utils/prisma";

const index: FastifyPluginAsync = async (fastify) => {
  fastify.get<{
    Reply: UserBasePayload;
  }>("/", async (request, reply) => {
    if (!request.user) {
      throw fastify.httpErrors.unauthorized("無効なセッションです");
    }

    const userData = async (user: PassportUser) => {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
        },
      });
      if (!userData) {
        return;
      }

      const response = {
        id: userData.id,
        email: userData.email,
      };
      return response;
    };

    const response = await userData(request.user);

    reply.send(response);
  });
};

export default index;
