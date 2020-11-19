'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {},
  models = ['User', 'Page'];

db.sequelize = sequelize;
db.Sequelize = Sequelize;

models.forEach(model => db[model] = require(`./${model}`)(sequelize, Sequelize));
models.forEach(model => {
  if (db[model].associate) db[model].associate(db)
});

module.exports = db;
