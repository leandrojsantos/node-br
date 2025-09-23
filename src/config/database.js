import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import { MongoStrategy } from '../models/strategies/mongoStrategy.js';
import { PostgresStrategy } from '../models/strategies/postgresStrategy.js';
import { DatabaseContext as BaseContext } from './context.js';

export class DatabaseContext extends BaseContext {
  constructor(strategy) {
    super(strategy);
  }

  /**
   * Cria contexto MongoDB
   */
  static async createMongoContext() {
    try {
      console.log('🔗 Conectando ao MongoDB...');

      const mongoUri = process.env.MONGODB_URI || 'mongodb://nodebr:nodebr123@node-br-mongo:27017/nodebr';
      console.log('📡 URI MongoDB:', mongoUri);

      // Configurações modernas do Mongoose
      const connection = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB conectado com sucesso!');
      console.log('📊 Estado da conexão:', connection.connection.readyState);

      const strategy = new MongoStrategy(connection);
      return new DatabaseContext(strategy);
    } catch (error) {
      console.error('❌ Erro ao conectar MongoDB:', error.message);
      throw error;
    }
  }

  /**
   * Cria contexto PostgreSQL
   */
  static async createPostgresContext() {
    try {
      console.log('🔗 Conectando ao PostgreSQL...');

      const sequelize = new Sequelize(
        process.env.POSTGRES_DB || 'nodebr',
        process.env.POSTGRES_USER || 'postgres',
        process.env.POSTGRES_PASSWORD || 'postgres',
        {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: process.env.POSTGRES_PORT || 5432,
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          },
          dialectOptions: {
            connectTimeout: 60000,
            requestTimeout: 60000,
          }
        }
      );

      await sequelize.authenticate();
      // Registra os modelos antes do sync
      const strategy = new PostgresStrategy(sequelize);
      // Garantir que as tabelas existam em ambientes de dev/test
      await sequelize.sync();
      console.log('✅ PostgreSQL conectado com sucesso!');

      return new DatabaseContext(strategy);
    } catch (error) {
      console.error('❌ Erro ao conectar PostgreSQL:', error.message);
      throw error;
    }
  }
}
