var test = require('tape')
var parse = require('../parser')

var fs = require('fs')
var path = require('path')

var fixturesDir = path.join(__dirname, 'fixtures/shellcheck-tests')
var fixtureDirs = fs.readdirSync(fixturesDir)

test('shellcheck fixtures', function(t) {
  t.plan(fixtureDirs.length)
  fixtureDirs.forEach(function (dir) {
    var fixtureDir = path.join(fixturesDir, dir)

    var source = fs.readFileSync(path.join(fixtureDir, 'source.sh'), 'utf8')

    var error, ast;
    try { error = require(path.join(fixtureDir, 'error.json')) } catch (e) {}
    if (!error) {
      try { ast = require(path.join(fixtureDir, 'ast.json')) } catch (e) {}
    }

    if (error) {
      t.throws(function() {
        parse(source)
      }, error.message ? new RegExp(error.message) : undefined, dir + ' errored')
    } else if (ast) {
      t.deepEqual(parse(source), ast, dir)
    } else {
      try {
        parse(source)
        t.pass(dir + ': parsed sucessfully')
      } catch (e) {
        if (e instanceof parse.SyntaxError) {
          t.fail('parse failed')
          formatParseError(dir, source, e)
        } else {
          throw e
        }
      }
    }

  })
  t.end()

})

function formatParseError (dir, source, err) {
  var msg = dir + ': ' + err.message
  var start = Math.max(0, err.offset - 8)
  msg += '\n  ' + source.slice(start, start + 10).trim() + '\n'
  for (var i = 0; i <= (err.column - start); i++) msg += '-';
  msg += '^'
  console.error(msg)
}
