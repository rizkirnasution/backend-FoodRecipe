const express = require('express')
const Route = express.Router()
const { query, param, check } = require('express-validator')

const {
  getAllRecipeControllers,
  getRecipeControllersById,
  getRecipeControllersByUserId,
  postRecipeControllers,
  putRecipeControllers,
  deleteRecipeControllers
} = require('../controllers/recipe.controllers')
const { grantedOnlyCreator } = require('../middlewares/authorization')
const {
  cacheAllRecipe,
  cacheSingleRecipe,
  removeCacheAllRecipe,
  removeCacheSingleRecipe
} = require('../middlewares/cache')
const { checkRecipeExisting } = require('../middlewares/content')
const { multerHandler } = require('../middlewares/upload')
const validate = require('../middlewares/validation')
const { verifyToken } = require('../middlewares/verify')

Route
  .get('/', validate([
    query('search').escape().trim(),
    query('limit').escape().trim().toInt(),
    query('page').escape().trim().toInt()
  ]), cacheAllRecipe, getAllRecipeControllers)
  .get('/:id', validate([
    param('id').escape().trim().notEmpty().withMessage('Recipe ID can\'t be empty').bail().isNumeric().withMessage('Recipe ID must be numeric').bail().toInt()
  ]), cacheSingleRecipe, checkRecipeExisting, getRecipeControllersById)
  .get('/user/:userId', validate([
    param('userId').escape().trim().notEmpty().withMessage('User ID can\'t be empty').bail().isNumeric().withMessage('User ID must be numeric').bail().toInt()
  ]), verifyToken, grantedOnlyCreator, getRecipeControllersByUserId)
  .post('/', multerHandler, validate([
    check('title').escape().trim().notEmpty().withMessage('Recipe title can\'t be empty'),
    check('ingredient').escape().trim().notEmpty().withMessage('Recipe ingredient can\'t be empty'),
    check('category').escape().trim().notEmpty().withMessage('Recipe category can\'t be empty')
  ]), verifyToken, grantedOnlyCreator, removeCacheAllRecipe, postRecipeControllers)
  .put('/:id', multerHandler, validate([
    param('id').escape().trim().notEmpty().withMessage('Recipe ID can\'t be empty').bail().isNumeric().withMessage('Recipe ID must be numeric').bail().toInt(),
    check('title').optional({
      nullable: true,
      checkFalsy: true
    }).escape().trim().notEmpty().withMessage('Recipe title can\'t be empty'),
    check('ingredient').optional({
      nullable: true,
      checkFalsy: true
    }).escape().trim().notEmpty().withMessage('Recipe ingredient can\'t be empty'),
    check('category').optional({
      nullable: true,
      checkFalsy: true
    }).escape().trim().notEmpty().withMessage('Recipe category can\'t be empty')
  ]), verifyToken, grantedOnlyCreator, removeCacheSingleRecipe, removeCacheAllRecipe, checkRecipeExisting, putRecipeControllers)
  .delete('/:id', validate([
    param('id').escape().trim().notEmpty().withMessage('Recipe ID can\'t be empty').bail().isNumeric().withMessage('Recipe ID must be numeric').bail().toInt()
  ]), verifyToken, grantedOnlyCreator, removeCacheSingleRecipe, removeCacheAllRecipe, checkRecipeExisting, deleteRecipeControllers)

module.exports = Route
