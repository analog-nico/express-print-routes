'use strict'

let gulp = require('gulp')
let runSequence = require('run-sequence')
let istanbul = require('gulp-istanbul')
let mocha = require('gulp-mocha')
let chalk = require('chalk')
let rimraf = require('rimraf')
let coveralls = require('gulp-coveralls')
let eslint = require('gulp-eslint')
let mkdirp = require('mkdirp')

let chai = require("chai")
global.expect = chai.expect


let paths = {
    libJsFiles: './lib/**/*.js',
    gulpfile: './gulpfile.js',
    specFiles: './test/spec/**/*.js',
    fixtureFiles: './test/fixtures/**/*.txt'
}


gulp.task('dev', ['watch', 'validate'])

gulp.task('watch', () => {

    gulp.watch([
        paths.libJsFiles,
        paths.gulpfile,
        paths.specFiles,
        paths.fixtureFiles
    ], [
        'validate'
    ])

    gulp.watch([
        paths.gulpfile
    ], [
        'lint'
    ])

})

gulp.task('validate', (done) => runSequence('lint', 'test', done))

gulp.task('lint', () => {

    return gulp.src([paths.libJsFiles, paths.gulpfile, paths.specFiles])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())

})

gulp.task('test', ['clean'], (done) => {

    let coverageVariable = `$$cov_${ new Date().getTime() }$$`

    gulp.src(paths.libJsFiles)
        .pipe(istanbul({
            coverageVariable
        }))
        .pipe(istanbul.hookRequire())
        .on('finish', () => {

            gulp.src(paths.specFiles)
                .pipe(mocha())
                .on('error', (err) => {
                    console.error(String(err))
                    console.error(chalk.bold.bgRed(' TESTS FAILED '))
                    done(new Error(' TESTS FAILED '))
                })
                .pipe(istanbul.writeReports({
                    reporters: ['lcov'],
                    coverageVariable
                }))
                .on('end', () => done())

        })

})

gulp.task('test-without-coverage', () => {

    return gulp.src(paths.specFiles)
        .pipe(mocha())
        .on('error', () => console.log(chalk.bold.bgRed(' TESTS FAILED ')))

})

gulp.task('clean', ['clean-coverage', 'clean-results'])

gulp.task('clean-coverage', (done) => rimraf('./coverage', done))

gulp.task('clean-results', (done) => {

    rimraf('./test/results', (err) => {

        if (err) {
            return done(err)
        }

        mkdirp('./test/results', done)

    })

})

gulp.task('ci', (done) => runSequence('validate', 'coveralls', 'test-without-coverage', done))

gulp.task('ci-no-cov', (done) => runSequence('validate', 'test-without-coverage', done))

gulp.task('coveralls', () => {
    return gulp.src('coverage/**/lcov.info')
        .pipe(coveralls())
})
