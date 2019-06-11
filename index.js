const { compile } = require('vue-template-compiler');

module.exports = function(content) {
  const { render: renderFunction } = compile(content, {
    whitespace: 'condense'
  });

  return `
    module.exports = {
      functional: true,
      render(_h, { _c }) {${renderFunction}}
    }
  `;
}
