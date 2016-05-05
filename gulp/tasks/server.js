var fork = require('child_process').fork;
var gulp = require('gulp');

gulp.task('server', function() {
    return fork('server.js', [], {cwd: './src'})
});
