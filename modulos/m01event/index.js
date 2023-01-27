/**
 * enventos por exemplo click do usuario
 * ao contrario da promise onde e usanda uma unica vez event fica öuvindo "ouseja e usado para acoes contante"
 */

const EventEmitter = require(`events`)
class MeuEmissor extends EventEmitter {

}

const meuEmissor = new MeuEmissor()
const nomeEvento = 'usuario:click'
meuEmissor.on(nomeEvento, (click)=> {
    console.log('um usuario clicou aqui', click)
})

meuEmissor.emit(nomeEvento, "em Navbar")
meuEmissor.emit(nomeEvento,"em Footer")
meuEmissor.emit(nomeEvento,"click por seg em.:")

let count = 0
setInterval(()=>{
    meuEmissor.emit(nomeEvento, "ök " + (count++))
}, 1000)