require('dotenv').config();

const env = process.env;

const development = {
  "username": env.DEV_DB_USERNAME,
  "password": env.DEV_DB_PASSWORD,
  "database": env.DEV_DB_NAME,
  "host": env.DEV_DB_HOST,
  "dialect": "mysql"
};

const test = {
  "username": env.TEST_DB_USERNAME,
  "password": env.TEST_DB_PASSWORD,
  "database": env.TEST_DB_NAME,
  "host": env.TEST_DB_HOST,
  "dialect": "mysql"
};

const production = {
  "username": env.PROD_DB_USERNAME,
  "password": env.PROD_DB_PASSWORD,
  "database": env.PROD_DB_NAME,
  "host": env.PROD_DB_HOST,
  "dialect": "mysql"
};

module.exports = {
  development,
  test,
  production
};
