const router = require('express').Router();
const { Post, User, Comment, React } = require('../../models');
// const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: ['id', 'title', 'created_at', 'post_content'],
    order: [['created_at', 'DESC']],
    include: [
      // Comment model here -- attached username to comment
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
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/react', async (req, res) => {
  console.log(req.body, '------------------------------');
  const findReacts = await Post.findAll({
    raw: true,
    where: {
      id: req.body.id,
    },
    include: [
      {
        model: React,
        attributes: ['like', 'dislike'],
      },
    ],
  });

  if (
    findReacts[0]['reacts.like'] === null &&
    findReacts[0]['reacts.dislike'] === null
  ) {
    console.log('no reacts -----------');
    if (req.body.react) {
      console.log('adding first like');
      const firstLikeReact = await React.create({
        user_id: req.session.user_id,
        post_id: req.body.id,
        like: true,
      });
      firstLikeReact;
    } else if (!req.body.react) {
      console.log('adding first dislike');
      const firstDislikeReact = await React.create({
        user_id: req.session.user_id,
        post_id: req.body.id,
        dislike: true,
      });
      firstDislikeReact;
    }
  }

  console.log(findReacts);
  res.send('responce');
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'title', 'created_at', 'post_content'],
    include: [
      // include the Comment model here:
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_content: req.body.content,
    user_id: req.session.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_content: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, async (req, res) => {
  console.log('deleting post ----------------------------');
  try {
    const delComment = await Comment.destroy({
      where: {
        post_id: req.params.id,
      },
    });
    delComment;
    const delPost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });
    delPost;
    res.send('psot deleted');
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
