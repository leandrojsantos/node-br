const assert = require('assert')
const api = require('../api')
const nanoid = require('nanoid')

let app = {}
let MOCK_ID = ``
let MOCK_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE1NjcwMzYxOTJ9.Rucs0TRxlf4Hylol801jn0zTi-IPezfFg1YWf2OBuAM`

const headers = {
    Authorization: MOCK_TOKEN
}

function cadastrar() {
    return app.inject({
        method: 'POST',
        url: '/files',
        headers,
        payload: {
            name: 'test',
            size: '255',
            key: nanoid(7),
            url: 'https://gitlab.com'
        }
    });
}

describe('****Api File Suite de Testes****', function () {
    this.beforeAll(async () => {
        app = await api
        const result = await cadastrar()
        MOCK_ID = JSON.parse(result.payload)._id
    })

    it('T1 token Errado', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/files',
        })
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
  
    it('T2 lista', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/files',
            headers
        })
        const statusCode = result.statusCode

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(JSON.parse(result.payload)))
    })

    it('T3 cadastra', async () => {
        const result = await cadastrar()
        //console.log(`result`, result)
        //console.log((bodyParser.payload), result)
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).name, `test`)

    })

    it('T4 payload Errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/files',
            headers,
            payload: {
                NOME: 'test'
            }
        })
        const payload = JSON.parse(result.payload)
        assert.deepEqual(result.statusCode, 400)
        assert.ok(payload.message.search('"name" is required') !== -1)
    })

    it('T5 atualiza', async () => {
        const result = await app.inject({
            method: 'PATCH',
            url: `/files/${MOCK_ID}`,
            headers,
            payload: {
                name: 'Bruce Lee',
                size: '25',
                key:  nanoid(7),
                url: 'https://gitlab.com'
            }
        })
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).nModified, 1)

    })

    it('T6 remove', async () => {
        const result = await app.inject({
            method: 'DELETE',
            url: `/files/${MOCK_ID}`,
            headers,
        })
        assert.deepEqual(result.statusCode, 200)
        assert.deepEqual(JSON.parse(result.payload).n, 1)
    })
})