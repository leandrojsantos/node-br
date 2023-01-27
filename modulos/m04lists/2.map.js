/**
 * map e usando retornar infos (funciona como for por baixo dos panos)
 */


const service = require('./service')

//busca normal
async function main() {
    try {
        const results = await service.obterPessoas('a')
        //1 forma de busca 
        // const names = []
        // results.results.forEach((item)=>{
        //     names.push(item.name)            
        // });
        //console.log('names', names)

        //2 forma de busca
        // const names = results.results.map((pessoa) => {
        //     return pessoa.name
        // })

        //3 forma de busca
        const names = results.results.map((pessoa) => pessoa.name)
        console.log('names', names)

    } catch (error) {
        console.error('deu merda', error);
    }
}
main()