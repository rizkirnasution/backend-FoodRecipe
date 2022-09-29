const knex = require('../config/knex')
const response = require('../helpers/response')
const createErrors = require('http-errors')
const n = require('nested-knex')

module.exports = {
  getAllBookmarkerControllers: async (req, res) => {
    try {
      const queryParams = req.query
      let result = ''
      let totalRows = 0
      let rowsWithoutLimit = ''

      if (!queryParams) {
        result = await n.array(
          n.type({
            id: n.number('B.id', { id: true }),
            bookmarker: n.type({
              id: n.number('U.id', { id: true }),
              name: n.string('U.name'),
              email: n.string('U.email'),
              picture: n.string('U.picture'),
              phone: n.string('U.phone')
            }),
            recipes: n.array(n.type({
              id: n.number('R.id', { id: true }),
              title: n.string('R.title'),
              ingredient: n.string('R.ingredient'),
              category: n.string('R.category'),
              thumbnail: n.string('R.thumbnail'),
              videos: n.array(n.type({
                id: n.number('V.id', { id: true }),
                title: n.string('V.title'),
                thumbnail: n.string('V.thumbnail'),
                url: n.string('V.url'),
                created_at: n.date('V.created_at'),
                updated_at: n.date('V.updated_at')
              })),
              creator: n.type({
                id: n.number('UR.id', { id: true }),
                name: n.string('UR.name'),
                email: n.string('UR.email'),
                picture: n.string('UR.picture'),
                phone: n.string('UR.phone')
              }),
              created_at: n.date('R.created_at'),
              updated_at: n.date('R.updated_at')
            })),
            created_at: n.date('B.created_at'),
            updated_at: n.date('B.updated_at')
          })
        )
          .withQuery(
            knex('bookmarkers as B')
              .innerJoin('users as U', 'B.user_id', 'U.id')
              .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
              .innerJoin('videos as V', 'V.recipe_id', 'R.id')
              .innerJoin('users as UR', 'R.creator_id', 'UR.id')
          )

        rowsWithoutLimit = result
      } else {
        if (queryParams?.search) {
          result = await n.array(
            n.type({
              id: n.number('B.id', { id: true }),
              bookmarker: n.type({
                id: n.number('U.id', { id: true }),
                name: n.string('U.name'),
                email: n.string('U.email'),
                picture: n.string('U.picture'),
                phone: n.string('U.phone')
              }),
              recipes: n.array(n.type({
                id: n.number('R.id', { id: true }),
                title: n.string('R.title'),
                ingredient: n.string('R.ingredient'),
                category: n.string('R.category'),
                thumbnail: n.string('R.thumbnail'),
                videos: n.array(n.type({
                  id: n.number('V.id', { id: true }),
                  title: n.string('V.title'),
                  thumbnail: n.string('V.thumbnail'),
                  url: n.string('V.url'),
                  created_at: n.date('V.created_at'),
                  updated_at: n.date('V.updated_at')
                })),
                creator: n.type({
                  id: n.number('UR.id', { id: true }),
                  name: n.string('UR.name'),
                  email: n.string('UR.email'),
                  picture: n.string('UR.picture'),
                  phone: n.string('UR.phone')
                }),
                created_at: n.date('R.created_at'),
                updated_at: n.date('R.updated_at')
              })),
              created_at: n.date('B.created_at'),
              updated_at: n.date('B.updated_at')
            })
          )
            .withQuery(
              knex('bookmarkers as B')
                .innerJoin('users as U', 'B.user_id', 'U.id')
                .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
                .innerJoin('videos as V', 'V.recipe_id', 'R.id')
                .innerJoin('users as UR', 'R.creator_id', 'UR.id')
                .whereILike('U.name', `%${queryParams.search}%`)
                .orWhereILike('U.email', `%${queryParams.search}%`)
                .orWhereILike('U.phone', `%${queryParams.search}%`)
                .orWhereILike('UR.name', `%${queryParams.search}%`)
                .orWhereILike('UR.email', `%${queryParams.search}%`)
                .orWhereILike('UR.phone', `%${queryParams.search}%`)
                .orWhereILike('R.title', `%${queryParams.search}%`)
                .orWhereILike('R.ingredient', `%${queryParams.search}%`)
                .orWhereILike('R.category', `%${queryParams.search}%`)
                .orWhereILike('V.title', `%${queryParams.search}%`)
                .orderBy(`${queryParams?.orderBy ? `B.${queryParams?.orderBy}` : 'B.id'}`, `${queryParams?.sortBy || 'desc'}`)
                .limit(`${parseInt(queryParams?.limit) || 'NULL'}`)
                .offset(`${Math.max(((parseInt(queryParams?.limit) || 10) * (parseInt(queryParams?.page) || 0)) - (parseInt(queryParams?.limit) || 10), 0)}`)
            )

          rowsWithoutLimit = await n.array(
            n.type({
              id: n.number('B.id', { id: true }),
              bookmarker: n.type({
                id: n.number('U.id', { id: true }),
                name: n.string('U.name'),
                email: n.string('U.email'),
                picture: n.string('U.picture'),
                phone: n.string('U.phone')
              }),
              recipes: n.array(n.type({
                id: n.number('R.id', { id: true }),
                title: n.string('R.title'),
                ingredient: n.string('R.ingredient'),
                category: n.string('R.category'),
                thumbnail: n.string('R.thumbnail'),
                videos: n.array(n.type({
                  id: n.number('V.id', { id: true }),
                  title: n.string('V.title'),
                  thumbnail: n.string('V.thumbnail'),
                  url: n.string('V.url'),
                  created_at: n.date('V.created_at'),
                  updated_at: n.date('V.updated_at')
                })),
                creator: n.type({
                  id: n.number('UR.id', { id: true }),
                  name: n.string('UR.name'),
                  email: n.string('UR.email'),
                  picture: n.string('UR.picture'),
                  phone: n.string('UR.phone')
                }),
                created_at: n.date('R.created_at'),
                updated_at: n.date('R.updated_at')
              })),
              created_at: n.date('B.created_at'),
              updated_at: n.date('B.updated_at')
            })
          )
            .withQuery(
              knex('bookmarkers as B')
                .innerJoin('users as U', 'B.user_id', 'U.id')
                .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
                .innerJoin('videos as V', 'V.recipe_id', 'R.id')
                .innerJoin('users as UR', 'R.creator_id', 'UR.id')
                .whereILike('U.name', `%${queryParams.search}%`)
                .orWhereILike('U.email', `%${queryParams.search}%`)
                .orWhereILike('U.phone', `%${queryParams.search}%`)
                .orWhereILike('UR.name', `%${queryParams.search}%`)
                .orWhereILike('UR.email', `%${queryParams.search}%`)
                .orWhereILike('UR.phone', `%${queryParams.search}%`)
                .orWhereILike('R.title', `%${queryParams.search}%`)
                .orWhereILike('R.ingredient', `%${queryParams.search}%`)
                .orWhereILike('R.category', `%${queryParams.search}%`)
                .orWhereILike('V.title', `%${queryParams.search}%`)
                .orderBy(`${queryParams?.orderBy ? `B.${queryParams?.orderBy}` : 'B.id'}`, `${queryParams?.sortBy || 'desc'}`)
            )
        } else {
          result = await n.array(
            n.type({
              id: n.number('B.id', { id: true }),
              bookmarker: n.type({
                id: n.number('U.id', { id: true }),
                name: n.string('U.name'),
                email: n.string('U.email'),
                picture: n.string('U.picture'),
                phone: n.string('U.phone')
              }),
              recipes: n.array(n.type({
                id: n.number('R.id', { id: true }),
                title: n.string('R.title'),
                ingredient: n.string('R.ingredient'),
                category: n.string('R.category'),
                thumbnail: n.string('R.thumbnail'),
                videos: n.array(n.type({
                  id: n.number('V.id', { id: true }),
                  title: n.string('V.title'),
                  thumbnail: n.string('V.thumbnail'),
                  url: n.string('V.url'),
                  created_at: n.date('V.created_at'),
                  updated_at: n.date('V.updated_at')
                })),
                creator: n.type({
                  id: n.number('UR.id', { id: true }),
                  name: n.string('UR.name'),
                  email: n.string('UR.email'),
                  picture: n.string('UR.picture'),
                  phone: n.string('UR.phone')
                }),
                created_at: n.date('R.created_at'),
                updated_at: n.date('R.updated_at')
              })),
              created_at: n.date('B.created_at'),
              updated_at: n.date('B.updated_at')
            })
          )
            .withQuery(
              knex('bookmarkers as B')
                .innerJoin('users as U', 'B.user_id', 'U.id')
                .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
                .innerJoin('videos as V', 'V.recipe_id', 'R.id')
                .innerJoin('users as UR', 'R.creator_id', 'UR.id')
                .orderBy(`${queryParams?.orderBy ? `B.${queryParams?.orderBy}` : 'B.id'}`, `${queryParams?.sortBy || 'desc'}`)
                .limit(`${parseInt(queryParams?.limit) || 'NULL'}`)
                .offset(`${Math.max(((parseInt(queryParams?.limit) || 10) * (parseInt(queryParams?.page) || 0)) - (parseInt(queryParams?.limit) || 10), 0)}`)
            )

          rowsWithoutLimit = await n.array(
            n.type({
              id: n.number('B.id', { id: true }),
              bookmarker: n.type({
                id: n.number('U.id', { id: true }),
                name: n.string('U.name'),
                email: n.string('U.email'),
                picture: n.string('U.picture'),
                phone: n.string('U.phone')
              }),
              recipes: n.array(n.type({
                id: n.number('R.id', { id: true }),
                title: n.string('R.title'),
                ingredient: n.string('R.ingredient'),
                category: n.string('R.category'),
                thumbnail: n.string('R.thumbnail'),
                videos: n.array(n.type({
                  id: n.number('V.id', { id: true }),
                  title: n.string('V.title'),
                  thumbnail: n.string('V.thumbnail'),
                  url: n.string('V.url'),
                  created_at: n.date('V.created_at'),
                  updated_at: n.date('V.updated_at')
                })),
                creator: n.type({
                  id: n.number('UR.id', { id: true }),
                  name: n.string('UR.name'),
                  email: n.string('UR.email'),
                  picture: n.string('UR.picture'),
                  phone: n.string('UR.phone')
                }),
                created_at: n.date('R.created_at'),
                updated_at: n.date('R.updated_at')
              })),
              created_at: n.date('B.created_at'),
              updated_at: n.date('B.updated_at')
            })
          )
            .withQuery(
              knex('bookmarkers as B')
                .innerJoin('users as U', 'B.user_id', 'U.id')
                .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
                .innerJoin('videos as V', 'V.recipe_id', 'R.id')
                .innerJoin('users as UR', 'R.creator_id', 'UR.id')
                .orderBy(`${queryParams?.orderBy ? `B.${queryParams?.orderBy}` : 'B.id'}`, `${queryParams?.sortBy || 'desc'}`)
            )
        }
      }

      totalRows = rowsWithoutLimit.length

      const totalActiveRows = result.length
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

      return response(res, 200, result || [], pagination)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  getBookmarkerByUserIdControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const user = req.userData
      const userId = params.userId

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty')

      if (user.id !== userId) throw new createErrors.UnavailableForLegalReasons('Failed to get bookmark, your\'e not the bookmarker')

      const result = await n.array(
        n.type({
          id: n.number('B.id', { id: true }),
          bookmarker: n.type({
            id: n.number('U.id', { id: true }),
            name: n.string('U.name'),
            email: n.string('U.email'),
            picture: n.string('U.picture'),
            phone: n.string('U.phone')
          }),
          recipes: n.array(n.type({
            id: n.number('R.id', { id: true }),
            title: n.string('R.title'),
            ingredient: n.string('R.ingredient'),
            category: n.string('R.category'),
            thumbnail: n.string('R.thumbnail'),
            videos: n.array(n.type({
              id: n.number('V.id', { id: true }),
              title: n.string('V.title'),
              thumbnail: n.string('V.thumbnail'),
              url: n.string('V.url'),
              created_at: n.date('V.created_at'),
              updated_at: n.date('V.updated_at')
            })),
            creator: n.type({
              id: n.number('UR.id', { id: true }),
              name: n.string('UR.name'),
              email: n.string('UR.email'),
              picture: n.string('UR.picture'),
              phone: n.string('UR.phone')
            }),
            created_at: n.date('R.created_at'),
            updated_at: n.date('R.updated_at')
          })),
          created_at: n.date('B.created_at'),
          updated_at: n.date('B.updated_at')
        })
      )
        .withQuery(
          knex('bookmarkers as B')
            .innerJoin('users as U', 'B.user_id', 'U.id')
            .innerJoin('recipes as R', 'B.recipe_id', 'R.id')
            .innerJoin('videos as V', 'V.recipe_id', 'R.id')
            .innerJoin('users as UR', 'R.creator_id', 'UR.id')
            .where('B.user_id', userId)
        )

      return response(res, 200, result || [])
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  postBookmarkerControllers: async (req, res) => {
    try {
      const data = req.body
      const bodyLength = Object.keys(data).length
      const user = req.userData
      const existingBookmarker = await knex.select('id').from('bookmarkers').where('recipe_id', data?.recipe_id).andWhere('user_id', user.id).first()
      const checkRecipe = await knex.select('id').from('recipes').where('id', data?.recipe_id).first()

      if (!bodyLength) throw new createErrors.BadRequest('Request body empty')

      if (existingBookmarker?.id) throw new createErrors.Conflict('Recipe already bookmarked')

      if (!checkRecipe?.id) throw new createErrors.UnprocessableEntity('Recipe unavailable on server')

      const insertNewBookmarkers = {
        user_id: user.id,
        recipe_id: data.recipe_id
      }
      const result = await knex('bookmarkers').insert(insertNewBookmarkers).returning('id')

      if (!result) throw new createErrors.UnprocessableEntity('Failed to bookmark this recipe')

      const message = 'Bookmarked recipe'

      return response(res, 201, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  },
  deleteBookmarkerControllers: async (req, res) => {
    try {
      const params = req.params
      const paramsLength = Object.keys(params).length
      const user = req.userData
      const bookmarker = req.bookmarkerData

      if (!paramsLength) throw new createErrors.BadRequest('Request parameters empty')

      if (user.id !== bookmarker.user) throw new createErrors.UnavailableForLegalReasons('You\'re not the bookmarker of this recipe')

      const id = req.params.id
      const result = await knex('bookmarkers').where('id', id).del().returning('id')

      if (!result) throw new createErrors.UnprocessableEntity('Failed to remove bookmark of recipe')

      const message = 'Bookmark recipe removed'

      return response(res, 200, message)
    } catch (error) {
      return response(res, error.status || 500, {
        message: error.message || error
      })
    }
  }
}
