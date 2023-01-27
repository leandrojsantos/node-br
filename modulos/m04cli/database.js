/**
 * database = faz o palpel do service em ex anteriores
 * readfile = para ler arquivo ja vem no node (fs)
 * whitefile = para escrever arquivo ja vem no node (fs)
 */

const {
  readFile,
  writeFile
} = require('fs')

const {
  promisify
} = require('util')

/**
 * readFileAsync = para transformar a funcao que trabalha com callback (readFile) para promisify
 */
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

class Database {
  constructor() {
    this.NOME_ARQUIVO = 'herois.json'
  }
  /**
   * 2 forma obter json (quando ja se sabe que e json de retorno)
   * const dadosJson = require('./heroes.json')
   */
  async obterDadosArquivo() {
    const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8')
    return JSON.parse(arquivo.toString())
  }

  async escreverArquivo(dados) {
    await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados))
    return true
  }

  async cadastrar(heroi) {
    const dados = await this.obterDadosArquivo()
    const id = heroi.id <= 2 ? heroi.id : Date.now();
    /**
     * ... = concatena json ou array
     */
    const heroiComId = {
      id,
      ...heroi
    }

    const dadosFinal = [
      ...dados,
      heroiComId
    ]

    const resultado = await this.escreverArquivo(dadosFinal)
    return resultado

  }

  async listar(id) {
    const dados = await this.obterDadosArquivo()
    const dadosFiltrados = dados.filter(heroi => (id ? (heroi.id === id) : true))

    return dadosFiltrados
  }

  async remover(id) {
    if (!id) {
      return await this.escreverArquivo([])
    }
    const dados = await this.obterDadosArquivo()
    const indice = dados.findIndex(item => item.id === parseInt(id))
    if (indice === -1) {
      throw Error('Nao Existe')
    }
    dados.splice(indice, 1)
    return await this.escreverArquivo(dados)
  }

  async atualizar(id, modificacoes) {
    const dados = await this.obterDadosArquivo()
    const indice = dados.findIndex(item => item.id === parseInt(id))
    if (indice === -1) {
      throw Error('Nao Existe')
    }

    const atual = dados[indice]
    const objetoAtualizar = {
      ...atual,
      ...modificacoes
    }
    dados.splice(indice, 1)

    return await this.escreverArquivo([
      ...dados,
      objetoAtualizar
    ])
  }
}
module.exports = new Database()