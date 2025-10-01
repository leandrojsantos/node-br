import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authRoutes = (dbContext) => [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Registra um novo usuário',
      validate: {
        payload: Joi.object({
          nome: Joi.string().max(100).required().description('Nome do usuário'),
          email: Joi.string().email().required().description('Email do usuário'),
          password: Joi.string().min(6).required().description('Senha do usuário')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { nome, email, password } = request.payload;

        const existingUser = await dbContext.findByEmail(email);
        if (existingUser.success) {
          return h.response({
            success: false,
            message: 'Email já está em uso'
          }).code(400);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

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

        const { password: _password, ...userWithoutPassword } = result.data;

        return h.response({
          success: true,
          data: { user: userWithoutPassword },
          message: 'Usuário registrado com sucesso'
        }).code(201);
      } catch (error) {
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
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('Email do usuário'),
          password: Joi.string().required().description('Senha do usuário')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { email, password } = request.payload;

        const result = await dbContext.findByEmail(email.toLowerCase());
        if (!result.success) {
          return h.response({
            success: false,
            message: 'Credenciais inválidas'
          }).code(401);
        }

        const user = result.data;

        if (user.status !== 'ativo') {
          return h.response({
            success: false,
            message: 'Conta desativada. Entre em contato com o suporte.'
          }).code(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return h.response({
            success: false,
            message: 'Credenciais inválidas'
          }).code(401);
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role
          },
          process.env.JWT_SECRET || 'minha-chave-secreta-super-segura-2025',
          {
            expiresIn: '4h',
            issuer: 'api-strategy',
            audience: 'api-client'
          }
        );

        await dbContext.update(user.id, { ultimoLogin: new Date() });

        const { password: _password, ...userWithoutPassword } = user;

        return h.response({
          success: true,
          data: {
            user: userWithoutPassword,
            token,
            expiresIn: '4h'
          },
          message: 'Login realizado com sucesso'
        }).code(200);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  }
];
