// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dictionary_db', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize;
