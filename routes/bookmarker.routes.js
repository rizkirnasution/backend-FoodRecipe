const express = require('express')
const Route = express.Router()
const { query, param, check } = require('express-validator')

const {
  getAllBookmarkerControllers,
  getBookmarkerByUserIdControllers,
  postBookmarkerControllers,
  deleteBookmarkerControllers
} = require('../controllers/bookmarker.controllers')
const { grantedAll } = require('../middlewares/authorization')
const { checkBookmarkerExisting } = require('../middlewares/content')
const validate = require('../middlewares/validation')
const { verifyToken } = require('../middlewares/verify')

Route
  .get('/', validate([
    query('search').escape().trim(),
    query('limit').escape().trim().toInt(),
    query('page').escape().trim().toInt()
  ]), getAllBookmarkerControllers)
  .get('/:userId', validate([
    param('userId').escape().trim().notEmpty().withMessage('User ID can\'t be empty').bail().isNumeric().withMessage('User ID must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, getBookmarkerByUserIdControllers)
  .post('/', validate([
    check('recipe_id').escape().trim().notEmpty().withMessage('Recipe ID\'s can\'t be empty').bail().isNumeric().withMessage('Recipe ID\'s must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, postBookmarkerControllers)
  .delete('/:id', validate([
    param('id').escape().trim().notEmpty().withMessage('Bookmarker ID can\'t be empty').bail().isNumeric().withMessage('Bookmarker ID must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, checkBookmarkerExisting, deleteBookmarkerControllers)

module.exports = Route
