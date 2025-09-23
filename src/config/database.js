import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { MongoStrategy } from '../models/strategies/mongoStrategy.js';
import { PrismaStrategy } from '../models/strategies/prismaStrategy.js';
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
      console.log('🔗 Conectando ao PostgreSQL via Prisma...');
      const prisma = new PrismaClient();
      await prisma.$connect();
      console.log('✅ PostgreSQL conectado com sucesso!');

      const strategy = new PrismaStrategy(prisma);
      return new DatabaseContext(strategy);
    } catch (error) {
      console.error('❌ Erro ao conectar PostgreSQL:', error.message);
      throw error;
    }
  }
}
