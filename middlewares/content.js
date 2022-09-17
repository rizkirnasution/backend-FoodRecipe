const response = require('../helpers/response')
const createErrors = require('http-errors')
const knex = require('../config/knex')

module.exports = {
  checkRecipeExisting: async (req, res, next) => {
    try {
      const checkRecipe = await knex.select('creator_id', 'id').from('recipes').where('id', req?.params?.id).first()

      if (checkRecipe) {
        req.recipeData = {
          creator: checkRecipe?.creator_id,
          id: checkRecipe?.id
        }
      } else {
        throw new createErrors.ExpectationFailed('Recipe data not available on server!')
      }

      next()
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  },
  checkVideoExisting: async (req, res, next) => {
    try {
      const checkVideo = await knex.select('recipe_id').from('videos').where('id', req?.params?.id).first()

      if (checkVideo) {
        req.videoData = {
          recipe: checkVideo?.recipe_id
        }
      } else {
        throw new createErrors.ExpectationFailed('Video data not available on server!')
      }

      next()
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  }
}
