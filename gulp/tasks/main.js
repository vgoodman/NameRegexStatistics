/**
 * Created by Verena on 6/18/15.
 */
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
  "src/js/main/app.js",
  "src/js/main/NRController.js",
  "src/js/main/NRRouter.js",
  "src/js/routes/baseController.js",
  "src/js/routes/*.js"
];

gulp.task("main", ["mainMin", "mainSass"]);

gulp.task("mainJs", function() {
  return gulp.src(fileList)
    .pipe(concat("main.js"))
    .pipe(jsValidate())
    .pipe(insert.append("\n//# sourceURL=main.js"))
    .pipe(insert.prepend('"use strict";'))
    .pipe(gulp.dest("public/js"))
    .on("error", gutil.log);
});

gulp.task("mainMin", ["mainJs"], function() {
  return gulp.src(fileList)
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("public/js/min"))
    .on("error", gutil.log);
});

gulp.task("mainSass", function() {
  return gulp.src(["src/scss/general.scss"])
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest("public/css"));
});