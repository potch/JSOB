# JSOB - JavaScript OBject literal notation

[![jsob on npm](https://img.shields.io/npm/v/jsob.svg)](https://www.npmjs.com/package/jsob)

Like JSON, but a bit less of a pain. Uses an actual JS parser ([acorn](https://github.com/acornjs/acorn)) to read object literal syntax (including comments!), *without* running the code. Only supports JSON-compatible types (numbers, boolean, strings, objects, and arrays). No need to worry about quoting keys and all that junk. If it's valid JS, it should be valid JSOB!

[📦 JSOB package](https://www.npmjs.com/package/jsob)

**This project is not particularly well tested, so maybe don't use it in prod!**

Here's some JSOB:

```js
{
  msg: 'hello!',
  'quotes': "optional but fine!",
  // this is a comment!! wowww
  'multiline support': `
    Yup! You can't use tags or substitutions,
    but otherwise go for it.
  `,
  // why not have a trailing comma while we're at it?
  last: 'property',
}
```

## Usage

```js
const JSOB = require('JSOB');

let obj = JSOB.parse(`{
  msg: 'hello!',
}`);
```

## TODO

* much, much bigger test suite
* non-JSON serialization with options
* self-contained parser- we don't technically need a *whole* JS parser so this could be a much smaller package
