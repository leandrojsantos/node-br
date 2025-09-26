/**
 * Configuração simples dos testes Jest
 */
const { config } = require('dotenv');

// Carregar variáveis de ambiente para testes
config({ path: '.env.test' });

// Configurações de banco de dados para testes
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodebr_test';
// Para E2E, por padrão aponte para a app local (porta 5000).
// Se quiser usar a app em containers, exporte E2E_BASE_URL antes de rodar os testes.
process.env.E2E_BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5000';
