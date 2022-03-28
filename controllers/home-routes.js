const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, React } = require('../models');
const { toBanana } = require('../utils/to-banana');

router.get('/', async (req, res) => {
  try {
    const posts1 = await Post.findAll({
      attributes: ['id', 'title', 'created_at', 'post_content'],

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
    const posts = posts1.map((post) => post.get({ plain: true })).reverse();

for (let index = 0; index < posts.length; index++) {
  const element = posts[index]

    
    
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

      element['likes'] = likeTally;
      element['dislikes'] = dislikeTally;
}
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

router.post('/post/api/posts/react', async (req, res) => {
  //a copy of the like code for single post likes
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
  //single homepage posts
  const post1 = await Post.findOne({
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

  if (!post1) {
    res.status(404).json({ message: 'No post found with this id' });
  }
  const post = post1.get({ plain: true });
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
  if (!req.session.loggedIn) {
    const str = toBanana(post.title);
    post.title = str[0];
    const arr = toBanana(post.post_content);
    post.post_content = arr[0];

    post.comments.forEach((ele) => {
      if (ele.comment_text.length > 3) {
        const newArr = toBanana(ele.comment_text);
        ele.comment_text = newArr[0];
      }
    });
  }
  res.render('single-post', {
    post,
    loggedIn: req.session.loggedIn,
  });
});

module.exports = router;
