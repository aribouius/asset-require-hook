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

  it('returns the MD5 hash of the file\'s content by default', () => {
    assert.equal(prepare(), '2b54866f5a487761c94e6ad634b7bf1d.txt')
  })

  it('accepts a `name` parameter with template placeholders', () => {
    let name = prepare({ name: '[name]-[hash].[ext]' })
    assert.equal(name, 'file-2b54866f5a487761c94e6ad634b7bf1d.txt')
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
