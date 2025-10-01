import mongoose from 'mongoose';

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
  timestamps: true,
  versionKey: false
});

heroSchema.index({ nome: 1 });
heroSchema.index({ status: 1 });
heroSchema.index({ nivel: 1 });

heroSchema.pre('save', function (next) {
  if (this.nome) {
    this.nome = this.nome.toLowerCase();
  }
  next();
});

export const HeroSchema = heroSchema;
