const tap = require('tap');
const JSOB = require('../');

(function () {
  let text = `{
    a: 1,
    b: "foo",
    // there's a comment
    c: { "a": 1 },
    d: [1, 2, "foo", [1]],
    "e": true,
    'key with a space': 42,
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
  tap.equal(o['key with a space'], 42);

  // check passthrough serialization
  tap.equal(JSOB.stringify(o, null, 2), JSON.stringify(o, null, 2));
})();

// assorted errors
tap.throws(() => JSOB.parse('[]'), 'Invalid outer type: ArrayExpression');
tap.throws(() => JSOB.parse('{ a: function () {} }'));
tap.throws(() => JSOB.parse('{ a: /abc/ }'));
tap.throws(() => JSOB.parse('{a:1'));
tap.throws(() => JSOB.parse(''));
