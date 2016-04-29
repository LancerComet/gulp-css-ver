# gulp-css-ver
A small gulp tool to add version that based on md5 of pictures to "url()" in css files.

## Usage
cssVer(distDirName, secDistDirName, versionName);

`distDirName` is where the css files will be generated. Gulp-css-ver will try to read all pictrues that are required in css files and root path are based on `distDirName` firstly. Gulp-css-ver will try to read these picture files in `secDistDirName` if there are no these required-pictrue in folder `distDirName`.

Please note that `distDirName` is relative to **rootpath** of your project. 
For example, if your css files is in "PROJECT_DIR/public/index", then you should set `distDirName` to `public/index`.

If you provided a `versionName`, all querying params in `url(xxx?@queryingParam)` will be replaced with `versionName`. 


## Example
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
            .pipe(cssVer("public/index", "dist/index"))
            .pipe(rename("bundle.min.css"))
            .pipe(sourcemap.write("."))
            .pipe(gulp.dest("./public/index"));  // dist.
});
```

## Result
Before:
```
background-image: url("xxx.png")
```
After:
```
background-image: url("xxx.png?xxxx")
```

## License
MIT.
© 2016 LancerComet.
