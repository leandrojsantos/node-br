/**
 * class feita para padronizar error com exception
 */

class NotImplementedException extends Error {
    constructor() {
        super("Sem Implementacao")
    }
}

class ICrud {
    create(item){
        throw new NotImplementedException()
    }

    read(query){
        throw new NotImplementedException()
    }

    update(id, item){
        throw new NotImplementedException()
    }

    delete(id){
        throw new NotImplementedException()
    }

    isConnected(){
        throw new NotImplementedException()
    }
}

module.exports = ICrud
