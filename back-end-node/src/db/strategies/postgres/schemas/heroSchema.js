const Sequelize = require('sequelize')
const HeroSchema = {
  name: 'hero',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      required: true,
    },
    power: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    //opcoes para base existente
    tableName: 'TB_HERO',
    freezeTableName: false,
    timestamps: false,
  }
}

module.exports = HeroSchema