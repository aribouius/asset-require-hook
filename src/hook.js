export default function addHook(extension, compile) {
  require.extensions[extension] = function hook(module, file) {
    const url = compile(file)
    return module._compile('module.exports = ' + JSON.stringify(url), file)
  }
}
