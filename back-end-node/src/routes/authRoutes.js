const BaseRoute = require('./base/baseRoute')

const Joi = require('joi')
const Boom = require('boom')

const PasswordHelper = require('../helpers/passwordHelper')

const USER = {
    username: 'Chapolin',
    password: 'auth',
}
const Jwt = require('jsonwebtoken')

class AuthRoutes extends BaseRoute {
    constructor(key, db) {
        super()
        this.secret = key
        this.db = db
    }

    login() {

        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter token',
                notes: 'Retorna o token com user e senha do banco',
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                validate: {
                    failAction: (request, h, err) => {
                        throw err;
                    },
                    payload: {
                        username: Joi.string().min(3).max(30).required(),
                        password: Joi.string().min(3).max(30).required()
                    }
                }
            },
            handler: async (request, headers) => {
                const {
                    username,
                    password
                } = request.payload

                const [USER] = await this.db.read({
                    username: username.toLowerCase()
                })

                if (!USER) {
                    return Boom.badRequest('Usuario nao existe')
                }

                const match = await PasswordHelper.comparePassword(password, USER.password)

                if (!match) {
                    return Boom.badRequest('Usuario ou Senha invalidos!!!')
                }

                return {
                    token: Jwt.sign({
                        username: username
                    }, this.secret)
                }
            }
        }
    }
}

module.exports = AuthRoutes