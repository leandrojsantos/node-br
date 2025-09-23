/**
 * Contexto base para implementação do padrão Strategy
 * Permite trocar algoritmos de banco de dados em tempo de execução
 */
export class DatabaseContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  /**
   * Verifica se a conexão com o banco está ativa
   * @returns {Promise<boolean>}
   */
  async isConnected() {
    return this.strategy.isConnected();
  }

  /**
   * Cria um novo registro
   * @param {Object} data - Dados para criação
   * @returns {Promise<Object>}
   */
  async create(data) {
    return this.strategy.create(data);
  }

  /**
   * Busca registros baseado em query
   * @param {Object} query - Critérios de busca
   * @returns {Promise<Array>}
   */
  async read(query = {}) {
    return this.strategy.read(query);
  }

  /**
   * Atualiza um registro por ID
   * @param {string|number} id - ID do registro
   * @param {Object} data - Dados para atualização
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    return this.strategy.update(id, data);
  }

  /**
   * Remove um registro por ID
   * @param {string|number} id - ID do registro
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    return this.strategy.delete(id);
  }

  /**
   * Busca um registro por ID
   * @param {string|number} id - ID do registro
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    return this.strategy.findById(id);
  }

  /**
   * Busca um registro por email (quando suportado pela estratégia)
   * @param {string} email - Email para busca
   * @returns {Promise<Object>}
   */
  async findByEmail(email) {
    if (typeof this.strategy.findByEmail === 'function') {
      return this.strategy.findByEmail(email);
    }
    throw new Error('findByEmail não suportado pela estratégia atual');
  }

  /**
   * Troca a estratégia em tempo de execução
   * @param {Object} strategy - Nova estratégia
   */
  setStrategy(strategy) {
    this.strategy = strategy;
  }
}
