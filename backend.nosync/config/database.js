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


// Below code will sync models with the database
// The { alter: true } option will check the current state of the table in the database and then perform the necessary changes to make it
// match the model. You can use this to make changes to your model as needed
//sequelize.sync({ alter: false })
//  .then(() => console.log('🔄 Database synchronized'))
//  .catch(err => console.error('❌ Error synchronizing database:', err));


module.exports = sequelize;