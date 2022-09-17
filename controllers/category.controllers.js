const response = require('../helpers/response')
const createErrors = require('http-errors')
const fetch = require('cross-fetch')

module.exports = {
  getAllCategoryControllers: async (_, res) => {
    try {
      const fetchCategories = await fetch('https://masak-apa-tomorisakura.vercel.app/api/category/recipes')

      if (!fetchCategories.ok) { throw new createErrors.BadRequest(`An error has occured: ${fetchCategories.status}`) }

      const categories = await fetchCategories.json()

      const result = categories.results.map(value => {
        return value.category
      })

      return response(res, 200, result)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  }
}
