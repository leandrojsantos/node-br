/**
 * deepEual, ok = faz parte do mocha (tmb trabalha com boolean)
 */

const {
    deepEqual,
    ok
} = require('assert')

const database = require('./database')

const DEFAULT_ITEM_CADASTRAR = {
    nome: 'flash',
    poder: 'speed',
    id: 1
}

const DEFAULT_ITEM_ATUALIZAR = {
    nome: 'lanterna verde',
    poder: 'energia',
    id: 2
}

/**
 * decribe = usando para inicializar uma suite de teste
 * expected = usando para verificar o exeperado do teste
 */
describe('Suite Teste Heroi', () => {

    before(async () => {
        await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        await database.cadastrar(DEFAULT_ITEM_ATUALIZAR)
    })

    it('listar heroi', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        const [resultado] = await database.listar(expected.id)

        deepEqual(resultado, expected)
    })

    it('cadastrar heroi', async () => {
        const expected = DEFAULT_ITEM_CADASTRAR
        const resultado = await database.cadastrar(DEFAULT_ITEM_CADASTRAR)
        const [actual] = await database.listar(DEFAULT_ITEM_CADASTRAR.id)

        deepEqual(actual, expected)
    })

    it('deletar heroi', async () => {
        const expected = true;
        const resultado = await database.remover(DEFAULT_ITEM_CADASTRAR.id)

        deepEqual(resultado, expected)
    })

    it('atualizar heroi', async () => {
        const expected = {
            ...DEFAULT_ITEM_ATUALIZAR,
            nome: 'batman',
            poder: 'dinheiro'
        }

        const novoDado = {
            nome: 'batman',
            poder: 'dinheiro'
        }

        await database.atualizar(DEFAULT_ITEM_ATUALIZAR.id, novoDado)
        const [resultado] = await database.listar(DEFAULT_ITEM_ATUALIZAR.id)

        deepEqual(resultado, expected)
    })

})