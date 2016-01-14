import hook from '..'
import assert from 'assert'
import assign from 'lodash.assign'

function prepare(options) {
  hook(assign({extensions: ['.txt']}, options))
  return require('./file.txt')
}

function reset() {
  delete require.cache[require.resolve('./file.txt')]
}

describe('asset-require-hook', function() {
  afterEach(() => reset())

  context('when a `limit` option is not provided', () => {
    it('returns a data url', () => {
      assert.equal(prepare(), 'data:text/plain;base64,WW8hCg==')
    })

    it('accepts a custom mimetype', () => {
      assert.equal(prepare({ mimetype: 'text/html' }), 'data:text/html;base64,WW8hCg==')
    })
  })

  context('when a `limit` option is provided', () => {
    it('returns a data url if limit is zero', () => {
      assert.equal(prepare({ limit: 0 }), 'data:text/plain;base64,WW8hCg==')
    })

    it('does not return a data url if file size exceeds limit', () => {
      assert.notEqual(prepare({ limit: 3 }), 'data:text/plain;base64,WW8hCg==')
    })

    it('does not return a data url if limit is negative', () => {
      assert.notEqual(prepare({ limit: -1 }), 'data:text/plain;base64,WW8hCg==')
    })

    it('accepts a custom mimetype', () => {
      assert.equal(prepare({ limit: 0, mimetype: 'text/html' }), 'data:text/html;base64,WW8hCg==')
    })
  })

  context('when data urls are disabled', () => {
    it('returns the MD5 hash of the file\'s content by default', () => {
      assert.equal(prepare({ limit: -1 }), '2b54866f5a487761c94e6ad634b7bf1d.txt')
    })

    it('accepts template placeholders', () => {
      let name = prepare({ limit: -1, name: '[name]-[hash].[ext]' })
      assert.equal(name, 'file-2b54866f5a487761c94e6ad634b7bf1d.txt')
    })
  })
})
