import fastifyPassport from '@fastify/passport';
import { FastifyPluginAsync } from 'fastify';

const index: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/',
    {
      preValidation: fastifyPassport.authenticate('sessionAuth', {
        authInfo: false,
      }),
    },
    async (_, reply) => {
      reply.send('authenticated');
    },
  );
};

export default index;
