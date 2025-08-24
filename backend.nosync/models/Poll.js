const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Poll = sequelize.define('Poll', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL array of strings
    defaultValue: [],
  },
  closeDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  pollType: {
    type: DataTypes.ENUM('single', 'multiple'),
    allowNull: false,
  },
    visibilityPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  options: {
    type: DataTypes.JSONB, // JSON array of options with text and votes
    allowNull: false,
  },
  votes: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [], // start as empty array
 },
  trending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  updatedAt: false,
  tableName: 'polls',
});
module.exports = Poll;
