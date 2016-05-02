'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var chalk = require('chalk');
var rimraf = require('rimraf');
var coveralls = require('gulp-coveralls');
var eslint = require('gulp-eslint');

var chai = require("chai");
global.expect = chai.expect;


var paths = {
    libJsFiles: './lib/**/*.js',
    gulpfile: './gulpfile.js',
    specFiles: './test/spec/**/*.js',
    fixtureFiles: './test/fixtures/**/*.txt'
};


gulp.task('dev', ['watch', 'validate']);

gulp.task('watch', function () {

    gulp.watch([
        paths.libJsFiles,
        paths.gulpfile,
        paths.specFiles,
        paths.fixtureFiles
    ], [
        'validate'
    ]);

    gulp.watch([
        paths.gulpfile
    ], [
        'lint'
    ]);

});

gulp.task('validate', function (done) {
    runSequence('lint', 'test', done);
});

gulp.task('lint', function () {

    return gulp.src([paths.libJsFiles, paths.gulpfile, paths.specFiles])
        .pipe(eslint({
            extends: 'eslint:recommended',
            rules: {
                'no-console': 0
            },
            envs: [
                'node'
            ],
            globals: {
                describe: true,
                it: true,
                expect: true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

});

gulp.task('test', ['clean'], function (done) {

    var coverageVariable = '$$cov_' + new Date().getTime() + '$$';

    gulp.src(paths.libJsFiles)
        .pipe(istanbul({
            coverageVariable: coverageVariable
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', function () {

            gulp.src(paths.specFiles)
                .pipe(mocha())
                .on('error', function (err) {
                    console.error(String(err));
                    console.error(chalk.bold.bgRed(' TESTS FAILED '));
                    done(new Error(' TESTS FAILED '));
                })
                .pipe(istanbul.writeReports({
                    reporters: ['lcov'],
                    coverageVariable: coverageVariable
                }))
                .on('end', done);

        });

});

gulp.task('test-without-coverage', function () {

    return gulp.src(paths.specFiles)
        .pipe(mocha())
        .on('error', function () {
            console.log(chalk.bold.bgRed(' TESTS FAILED '));
        });

});

gulp.task('clean', function (done) {
    rimraf('./coverage', done);
});

gulp.task('ci', function (done) {
    runSequence('validate', 'coveralls', 'test-without-coverage', done);
});

gulp.task('ci-no-cov', function (done) {
    runSequence('validate', 'test-without-coverage', done);
});

gulp.task('coveralls', function () {
    return gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());
});
