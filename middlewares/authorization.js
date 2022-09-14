const response = require('../helpers/response')
const createErrors = require('http-errors')
const knex = require('../config/knex')

module.exports = {
  grantedAll: async (req, res, next) => {
    try {
      const email = req.userData.email
      const checkUser = await knex.select('role').from('users').where('email', email).first()

      if (!checkUser) throw new createErrors.Unauthorized('Access denied, account unregistered!')

      const { role } = checkUser

      switch (role) {
        case 'user':
          return next()
        case 'creator':
          return next()

        default:
          throw new createErrors.Unauthorized('Access denied, who are you?')
      }
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  },
  grantedOnlyCreator: async (req, res, next) => {
    try {
      const email = req.userData.email
      const checkUser = await knex.select('role').from('users').where('email', email).first()

      if (!checkUser) throw new createErrors.Unauthorized('Access denied, account unregistered!')

      const { role } = checkUser

      switch (role) {
        case 'creator':
          return next()

        default:
          throw new createErrors.Unauthorized('Access denied, who are you?')
      }
    } catch (error) {
      return response(res, error.status, {
        message: error.message || error
      })
    }
  }
}
