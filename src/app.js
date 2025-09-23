import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import { config } from 'dotenv';
import HapiSwagger from 'hapi-swagger';

import HapiJwt from 'hapi-auth-jwt2';
import { DatabaseContext } from './config/database.js';
import { authRoutes } from './routes/authRoutes.js';
import { heroRoutes } from './routes/heroRoutes.js';

// Carregar variáveis de ambiente
config();
console.log('🔧 MONGODB_URI carregada:', process.env.MONGODB_URI);

const init = async () => {
  console.log('🚀 Iniciando Node BR API...');

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  });

  // Registrar plugins
  await server.register([
    {
      plugin: Inert
    },
    {
      plugin: Vision
    },
    {
      plugin: HapiJwt
    },
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'Node BR API Refatorada',
          version: '3.0.0',
          description: 'API Node.js com padrões 2025, Strategy Pattern, Jest e Swagger'
        },
        documentationPath: '/docs',
        swaggerUIPath: '/swaggerui/',
        jsonPath: '/swagger.json',
        lang: 'pt'
      }
    }
  ]);

  // Inicializar contexto de banco de dados
  console.log('📊 Inicializando banco de dados...');
  const mongoContext = await DatabaseContext.createMongoContext();
  const postgresContext = await DatabaseContext.createPostgresContext();
  console.log('✅ Banco de dados inicializado!');

  // Registrar rotas
  console.log('🛣️ Registrando rotas...');
  // Estratégia JWT (validação simples via DB)
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025',
    validate: async (decoded) => {
      const result = await postgresContext.findById(decoded.id);
      return { isValid: result.success };
    },
    verifyOptions: { algorithms: ['HS256'] }
  });
  server.auth.default('jwt');

  server.route([
    ...authRoutes(postgresContext),
    ...heroRoutes(mongoContext)
  ]);

  // Rota de health check
  server.route({
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return h.response({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoContext.isConnected() ? 'connected' : 'disconnected'
      }).code(200);
    }
  });

  // Rota de teste
  server.route({
    method: 'GET',
    path: '/test',
    handler: async (request, h) => {
      try {
        const result = await mongoContext.read();
        return h.response({
          message: 'Teste de conexão com MongoDB',
          database: 'connected',
          heroesCount: result.count
        }).code(200);
      } catch (error) {
        return h.response({
          message: 'Erro no teste de conexão',
          error: error.message
        }).code(500);
      }
    }
  });

  // Iniciar servidor
  await server.start();
  console.log(`🚀 Servidor rodando em ${server.info.uri}`);
  console.log(`📚 Documentação disponível em ${server.info.uri}/docs`);
  console.log(`🔍 Teste de conexão: ${server.info.uri}/test`);

  return server;
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Erro não tratado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Exceção não capturada:', err);
  process.exit(1);
});

// Inicializar aplicação
init().catch((err) => {
  console.error('❌ Erro ao inicializar aplicação:', err);
  process.exit(1);
});

export default init;
