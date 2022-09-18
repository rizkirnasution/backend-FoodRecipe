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
        throw new createErrors.ExpectationFailed('Recipe data not available on server')
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
        throw new createErrors.ExpectationFailed('Video data not available on server')
      }

      next()
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  },
  checkLikerExisting: async (req, res, next) => {
    try {
      const checkLiker = await knex.select('user_id').from('likers').where('id', req?.params?.id).first()

      if (checkLiker) {
        req.likerData = {
          user: checkLiker?.user_id
        }
      } else {
        throw new createErrors.ExpectationFailed('Liker data not available on server')
      }

      next()
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  },
  checkBookmarkerExisting: async (req, res, next) => {
    try {
      const checkBookmarker = await knex.select('user_id').from('bookmarkers').where('id', req?.params?.id).first()

      if (checkBookmarker) {
        req.bookmarkerData = {
          user: checkBookmarker?.user_id
        }
      } else {
        throw new createErrors.ExpectationFailed('Bookmarker data not available on server')
      }

      next()
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  }
}
