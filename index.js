const { compile } = require('vue-template-compiler');

function transformChildren(value) {
  const chilldren = value.reduce((acc, child) => {
    if(child.text) {
      acc.push(`_v('${child.text}')`);
    } else {
      const args = [`'${child.tag}'`];

      if(Object.keys(child.attrsMap).length) {
        const data = [];

        if(child.staticClass) {
          data.push(`staticClass:${child.staticClass}`);
        }

        if(child.staticStyle) {
          data.push(`staticStyle:${child.staticStyle}`);
        }

        if(child.attrsList.length) {
          const attrs = child.attrsList.reduce((v, attr) => ({
            ...v,
            [attr.name]: attr.value,
          }), {});

          data.push(`attrs:${JSON.stringify(attrs)}`);
        }

        if(data.length) {
          args.push(`{${data.join()}}`);
        }
      }

      if(child.children.length) {
        args.push(transformChildren(child.children));
      }

      acc.push(`_c(${args.join()})`);
    }

    return acc;
  }, []);

  return `[${chilldren.join()}]`;
}

const stringify = (value) => value.filter((item) => item).join();

module.exports = (result) => {
  const { ast } = compile(result, {
    preserveWhitespace: false,
  });

  const children = ast.children.length
    ? `children.concat(${transformChildren(ast.children)})`
    : 'children';

  const attrs = Object.keys(ast.attrsMap).length
    ? `attrs: Object.assign(${JSON.stringify(ast.attrsMap)}, attrs)`
    : 'attrs';

  const classNames = stringify([ast.staticClass, 'classNames', 'staticClass']);
  const styles = stringify([ast.staticStyle, 'style', 'staticStyle']);

  return `
    module.exports = {
      functional: true,
      render(_h, { _c, _v, data, children = [] }) {
        const {
          class: classNames,
          staticClass,
          style,
          staticStyle,
          attrs = {},
          ...rest
        } = data;

        return _c('svg', {
          class: [${classNames}],
          style: [${styles}],
          ${attrs},
          ...rest,
        }, ${children})
      }
    }
  `;
}
