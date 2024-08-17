const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LikeDislikeLog = sequelize.define('LikeDislikeLog', {
    wordId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'WordStatistics', // Make sure the table name is correct
            key: 'id'
        },
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false, // if you don't need updatedAt field
});

module.exports = LikeDislikeLog;
