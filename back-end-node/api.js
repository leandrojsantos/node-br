const { join } = require('path')
const { config } = require('dotenv')
const { ok } = require('assert')
const Hapi = require('hapi')
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "environment err!!! in prod  dev")
const configPath = join('./config', `.env.${env}`)
config({ path: configPath })
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const HapiJwt = require('hapi-auth-jwt2')
const JWT_KEY_ROOT = process.env.JWT_KEY

const swaggerConfig = {
    info: {
        title: 'API Restfull',
        version: 'v0.10'
    },
}

const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDB = require('./src/db/strategies/mongodb/mongoDbStrategy')
const PostgresDB = require('./src/db/strategies/postgres/postgresSQLStrategy')

const HeroSchema = require('./src/db/strategies/postgres/schemas/heroSchema')
const FileSchema = require('./src/db/strategies/mongodb/schemas/fileSchema')
const UserSchema = require('./src/db/strategies/mongodb/schemas/userSchema')
const UtilRoutes = require('./src/routes/utilRoutes')
const AuthRoutes = require('./src/routes/authRoutes')
const UserRoutes = require('./src/routes/userRoutes')
const FileRoutes = require('./src/routes/fileRoutes')

const app = new Hapi.Server({
    port: process.env.PORT,
    routes: { cors: true }
})

function mapRoutes(instance, methods) { return methods.map(method => instance[method]())}

async function main() {
    //mongodb
    const user = MongoDB.connect()
    const file = MongoDB.connect()
    const mongoDbFile = new Context(new MongoDB(file, FileSchema))
    const mongoDbUser = new Context(new MongoDB(user, UserSchema))

    //postgres
    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, HeroSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    await app.register([ 
        HapiJwt, Inert, Vision,
        { plugin: HapiSwagger, options: swaggerConfig }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_KEY_ROOT,
        options: {
            expiresIn: 30,
            algorithms: ['HS256']
        },
        validate: (dado, request) => { return { isValid: true }}
    })

    app.auth.default('jwt')

    app.route([
        //api methods postgresql
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods()),
        ...mapRoutes(new HeroRoutes(postgresModel), HeroRoutes.methods()),

        //api methods mongodb
        ...mapRoutes(new FileRoutes(mongoDbFile), FileRoutes.methods()),
        ...mapRoutes(new UserRoutes(mongoDbUser), UserRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_KEY_ROOT, mongoDbUser),
            AuthRoutes.methods()),
    ])

    await app.start()
    console.log('API SWAGGER OK, na porta', app.info.port, 'link abaixo')
    console.log(`${'http://localhost:5000/documentation'}`)
    return app;
}

module.exports = main()