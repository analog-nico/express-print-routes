'use strict';

var path = require('path');
var fs = require('fs');

var express = require('express');
var printRoutes = require('../../lib/index.js');


describe('The express-print-routes middleware', function () {

    it('should print all routes and middlewares', function (done) {

        var app = express();

        app.all('*', function __starAll() {});
        app.get('/', function __rootGet() {});
        app.get('/test', function __testGet() {});
        app.post('/test/:param', function __testParamPost() {});
        app.get(/^\/spa($|\/)/, function __spaRegexGet() {});
        app.get('/chained', function __chainedGet1() {}, function __chainedGet2() {});

        var router = express.Router();
        app.use('/routed', router);
        router.all('*', function __routedStarAll() {});
        router.get('/', function __routedRootGet() {});
        router.get('/test', function __routedTestGet() {});
        router.post('/test/:param', function __routedTestParamPost() {});
        router.get(/^\/spa($|\/)/, function __routedSpaRegexGet() {});
        router.get('/chained', function __routedChainedGet1() {}, function __routedChainedGet2() {});


        printRoutes(app, path.join(__dirname, '../results/routes.generated.txt'));


        setTimeout(function () {

            var expected = fs.readFileSync(path.join(__dirname, '../results/routes.expected.txt'), 'utf8');
            var generated = fs.readFileSync(path.join(__dirname, '../results/routes.generated.txt'), 'utf8');

            expect(generated).to.eql(expected);

            done();

        }, 100);

    });

});
