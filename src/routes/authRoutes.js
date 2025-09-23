import bcrypt from 'bcryptjs';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

/**
 * Rotas de autenticação
 * Implementa login, registro e refresh token
 */
export const authRoutes = (dbContext) => [
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
          nome: Joi.string().min(2).max(100).required().description('Nome completo'),
          email: Joi.string().email().required().description('Email válido'),
          password: Joi.string().min(6).required().description('Senha com pelo menos 6 caracteres'),
          confirmPassword: Joi.string().valid(Joi.ref('password')).required().description('Confirmação da senha')
        })
      },
      response: {
        status: {
          201: Joi.object({
            success: Joi.boolean(),
            data: Joi.object({
              id: Joi.number(),
              nome: Joi.string(),
              email: Joi.string(),
              role: Joi.string(),
              status: Joi.string()
            }),
            message: Joi.string()
          }),
          400: Joi.object({
            success: Joi.boolean(),
            message: Joi.string()
          })
        }
      }
    },
    handler: async (request, h) => {
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
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Criar usuário
        const userData = {
          nome,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'user',
          status: 'ativo'
        };

        const result = await dbContext.create(userData);

        if (!result.success) {
          return h.response({
            success: false,
            message: 'Erro ao criar usuário'
          }).code(400);
        }

        // Remover senha da resposta
        const { password: _, ...userWithoutPassword } = result.data.dataValues;

        return h.response({
          success: true,
          data: userWithoutPassword,
          message: 'Usuário criado com sucesso'
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
      notes: 'Realiza login e retorna token JWT',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('Email do usuário'),
          password: Joi.string().required().description('Senha do usuário')
        })
      },
      response: {
        status: {
          200: Joi.object({
            success: Joi.boolean(),
            data: Joi.object({
              user: Joi.object({
                id: Joi.number(),
                nome: Joi.string(),
                email: Joi.string(),
                role: Joi.string(),
                status: Joi.string()
              }),
              token: Joi.string(),
              expiresIn: Joi.string()
            }),
            message: Joi.string()
          }),
          401: Joi.object({
            success: Joi.boolean(),
            message: Joi.string()
          })
        }
      }
    },
    handler: async (request, h) => {
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

        const user = result.data;

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
        const { password: _, ...userWithoutPassword } = user.dataValues;

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
  },
  {
    method: 'POST',
    path: '/auth/refresh',
    options: {
      auth: 'jwt',
      tags: ['api', 'auth'],
      description: 'Renova o token JWT',
      notes: 'Gera um novo token JWT válido',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT atual')
        }).unknown()
      }
    },
    handler: async (request, h) => {
      try {
        const user = request.auth.credentials.user;

        // Gerar novo token
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

        return h.response({
          success: true,
          data: {
            token,
            expiresIn: '4h'
          },
          message: 'Token renovado com sucesso'
        }).code(200);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/logout',
    options: {
      auth: 'jwt',
      tags: ['api', 'auth'],
      description: 'Realiza logout do usuário',
      notes: 'Invalida o token JWT (implementação básica)',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT')
        }).unknown()
      }
    },
    handler: async (request, h) => {
      try {
        // Em uma implementação real, você adicionaria o token a uma blacklist
        // Por enquanto, apenas retornamos sucesso
        return h.response({
          success: true,
          message: 'Logout realizado com sucesso'
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
