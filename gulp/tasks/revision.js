
var gulp = require("gulp");
var rev = require("gulp-rev");
var del = require("del");
var rename = require("gulp-rename");

gulp.task("revision", ["cleanRevisions", "revisionCSS"], function () {
  return gulp.src(["public/js/min/*.js"])
    .pipe(rev())
    .pipe(gulp.dest("public/revisioned"))
    .pipe(rev.manifest())
    .pipe(rename("js.manifest.json"))
    .pipe(gulp.dest("temp/json"));
});
gulp.task("revisionCSS", function () {
  return gulp.src(["public/css/*.css"])
    .pipe(rev())
    .pipe(gulp.dest("public/revisioned"))
    .pipe(rev.manifest())
    .pipe(rename("css.manifest.json"))
    .pipe(gulp.dest("temp/json"));
});
gulp.task("cleanRevisions", function () {
  return del("public/revisioned/*", function (err, paths) {
    console.log('Deleted files/folders:\n', paths.join('\n'));
});
});