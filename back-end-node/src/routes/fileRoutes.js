const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class FileRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/files',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'Lista todos os file ',
                notes: 'Retorna a base inteira de file',

                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                }
            },
            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }

    create() {
        return {
            path: '/files',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Cadastra novo file ',
                notes: 'add novo file',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    payload: {
                        name: Joi.string().min(3).max(50).required(),
                        size: Joi.number().integer().positive().min(1).required(),
                        key: Joi.string().min(2).max(100),
                        url: Joi.string().min(2).max(200)
                    }
                },

            },
            handler: (request, headers) => {
                const payload = request.payload
                return this.db.create(payload)
            }
        }
    }

    update() {
        return {
            path: '/files/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'Atualizar file',
                notes: 'Atualiza um file dinamico por ID',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        name: Joi.string().min(3).max(50).required(),
                        size: Joi.string().min(2).max(10),
                        key: Joi.string().min(2).max(200),
                        url: Joi.string().min(2).max(500)
                    }
                },

            },
            handler: (request, headers) => {
                const payload = request.payload;
                const id = request.params.id;
                return this.db.update(id, payload)
            }
        }
    }

    delete() {
        return {
            path: '/files/{id}',
            method: 'DELETE',
            config: {
                tags: ['api'],
                description: 'Remove file',
                notes: 'Remove um file por ID',

                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    headers: Joi.object({
                        authorization: Joi.string().required()
                    }).unknown(),
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: (request, headers) => {
                const id = request.params.id;
                return this.db.delete(id)
            }
        }
    }

}

module.exports = FileRoutes