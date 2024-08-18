const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const WordStatistics = require('./WordStatistics');
const Meaning = require('./Meaning');
const Definition = require('./Definition');
const User = require('./User');
const LikeDislikeLog = require('./LikeDislikeLog');

class Word extends Model {
  // Static method to fetch all words with associations and likes/dislikes for a given IP address
  static async getAllWordsWithInteraction(ipAddress, role, userId, limit, offset) {
    try {
      let whereCondition = {};
      if (role !== "admin" && role !== "contributor") {
        whereCondition = { status: 'approved' };
      }

      if (userId) {
        whereCondition = { userId: userId };
      }

      // Convert limit and offset to integers
      const limitInt = parseInt(limit, 10) || 10;   // Default to 10 if limit is not provided
      const offsetInt = parseInt(offset, 10) || 0;  // Default to 0 if offset is not provided

      // Use Sequelize's `findAndCountAll` to get paginated results and total count
      const words = await Word.findAndCountAll({
        where: whereCondition,
        limit: limitInt,        // Add limit for pagination
        offset: offsetInt,       // Add offset for pagination
        include: [
          { model: WordStatistics, as: 'statistics' },
          {
            model: Meaning, as: 'meanings',
            include: [{ model: Definition, as: 'definitions' }]
          },
          {
            model: User, as: 'user',
            attributes: ['username']
          }
        ]
      });

      // Add like/dislike interaction logic as before
      for (const word of words.rows) {
        const likeLog = await LikeDislikeLog.findOne({
          where: { wordId: word.id, ipAddress, action: 'like' }
        });

        const dislikeLog = await LikeDislikeLog.findOne({
          where: { wordId: word.id, ipAddress, action: 'dislike' }
        });

        word.setDataValue('liked', !!likeLog);
        word.setDataValue('disliked', !!dislikeLog);
      }

      return words; // Return the result with rows and count
    } catch (error) {
      throw new Error('Failed to fetch words with interaction: ' + error.message);
    }
  }
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
  hooks: {
    beforeCreate: async (word) => {
      const user = await User.findOne({ where: { id: word.userId } })

      // Assuming the user role is passed in options for Sequelize
      const userRole = user.role;
      // Set status based on role
      if (userRole === 'admin') {
        word.status = 'approved'; // Admin role gets 'approved' status by default
      } else if (userRole === 'contributor') {
        word.status = 'pending'; // Contributor role gets 'pending' status by default
      }
    }
  }
});

module.exports = Word;