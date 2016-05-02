# Lost Track of All Your Express Routes And Middlewares?!

`express-print-routes` prints the tree of all your [Express](http://expressjs.com) routes and middlewares to a file.

**You get this** for example:

```
router                                                                                                         
 ├── query                            *                                                           
 ├── expressInit                      *                                                           
 ├── logger                           *                                                           
 ├── hpp                              *                                                           
 ├── router                           /^\/api\/?(?=\/|$)/                                         
 │   router                                                                                                    
 │    ├── bound dispatch              /users/:id             GET
 │    │    └── __getUser              /                      GET
 │    │   
 │    └── bound dispatch              /users/:id             POST
 │         ├── __checkAccessRights    /                      POST
 │         └── __updateUser           /                      POST
 │        
 │   
 ├── serveStatic                      *                                                           
 └── __handleError                    *                                                           
```

## Installation

[![Build Status](https://img.shields.io/travis/analog-nico/express-print-routes/master.svg?style=flat-square)](https://travis-ci.org/analog-nico/express-print-routes)
[![Coverage Status](https://img.shields.io/coveralls/analog-nico/express-print-routes.svg?style=flat-square)](https://coveralls.io/r/analog-nico/express-print-routes)
[![Dependency Status](https://img.shields.io/david/analog-nico/express-print-routes.svg?style=flat-square)](https://david-dm.org/analog-nico/express-print-routes)

[![NPM Stats](https://nodei.co/npm/express-print-routes.png?downloads=true)](https://npmjs.org/package/express-print-routes)

This is a module for node.js and is installed via npm:

``` bash
npm install express-print-routes --save-dev
```

## Usage

Call `express-print-routes` after you registered all your routes / middlewares:

``` js
var app = express();

// Register all your routes / middlewares


if (process.env.NODE_ENV === 'development') { // Only in dev environment

    // Absolute path to output file
    var path = require('path');
    var filepath = path.join(__dirname, '../docs/routes.generated.txt');

    // Invoke express-print-routes
    require('express-print-routes')(app, filepath);
    
}
```

Consider giving your middlewares names when they appear as `<anonymous>`. Often, they are added as anonymous functions like this:

``` js
app.use(function (req, res, next) {
    console.log('Hello world'!);
    next();
});
```

Give the middleware a name like this:

``` js
app.use(function __helloWorld(req, res, next) { // <-- '__helloWorld' will be printed now 
    console.log('Hello world'!);
    next();
});
```


### Why printing to a file and not just to the console?

It is good practice to commit the generated file to your version control system. This way you can review all changes like added / renamed / removed routes and added / removed middlewares.

## Contributing

To set up your development environment for `express-print-routes`:

1. Clone this repo to your desktop,
2. in the shell `cd` to the main folder,
3. hit `npm install`,
4. hit `npm install gulp -g` if you haven't installed gulp globally yet, and
5. run `gulp dev`. (Or run `node ./node_modules/.bin/gulp dev` if you don't want to install gulp globally.)

`gulp dev` watches all source files and if you save some changes it will lint the code and execute all tests. The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

If you want to debug a test you should use `gulp test-without-coverage` to run all tests without obscuring the code by the test coverage instrumentation.

## Change History

- v1.0.0 (2016-05-01)
    - Initial version

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.
