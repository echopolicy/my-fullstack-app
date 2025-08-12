const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // allows self-signed certs
    }
  },
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log('✅ Connection has been established successfully.'))
  .catch(err => console.error('❌ Unable to connect to the database:', err));


module.exports = sequelize;