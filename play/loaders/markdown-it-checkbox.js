
function checkboxReplace (md) {
  let lastId = 0
  const arrayReplaceAt = md.utils.arrayReplaceAt
  const options = {
    divWrap: false
  }
  const pattern = /\[(X|\s|_|-)\]\s(.*)/i

  function splitTextToken (original, Token) {
    let ref, token
    const text = original.content
    const nodes = []
    const matches = text.match(pattern)
    const value = matches[1]
    const label = matches[2]
    const checked = (ref = value === 'X' || value === 'x') != null
      ? ref
      : {
          true: false
        }

    /**
     * <div class="checkbox">
     */
    if (options.divWrap) {
      token = new Token('checkbox_open', 'div', 1)
      token.attrs = [['class', 'checkbox']]
      nodes.push(token)
    }

    /**
     * <input type="checkbox" id="checkbox{n}" checked="true">
     */
    const id = 'checkbox' + lastId
    lastId += 1
    token = new Token('checkbox_input', 'input', 0)
    token.attrs = [['type', 'checkbox'], ['id', id], ['disabled', true]]
    if (checked === true) {
      token.attrs.push(['checked', 'true'])
    }
    nodes.push(token)

    /**
     * <label for="checkbox{n}">
     */
    token = new Token('label_open', 'label', 1)
    token.attrs = [['for', id]]
    nodes.push(token)

    /**
     * content of label tag
     */
    token = new Token('text', '', 0)
    token.content = label
    nodes.push(token)

    /**
     * closing tags
     */
    nodes.push(new Token('label_close', 'label', -1))
    if (options.div_wrap) {
      nodes.push(new Token('checkbox_close', 'div', -1))
    }
    return nodes
  };

  return function (state) {
    let i, token, tokens
    const blockTokens = state.tokens
    let j = 0
    const l = blockTokens.length
    while (j < l) {
      if (blockTokens[j].type !== 'inline') {
        j++
        continue
      }
      tokens = blockTokens[j].children
      i = tokens.length - 1
      while (i >= 0) {
        token = tokens[i]
        if (token.type === 'text' && pattern.test(token.content)) {
          blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, splitTextToken(token, state.Token))
        }
        i--
      }
      j++
    }
  }
};

module.exports = function (md) {
  md.core.ruler.push('checkbox', checkboxReplace(md))
}
