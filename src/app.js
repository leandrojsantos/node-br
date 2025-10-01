import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import { config } from 'dotenv';
import HapiSwagger from 'hapi-swagger';
import HapiJwt from 'hapi-auth-jwt2';

import { DatabaseContext } from './config/database.js';
import { authRoutes } from './routes/authRoutes.js';
import { heroRoutes } from './routes/heroRoutes.js';

config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  await server.register([
    { plugin: Inert },
    { plugin: Vision },
    { plugin: HapiJwt },
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'API Strategy Pattern',
          version: '4.0.0'
        },
        documentationPath: '/docs',
        auth: false
      }
    }
  ]);

  const mongoContext = await DatabaseContext.createMongoContext();
  const postgresContext = await DatabaseContext.createPostgresContext();

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025',
    validate: async (decoded) => {
      const result = await postgresContext.findById(decoded.id);
      return { isValid: result.success };
    },
    verifyOptions: { algorithms: ['HS256'] }
  });

  server.route([
    ...authRoutes(postgresContext),
    ...heroRoutes(mongoContext)
  ]);

  server.route({
    method: 'GET',
    path: '/health',
    options: { auth: false },
    handler: (request, h) => {
      return h.response({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoContext.isConnected() ? 'connected' : 'disconnected'
      }).code(200);
    }
  });

  await server.start();
  console.log(`🚀 Servidor rodando em ${server.info.uri}`);
  console.log(`📚 Documentação disponível em ${server.info.uri}/docs`);

  return server;
};

process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exceção não capturada:', err);
  process.exit(1);
});

init().catch((err) => {
  console.error('❌ Erro ao inicializar aplicação:', err);
  process.exit(1);
});

export default init;
