# gulp-css-ver
A small gulp tool to add version that based on md5 of pictures to "url()" in css files.

## Usage
```
var gulp = require("gulp");
var rename = require("gulp-rename");
var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var sourcemap = require("gulp-sourcemaps");
var cssVer = require("gulp-css-ver");

gulp.task("stylus-to-css", function () {
        gulp.src("main-package.styl")
            .pipe(sourcemap.init())
            .pipe(stylus({
                compress: true
            }))
            .pipe(autoprefixer({
                browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', "ie 8", "ie 9"]
            }))
            .pipe(cssVer(distPath, "./public/"))  // "distPath" is where the css file will be generated. Gulp will try to read pictures that root path are based on "distPath" firstly and then try "./public/" if there is no this picture file in "distPath".
            .pipe(rename("bundle.min.css"))
            .pipe(sourcemap.write("."))
            .pipe(gulp.dest(distPath));  // dist.
});
```

## License
MIT.
© 2016 LancerComet.
