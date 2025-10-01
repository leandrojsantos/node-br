const { config } = require('dotenv');

config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodebr_test';
