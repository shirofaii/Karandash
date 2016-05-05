var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');
var envify = require('envify');
var source = require('vinyl-source-stream');
var watchify = require('watchify')

var bundler = browserify({ cache: {}, packageCache: {} })
    .transform(babelify)
    .transform(reactify, {"es6": true})
    .transform(envify)
    .add('src/js/app.js')

function bundle() {
    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('src/assets'));
}

gulp.task('app-js', bundle);

gulp.task('watch-js', function() {
    watchify.args.debug = true;
    var watcher = watchify(bundler);
    watcher.on('update', function() {
        bundle()
    });
    watcher.on('log', function(log) {
        console.log(log)
    })
    bundle();
    return watcher
})