const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Poll = require('./Poll');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Comments',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  timestamps: true, // createdAt, updatedAt
  tableName: 'comments'
});

// Relationships
User.hasMany(Comment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

Poll.hasMany(Comment, { foreignKey: 'poll_id', onDelete: 'CASCADE' });
Comment.belongsTo(Poll, { foreignKey: 'poll_id' });

Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });

module.exports = Comment;