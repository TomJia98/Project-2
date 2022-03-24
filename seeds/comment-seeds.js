const { Comment } = require('../models');

const commentData = [
  {
    user_id: 1,
    post_id: 5,
    comment_text: 'Holy!!!!!',
  },
  {
    user_id: 4,
    post_id: 4,
    comment_text: 'Wow!!!',
  },
  {
    user_id: 1,
    post_id: 4,
    comment_text: 'Awesome! Have a banana',
  },
  {
    user_id: 3,
    post_id: 5,
    comment_text: 'Cool banana and fantastic!',
  },
  {
    user_id: 3,
    post_id: 2,
    comment_text: 'Love it!',
  },
  {
    user_id: 3,
    post_id: 4,
    comment_text: 'Banana is good for you. How many?',
  },
  {
    user_id: 5,
    post_id: 3,
    comment_text: 'No banana, go apple la!!!',
  },
  {
    user_id: 2,
    post_id: 1,
    comment_text: 'Ur legend!',
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
