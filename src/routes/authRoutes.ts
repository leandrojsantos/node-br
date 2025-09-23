import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaStrategy } from '../models/strategies/prismaStrategy.js';

export const authRoutes = (dbContext: PrismaStrategy) => [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Registra um novo usuário',
      notes: 'Cria uma nova conta de usuário no sistema',
      validate: {
        payload: Joi.object({
          nome: Joi.string().max(100).required().description('Nome do usuário'),
          email: Joi.string().email().required().description('Email do usuário'),
          password: Joi.string().min(6).required().description('Senha do usuário')
        })
      }
    },
    handler: async (request: any, h: any) => {
      try {
        const { nome, email, password } = request.payload;

        // Verificar se email já existe
        const existingUser = await dbContext.findByEmail(email);
        if (existingUser.success) {
          return h.response({
            success: false,
            message: 'Email já está em uso'
          }).code(400);
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Criar usuário
        const result = await dbContext.create({
          nome,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'user',
          status: 'ativo'
        });

        if (!result.success) {
          return h.response({
            success: false,
            message: result.message
          }).code(400);
        }

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = result.data as any;

        return h.response({
          success: true,
          data: { user: userWithoutPassword },
          message: 'Usuário registrado com sucesso'
        }).code(201);
      } catch (error: any) {
        return h.response({
          success: false,
          message: error.message
        }).code(400);
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Autentica um usuário',
      notes: 'Realiza login e retorna token JWT',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('Email do usuário'),
          password: Joi.string().required().description('Senha do usuário')
        })
      }
    },
    handler: async (request: any, h: any) => {
      try {
        const { email, password } = request.payload;

        // Buscar usuário por email
        const result = await dbContext.findByEmail(email.toLowerCase());
        if (!result.success) {
          return h.response({
            success: false,
            message: 'Credenciais inválidas'
          }).code(401);
        }

        const user = result.data as any;

        // Verificar status do usuário
        if (user.status !== 'ativo') {
          return h.response({
            success: false,
            message: 'Conta desativada. Entre em contato com o suporte.'
          }).code(401);
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return h.response({
            success: false,
            message: 'Credenciais inválidas'
          }).code(401);
        }

        // Gerar token JWT
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role
          },
          process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025',
          {
            expiresIn: '4h',
            issuer: 'node-br-api',
            audience: 'node-br-client'
          }
        );

        // Atualizar último login
        await dbContext.update(user.id, { ultimoLogin: new Date() });

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = user;

        return h.response({
          success: true,
          data: {
            user: userWithoutPassword,
            token,
            expiresIn: '4h'
          },
          message: 'Login realizado com sucesso'
        }).code(200);
      } catch (error: any) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  }
];
