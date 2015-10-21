/**
 * Created by Verena on 7/21/14.
 */
// Lint Task
var gulp = require("gulp");
var jshint = require("gulp-jshint");

gulp.task("lint", function() {
  return gulp.src(["src/js/**/*.js"])
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});