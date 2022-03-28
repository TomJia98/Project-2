const router = require('express').Router();
const { Post, User, Comment, React } = require('../../models');
// const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');
const { wss } = require('../../websockets/websockets');

// get all posts
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
    .then((dbPostData) => {
      console.log(dbPostData);
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/react', async (req, res) => {
  const findReacts = await React.findAll({
    raw: true,
    where: {
      post_id: req.body.id,
      user_id: req.session.user_id,
    },
  });
  if (
    findReacts[0] === undefined &&
    findReacts[0] === undefined
    //first time user has liked content
  ) {
    console.log('no reacts -----------');
    if (req.body.react) {
      console.log('adding first like');
      const firstLikeReact = await React.create({
        user_id: req.session.user_id,
        post_id: req.body.id,
        like: true,
        dislike: false,
      });
      firstLikeReact; //add their first like
    } else if (!req.body.react) {
      console.log('adding first dislike');
      const firstDislikeReact = await React.create({
        user_id: req.session.user_id,
        post_id: req.body.id,
        like: false,
        dislike: true,
      });
      firstDislikeReact; //add their first dislike
    }
  } else if (findReacts[0].like) {
    //if post has been liked already
    console.log('already liked');
    if (req.body.react === false) {
      console.log('changing like to dislike');
      //post has just been disliked
      const changeLikeToDislike = await React.update(
        {
          like: false,
          dislike: true,
        },
        {
          where: {
            id: findReacts[0].id,
          },
        }
      );
      changeLikeToDislike;
    }
  } else if (findReacts[0].dislike) {
    console.log('already disliked');
    if (req.body.react === true) {
      console.log('changing dislike to like');
      const changeDislikeToLike = await React.update(
        {
          like: true,
          dislike: false,
        },
        {
          where: {
            id: findReacts[0].id,
          },
        }
      );
      changeDislikeToLike;
    }
  }
  res.send('response');
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

      console.log('aaaa');
      wss.broadcast(
        JSON.stringify({
          post: dbPostData,
        })
      );
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
    .then((dbPostData) => {
      console.log('this is the routes data' + dbPostData);

      return Post.findByPk(dbPostData.id, {
        include: [
          {
            model: User,
          },
          {
            model: Comment,
          },
        ],
      });
    })
    .then((post) => {
      // dbPostData.
      console.log(post.dataValues);
      console.log('got it');
      wss.broadcast(JSON.stringify(post.toJSON()));
      res.json(post.dataValues);
      // res.redirect(req.baseUrl + '/dashboard');
    })

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
  try {
    const delReacts = await React.destroy({
      where: {
        post_id: req.params.id,
      },
    });
    delReacts;
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
    res.send('post deleted');
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
