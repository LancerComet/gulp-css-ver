/*
 *  Gulp CSS Version By © 2016 LancerComet at 17:15, 2016.03.23.
 *  # Carry Your World #
 *  ---
 *  gulp-css-ver @ MIT.
 */

const through = require("through2");
const gutil = require("gulp-util");
const PluginError = gutil.PluginError;
const fs = require("fs");
const md5 = require('md5');

const appConfig = {
    PLUGIN_NAME: "gulp-css-ver",
    picRegExp: /["|'].*.["|']/gi,
    httpRegExp: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
};

module.exports = function (distPath, publicPath, version) {

    // Error Handler.
    if (!distPath) {
        throw new PluginError(appConfig.PLUGIN_NAME, "Please provide what the css file path is. 请指定 CSS 文件的生成目录以便读取图片并生成版本号.");
    }

    var stream = through.obj(function (file, enc, cb) {

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (file.isBuffer()) {
            // 用于查询 url().
            var regExp = /(^|)\s*url\s*\(["|'][0-9a-zA-Z+\-*%/\\<>.,;:_&^%$#@!]*\.[0-9a-zA-Z-+/\\<>.,;:_]*.[\)]/gi;

            // 用于替换字符串.
            var replaceRegExp = /["|']\)/;

            var fileContent = file.contents.toString();
            var matchedResult = fileContent.match(regExp);

            // 如果没有指定版本号, 则遍历所有图片并生成 hash 后, 将 hash 作为每个图片的访问后缀参数.
            // 如果指定了版本号, 则直接全局替换.
            if (!version) {
                withoutVersion();
            } else {
                withVersion();
            }

            // 将结果转为 Buffer 后输出为结果.
            file.contents = new Buffer(fileContent);


            /* ============== Definition goes below. ============== */

            // Definition: 指定版本号的情况.
            function withVersion () {
                console.log("You provide a version code, all pictures's querying param will be replaced. \n 您指定了一个版本号，所有图片地址都将替换为您的版本号.");
                matchedResult.forEach(function (value, index, array) {
                    var urlPath = value.match(appConfig.picRegExp)[0];
                    urlPath = urlPath.substr(1, urlPath.length - 2);

                    version = new Buffer(version);
                    version = version.toString();
                    fileContent = fileContent.replace(urlPath, urlPath + "?" + version);  // 使用版本号.
                });
            }

            // Definition: 没有版本号的情况. 遍历所有图片后生成 hash 并替换.
            function withoutVersion () {
                matchedResult.forEach(function (value, index, array) {
                    var urlPath = value.match(appConfig.picRegExp)[0];
                    urlPath = urlPath.substr(1, urlPath.length - 2);  // 获取图片在 CSS 中的地址.

                    if (urlPath.match(appConfig.httpRegExp)) { return; }  // 如果是 http 的地址则跳过.

                    var picPath = distPath + urlPath;
                    picPath = picPath.replace(/\/.\//gi, "/");  // 将 CSS 图片地址与 distPath 拼合.
                    picPath = picPath.replace(/\/[0-9a-zA-Z+\-*_!@#$%^&()]*\.\.\//gi, "/");  // 处理 "../" 上级相对路径.


                    // 如果图片不在 dist 目录, 则尝试从 public 目录中读取.
                    if (!fs.existsSync(picPath)) {
                        var picPublicPath = publicPath + urlPath;
                        picPublicPath = picPublicPath.replace(/\/.\//gi, "/");  // 将 CSS 图片地址与 distPath 拼合.
                        picPublicPath = picPublicPath.replace(/\/[0-9a-zA-Z+\-*_!@#$%^&()]*\.\.\//gi, "/");  // 处理 "../" 上级相对路径.
                        picPath = picPublicPath;
                    }

                    const picHash = createPicHash(picPath);  // 获取图片的 MD5 值.
                    fileContent = fileContent.replace(urlPath, urlPath + "?" + picHash);  // 使用版本号.                    fileContent = fileContent
                });
            }

        }

        // 确保文件进入下一个 gulp 插件
        this.push(file);

        // 告诉 stream 引擎，我们已经处理完了这个文件
        cb();
    });

    return stream;
};



// Definition: 生成图片 Hash 函数.
function createPicHash (path) {
    if (!fs.existsSync(path)) {
        console.log('File "' + path + '" not exist, no md5 will returned.');
        return "";
    }
    return md5(fs.readFileSync(path)).substr(0, 6);
}
