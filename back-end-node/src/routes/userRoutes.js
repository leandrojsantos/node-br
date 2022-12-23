const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const PasswordHelper = require('../helpers/passwordHelper')
const Jwt = require('jsonwebtoken')

const USER = {
    username: 'root',
    password: 'root',
}

class UserRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() { return {
                path: '/users',
                method: 'GET',
                config: {
                    tags: ['api'],
                    description: 'Listar users',
                    notes: 'Retorna a base inteira de users e password com hash',

                    validate: {failAction: (request, h, err) => { throw err;},
                    headers: Joi.object({authorization: Joi.string().required()}).unknown(),}
                },

            handler: (request, headers) => {
                return this.db.read()
            }
        }
    }

    create() { return {
            path: '/users',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Cadastrar User',
                notes: 'Cadastra um novo Usuario: por username e password',

                plugins: {'hapi-swagger': { payloadType: 'form'}},
                validate: {failAction: (request, h, err) => { throw err; },
                    payload: {
                        username: Joi.string().min(3).max(30).required(),
                        password: Joi.string().min(3).max(30).required()
                    }
                }
            },

            handler: async (request, headers) => {
                const payload = request.payload
                const { username } = request.payload
                const [USER] = await this.db.read({
                    username: username.toLowerCase()
                })
                if (!USER) {
                    const userNew = {...payload,
                        password: await PasswordHelper.hashPassword(payload.password)
                    }
                    console.log(`payload`, payload)
                        return this.db.create(userNew)
                }

                return Boom.badRequest('Username ja existe')
            }
        }
    }

    update() {return {
                path: '/users/{id}',
                method: 'PATCH',
                config: {
                    tags: ['api'],
                    description: 'Atualizar User',
                    notes: 'Atualiza um Usuario por ID',

                    plugins: {'hapi-swagger': {payloadType: 'form'}},
                    validate: {failAction: (request, h, err) => { throw err; },
                    headers: Joi.object({authorization: Joi.string().required()}).unknown(),                 params: { id: Joi.string().required()},
                        payload: {
                            username: Joi.string().min(3).max(30).required(),
                            password: Joi.string().min(3).max(30).required()
                        }
                    }
                },

            handler: async (request, headers) => {
                const payload = request.payload;
                const userUpdate = {...payload,
                    password: await PasswordHelper.hashPassword(payload.password)
                }
                const id = request.params.id;
                console.log(`payload`, payload);
                    return this.db.update(id, userUpdate)
            }
        }
    }

    delete() { return {
                path: '/users/{id}',
                method: 'DELETE',
                config: {
                    tags: ['api'],
                    description: 'Remove User',
                    notes: 'Remove um Usuario por ID',

                    validate: {failAction: (request, h, err) => { throw err; },
                    headers: Joi.object({authorization: Joi.string().required()}).unknown(),                    params: { id: Joi.string().required()}}
                },

            handler: (request, headers) => {
                const id = request.params.id;
                    return this.db.delete(id)
            }
        }
    }
}

module.exports = UserRoutes