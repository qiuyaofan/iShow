var gulp = require('gulp');
var md5 = require('md5');
var qiniu = require('gulp-qiniu');
var cheerio = require('gulp-cheerio');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var compass = require('gulp-compass');
var minifyCss = require('gulp-minify-css');
var yuicompress = require('gulp-yuicompressor');
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('clean-css');
var argv = require('yargs').argv;
var fs = require('fs');
var sourcemaps = require('gulp-sourcemaps');
var htmlreplace = require('gulp-html-replace');
var replace = require('gulp-replace');
var upload = require('gulp-upload');
var sass = require('gulp-sass');
//启动项目命令：gulp watch
//http://localhost:2000/view/wap.html


var config = {
    timesamp: md5(+new Date()),
    uploadUrl:'./js/*',
    image: './images/*',
    font: './font/*',
    htmlImagePath: '../images/',
    cssImagePath:'../images/',
    fontPath:'../../font/',
};

var build = {
    html: [
        './view/wap.html'
    ],
    css: [
        './css/wap.css'
    ],
    uploadjs:[
        './js/plugin/jquery-2.1.0.min.js',
        './js/plugin/template.js'
    ],
    js: [
        './js/plugin/iui.js',
        './js/json.js',
        './js/wap.js'
    ],
    dest: './dest/',
    key:'wap'

};

/**
 * 监听配置 : 用于 compass watch 或自动刷新时监听的资源路径
 */
var watch = {
    html: './{,*/}*.html',
    js: './js/{,*/}*.js',
    css: './css/{,*/}*.css',
    scss: './sass/{,*/}*.scss'
};

var path={
    css:'./css',
}


/**
 * 编译sass
 */
gulp.task('sass', function() {
    gulp.src(watch.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(path.css));
});

/**
 * 编译sass并监听
 */
gulp.task('sass:watch', function () {
  gulp.watch(watch.scss, ['sass']);
});


/**
 * fresh : 监听文件有改变时触发刷新浏览器
 * gulp watch 时需要用到
 */
gulp.task('fresh', function() {
    gulp.src([watch.html, watch.css, watch.js]).pipe(reload({
        stream: true
    }));
});

/**
 * browser-sync : 启动一个微型服务器
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        },
        port: 2000,
        weinre: {
            port: 2000
        },
        open: false

    });
});

/**
 * gulp watch ：监听 watch 配置下的文件，一旦改变就自动刷新
 * 仅用于 edm或静态页面 开发
 */
gulp.task('watch', ['browser-sync', 'sass', 'fresh'], function() {
    gulp.watch([watch.html,watch.css,watch.js], ['fresh']);
    gulp.watch([watch.scss], ['sass']);
});
