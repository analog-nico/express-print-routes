'use strict';

var path = require('path');
var fs = require('fs');

var express = require('express');
var printRoutes = require('../../lib/index.js');


describe('The express-print-routes middleware', function () {

    it('should print all routes and middlewares', function (done) {

        var app = express();

        app.get('/test', function __getTest() {});

        printRoutes(app, path.join(__dirname, '../results/routes.generated.txt'));

        setTimeout(function () {

            var expected = fs.readFileSync(path.join(__dirname, '../results/routes.expected.txt'), 'utf8');
            var generated = fs.readFileSync(path.join(__dirname, '../results/routes.generated.txt'), 'utf8');

            expect(generated).to.eql(expected);

            done();

        }, 100);

    });

});
