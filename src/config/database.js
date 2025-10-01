import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import { MongoStrategy } from '../models/strategies/mongoStrategy.js';
import { PrismaStrategy } from '../models/strategies/prismaStrategy.js';
import { DatabaseContext as BaseContext } from './context.js';

export class DatabaseContext extends BaseContext {
  static async createMongoContext() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/nodebr?authSource=admin';

    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    const strategy = new MongoStrategy(connection);
    return new DatabaseContext(strategy);
  }

  static async createPostgresContext() {
    const prisma = new PrismaClient();
    await prisma.$connect();

    const strategy = new PrismaStrategy(prisma);
    return new DatabaseContext(strategy);
  }
}
