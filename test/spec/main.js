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
        //app.param('testId', function __testIdParam() {});
        app.post('/test/:testId', function __testParamPost() {});
        app.get(/^\/spa($|\/)/, function __spaRegexGet() {});
        app.get('/chained', function __chainedGet1() {}, function __chainedGet2() {});
        app.use('/use', function __useUse() {});

        var router = express.Router();
        app.use('/routedWithRouter', router);
        router.all('*', function __routedStarAll() {});
        router.get('/', function __routedRootGet() {});
        router.get('/test', function __routedTestGet() {});
        //router.param('testId', function __routedTestIdParam() {});
        router.post('/test/:testId', function __routedTestParamPost() {});
        router.get(/^\/spa($|\/)/, function __routedSpaRegexGet() {});
        router.get('/chained', function __routedChainedGet1() {}, function __routedChainedGet2() {});
        router.use('/use', function __routedUseUse() {});
        router.route('/routedWithDotRoute')
            .all(function __routedAll() {})
            .get(function __routedChainedGet1() {}, function __routedChainedGet2() {});

        app.route('/routedWithDotRoute')
            .all(function __routedAll() {})
            .get(function __routedChainedGet1() {}, function __routedChainedGet2() {});

        app.route(/^\/routedWithDotRouteAndRegex($|\/)/)
            .get(function __routedGet() {})
            .post(function __routedChainedPost1() {}, function __routedChainedPost2() {});

        //var routerCaseSensitive = express.Router({ caseSensitive: true });
        //app.use('/caseSensitive', routerCaseSensitive);


        printRoutes(app, path.join(__dirname, '../results/routes.generated.txt'));


        setTimeout(function () {

            function getNodeVersionMajor() {
                return process.versions.node.split('.')[0];
            }

            var expected = fs.readFileSync(path.join(__dirname, '../fixtures/routes.expected.node' + getNodeVersionMajor() + '.txt'), 'utf8');
            var generated = fs.readFileSync(path.join(__dirname, '../results/routes.generated.txt'), 'utf8');

            expect(generated).to.eql(expected);

            done();

        }, 100);

    });

    it('should print example in README', function (done) {

        var app = express();

        app.use(function logger() {});
        app.use(function hpp() {});

        var router = express.Router();
        app.use('/api', router);
        router.get('/users/:id', function __getUser() {});
        router.post('/users/:id', function __checkAccessRights() {}, function __updateUser() {});

        app.use(express.static('.'));
        app.use(function __handleError() {});

        printRoutes(app, path.join(__dirname, '../results/example.generated.txt'));


        setTimeout(function () {

            var expected = fs.readFileSync(path.join(__dirname, '../fixtures/example.expected.txt'), 'utf8');
            var generated = fs.readFileSync(path.join(__dirname, '../results/example.generated.txt'), 'utf8');

            expect(generated).to.eql(expected);

            done();

        }, 100);

    });

});
