const sequelize = require('../config/database');
const Word = require('./Word');
const Meaning = require('./Meaning');
const Definition = require('./Definition');
const WordStatistics = require('./WordStatistics');
const User = require('./User');
const LikeDislikeLog = require('./LikeDislikeLog'); // Import the LikeDislikeLog model

// Associations
Word.hasMany(Meaning, { foreignKey: 'wordId', as: 'meanings' });
Word.hasOne(WordStatistics, { foreignKey: 'wordId', as: 'statistics' });
Word.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Meaning.belongsTo(Word, { foreignKey: 'wordId', as: 'word' });
Meaning.hasMany(Definition, { foreignKey: 'meaningId', as: 'definitions' });

Definition.belongsTo(Meaning, { foreignKey: 'meaningId' });

User.hasMany(Word, { foreignKey: 'userId' });

// New Associations for LikeDislikeLog
WordStatistics.hasMany(LikeDislikeLog, { foreignKey: 'wordId', as: 'logs' });
LikeDislikeLog.belongsTo(WordStatistics, { foreignKey: 'wordId', as: 'statistics' });

module.exports = {
  sequelize,
  Word,
  Meaning,
  Definition,
  WordStatistics,
  User,
  LikeDislikeLog, 
};
