'use strict';

var fs = require('fs');
var _ = require('lodash');

module.exports = function (expressApp, filename) {

    var text = [];

    function fillWithSpaces(str, len) {
        while (str.length < len) {
            str += ' ';
        }
        return str;
    }

    function brushIndentation(indentation) {
        return indentation.replace(/─/g, ' ').replace(/├/g, '│').replace(/└/g, ' ');
    }

    function printRoutes(layer, indentation) {

        var path = ' ';
        if (layer.path) {
            path += layer.path;
        } else if (layer.route && layer.route.path) {
            path += layer.route.path;
        } else if (layer.regexp) {
            if (layer.regexp.source === '^\\/?$') {
                path += '/';
            } else if (layer.regexp.source === '^\\/?(?=\\/|$)') {
                path += '*';
            } else {
                path += '/' + layer.regexp.source + '/';
            }
        }

        var methods = [];
        if (layer.method) {
            methods.push(layer.method);
        } else if (layer.route) {
            if (layer.route.methods) {
                methods = _.keys(layer.route.methods);
            } else if (layer.route.method) {
                methods.push(layer.route.method);
            }
        }
        methods = methods.join(', ').toUpperCase();

        text.push(fillWithSpaces(indentation + layer.name, 50) + fillWithSpaces(path, 60) + ' ' + methods);

        if (!layer.stack && !(layer.route && layer.route.stack)) {
            if (layer.handle.stack) {
                return printRoutes(layer.handle, brushIndentation(indentation));
            }
            return;
        }

        indentation = brushIndentation(indentation) + ' ├── ';

        var stack = layer.stack || layer.route.stack;
        for ( var i = 0; i < stack.length; i+=1 ) {
            if (i === stack.length - 1) {
                indentation = indentation.substr(0, indentation.length - 5) + ' └── ';
            }
            printRoutes(stack[i], indentation);
        }

        text.push(indentation.substr(0, indentation.length - 5));

    }

    printRoutes(expressApp._router, '');

    fs.writeFile(filename, text.join('\n'), function (err) {
        /* istanbul ignore if */
        if (err) {
            console.error('Failed to print routes to ' + filename);
        } else {
            console.log('Printed routes to ' + filename);
        }
    });

};
