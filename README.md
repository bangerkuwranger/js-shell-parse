# shell-parse

Parse bash scripts into AST's

## Synopsis

```ocaml
module.exports := (String) => Object
```

_(better synopsis will come after real tests)_

## Description

This thing parses strings containing bash scripts into an AST that you might
execute using an interpreter or something.

## Example

This structure is in need of some peer review:

```javascript
var parse = require('./build')

var input = [
  "blah >(substitute-command --with args)",
  "first | second",
  "echo ${what/hot/not} ok 'single-quoted arg'\"double-quoted $var\" > here",
].join('\n')

console.log(
  JSON.stringify(parse(input + '\n'), null, 2)
)
```

Output:

```javascript
[
  {
    "type": "command",
    "command": {
      "type": "literal",
      "value": "blah"
    },
    "args": [
      {
        "type": "command-substitution",
        "readWrite": ">",
        "commands": [
          {
            "type": "command",
            "command": {
              "type": "literal",
              "value": "substitute-command"
            },
            "args": [
              {
                "type": "literal",
                "value": "--with"
              },
              {
                "type": "literal",
                "value": "args"
              }
            ],
            "redirects": [],
            "control": null
          }
        ]
      }
    ],
    "redirects": [],
    "control": ";"
  },
  {
    "type": "command",
    "command": {
      "type": "literal",
      "value": "first"
    },
    "args": [],
    "redirects": [
      {
        "type": "pipe",
        "command": {
          "type": "command",
          "command": {
            "type": "literal",
            "value": "second"
          },
          "args": [],
          "redirects": [],
          "control": ";"
        }
      }
    ],
    "control": null
  },
  {
    "type": "command",
    "command": {
      "type": "literal",
      "value": "echo"
    },
    "args": [
      {
        "type": "substitution",
        "expression": "what/hot/not"
      },
      {
        "type": "literal",
        "value": "ok"
      },
      {
        "type": "quotation",
        "pieces": [
          {
            "type": "literal",
            "value": "single-quoted arg"
          },
          {
            "type": "double-quote",
            "contents": [
              {
                "type": "literal",
                "value": "double-quoted "
              },
              {
                "type": "variable",
                "name": "var"
              }
            ]
          }
        ]
      }
    ],
    "redirects": [
      {
        "type": "redirect",
        "op": ">",
        "filename": {
          "type": "literal",
          "value": "here"
        }
      }
    ],
    "control": ";"
  }
]
```

## License

MIT
