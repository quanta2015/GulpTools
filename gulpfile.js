var gulp = require('gulp');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

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
    return gulp.src('src/*.html')
        .pipe(fileinclude())
        .pipe(gulp.dest('dist/'))
});

//处理图片
gulp.task('images', function() {
    return gulp.src('src/img/*')  //源文件路径
        .pipe(cache(imagemin({   //压缩图片
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img')) //目的路径
});

//拷贝库函数
gulp.task('lib', function() {
    return gulp.src(['src/lib/*/*.js', 'src/lib/*/*.css'])
        .pipe(gulp.dest('dist/lib'))
});

//压缩拼接重命名js
gulp.task('scripts', function() {
    return gulp.src('src/sys/js/*.js')  //源文件路径
        .pipe(order([
            "src/sys/js/config.js",
            "src/sys/js/index.js"
        ]))  //排列顺序
        .pipe(concat('main.js'))  //合并文件
        .pipe(gulp.dest('dist/sys/js')) //目的路径
        .pipe(rename({  
            suffix: '.min'
        }))   //修改文件名      
        .pipe(uglify())   //压缩js
        .pipe(gulp.dest('dist/sys/js')) //目的路径
})

//编译less&压缩&重命名
gulp.task('styles', function() {
    return gulp.src('src/sys/less/*.less') //源文件路径
        .pipe(less()) //less编译
        .pipe(base64()) //base64编码
        .pipe(autoprefixer()) //自动前缀
        .pipe(cssmin()) //css压缩
        .pipe(rename({
            suffix: '.min'
        })) //修改文件名                            
        .pipe(gulp.dest('dist/sys/css')) //目的路径
});

//清空文件夹
gulp.task('clean', function() {
    return gulp.src(['dist/sys/css', 'dist/sys/js', 'dist/img'], {
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
            baseDir: "./dist"
        }
    });

    gulp.watch('src/sys/less/*', ['styles']);
    gulp.watch('src/sys/js/*', ['scripts']);
    gulp.watch('src/img/*', ['images']);
    gulp.watch('src/*.html', ['html']);

    gulp.watch([
        "./dist/*.html",
        './dist/sys/css/*',
        './dist/sys/js/*',
        './dist/img/*'
    ]).on("change", browserSync.reload)

});