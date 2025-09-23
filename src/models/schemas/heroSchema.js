import mongoose from 'mongoose';

/**
 * Schema do Mongoose para heróis
 * Define a estrutura dos dados de heróis no MongoDB
 */
const heroSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    trim: true
  },
  poder: {
    type: String,
    required: [true, 'Poder é obrigatório'],
    maxlength: [30, 'Poder deve ter no máximo 30 caracteres'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['ativo', 'inativo', 'aposentado'],
      message: 'Status deve ser: ativo, inativo ou aposentado'
    },
    default: 'ativo'
  },
  nivel: {
    type: Number,
    min: [1, 'Nível deve ser no mínimo 1'],
    max: [100, 'Nível deve ser no máximo 100'],
    default: 1
  },
  habilidades: {
    type: [String],
    default: []
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  versionKey: false // Remove o campo __v
});

// Índices para melhor performance
heroSchema.index({ nome: 1 });
heroSchema.index({ status: 1 });
heroSchema.index({ nivel: 1 });

// Middleware para validação personalizada
heroSchema.pre('save', function (next) {
  // Converte nome para lowercase para busca case-insensitive
  if (this.nome) {
    this.nome = this.nome.toLowerCase();
  }
  next();
});

// Método estático para buscar heróis ativos
heroSchema.statics.findActive = function () {
  return this.find({ status: 'ativo' });
};

// Método de instância para verificar se herói é ativo
heroSchema.methods.isActive = function () {
  return this.status === 'ativo';
};

export const HeroSchema = heroSchema;
