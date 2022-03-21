const { Posts, Users, Comments } = require('../models');
const router = require('express').Router();

router.get('/', (req, res) => {
  Posts.findAll({
    attributes: ['id', 'title', 'content', 'created_at'],
    include: [
      {
        model: Comments,
        attributes: ['id', 'description', 'post_id', 'user_id', 'date_created'],
        include: {
          model: Users,
          attributes: ['name'],
        },
      },
      {
        model: Users,
        attributes: ['name'],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((posts) => posts.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
