const router = require('express').Router();
const bodyParser = require('body-parser');
// const app = require("express");
// const { currentDate } = require("../utils/helpers");
const session = require('express-session');
const { User, Post, Comment } = require('../models');

router.get('/', async (req, res) => {
  res.render('main');
});

router.get('/login', async (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const checkPW = await User.findOne({
    where: { name: req.body.username },
  });
  //save the users username in the body as username in the frontend

  if (!checkPW) {
    res.render('login', { message: 'Invalid username or password' });
    //if the password is incorrect, redirect back to the login page while displaying the login attempt was wrong
  } else {
    const validPassword = checkPW.checkPassword(req.body.password); //make sure to send the password through in the body as "password"
    if (validPassword) {
      req.session.logged_in = true; //assuming the sessionId for logged in is set as logged_in
      req.session.user = req.body.username;
      //assuming the sessionId for user is set as user
      req.session.userId = checkPW.id;
      //getting the users ID for the DB and saving it in session an userId

      //add the render for where to send the user when their logged in
    } else {
      res.render('login', { message: 'Invalid username or password' });
      //if the password is incorrect, redirect back to the login page while displaying the login attempt was wrong
    }
  }
});
