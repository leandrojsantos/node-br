const { joi } = require('path')
const { config } = require('dotenv')
const { ok } = require('assert')
const HapiSwagger = require('hapi-swagger')
const Hapi = require('hapi')
const HapiJwt = require('hapi-auth-jwt2')
const Inert = require('inert')
const Vision = require('vision')
const JWT_KEY_ROOT = process.env.JWT_KEY
const env = process.env.NODE_ENV || "dev"
const configPath = join('./config', `.env.${env}`)

ok(env === "prod" || env === "dev", "environment inválida! Ou prod ou dev")
config({ path: configPath })


const swaggerConfig = {
    info: {
        title: 'Api Restfull - Multi DataSources',
        version: 'v5.5'
    },
}

const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')

const FileSchema = require('./src/db/strategies/mongodb/schemas/fileSchema')
const UserSchema = require('./src/db/strategies/postgres/schemas/userSchema')

const UtilRoutes = require('./src/routes/utilRoutes')
const AuthRoutes = require('./src/routes/authRoutes')
const UserRoutes = require('./src/routes/userRoutes')
const FileRoutes = require('./src/routes/fileRoutes')

const app = new Hapi.Server({
    port: process.env.PORT,
    routes: { cors: true }
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {

    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    const file = MongoDB.connect()
    const mongoDbFile = new Context(new MongoDB(file, FileSchema))

    await app.register([ HapiJwt, Inert, Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY_ROOT,
        options: {
            expiresIn: 30,
            algorithms: ['HS256']
        },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })

    app.auth.default('jwt')


    app.route([
        //api methods helpers
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),

        //api methods mongodb
        ...mapRoutes(new FileRoutes(mongoDbFile), FileRoutes.methods()),

        //api methods postgres
        ...mapRoutes(new UserRoutes(postgresModel), UserRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, postgresModel), AuthRoutes.methods())
    ])

    await app.start()
    console.log('API SWAGGER OK, na porta', app.info.port, 'link abaixo')
    console.log(`${'http://localhost:5000/documentation'}`)
       return app;
}

module.exports = main()