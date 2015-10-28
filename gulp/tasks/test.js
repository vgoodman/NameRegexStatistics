
//Concatenate & Minify JS
 var gulp = require("gulp");
var concat = require("gulp-concat");
var gutil = require("gulp-util");

var rename = require("gulp-rename");

var fileList = [
  "node_modules/mocha/mocha.js",
  "node_modules/chai/chai.js"
];

gulp.task("test", ["testJs", "copyCss"]);

gulp.task("testJs", function() {
  return gulp.src(fileList)
    .pipe(concat("test.js"))
    .pipe(gulp.dest("public/js"))
    .on("error", gutil.log);
});

gulp.task("copyCss", function() {
  return gulp.src(["node_modules/mocha/mocha.css"])
    .pipe(rename("test.css"))
    .pipe(gulp.dest("public/css"));
});
