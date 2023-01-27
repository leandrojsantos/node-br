/**
 * commander = interface do usuario
 */

const Commander = require('commander')
const Datatase = require('./database')
const Heroi = require('./heroi')

async function main() {
    /**
     * node index.js --help 
     * .option = value que sera passado , string que vai para usuario
     */
    Commander
        .version('v1')
        .option('-n, --nome [value]', "Nome.:")
        .option('-p, --poder [value]', "Poder.:")
        .option('-i, --id [value]', "Id.:")

        /**
         * option para crud 
         */
        .option('-c, --cadastrar [value]', "Cadastro.:")
        .option('-l, --listar', "Lista.:")
        .option('-r, --remover', "Remove.:")
        .option('-a, --atualizar [value]', "Atualizar.:")
        .parse(process.argv)

    const heroi = new Heroi(Commander)

    try {
        if (Commander.cadastrar) {
            /**
             * caso vir null ja deleta
             */
            delete heroi.id

            const resultado = await Datatase.cadastrar(heroi)
            if (!resultado) {
                console.error('Deu Merda')
                return;
            }
            console.log('Cadastro Feito')
        }

        if (Commander.listar) {
            const resultado = await Datatase.listar()
            console.log(resultado)
            return;
        }

        if (Commander.remover) {
            const resultado = await Datatase.remover(heroi.id)
            if (!resultado) {
                console.error('Nao existe')
                return;
            }
            console.log('Removido')
        }

        if (Commander.atualizar) {
            const idParaAtualizar = parseInt(Commander.atualizar);
            /**
             * remover todas as chaves que estiverem null ou underfind
             */
            const dado = JSON.stringify(heroi)
            const heroiAtualizar = JSON.parse(dado)
            const resultado = await Datatase.atualizar(idParaAtualizar, heroiAtualizar)
            if (!resultado) {
                console.error('Nao existe')
                return;
            }
            console.log('Atualizado')
        }

    } catch (error) {
        console.error('Deu Merda faz de novo', error);
    }
}
main()