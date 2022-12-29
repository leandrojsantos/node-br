const assert = require('assert')
const api = require('../api')
const UserSchema = require('./../src/db/strategies/postgres/schemas/userSchema')
const Context = require('./../src/db/strategies/base/contextStrategy')
const PostgresDB = require('./../src/db/strategies/postgres/postgresSQLStrategy')

let app = {}
const USER = {
    username: 'seu madruga',
    password: 'auth'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$meQYE5L8R6Wo5SfI8m6a7OFWmuJgPtFlvHveO5fN.bd8gM.DnzatS'
}


describe('*****auth.test.suite*****', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, USER_DB, true)
    })
    
    it('t1 - deve obter um token', async () => {
        const result = await app.inject({ method: 'POST',
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
    })

    it('t2 - deve retornar um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'teste',
                password: '123'
            }
        });
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
})