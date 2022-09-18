const express = require('express')
const Route = express.Router()
const { query, param, check } = require('express-validator')

const {
  getAllLikerControllers,
  getLikerByUserIdControllers,
  postLikerControllers,
  deleteLikerControllers
} = require('../controllers/liker.controllers')
const { grantedAll } = require('../middlewares/authorization')
const { checkLikerExisting } = require('../middlewares/content')
const validate = require('../middlewares/validation')
const { verifyToken } = require('../middlewares/verify')

Route
  .get('/', validate([
    query('search').escape().trim(),
    query('limit').escape().trim().toInt(),
    query('page').escape().trim().toInt()
  ]), getAllLikerControllers)
  .get('/:userId', validate([
    param('userId').escape().trim().notEmpty().withMessage('User ID can\'t be empty').bail().isNumeric().withMessage('User ID must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, getLikerByUserIdControllers)
  .post('/', validate([
    check('recipe_id').escape().trim().notEmpty().withMessage('Recipe ID\'s can\'t be empty').bail().isNumeric().withMessage('Recipe ID\'s must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, postLikerControllers)
  .delete('/:id', validate([
    param('id').escape().trim().notEmpty().withMessage('Liker ID can\'t be empty').bail().isNumeric().withMessage('Liker ID must be numeric').bail().toInt()
  ]), verifyToken, grantedAll, checkLikerExisting, deleteLikerControllers)

module.exports = Route
