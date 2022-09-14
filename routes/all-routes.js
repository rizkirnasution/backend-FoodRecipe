const express = require('express')
const Route = express.Router()

const authRoutes = require('./auth')

Route
  .use('/auth', authRoutes)

module.exports = Route
