const response = require('../helpers/response')
const createErrors = require('http-errors')
const argon2 = require('argon2')
const cloudinary = require('cloudinary')
const knex = require('../config/knex')
const fs = require('node:fs')

module.exports = {
  getProfileControllers: async (req, res) => {
    try {
      const userData = req.userData
      const id = userData?.id
      const user = await knex.select().from('users').where('id', id).first()

      delete user?.password
      delete user?.refresh_token
      delete user?.verification_code

      if (!user) throw new createErrors.ExpectationFailed('Unregistered account')

      return response(res, 200, user)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  editProfileControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const data = req.body
      const bodyLength = Object.keys(data).length
      const file = req.files?.picture || {}
      const id = params.id
      const userData = req.userData

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty')

      if (!bodyLength) throw new createErrors.BadRequest('Request body empty')

      const user = await knex.select('name').from('users').where('id', id).first()

      if (!user) throw new createErrors.ExpectationFailed('Unregistered account')

      if (userData.id !== id) throw new createErrors.ExpectationFailed('Your profile ID did not match with session')

      if (data?.password) {
        const hashPassword = await argon2.hash(data.password, { type: argon2.argon2id })

        data.password = hashPassword
      }

      if (file.length) {
        cloudinary.v2.config({ secure: true })

        await cloudinary.v2.uploader.upload(file[0].path, {
          use_filename: false,
          unique_filename: true,
          overwrite: true
        }, (pictureError, pictureResponse) => {
          if (pictureError) throw new createErrors.UnsupportedMediaType(`Profile picture: ${pictureError.message}`)

          fs.unlinkSync(file[0].path)

          data.picture = pictureResponse.secure_url || ''
        })
      }

      const result = await knex('users').where('id', id).update(data).returning('name')

      const message = `Profile: ${result[0].name}, successfully updated`

      return response(res, 200, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  }
}
