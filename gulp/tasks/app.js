var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watchify = require('watchify')

var bundler = browserify('src/js/app.js', {
        cache: {},
        packageCache: {},
        debug: false
    })
    .transform(babelify, {presets: ["es2015", "react"]})

function bundle() {
    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('src/wwwroot/assets'));
}

gulp.task('app', bundle);

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