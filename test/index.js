import hook from '../src'
import assert from 'assert'
import assign from 'lodash.assign'

function prepare(options) {
  hook(assign({extensions: ['.txt']}, options))
  return require('./assets/file.txt')
}

function reset() {
  delete require.cache[require.resolve('./assets/file.txt')]
}

describe('asset-require-hook', function() {
  afterEach(() => reset())

  it('returns the MD5 hash of the file\'s content by default', () => {
    assert.equal(prepare(), '2b54866f5a487761c94e6ad634b7bf1d.txt')
  })

  it('accepts a `name` parameter with template placeholders', () => {
    const name = prepare({ name: '[name]-[hash].[ext]' })
    assert.equal(name, 'file-2b54866f5a487761c94e6ad634b7bf1d.txt')
  })

  it('supports a string `publicPath` option', () => {
    const name = prepare({ name: '[name].[ext]', publicPath: '/foo/' })
    assert.equal(name, '/foo/file.txt')
  })

  it('supports a function `publicPath` option', () => {
    const name = prepare({ name: '[name].[ext]', publicPath: str => `/bar/${str}` })
    assert.equal(name, '/bar/file.txt')
  })

  it('supports a `regExp` option', () => {
    const name = prepare({ name: '[1]?[hash]', regExp: '\\btest/(.+)' })
    assert.equal(name, 'assets/file.txt?2b54866f5a487761c94e6ad634b7bf1d')
  })

  context('when a `limit` parameter is provided', () => {
    it('returns a data URI if limit is zero', () => {
      assert.equal(prepare({ limit: 0 }), 'data:text/plain;base64,WW8hCg==')
    })

    it('returns a data URI if file size does not exceed limit', () => {
      assert.equal(prepare({ limit: 5 }), 'data:text/plain;base64,WW8hCg==')
    })

    it('does not return a data url if file size exceeds limit', () => {
      assert.equal(prepare({ limit: 3 }), '2b54866f5a487761c94e6ad634b7bf1d.txt')
    })

    it('accepts a `mimetype` parameter', () => {
      assert.equal(prepare({ limit: 0, mimetype: 'text/html' }), 'data:text/html;base64,WW8hCg==')
    })
  })
})
