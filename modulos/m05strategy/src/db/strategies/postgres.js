const ICrud = require('./interfaces/interfaceCrud')

class Postgres extends ICrud{
    constructor(){
        super()
    }
    create(item){
        console.log('Salvo no PG')
    }
}

module.exports = Postgres