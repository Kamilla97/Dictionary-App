const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const WordStatistics = require('./WordStatistics');
const Meaning = require('./Meaning');
const Definition = require('./Definition');
const User = require('./User');
const LikeDislikeLog = require('./LikeDislikeLog');

class Word extends Model {

}

// Word Model definition
Word.init({
  headword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pronunciation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'denied'),
    allowNull: false,
    defaultValue: 'pending',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  mp3Url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true, // Ensure the value is a valid URL
    },
  }
}, {
  sequelize,
  modelName: 'Word',
});

module.exports = Word;