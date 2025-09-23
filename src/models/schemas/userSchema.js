import { DataTypes } from 'sequelize';

/**
 * Schema do Usuário para PostgreSQL
 * Define a estrutura e validações do modelo User
 */
export const UserModel = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nome é obrigatório'
        },
        len: {
          args: [2, 100],
          msg: 'Nome deve ter entre 2 e 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email já está em uso'
      },
      validate: {
        isEmail: {
          msg: 'Email deve ter um formato válido'
        },
        notEmpty: {
          msg: 'Email é obrigatório'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Senha é obrigatória'
        },
        len: {
          args: [6, 255],
          msg: 'Senha deve ter pelo menos 6 caracteres'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'moderator'),
      defaultValue: 'user',
      validate: {
        isIn: {
          args: [['admin', 'user', 'moderator']],
          msg: 'Role deve ser admin, user ou moderator'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('ativo', 'inativo', 'suspenso'),
      defaultValue: 'ativo',
      validate: {
        isIn: {
          args: [['ativo', 'inativo', 'suspenso']],
          msg: 'Status deve ser ativo, inativo ou suspenso'
        }
      }
    },
    ultimoLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tentativasLogin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    bloqueadoAte: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['status']
      },
      {
        fields: ['role']
      }
    ],
    hooks: {
      beforeCreate: (user) => {
        user.email = user.email.toLowerCase();
      },
      beforeUpdate: (user) => {
        if (user.changed('email')) {
          user.email = user.email.toLowerCase();
        }
      }
    }
  });

  return User;
};
