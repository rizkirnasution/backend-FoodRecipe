module.exports = {
  mappingKey: (object = {}) => {
    return Object.keys(object)
      .map(key => `${key}${object[key]}`)
      .join('')
  },
  changeExt: (fileName, newExt) => {
    const pos = fileName.includes('.') ? fileName.lastIndexOf('.') : fileName.length
    const fileRoot = fileName.substr(0, pos)
    const output = `${fileRoot}.${newExt}`

    return output
  },
  pruneObject: (object, desiredKeys) => {
    Object.keys(object)
      .filter(key => !desiredKeys.includes(key))
      .forEach(key => delete object[key])
  }
}
