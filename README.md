# asset-require-hook
A require hook for importing asset files as paths during runtime.

## Features
Allows files required by node that match a given set of extensions to be returned as either a data URI, or a custom filename. Meant be used in conjunction with [file-loader](https://github.com/webpack/file-loader) or [url-loader](https://github.com/webpack/url-loader) when building [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9#.ttz58ohle) apps.

## Requirements
Using this tool requires [Node.js v0.12.x](https://github.com/nodejs/node) or higher.

## Installation
```bash
$ npm install asset-require-hook
```

## Usage
```javascript
require('asset-require-hook')({
  extensions: ['jpg']
})

// const image = require('./icon.jpg');
```
