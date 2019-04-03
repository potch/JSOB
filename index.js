const acorn = require('acorn');

// Punt! All JSOB is JSON, so this counts.
exports.stringify = function (...args) {
  return JSON.stringify(...args);
}

exports.parse = function parse(string) {

  let ast = acorn.parseExpressionAt(string, 0);

  if (ast.type !== 'ObjectExpression') {
    throw new Error('Invalid Outer Type: ' + ast.type);
  }
  
  // All valid value types.
  function walkValue(val) {
    switch (val.type) {
      case 'Literal':
        if (val.regex) {
          throw new Error('Sorry, no RegExp Support!');
        }
        return val.value;
      case 'ObjectExpression':
        return walkObject(val);
      case 'ArrayExpression':
        return walkArray(val);
      case 'TemplateLiteral':
        // use only the first quasi
        return val.quasis[0].value.cooked;
    }
    throw new Error('Invalid Value Type: ' + val.type);
  }
  
  function walkObject(obj) {
    return obj.properties.reduce((o, prop) => {
      if (prop.type !== 'Property') {
        throw new Error('Invalid Property Type: ' + prop.type);
      }
      let key;
      if (prop.key.type === 'Identifier') {
        key = prop.key.name;
      } else if (prop.key.type === 'Literal') {
        key = prop.key.value;
      } else {
        throw new Error('Invalid Key Type: ' + prop.key.type);
      }
      o[key] = walkValue(prop.value);
      return o;
    }, {});
  }
  
  function walkArray(arr) {
    return arr.elements.map(walkValue);
  }
  
  return walkObject(ast);
}
