const { join } = require('path')
const { config } = require('dotenv')
const { ok } = require('assert')
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev")
const configPath = join('./config', `.env.${env}`)
config({ path: configPath })

const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const HeroRoutes = require('./src/routes/heroRoutes')
const HeroSchema = require('./src/db/strategies/mongodb/schemas/heroSchema')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')
const AuthRoutes = require('./src/routes/authRoutes')
const UserSchema = require('./src/db/strategies/postgres/schemas/userSchema')

const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const HapiJwt = require('hapi-auth-jwt2')
const MINHA_CHAVE_SECRETA = process.env.JWT_KEY

const swaggerConfig = {
    info: { title: '#API', version: 'v5.5' },
    lang: 'pt'
}

const app = new Hapi.Server({ port: process.env.PORT })

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))

    await app.register([ HapiJwt, Inert, Vision,  { plugin: HapiSwagger,  options: swaggerConfig }])
    
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY_ROOT,
        options: { expiresIn: 30, algorithms: ['HS256']},
        validate: (dado, request) => {return { isValid: true }        }
    })

    app.auth.default('jwt')

    app.route([
        //rotas do mongodb
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        
        //rotas do postgres
        ...mapRoutes(new UserRoutes( postgresModel), UserRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
    ])

    await app.start()
    console.log('API SWAGGER OK, na porta', app.info.port, 'link abaixo')
    console.log(`${'http://localhost:5000/documentation'}`)
        return app;
}

module.exports = main()