const tap = require('tap');
const JSOB = require('../');

let text = `{
  a: 1,
  b: "foo",
  // there's a comment
  c: { "a": 1 },
  d: [1, 2, "foo", [1]],
  "e": true,
  'key with a space': false,
  f: \`
    this is a
    multiline string
  \`,
}`;
let o = JSOB.parse(text);
// check structure
tap.equal(o.a, 1);
tap.equal(o.b, 'foo');
tap.equal(typeof o.c, 'object');
tap.equal(o.c.a, 1);
tap.equal(o.d instanceof Array, true);
tap.equal(o.d.length, 4);
tap.equal(o.d[3][0], 1);
tap.equal(o.e, true);
tap.equal(o['key with a space'], false);

// check passthrough serialization
tap.equal(JSOB.stringify(o, null, 2), JSON.stringify(o, null, 2));

// Objects, not Arrays
tap.throws(() => JSOB.parse('[]'));
