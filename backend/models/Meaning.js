const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Meaning extends Model {}

Meaning.init({
  partOfSpeech: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Words',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, { sequelize, modelName: 'Meaning' });

module.exports = Meaning;
