// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const pollsRouter = require('./routes/polls');

// ✅ Import the model so Sequelize knows about it
require('./models/Poll'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/polls', pollsRouter);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to EchoPolicy backend API');
});

// DB Connection and Server Start 
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ force: false }); // change to alter: true if needed
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to DB:', err);
    process.exit(1);
  });

module.exports = app;
