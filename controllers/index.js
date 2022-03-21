const router = require('express').Router();
const bodyParser = require('body-parser');
const app = require('express');
const { currentDate } = require('../utils/helpers');
const session = require('express-session');
const { User, Post, Comment } = require('../models');
