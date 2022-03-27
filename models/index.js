const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const React = require('./React');

//create associations

React.belongsTo(Post, {
  foreignKey: 'post_id',
});

React.belongsTo(User, {
  foreignKey: 'user_id',
});

Post.hasMany(React, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

User.hasMany(React, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

User.hasMany(Post, {
  foreignKey: 'user_id',
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});

module.exports = { User, Post, Comment, React };
