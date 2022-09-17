const express = require('express')
const Route = express.Router()

const authRoutes = require('./auth.routes')
const categoryRoutes = require('./category.routes')
const recipeRoutes = require('./recipe.routes')
const videoRoutes = require('./video.routes')

Route
  .use('/auth', authRoutes)
  .use('/category', categoryRoutes)
  .use('/recipe', recipeRoutes)
  .use('/video', videoRoutes)

module.exports = Route
