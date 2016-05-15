var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var watchify = require('watchify')
var uglifyify = require('uglifyify')

var bundlerProd = browserify('src/js/app.js', {
        debug: false
    })
    .transform(babelify, {presets: ["es2015", "react"]})
    .transform(uglifyify, {global: true})

var bundlerDev = browserify('src/js/app.js', {
        cache: {},
        packageCache: {},
        debug: true
    })
    .transform(babelify, {presets: ["es2015", "react"]})


function bundle(bundler) {
    return bundler.bundle()
        .on('error', e => console.error(e.message))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('src/wwwroot/assets'));
}

gulp.task('app-prod', f => bundle(bundlerProd));
gulp.task('app-dev', f => bundle(bundlerDev));

gulp.task('watch-js', function() {
    watchify.args.debug = true;
    var watcher = watchify(bundlerDev);
    watcher.on('update', function() {
        bundle(bundlerDev)
    });
    watcher.on('log', function(log) {
        console.log(log)
    })
    bundle(bundlerDev);
    return watcher
})