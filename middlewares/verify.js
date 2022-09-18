const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { decrypt } = require('../helpers/cryptography')
const createErrors = require('http-errors')
const knex = require('../config/knex')
require('dotenv').config()
const {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_ALGORITHM
} = process.env

module.exports = {
  verifyToken: (req, res, next) => {
    try {
      const token = req.headers.authorization
      const signedCookie = req.signedCookies

      if (!signedCookie?.token) throw new createErrors.Unauthorized('Session unavailable')

      if (typeof token !== 'undefined') {
        const bearer = token.split(' ')
        const bearerToken = bearer[1]

        if (!bearerToken) throw new createErrors.Unauthorized('Empty access token')

        jwt.verify(
          bearerToken,
          JWT_SECRET_KEY,
          { algorithms: JWT_ALGORITHM },
          async (err, result) => {
            if (err) {
              return response(res, err.status || 412, {
                message: err.message || err
              })
            } else {
              const user = await knex.select('id', 'role', 'email').from('users').where('email', result.email).first()

              if (!user) throw new createErrors.Unauthorized('Access denied, account unregistered')

              req.userData = user

              return next()
            }
          }
        )
      } else {
        throw new createErrors.Unauthorized('Bearer token must be conditioned')
      }
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  verifyRefreshToken: (req, res, next) => {
    try {
      const signedCookie = req.signedCookies

      if (!signedCookie?.token) throw new createErrors.PreconditionFailed('Session unavailable')

      const { token } = req.signedCookies

      if (typeof token !== 'undefined') {
        const decryptionTokenFromSignedCookie = decrypt(13, token)

        jwt.verify(
          decryptionTokenFromSignedCookie,
          JWT_REFRESH_SECRET_KEY,
          { algorithms: JWT_ALGORITHM },
          async (err, result) => {
            if (err) {
              throw new createErrors.PreconditionFailed(err.message || err)
            } else {
              req.data = result

              return next()
            }
          }
        )
      } else {
        throw new createErrors.PreconditionFailed('Refresh token must be conditioned')
      }
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  }
}
