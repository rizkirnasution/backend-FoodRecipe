const response = require('../helpers/response')
const createErrors = require('http-errors')
const knex = require('../config/knex')
const cloudinary = require('cloudinary')
const fs = require('node:fs')

module.exports = {
  postVideoControllers: async (req, res) => {
    try {
      const data = req.body
      const bodyLength = Object.keys(data).length
      const file = req.files?.picture || {}
      const videoFile = req.files?.video || {}

      if (!bodyLength) throw new createErrors.BadRequest('Request body empty!')

      if (file.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(file[0].path, {
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (pictureError, pictureResponse) => {
          if (pictureError) throw new createErrors.UnsupportedMediaType(`Video thumbnail: ${pictureError.message}`)

          fs.unlinkSync(file[0].path)

          data.thumbnail = pictureResponse.secure_url || ''
        })
      }

      if (videoFile.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(videoFile[0].path, {
          resource_type: 'video',
          chunk_size: 20000000,
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (videoError, videoResponse) => {
          if (videoError) throw new createErrors.UnsupportedMediaType(`Video on controller: ${videoError.message}`)

          fs.unlinkSync(videoFile[0].path)

          data.url = videoResponse.secure_url || ''
        })
      }

      const newVideo = {
        title: data.title,
        url: data.url,
        thumbnail: data.thumbnail,
        recipe_id: data.recipe_id
      }

      await knex('videos').insert(newVideo)

      const message = 'New Video successfully added!'

      return response(res, 201, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  putVideoControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const data = req.body
      const bodyLength = Object.keys(data).length
      const file = req.files?.picture || {}
      const videoFile = req.files?.video || {}

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty!')

      if (!bodyLength) throw new createErrors.BadRequest('Request body empty!')

      if (file.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(file[0].path, {
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (pictureError, pictureResponse) => {
          if (pictureError) throw new createErrors.UnsupportedMediaType(`Video thumbnail: ${pictureError.message}`)

          fs.unlinkSync(file[0].path)

          data.thumbnail = pictureResponse.secure_url || ''
        })
      }

      if (videoFile.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(videoFile[0].path, {
          resource_type: 'video',
          chunk_size: 20000000,
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (videoError, videoResponse) => {
          if (videoError) throw new createErrors.UnsupportedMediaType(`Video on controller: ${videoError.message}`)

          fs.unlinkSync(videoFile[0].path)

          data.url = videoResponse.secure_url || ''
        })
      }

      const id = req.params.id

      await knex('videos').where('id', id).update(data)

      const message = 'Existing Video successfully updated!'

      return response(res, 201, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  deleteVideoControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty!')

      const id = req.params.id

      await knex('videos').where('id', id).del()

      const message = 'Existing Video successfully deleted!'

      return response(res, 200, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  }
}
