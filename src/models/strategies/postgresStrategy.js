import { UserModel } from '../schemas/userSchema.js';

/**
 * Estratégia para PostgreSQL usando Sequelize
 * Implementa o padrão Strategy para operações de banco de dados
 */
export class PostgresStrategy {
  constructor(connection) {
    this.connection = connection;
    this.User = UserModel(connection);
  }

  /**
   * Verifica se a conexão está ativa
   * @returns {Promise<boolean>}
   */
  async isConnected() {
    try {
      await this.connection.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cria um novo usuário
   * @param {Object} data - Dados do usuário
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const user = await this.User.create(data);
      return {
        success: true,
        data: user,
        message: 'Usuário criado com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Busca usuários baseado em query
   * @param {Object} query - Critérios de busca
   * @returns {Promise<Object>}
   */
  async read(query = {}) {
    try {
      const users = await this.User.findAll({
        where: query,
        attributes: { exclude: ['password'] }
      });

      return {
        success: true,
        data: users,
        count: users.length,
        message: 'Usuários encontrados com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  /**
   * Atualiza um usuário por ID
   * @param {number} id - ID do usuário
   * @param {Object} data - Dados para atualização
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const [affectedRows] = await this.User.update(
        { ...data, updatedAt: new Date() },
        { where: { id } }
      );

      if (affectedRows === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      const user = await this.User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      return {
        success: true,
        data: user,
        message: 'Usuário atualizado com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  /**
   * Remove um usuário por ID
   * @param {number} id - ID do usuário
   * @returns {Promise<Object>}
   */
  async delete(id) {
    try {
      const deletedRows = await this.User.destroy({ where: { id } });

      if (deletedRows === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        message: 'Usuário removido com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao remover usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por ID
   * @param {number} id - ID do usuário
   * @returns {Promise<Object>}
   */
  async findById(id) {
    try {
      const user = await this.User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por email
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>}
   */
  async findByEmail(email) {
    try {
      const user = await this.User.findOne({ where: { email } });

      if (!user) {
        return {
          success: false,
          message: 'Usuário não encontrado'
        };
      }

      return {
        success: true,
        data: user,
        message: 'Usuário encontrado com sucesso'
      };
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }
}
