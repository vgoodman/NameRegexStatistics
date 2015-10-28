
// Watch Files For Changes
var gulp = require("gulp");
var files = [
"analytics",
"main",
"common"
];
gulp.task("watch", function() {
	for(var i=0; i<files.length; i++) {
		gulp.watch(["src/js/"+files[i]+"/**/*.js", "src/templates/"+files[i]+"/**/*.hbs", "src/scss/"+files[i]+"/**/*.scss"], ["lint", files[i], "revision"]);
	}
	gulp.watch(["src/js/routes/**/*.js", "src/scss/*.scss"], ["lint", "main", "revision"]);
	gulp.watch(["src/images/**/*.{png,jpg,jpeg,gif,svg}"], ["images"]);
	gulp.watch(["src/tests/**/*"], ["test"]);
});
