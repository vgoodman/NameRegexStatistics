var files = [
  "lint",
  "vendor",
  "watch",
  "analytics",
  "main",
  "revision",
  "common",
  "images"
];
var gulp = require("./gulp")(files);
// Default Task
gulp.task("default", files);