/**
 * testes = mocha usado para teste em servico ou aplicacao
*assert = para valiadacao do testes
 */

const assert = require('assert')
const {
    obterPessoas
} = require('../service')

/**
 * nock = pacote para simular requisicoes
 */
const nock = require('nock')
/**
 * this.beforeAll = antes de ir para it ele executa 'x' tarefas ou requisicoes 
 */
describe('Star Wars Tests', function () {
    this.timeout(3000)
    this.beforeAll(() => {
        const response = {
            count: 1,
            next: null,
            previous: null,
            results: [{
                name: 'R2-D2',
                height: '96',
                mass: '32',
                hair_color: 'n/a',
                skin_color: 'white, blue',
                eye_color: 'red',
                birth_year: '33BBY',
                gender: 'n/a',
                homeworld: 'https://swapi.co/api/planets/8/',
                vehicles: [],
                starships: [],
                created: '2014-12-10T15:11:50.376000Z',
                edited: '2014-12-20T21:17:50.311000Z',
                url: 'https://swapi.co/api/people/3/'
            }]
        }

        nock('https://swapi.co/api/people')
            .get('/?search=r2-d2&format=json')
            .reply(200, response)
    })

    // toda vez que bater nessa API vai retornar esse valor
    // quando rolar algum resultado diferente o nock vai reclamar
    // requisições externas não são problemas nossos! Mas temos que validar caso
    // esteja tudo nos conformes, trazer as informações conforme o esperado

    /**
     * it = faz o teste de fato
     */

    it('r2d2', async () => {
        const expected = [{
            nome: 'R2-D2',
            peso: '96'
        }]
        const nomeBase = `r2-d2`
        const resultado = await obterPessoas(nomeBase)
        assert.deepEqual(resultado, expected)
    })

/**
 * ex de falha pelo peso diferente do experado
 **/
    // it('r2d2 com peso errado', async () => {
    //     const expected = [{
    //         nome: 'R2-D2',
    //         peso: '96'
    //     }]
    //     const nomeBase = `r2-d2`
    //     const resultado = await obterPessoas(nomeBase)
    //     assert.deepEqual(resultado, expected)
    // })


})