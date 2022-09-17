const express = require('express')
const Route = express.Router()

const { getAllCategoryControllers } = require('../controllers/category.controllers')

Route.get('/', getAllCategoryControllers)

module.exports = Route
