/**
 * Configuração simples dos testes Jest
 */
const { config } = require('dotenv');

// Carregar variáveis de ambiente para testes
config({ path: '.env.test' });

// Configurações de banco de dados para testes
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodebr_test';
