export class DatabaseContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async isConnected() {
    return this.strategy.isConnected();
  }

  async create(data) {
    return this.strategy.create(data);
  }

  async read(query = {}) {
    return this.strategy.read(query);
  }

  async update(id, data) {
    return this.strategy.update(id, data);
  }

  async delete(id) {
    return this.strategy.delete(id);
  }

  async findById(id) {
    return this.strategy.findById(id);
  }

  async findByEmail(email) {
    if (typeof this.strategy.findByEmail === 'function') {
      return this.strategy.findByEmail(email);
    }
    throw new Error('findByEmail não suportado pela estratégia atual');
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }
}
