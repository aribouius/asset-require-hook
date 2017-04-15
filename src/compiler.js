import { readFileSync } from 'fs'
import { interpolateName } from 'loader-utils'
import assign from 'lodash.assign'

export default function compiler(name, options) {
  return function compile(file) {
    const { limit, publicPath, mimetype } = options
    const content = readFileSync(file)

    if (limit !== undefined) {
      const max = parseInt(limit || 0, 10)
      if (max <= 0 || content.length < max) {
        const mime = mimetype || require('mime').lookup(file)
        return `data:${mime ? mime + ';' : ''}base64,${content.toString('base64')}`
      }
    }

    const context = {
      resourcePath: file,
    }

    let result = interpolateName(context, name, {
      content: content,
    })

    if (publicPath) {
      result = typeof publicPath === 'function' ? publicPath(result) : `${publicPath}${result}`
    }

    return result
  }
}
