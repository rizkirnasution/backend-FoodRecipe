const response = require('../helpers/response')
const createErrors = require('http-errors')
const cloudinary = require('cloudinary')
const { mappingKey, changeExt } = require('../helpers/common')
const setter = require('../helpers/setter')
const redisClient = require('../config/redis')
const knex = require('../config/knex')
const { selectedColumnUserRecipes } = require('../constants/recipe.data')
require('dotenv').config()
const { REDIS_CACHE_LIFE } = process.env
const fs = require('node:fs')

module.exports = {
  getAllRecipeControllers: async (req, res) => {
    try {
      const queryParams = req.query
      let result = ''
      let totalRows = 0

      if (!queryParams) {
        result = await knex
          .select(selectedColumnUserRecipes)
          .from('recipes')
          .leftOuterJoin('users', 'recipes.creator_id', 'users.id')
          .leftOuterJoin('videos', 'recipes.id', 'videos.recipe_id')
      } else {
        if (queryParams?.search) {
          result = await knex
            .select(selectedColumnUserRecipes)
            .from('recipes')
            .leftOuterJoin('users', 'recipes.creator_id', 'users.id')
            .leftOuterJoin('videos', 'recipes.id', 'videos.recipe_id')
            .whereILike('recipes.title', `%${queryParams.search}%`)
            .orWhereILike('recipes.ingredient', `%${queryParams.search}%`)
            .orWhereILike('recipes.category', `%${queryParams.search}%`)
            .orWhereILike('videos.title', `%${queryParams.search}%`)
            .orWhereILike('users.name', `%${queryParams.search}%`)
            .orderBy(`${queryParams?.orderBy ? `recipes.${queryParams?.orderBy}` : 'recipes.id'}`, `${queryParams?.sortBy || 'desc'}`)
            .limit(`${parseInt(queryParams?.limit) || 'NULL'}`)
            .offset(`${Math.max(((parseInt(queryParams?.limit) || 10) * (parseInt(queryParams?.page) || 0)) - (parseInt(queryParams?.limit) || 10), 0)}`)
        } else {
          result = await knex
            .select(selectedColumnUserRecipes)
            .from('recipes')
            .leftOuterJoin('users', 'recipes.creator_id', 'users.id')
            .leftOuterJoin('videos', 'recipes.id', 'videos.recipe_id')
            .orderBy(`${queryParams?.orderBy ? `recipes.${queryParams?.orderBy}` : 'recipes.id'}`, `${queryParams?.sortBy || 'desc'}`)
            .limit(`${parseInt(queryParams?.limit) || 'NULL'}`)
            .offset(`${Math.max(((parseInt(queryParams?.limit) || 10) * (parseInt(queryParams?.page) || 0)) - (parseInt(queryParams?.limit) || 10), 0)}`)
        }
      }

      const recipeVideos = []
      const recipeCreator = []

      result.forEach(value => {
        recipeVideos.push({
          id: value.video_id,
          title: value.video_title,
          thumbnail: value.video_thumbnail,
          url: value.video_url,
          recipe_id: value.recipe_video_id,
          created_at: value.video_created_at,
          updated_at: value.video_updated_at
        })

        recipeCreator.push({
          id: value.creator_id,
          email: value.creator_email,
          name: value.creator_name,
          picture: value.creator_picture,
          creator_id: value.recipe_creator_id
        })

        return value
      })

      const listOfRecipe = []
      const mappingRecipe = result.map(value => {
        return {
          id: value.id,
          title: value.title,
          ingredient: value.ingredient,
          category: value.category,
          thumbnail: value.thumbnail,
          created_at: value.created_at,
          updated_at: value.updated_at,
          videos: recipeVideos.filter(videoValue => videoValue.recipe_id === value.id),
          creator: recipeCreator.filter(creatorValue => creatorValue.creator_id === value.creator_id)[0]
        }
      })

      recipeVideos.forEach(value => {
        delete value.recipe_id

        return value
      })

      recipeCreator.forEach(value => {
        delete value.creator_id

        return value
      })

      const recipes = mappingRecipe.filter(value => {
        const isDuplicate = listOfRecipe.includes(value.id)

        if (!isDuplicate) {
          listOfRecipe.push(value.id)

          return true
        }

        return false
      })

      totalRows = recipes.length

      const totalActiveRows = recipes.length
      const sheets = Math.ceil(totalRows / (parseInt(queryParams?.limit) || 0))
      const nextPage = (page, limit, total) => (total / limit) > page ? (limit <= 0 ? false : page + 1) : false
      const previousPage = (page) => page <= 1 ? false : page - 1

      const pagination = {
        total: {
          data: totalRows,
          active: totalActiveRows,
          sheet: sheets === Infinity ? 0 : sheets
        },
        page: {
          limit: parseInt(queryParams?.limit) || 0,
          current: parseInt(queryParams?.page) || 1,
          next: nextPage((parseInt(queryParams?.page) || 1), (parseInt(queryParams?.limit) || 0), totalRows),
          previous: previousPage((parseInt(queryParams?.page) || 1))
        }
      }

      const {
        redisKey,
        redisData,
        cacheLife
      } = {
        redisKey: `recipes:${mappingKey(req.query)}`,
        redisData: {
          data: result ? recipes : [],
          pagination
        },
        cacheLife: REDIS_CACHE_LIFE
      }

      await setter(
        redisKey,
        redisData,
        cacheLife
      )

      return response(res, 200, result ? recipes : [], pagination)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  getRecipeControllersById: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty!')

      const id = req.params.id
      const result = await knex
        .select(selectedColumnUserRecipes)
        .from('recipes')
        .leftOuterJoin('users', 'recipes.creator_id', 'users.id')
        .leftOuterJoin('videos', 'recipes.id', 'videos.recipe_id')
        .where('recipes.id', id)

      const recipeVideos = []
      let recipeCreator = {}

      result.forEach(value => {
        recipeVideos.push({
          id: value.video_id,
          title: value.video_title,
          thumbnail: value.video_thumbnail,
          url: value.video_url,
          created_at: value.video_created_at,
          updated_at: value.video_updated_at
        })

        recipeCreator = {
          id: value.creator_id,
          email: value.creator_email,
          name: value.creator_name,
          picture: value.creator_picture
        }

        return value
      })

      const listOfRecipe = []
      const mappingRecipe = result.map(value => {
        return {
          id: value.id,
          title: value.title,
          ingredient: value.ingredient,
          category: value.category,
          thumbnail: value.thumbnail,
          created_at: value.created_at,
          updated_at: value.updated_at,
          videos: recipeVideos,
          creator: recipeCreator
        }
      })
      const recipe = mappingRecipe.filter(value => {
        const isDuplicate = listOfRecipe.includes(value.id)

        if (!isDuplicate) {
          listOfRecipe.push(value.id)

          return true
        }

        return false
      })

      const {
        redisKey,
        redisData,
        cacheLife
      } = {
        redisKey: `recipe/${id}`,
        redisData: result ? recipe[0] : {},
        cacheLife: REDIS_CACHE_LIFE
      }

      await setter(
        redisKey,
        redisData,
        cacheLife
      )

      return response(res, 200, result ? recipe[0] : {})
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  postRecipeControllers: async (req, res) => {
    try {
      const data = req.body
      const bodyLength = Object.keys(data).length
      const file = req.files?.picture || {}
      const video = req.files?.video || {}
      const videoUrls = []

      if (!bodyLength) throw new createErrors.BadRequest('Request body empty!')

      if (file.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(file[0].path, {
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (pictureError, pictureResponse) => {
          if (pictureError) throw new createErrors.UnsupportedMediaType(`Recipe thumbnail: ${pictureError.message}`)

          fs.unlinkSync(file[0].path)

          data.thumbnail = pictureResponse.secure_url || ''
        })
      }

      if (video.length) {
        for (const videoFile of video) {
          const { path } = videoFile

          cloudinary.v2.config({ secure: true })

          await cloudinary.v2.uploader.upload(path, {
            resource_type: 'video',
            chunk_size: 20000000,
            use_filename: false,
            unique_filename: true,
            overwrite: true
          }, (videoError, videoResponse) => {
            if (videoError) throw new createErrors.UnsupportedMediaType(`Video on recipe: ${videoError.message}`)

            fs.unlinkSync(path)

            videoUrls.push({
              title: videoResponse.original_filename || data?.title,
              url: videoResponse.secure_url
            })
          })
        }
      }

      const user = req.userData
      const insertNewRecipes = {
        title: data.title,
        ingredient: data.ingredient,
        thumbnail: data.thumbnail,
        category: data.category,
        creator_id: user.id
      }
      const result = await knex('recipes').insert(insertNewRecipes).returning(['id', 'title'])

      if (result.length) {
        for (const videoData of videoUrls) {
          const insertNewVideos = {
            title: videoData.title,
            url: videoData.url,
            thumbnail: changeExt(videoData.url, 'png'),
            recipe_id: result[0].id
          }

          await knex('videos').insert(insertNewVideos)
        }
      }

      const message = `New recipes: ${result[0].title}, successfully added!`

      return response(res, 201, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  putRecipeControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const data = req.body
      const file = req.files?.picture || {}
      const user = req.userData
      const recipe = req.recipeData

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty!')

      if (user.id !== recipe.creator) throw new createErrors.UnavailableForLegalReasons('You\'re not the creator of this recipe!')

      if (file.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(file[0].path, {
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (pictureError, pictureResponse) => {
          if (pictureError) throw new createErrors.UnsupportedMediaType(`Recipe thumbnail: ${pictureError.message}`)

          fs.unlinkSync(file[0].path)

          data.thumbnail = pictureResponse.secure_url || ''
        })
      }

      const id = req.params.id
      const result = await knex('recipes').where('id', id).update(data).returning('*')
      const video = {
        id: result.video_id,
        title: result.video_title,
        url: result.video_url
      }
      const creator = {
        id: result.creator_id,
        email: result.creator_email,
        name: result.creator_name
      }
      const recipeData = {
        ...result,
        video,
        creator
      }
      const getCacheRecipeById = await redisClient.get(`recipe/${id}`)

      if (getCacheRecipeById) {
        const {
          redisKey,
          redisData,
          cacheLife
        } = {
          redisKey: `recipe/${id}`,
          redisData: result ? recipeData : {},
          cacheLife: REDIS_CACHE_LIFE
        }

        await setter(
          redisKey,
          redisData,
          cacheLife
        )
      }

      const message = `Existing recipes: ${result[0].title}, successfully updated!`

      return response(res, 200, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  deleteRecipeControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const user = req.userData
      const recipe = req.recipeData

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty!')

      if (user.id !== recipe.creator) throw new createErrors.UnavailableForLegalReasons('You\'re not the creator of this recipe!')

      const id = req.params.id
      const result = await knex('recipes').where('id', id).del().returning('*')

      const message = `Existing recipes: ${result[0].title}, successfully deleted!`

      return response(res, 200, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  }
}
