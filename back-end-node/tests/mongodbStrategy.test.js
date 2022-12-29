const assert = require('assert')
const HeroSchema = require('../src/db/strategies/mongodb/schemas/heroSchema')
const MongoDb = require('../src/db/strategies/mongodb/mongoDbStrategy')
const Context = require('../src/db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'teste j',
    poder: 'visao'
};

const MOCK_HEROI_ATUALIZAR = {
    nome: 'hulk',
    poder: 'força'
};
let MOCK_HEROI_ATUALIZAR_ID = '';
let context = {}

describe('*****mongodbStartegy.test*****', function () {
    this.beforeAll(async () => {
        const connection = MongoDb.connect()
        context = new Context(new MongoDb(connection, HeroSchema))
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ATUALIZAR_ID = result._id
    })

    it('t1 - verificar conexao', async () => {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })

    it('t2 - cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)        
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('t3 - listar', async () => {
        const [{ nome, poder}] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome})
        const result = { nome, poder }
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('t4 - atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ATUALIZAR_ID, { poder: 'rapidez'})
        assert.deepEqual(result.nModified, 1)
    })
    
    it('t5 - remover', async () => {
        const result = await context.delete(MOCK_HEROI_ATUALIZAR_ID)
        assert.deepEqual(result.n, 1)
    })
})