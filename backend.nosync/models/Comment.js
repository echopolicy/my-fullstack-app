// models/Comment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Poll = require('./Poll');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  poll_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Poll,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  parent_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'Comments',  // self-reference
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comments',
  timestamps: false   // we'll rely on explicit created_at / updated_at
});

// Associations
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Comment.belongsTo(Poll, { foreignKey: 'poll_id', as: 'poll' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

module.exports = Comment;