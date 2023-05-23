const MarkdownIt = require('markdown-it')
const MarkdownItCheckbox = require('./markdown-it-checkbox')
const markdownIt = new MarkdownIt().use(MarkdownItCheckbox)

module.exports = function (source) {
  const content = markdownIt.render(source)
  const code = `export default ${JSON.stringify(content)}`
  return code
}
