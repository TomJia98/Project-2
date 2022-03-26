const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const React = require('./React');

//create associations
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
});

Post.hasMany(Comment, {
  foreignKey: 'post_id',
});
// reacts
React.belongsTo(Post, {
  foreignKey: 'post_id',
});

React.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(React, {
  foreignKey: 'user_id',
});

Post.hasMany(React, {
  foreignKey: 'post_id',
});

module.exports = { User, Post, Comment };
