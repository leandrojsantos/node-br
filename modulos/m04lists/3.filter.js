/**
 * usando para infos que retorna no map (funciona como forIn pro baixo dos panos)
 */

const {
    obterPessoas
} = require('./service')

async function main() {
    try {
        const {
            results
        } = await obterPessoas('a')

        const familiaLars = results.filter((item) => item.name.toLowerCase().indexOf('lars') !== -1)
        /**
         * faz uma lista aux para filtar infos em boolean.:
         * nao encontro = -1
         * true = mantem
         * false = remove
         * encontro = posicaoNoArray
         */
        const names = familiaLars.map((pessoa) => pessoa.name)
        console.log(names)


    } catch (error) {
        console.error('deu merda', error);
    }
}
main()