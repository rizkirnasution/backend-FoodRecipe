const express = require('express')
const Route = express.Router()

const authRoutes = require('./auth.routes')
const categoryRoutes = require('./category.routes')
const recipeRoutes = require('./recipe.routes')
const videoRoutes = require('./video.routes')
const profileRoutes = require('./profile.routes')
const likerRoutes = require('./liker.routes')
const bookmarkerRoutes = require('./bookmarker.routes')

Route
  .use('/auth', authRoutes)
  .use('/category', categoryRoutes)
  .use('/recipe', recipeRoutes)
  .use('/video', videoRoutes)
  .use('/profile', profileRoutes)
  .use('/liker', likerRoutes)
  .use('/bookmark', bookmarkerRoutes)

module.exports = Route
