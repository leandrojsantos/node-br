const assert = require('assert')
const api = require('./../api')
const HeroSchema = require('../src/db/strategies/mongodb/schemas/heroSchema')
const MongoDB = require('../src/db/strategies/mongodb/mongoDbStrategy')
const Context = require('../src/db/strategies/base/contextStrategy')

let app = {}
let MOCK_ID = `mock`
//hash MOCK_TOKEN = auth
let MOCK_TOKEN = `$2b$04$meQYE5L8R6Wo5SfI8m6a7OFWmuJgPtFlvHveO5fN.bd8gM.DnzatS`
const headers = { Authorization: MOCK_TOKEN }


function cadastrar() { return app.inject({
        method: 'POST',
        url: '/herois',  
        headers,
        payload: {
            nome: 'teste a',
            poder: 'Velocidade'
        }
    });
}

describe('*****apiHeroes.test*****', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar()
        MOCK_ID = JSON.parse(result.payload)._id
    })

    it('t1 - não deve listar herois sem um token', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois', 
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })

    it('t2 - listar /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois',
            headers
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(result.payload)))
    })

    it('t3 - cadastrar /herois', async () => {
        const result = await cadastrar()
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).nome, 'test a')
    })

    it('t4 - não deve cadastrar com payload errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: {
                name: 'testtt',
                poder: 'paciencia'   
            }
        })
        const payload = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 400)
        assert.ok(payload.message.search('"nome" is required') !== -1)
    })

    it('t5 - atualizar /herois/{id}', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${MOCK_ID}`,
            headers,
            payload: {
                nome: 'mock',
                poder: 'auth'
            }
        })
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).nModified, 1)
    })
    
    it('t6 - remover /herois/{id}', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${MOCK_ID}`,
            headers,
        })
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).n, 1)
    })
})