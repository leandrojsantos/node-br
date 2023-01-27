/**
 * class criada para commander trazer somente as infos necessarias
 */

class Heroi {
    constructor({
        nome,
        poder,
        id
    }) {
        this.nome = nome,
            this.poder = poder,
            this.id = id
    }
}

module.exports = Heroi