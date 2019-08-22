const acorn = require('acorn');

// Punt! All JSOB is JSON, so this counts.
exports.stringify = function (...args) {
  return JSON.stringify(...args);
}

exports.parse = function parse(string) {

  let ast;
  try {
    ast = acorn.parseExpressionAt(string, 0);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`Syntax error during parsing: ${e.message}`);
    }
    throw new Error(`Error during parsing: ${e.message}`);
  }

  if (ast.type !== 'ObjectExpression') {
    throw new Error('Invalid top-level value: ' + ast.type);
  }
  
  // All valid value types.
  function walkValue(val, string='') {
    switch (val.type) {
      case 'Literal':
        if (val.regex) {
          throw new Error(`Error at ${string}: Value cannot be a Regular Expression`);
        }
        return val.value;
      case 'FunctionExpression':
        throw new Error(`Error at ${string}: Value cannot be a Function`);
      case 'ObjectExpression':
        return walkObject(val, string);
      case 'ArrayExpression':
        return walkArray(val, string);
      case 'TemplateLiteral':
        // use only the first quasi
        return val.quasis[0].value.cooked;
    }
    throw new Error(`Error at ${string}: Invalid value of type ${val.type}`);
  }
  
  function walkObject(obj, string='') {
    return obj.properties.reduce((o, prop) => {
      if (prop.type !== 'Property') {
        throw new Error(`Error at ${string}: Invalid property type: ${prop.type}`);
      }
      let key;
      if (prop.key.type === 'Identifier') {
        key = prop.key.name;
      } else if (prop.key.type === 'Literal') {
        key = prop.key.value;
      } else {
        throw new Error(`Error at ${string}: Invalid key type: ${prop.type}`);
      }
      o[key] = walkValue(prop.value, string + '.' + key);
      return o;
    }, {});
  }
  
  function walkArray(arr, string='') {
    return arr.elements.map((val, i) => walkValue(val, string + '[' + i + ']'));
  }
  
  return walkObject(ast);
}
