var gulp = require('gulp');

gulp.task('watch-css', function() {
    return gulp.watch('src/css/**/*.styl', ['styles'])
});
