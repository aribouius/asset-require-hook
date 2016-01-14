import { readFileSync } from 'fs'
import { interpolateName } from 'loader-utils'
import assign from 'lodash.assign'

export default function compiler(name, options) {
  return function compile(file) {
    let content = readFileSync(file)

    if (options.limit !== undefined) {
      let limit = parseInt(options.limit || 0, 10)
      if (limit <= 0 || content.length < limit) {
        const mime = options.mimetype || require('mime').lookup(file)
        return `data:${mime ? mime + ';' : ''}base64,${content.toString('base64')}`
      }
    }

    const context = { resourcePath: file }
    return interpolateName(context, name, assign({}, options, {
      content: content
    }))
  }
}
