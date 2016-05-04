'use strict'

let fs = require('fs')
let _ = require('lodash')

module.exports = (expressApp, filename) => {

    const COLUMN_WIDTH_TREE = 50
    const COLUMN_WIDTH_PATH = 60
    const TREE_INDENT_SIZE = 5

    let text = []

    function fillWithSpaces(str, len) {
        while (str.length < len) {
            str += ' '
        }
        return str
    }

    function brushIndentation(indentation) {
        return indentation.replace(/─/g, ' ').replace(/├/g, '│').replace(/└/g, ' ')
    }

    function printRoutes(layer, indentation) {

        let path = ' '
        if (layer.path) {
            path += layer.path
        } else if (layer.route && layer.route.path) {
            path += layer.route.path
        } else if (layer.regexp) {
            if (layer.regexp.source === '^\\/?$') {
                path += '/'
            } else if (layer.regexp.source === '^\\/?(?=\\/|$)') {
                path += '*'
            } else {
                path += `/${ layer.regexp.source }/`
            }
        }

        let methods = []
        if (layer.method) {
            methods.push(layer.method)
        } else if (layer.route) {
            if (layer.route.methods) {
                methods = _.keys(layer.route.methods)
            } else if (layer.route.method) {
                methods.push(layer.route.method)
            }
        }
        methods = methods.join(', ').toUpperCase()

        text.push(`${ fillWithSpaces(indentation + layer.name, COLUMN_WIDTH_TREE) }${ fillWithSpaces(path, COLUMN_WIDTH_PATH) } ${ methods }`)

        if (!layer.stack && !(layer.route && layer.route.stack)) {
            if (layer.handle.stack) {
                return printRoutes(layer.handle, brushIndentation(indentation))
            }
            return
        }

        indentation = `${ brushIndentation(indentation) } ├── `

        let stack = layer.stack || layer.route.stack
        for ( let i = 0; i < stack.length; i+=1 ) {
            if (i === stack.length - 1) {
                indentation = `${ indentation.substr(0, indentation.length - TREE_INDENT_SIZE) } └── `
            }
            printRoutes(stack[i], indentation)
        }

        text.push(indentation.substr(0, indentation.length - TREE_INDENT_SIZE))

    }

    printRoutes(expressApp._router, '')

    fs.writeFile(filename, text.join('\n'), (err) => {
        /* istanbul ignore if */
        if (err) {
            console.error(`Failed to print routes to ${ filename }`)
        } else {
            console.log(`Printed routes to ${ filename }`)
        }
    })

}
