const Sequelize = require('sequelize');

const config = require('../config/config')[process.env.NODE_ENV], db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
