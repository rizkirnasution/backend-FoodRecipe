const express = require('express')
const Route = express.Router()
const { param, check } = require('express-validator')

const {
  postVideoControllers,
  putVideoControllers,
  deleteVideoControllers
} = require('../controllers/video.controllers')
const { grantedOnlyCreator } = require('../middlewares/authorization')
const { checkVideoExisting } = require('../middlewares/content')
const { multerHandler } = require('../middlewares/upload')
const validate = require('../middlewares/validation')
const { verifyToken } = require('../middlewares/verify')

Route
  .post('/', multerHandler, validate([
    check('title').escape().trim().notEmpty().withMessage('Video title can\'t be empty'),
    check('recipe_id').escape().trim().notEmpty().withMessage('Recipe ID\'s can\'t be empty').bail().isNumeric().withMessage('Recipe ID\'s must be numeric').bail().toInt()
  ]), verifyToken, grantedOnlyCreator, postVideoControllers)
  .put('/:id', multerHandler, validate([
    param('id').escape().trim().notEmpty().withMessage('Video ID can\'t be empty').bail().isNumeric().withMessage('Video ID must be numeric').bail().toInt(),
    check('title').optional({
      nullable: true,
      checkFalsy: true
    }).escape().trim().notEmpty().withMessage('Video title can\'t be empty'),
    check('recipe_id').optional({
      nullable: true,
      checkFalsy: true
    }).escape().trim().notEmpty().withMessage('Recipe ID\'s can\'t be empty').bail().isNumeric().withMessage('Recipe ID\'s must be numeric').bail().toInt()
  ]), verifyToken, grantedOnlyCreator, checkVideoExisting, putVideoControllers)
  .delete('/:id', validate([
    param('id').escape().trim().notEmpty().withMessage('Video ID can\'t be empty').bail().isNumeric().withMessage('Video ID must be numeric').bail().toInt()
  ]), verifyToken, grantedOnlyCreator, checkVideoExisting, deleteVideoControllers)

module.exports = Route
