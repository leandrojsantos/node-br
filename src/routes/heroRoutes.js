import Joi from 'joi';

export const heroRoutes = (dbContext) => [
  {
    method: 'GET',
    path: '/heroes',
    options: {
      auth: false,
      tags: ['api', 'heroes'],
      description: 'Lista todos os heróis',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Número da página'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('Itens por página'),
          status: Joi.string().valid('ativo', 'inativo', 'aposentado').description('Filtrar por status'),
          nivel: Joi.number().integer().min(1).max(100).description('Filtrar por nível mínimo')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { page = 1, limit = 10, ...filters } = request.query;
        const skip = (page - 1) * limit;

        const result = await dbContext.read(filters);

        if (!result.success) {
          return h.response(result).code(500);
        }

        const heroes = result.data || [];
        const total = heroes.length;
        const paginatedHeroes = heroes.slice(skip, skip + limit);

        return h.response({
          success: true,
          data: paginatedHeroes,
          count: paginatedHeroes.length,
          message: 'Heróis encontrados com sucesso',
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
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
    path: '/heroes/{id}',
    options: {
      auth: false,
      tags: ['api', 'heroes'],
      description: 'Busca um herói por ID',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID do herói')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
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
    method: 'POST',
    path: '/heroes',
    options: {
      tags: ['api', 'heroes'],
      description: 'Cria um novo herói',
      validate: {
        payload: Joi.object({
          nome: Joi.string().max(100).required().description('Nome do herói'),
          poder: Joi.string().max(30).required().description('Poder do herói'),
          status: Joi.string().valid('ativo', 'inativo', 'aposentado').default('ativo').description('Status do herói'),
          nivel: Joi.number().integer().min(1).max(100).default(1).description('Nível do herói'),
          habilidades: Joi.array().items(Joi.string()).default([]).description('Lista de habilidades')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const result = await dbContext.create(request.payload);
        return h.response(result).code(201);
      } catch (error) {
        return h.response({
          success: false,
          message: error.message
        }).code(400);
      }
    }
  },
  {
    method: 'PATCH',
    path: '/heroes/{id}',
    options: {
      tags: ['api', 'heroes'],
      description: 'Atualiza um herói',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID do herói')
        }),
        payload: Joi.object({
          nome: Joi.string().max(100).description('Nome do herói'),
          poder: Joi.string().max(30).description('Poder do herói'),
          status: Joi.string().valid('ativo', 'inativo', 'aposentado').description('Status do herói'),
          nivel: Joi.number().integer().min(1).max(100).description('Nível do herói'),
          habilidades: Joi.array().items(Joi.string()).description('Lista de habilidades')
        }).min(1)
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const result = await dbContext.update(id, request.payload);

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
    method: 'DELETE',
    path: '/heroes/{id}',
    options: {
      tags: ['api', 'heroes'],
      description: 'Remove um herói',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID do herói')
        })
      }
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
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
