import { HeroSchema } from '../schemas/heroSchema.js';

/**
 * Estratégia para MongoDB usando Mongoose
 * Implementa o padrão Strategy para operações de banco de dados
 */
export class MongoStrategy {
  constructor(connection) {
    this.connection = connection;
    this.Hero = connection.model('Hero', HeroSchema);
  }

  /**
   * Verifica se a conexão está ativa
   * @returns {Promise<boolean>}
   */
  async isConnected() {
    return this.connection.readyState === 1;
  }

  /**
   * Cria um novo herói
   * @param {Object} data - Dados do herói
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      console.log('📝 Criando herói:', data);
      const hero = new this.Hero(data);
      const savedHero = await hero.save();
      console.log('✅ Herói criado:', savedHero._id);

      return {
        success: true,
        data: savedHero,
        message: 'Herói criado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao criar herói:', error.message);
      throw new Error(`Erro ao criar herói: ${error.message}`);
    }
  }

  /**
   * Busca heróis baseado em query
   * @param {Object} query - Critérios de busca
   * @returns {Promise<Object>}
   */
  async read(query = {}) {
    try {
      console.log('🔍 Buscando heróis com query:', query);
      const heroes = await this.Hero.find(query).select('-__v').lean();
      console.log('✅ Heróis encontrados:', heroes.length);

      return {
        success: true,
        data: heroes,
        count: heroes.length,
        message: 'Heróis encontrados com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao buscar heróis:', error.message);
      throw new Error(`Erro ao buscar heróis: ${error.message}`);
    }
  }

  /**
   * Atualiza um herói por ID
   * @param {string} id - ID do herói
   * @param {Object} data - Dados para atualização
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      console.log('📝 Atualizando herói:', id, data);
      const hero = await this.Hero.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-__v').lean();

      if (!hero) {
        return {
          success: false,
          message: 'Herói não encontrado'
        };
      }

      console.log('✅ Herói atualizado:', hero._id);
      return {
        success: true,
        data: hero,
        message: 'Herói atualizado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar herói:', error.message);
      throw new Error(`Erro ao atualizar herói: ${error.message}`);
    }
  }

  /**
   * Remove um herói por ID
   * @param {string} id - ID do herói
   * @returns {Promise<Object>}
   */
  async delete(id) {
    try {
      console.log('🗑️ Removendo herói:', id);
      const hero = await this.Hero.findByIdAndDelete(id);

      if (!hero) {
        return {
          success: false,
          message: 'Herói não encontrado'
        };
      }

      console.log('✅ Herói removido:', hero._id);
      return {
        success: true,
        message: 'Herói removido com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao remover herói:', error.message);
      throw new Error(`Erro ao remover herói: ${error.message}`);
    }
  }

  /**
   * Busca um herói por ID
   * @param {string} id - ID do herói
   * @returns {Promise<Object>}
   */
  async findById(id) {
    try {
      console.log('🔍 Buscando herói por ID:', id);
      const hero = await this.Hero.findById(id).select('-__v').lean();

      if (!hero) {
        return {
          success: false,
          message: 'Herói não encontrado'
        };
      }

      console.log('✅ Herói encontrado:', hero._id);
      return {
        success: true,
        data: hero,
        message: 'Herói encontrado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao buscar herói:', error.message);
      throw new Error(`Erro ao buscar herói: ${error.message}`);
    }
  }
}
