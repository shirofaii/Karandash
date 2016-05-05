var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');

gulp.task('styles', function() {
    return gulp.src('src/css/screen.styl')
        .pipe(stylus({
            errors: true
        }))
        .on('error', handleError)
        .pipe(autoprefixer())
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('src/assets'));
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}
