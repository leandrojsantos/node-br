import Joi from 'joi';

/**
 * Rotas para gerenciamento de usuários
 * Implementa CRUD completo com validações e documentação Swagger
 */
export const userRoutes = (dbContext) => [
  {
    method: 'GET',
    path: '/users',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Lista todos os usuários',
      notes: 'Retorna uma lista de usuários (apenas para administradores)',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT')
        }).unknown(),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Número da página'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('Itens por página'),
          status: Joi.string().valid('ativo', 'inativo', 'suspenso').description('Filtrar por status'),
          role: Joi.string().valid('admin', 'user', 'moderator').description('Filtrar por role')
        })
      }
    },
    handler: async (request, h) => {
      try {
        // Verificar se o usuário tem permissão de admin
        const user = request.auth.credentials.user;
        if (user.role !== 'admin') {
          return h.response({
            success: false,
            message: 'Acesso negado. Apenas administradores podem listar usuários.'
          }).code(403);
        }

        const { page, limit, status, role } = request.query;
        const query = {};

        if (status) query.status = status;
        if (role) query.role = role;

        const result = await dbContext.read(query);

        // Implementar paginação simples
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = result.data.slice(startIndex, endIndex);

        return h.response({
          ...result,
          data: paginatedData,
          pagination: {
            page,
            limit,
            total: result.data.length,
            pages: Math.ceil(result.data.length / limit)
          }
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
    method: 'GET',
    path: '/users/{id}',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Busca um usuário por ID',
      notes: 'Retorna os dados de um usuário específico',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT')
        }).unknown(),
        params: Joi.object({
          id: Joi.number().integer().required().description('ID do usuário')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const currentUser = request.auth.credentials.user;

        // Usuário só pode ver seus próprios dados ou admin pode ver qualquer usuário
        if (currentUser.id !== id && currentUser.role !== 'admin') {
          return h.response({
            success: false,
            message: 'Acesso negado. Você só pode ver seus próprios dados.'
          }).code(403);
        }

        const result = await dbContext.findById(id);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  },
  {
    method: 'PATCH',
    path: '/users/{id}',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Atualiza um usuário',
      notes: 'Atualiza os dados de um usuário existente',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT')
        }).unknown(),
        params: Joi.object({
          id: Joi.number().integer().required().description('ID do usuário')
        }),
        payload: Joi.object({
          nome: Joi.string().min(2).max(100).description('Nome do usuário'),
          email: Joi.string().email().description('Email do usuário'),
          status: Joi.string().valid('ativo', 'inativo', 'suspenso').description('Status do usuário'),
          role: Joi.string().valid('admin', 'user', 'moderator').description('Role do usuário')
        }).min(1)
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const currentUser = request.auth.credentials.user;

        // Usuário só pode atualizar seus próprios dados ou admin pode atualizar qualquer usuário
        if (currentUser.id !== id && currentUser.role !== 'admin') {
          return h.response({
            success: false,
            message: 'Acesso negado. Você só pode atualizar seus próprios dados.'
          }).code(403);
        }

        // Apenas admin pode alterar role
        if (request.payload.role && currentUser.role !== 'admin') {
          return h.response({
            success: false,
            message: 'Apenas administradores podem alterar roles.'
          }).code(403);
        }

        const result = await dbContext.update(id, request.payload);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(400);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    options: {
      auth: 'jwt',
      tags: ['api', 'users'],
      description: 'Remove um usuário',
      notes: 'Remove um usuário do sistema (soft delete)',
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('Token JWT')
        }).unknown(),
        params: Joi.object({
          id: Joi.number().integer().required().description('ID do usuário')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const currentUser = request.auth.credentials.user;

        // Apenas admin pode deletar usuários
        if (currentUser.role !== 'admin') {
          return h.response({
            success: false,
            message: 'Acesso negado. Apenas administradores podem remover usuários.'
          }).code(403);
        }

        // Não permitir que admin se delete
        if (currentUser.id === id) {
          return h.response({
            success: false,
            message: 'Você não pode remover sua própria conta.'
          }).code(400);
        }

        const result = await dbContext.delete(id);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  }
];
