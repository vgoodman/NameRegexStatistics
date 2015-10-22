//Concatenate & Minify JS
 var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");
var insert = require("gulp-insert");
var sass = require("gulp-sass");
var minifycss = require("gulp-minify-css");
var jsValidate = require("gulp-jsvalidate");

var rename = require("gulp-rename");
var handlebars = require("gulp-handlebars");
var declare = require("gulp-declare");
var defineModule = require("gulp-define-module");

var fileList = [
  "src/js/common/**/*.js"
];

gulp.task("common", ["commonMin"]);

gulp.task("commonJs", function() {
  return gulp.src(fileList)
    .pipe(concat("common.js"))
    .pipe(jsValidate())
    .pipe(insert.append("\n//# sourceURL=common.js"))
    .pipe(insert.prepend('"use strict";'))
    .pipe(gulp.dest("public/js"))
    .on("error", gutil.log);
});

gulp.task("commonMin", ["commonJs"], function() {
  return gulp.src(fileList)
    .pipe(concat("common.js"))
    .pipe(uglify())
    .pipe(gulp.dest("public/js/min"))
    .on("error", gutil.log);
});