//Concatenate & Minify JS
var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

var files = [
  "node_modules/backbone.marionette/node_modules/underscore/underscore.js",
  "node_modules/handlebars/dist/handlebars.js",
  "node_modules/jquery/dist/jquery.js",
  "node_modules/backbone.marionette/node_modules/backbone/backbone.js",
  "node_modules/backbone.marionette/lib/backbone.marionette.js",
  "node_modules/moment/moment.js"
];

gulp.task("vendor", function() {
  return gulp.src(files)
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest("public/js"))
    .pipe(uglify({preserveComments: "some"}))
    .pipe(gulp.dest("public/js/min"));
});