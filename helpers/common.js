module.exports = {
  queryWithValue: (body) => {
    return Object.keys(body).map(function (key) {
      return body[key]
    })
  },
  mappingKey: (object = {}) => {
    return Object.keys(object)
      .map(key => `${key}${object[key]}`)
      .join('')
  }
}
