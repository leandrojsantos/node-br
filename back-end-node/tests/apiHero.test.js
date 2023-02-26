const assert = require('assert')
const api = require('../api')
const Context = require('../src/db/strategies/base/contextStrategy')
const PostgresDB = require('../src/db/strategies/postgres/postgresSQLStrategy')
const HeroSchema = require('../src/db/strategies/postgres/schemas/heroSchema')
const PasswordHelper = require('../src/helpers/passwordHelper');

let app = {}

const Hero = {
    username: 'mock',
    power: 'auth',
}

const Hero_DB = {
    ...Hero,
    password: '$2b$04$meQYE5L8R6Wo5SfI8m6a7OFWmuJgPtFlvHveO5fN.bd8gM.DnzatS'
}

//auth => hash '$2b$04$meQYE5L8R6Wo5SfI8m6a7OFWmuJgPtFlvHveO5fN.bd8gM.DnzatS'

describe('****Api Hero Suite de Testes****', function () {
    this.beforeAll(async () => {
        app = await api
        const connectionPostgres = await PostgresDB.connect()
        const model = await PostgresDB.defineModel(connectionPostgres, HeroSchema)
        const postgresModel = new Context(new PostgresDB(connectionPostgres, model));
        await postgresModel.update(null, Hero_DB, true)
    })

    it('T1 gerar Hash', async () => {
        const result = await PasswordHelper.hashPassword(Hero.password);
        console.log('result', result)
        assert.ok(result.length > 10);
    });

    it('T2 add Hero', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: Hero
        });
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        console.log(`dados`, dados);

        assert.deepEqual(statusCode, 200 || 500)
        //500 demostra Heroname ja existe no db
        assert.ok(JSON.parse(result.payload).token.length > 10)
    })
})