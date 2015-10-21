
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
  "temp/templates/analytics.js",
  "src/js/analytics/*.js"
];

gulp.task("analytics", ["analyticsSass", "analyticsMin"]);

gulp.task("analyticsJs", ["analyticsTemplate"], function() {
  return gulp.src(fileList)
    .pipe(concat("analytics.js"))
    .pipe(jsValidate())
    .pipe(insert.append("\n//# sourceURL=analytics.js"))
    .pipe(insert.prepend('"use strict";'))
    .pipe(gulp.dest("public/js"))
    .on("error", gutil.log);
});

gulp.task("analyticsMin", ["analyticsJs"], function() {
  return gulp.src(fileList)
    .pipe(concat("analytics.js"))
    .pipe(uglify())
    .pipe(gulp.dest("public/js/min"))
    .on("error", gutil.log);
});

gulp.task("analyticsTemplate", function(){
  return gulp.src(["src/templates/analytics/**/*.hbs"])
    .pipe(handlebars())
    .pipe(defineModule("plain"))
    .pipe(declare({
      namespace: "NRTemplates.Analytics"
    }))
    .pipe(concat("analytics.js"))
    .pipe(gulp.dest("temp/templates/"))
    .on("error", gutil.log);
});

gulp.task("analyticsSass", function() {
  return gulp.src(["src/scss/analytics/analytics.scss"])
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest("public/css"));
});