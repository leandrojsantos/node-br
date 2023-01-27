/**
 * tem como funcao transforma um array em um unico resultado ou objeto 
 */

const {
    obterPessoas
} = require('./service')

async function main() {

    try {
        const {
            results
        } = await obterPessoas('a')
        const pesos = results.map((item) => parseInt(item.height))
        console.log('pesos', pesos)
        /**
         * monta um array de pesos com item.height apos soma array de pesos 
         */

        const total = pesos.reduce((anterior, proximo) => {
            return anterior + proximo
        })
        console.log('total', total)
        
    } catch (error) {
        console.error('deu merda faz dnovo', error);
    }
}
main()
