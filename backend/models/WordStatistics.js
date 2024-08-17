const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class WordStatistics extends Model {}

WordStatistics.init({
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dislikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  sequelize,
  modelName: 'WordStatistics'
});

module.exports = WordStatistics;
