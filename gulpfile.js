var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var config = require('./config');

// css处理库
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var base64 = require('gulp-base64');

//js处理库
var order = require("gulp-order");
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

//图片处理库
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var fileinclude = require('gulp-file-include');

//热加载
var browserSync = require('browser-sync').create();

// 处理html文件
gulp.task('html', function() {
    return gulp.src( config.html.src )
        .pipe(fileinclude())
        .pipe(gulp.dest( config.html.dest ))
});

//处理图片
gulp.task('images', function() {
    return gulp.src( config.images.src )  //源文件路径
        .pipe(cache(imagemin({   //压缩图片
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest( config.images.dest )) //目的路径
});

//拷贝库函数
gulp.task('lib', function() {
    return gulp.src( config.lib.src )
        .pipe(gulp.dest( config.lib.dest ))
});

//压缩拼接重命名js
gulp.task('scripts', function() {
    return gulp.src( config.js.src )  //源文件路径
        .pipe(order([
            config.js.base + "config.js",
            config.js.base + "index.js"
        ]))  //排列顺序
        .pipe(concat('main.js'))  //合并文件
        .pipe(gulp.dest( config.js.dest )) //目的路径
        .pipe(rename({  
            suffix: '.min'
        }))   //修改文件名      
        .pipe(uglify())   //压缩js
        .pipe(gulp.dest( config.js.dest )) //目的路径
})

//编译less&压缩&重命名
gulp.task('styles', function() {
    return gulp.src( config.css.src ) //源文件路径
        .pipe(less()) //less编译
        .pipe(base64()) //base64编码
        .pipe(autoprefixer()) //自动前缀
        .pipe(cssmin()) //css压缩
        .pipe(rename({
            suffix: '.min'
        })) //修改文件名                            
        .pipe(gulp.dest( config.css.dest )) //目的路径
});

//清空文件夹
gulp.task('clean', function() {
    return gulp.src([config.css.dest, config.js.dest, config.images.dest, config.html.dest ], {
            read: false
        })
        .pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'html', 'lib')
});

//热加载
gulp.task('dev', function() {
    browserSync.init({
        server: {
            baseDir: config.base.dest
        }
    });

    gulp.watch( config.css.src , ['styles']);
    gulp.watch( config.js.src , ['scripts']);
    gulp.watch( config.images.src , ['images']);
    gulp.watch( config.html.src , ['html']);

    gulp.watch([
        config.html.dest + "/*",
        config.css.dest  + "/*",
        config.js.dest + "/*",
        config.images.dest
    ]).on("change", browserSync.reload)

});