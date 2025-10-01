import { HeroSchema } from '../schemas/heroSchema.js';

export class MongoStrategy {
  constructor(connection) {
    this.connection = connection;
    this.Hero = connection.model('Hero', HeroSchema);
  }

  async isConnected() {
    return this.connection.readyState === 1;
  }

  async create(data) {
    const hero = new this.Hero(data);
    const savedHero = await hero.save();
    return {
      success: true,
      data: savedHero,
      message: 'Herói criado com sucesso'
    };
  }

  async read(query = {}) {
    const heroes = await this.Hero.find(query).select('-__v').lean();
    return {
      success: true,
      data: heroes,
      count: heroes.length,
      message: 'Heróis encontrados com sucesso'
    };
  }

  async update(id, data) {
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

    return {
      success: true,
      data: hero,
      message: 'Herói atualizado com sucesso'
    };
  }

  async delete(id) {
    const hero = await this.Hero.findByIdAndDelete(id);

    if (!hero) {
      return {
        success: false,
        message: 'Herói não encontrado'
      };
    }

    return {
      success: true,
      message: 'Herói removido com sucesso'
    };
  }

  async findById(id) {
    const hero = await this.Hero.findById(id).select('-__v').lean();

    if (!hero) {
      return {
        success: false,
        message: 'Herói não encontrado'
      };
    }

    return {
      success: true,
      data: hero,
      message: 'Herói encontrado com sucesso'
    };
  }
}
