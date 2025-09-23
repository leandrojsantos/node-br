import Joi from 'joi';
import { MongoStrategy } from '../models/strategies/mongoStrategy.js';

export const heroRoutes = (dbContext: MongoStrategy) => [
  {
    method: 'GET',
    path: '/heroes',
    options: {
      auth: false,
      tags: ['api', 'heroes'],
      description: 'Lista todos os heróis',
      notes: 'Retorna uma lista de heróis',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1).description('Número da página'),
          limit: Joi.number().integer().min(1).max(100).default(10).description('Itens por página'),
          status: Joi.string().valid('ativo', 'inativo', 'aposentado').description('Filtrar por status'),
          nivel: Joi.number().integer().min(1).max(100).description('Filtrar por nível mínimo')
        })
      }
    },
    handler: async (request: any, h: any) => {
      try {
        const { page, limit, status, nivel } = request.query;
        const query: any = {};

        if (status) query.status = status;
        if (nivel) query.nivel = { $gte: nivel };

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
      } catch (error: any) {
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
      notes: 'Retorna os dados de um herói específico',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID do herói')
        })
      }
    },
    handler: async (request: any, h: any) => {
      try {
        const { id } = request.params;
        const result = await dbContext.findById(id);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error: any) {
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
      notes: 'Cadastra um novo herói no sistema',
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
    handler: async (request: any, h: any) => {
      try {
        const result = await dbContext.create(request.payload);
        return h.response(result).code(201);
      } catch (error: any) {
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
      notes: 'Atualiza os dados de um herói existente',
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
    handler: async (request: any, h: any) => {
      try {
        const { id } = request.params;
        const result = await dbContext.update(id, request.payload);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error: any) {
        return h.response({
          success: false,
          message: error.message
        }).code(400);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/heroes/{id}',
    options: {
      tags: ['api', 'heroes'],
      description: 'Remove um herói',
      notes: 'Remove um herói do sistema',
      validate: {
        params: Joi.object({
          id: Joi.string().required().description('ID do herói')
        })
      }
    },
    handler: async (request: any, h: any) => {
      try {
        const { id } = request.params;
        const result = await dbContext.delete(id);

        if (!result.success) {
          return h.response(result).code(404);
        }

        return h.response(result).code(200);
      } catch (error: any) {
        return h.response({
          success: false,
          message: error.message
        }).code(500);
      }
    }
  }
];
