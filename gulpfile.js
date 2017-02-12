var gulp = require("gulp");
var browserSync = require('browser-sync');
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var cleanCSS = require("gulp-clean-css");
var minifyJs = require("gulp-minify");
var rename = require("gulp-rename");

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: '.'
        },
        port: 88
    })
});


gulp.task('less', function () {
    gulp.src("src/**/*.less", {base: "src/less"})
        .pipe(plumber({errorHandler: notify.onError("Error: <%=error.message%>")}))
        .pipe(less())
        .pipe(gulp.dest("assets/css/"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('minify-css', function() {
    return gulp.src('assets/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy-css', function() {
    return gulp.src('assets/css/*.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', function() {
    gulp.src('src/js/*.js')
        .pipe(minifyJs({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        })).pipe(gulp.dest('dist/js'));
});

gulp.task("compress", ['minify-css', 'copy-css', 'minify-js']);

gulp.task("watch", function () {
    gulp.watch("src/**/*.less", ["less"]);
    gulp.watch("./**/*.html", browserSync.reload);
    gulp.watch("js/**/*.js", browserSync.reload);
    gulp.watch("crop/**/*.js", browserSync.reload);
    gulp.watch("assets/**/*.css", browserSync.reload);
});


gulp.task('default', ['browserSync', 'watch', 'less']);