const { parse, baseCompile } = require('@vue/compiler-dom');

module.exports = function(source) {
  const [svgAst] = parse(source).children;

  const svgProps = svgAst.props.reduce((props, { name, value }) => {
    props[name] = value.content;
    return props;
  }, {});

  const svgChildren = svgAst.children.map((child) => {
    const renderFn = baseCompile(child.loc.source, {
      prefixIdentifiers: true
    }).code;

    return `() => {${renderFn}}`;
  });

  return `
  import * as Vue from 'vue';

  export default function(props, { attrs }) {
    return Vue.h(
      'svg',
      Vue.mergeProps(${JSON.stringify(svgProps)}, attrs),
      [${svgChildren}].map((child) => Vue.h(child()))
    );
  }`;
};
