const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, React } = require('../models');
const { toBanana } = require('../utils/to-banana');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title', 'created_at', 'post_content'],
      raw: true,
      include: [
        {
          model: Comment,
          attributes: [
            'id',
            'comment_text',
            'post_id',
            'user_id',
            'created_at',
          ],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    posts.forEach(async (element) => {
      //getting all the reacts for each post (including in original post dupiplacates the posts based on reacts)
      const postsLikes = await React.findAll({
        raw: true,
        attributes: ['like', 'dislike'],
        where: { post_id: element.id },
      });
      let likeTally = 0;
      let dislikeTally = 0;

      postsLikes.forEach((ele) => {
        likeTally = likeTally + ele.like;
        dislikeTally = dislikeTally + ele.dislike;
      });

      console.log(likeTally);
      console.log(dislikeTally);
      element['likes'] = likeTally;
      element['dislikes'] = dislikeTally;
      console.log(element);
    });
    console.log(posts);
    if (!req.session.loggedIn && posts) {
      posts.forEach((element) => {
        if (element.title) {
          const str = toBanana(element.title);
          element.title = str[0];
        }
        if (element.post_content) {
          const strObj = toBanana(element.post_content);
          element.post_content = strObj[0];
        }
      });
      //sending the content of the post to the bananariser to be banana'd and saving it back where it was
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn,
      });
    } else {
      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

router.get('/post/:id', async (req, res) => {
  const post = await Post.findOne({
    raw: true,
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'created_at', 'post_content'],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  });

  if (!post) {
    res.status(404).json({ message: 'No post found with this id' });
  }

  //getting all the reacts for each post (including in original post dupiplacates the posts based on reacts)
  const postsLikes = await React.findAll({
    raw: true,
    attributes: ['like', 'dislike'],
    where: { post_id: post.id },
  });
  let likeTally = 0;
  let dislikeTally = 0;

  postsLikes.forEach((ele) => {
    likeTally = likeTally + ele.like;
    dislikeTally = dislikeTally + ele.dislike;
  });

  post['likes'] = likeTally;
  post['dislikes'] = dislikeTally;

  res.render('single-post', {
    post,
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
