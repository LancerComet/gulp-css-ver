const gulp = require("gulp");
const stylus = require("gulp-stylus");
const cssVer = require("../index");

var distPath = "./dist/"

gulp.task("default", function () {
    gulp.src("./stylus/test.styl")
        .pipe(stylus())
        .pipe(cssVer(distPath))
        .pipe(gulp.dest(distPath));
});