import { FastifyPluginAsync } from 'fastify';

const index: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', (request, reply) => {
    // request.session.delete();
    request.logout();
    reply.send('logout');
  });
};

export default index;
