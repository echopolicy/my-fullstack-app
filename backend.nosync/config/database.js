require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,   
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432, 
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;