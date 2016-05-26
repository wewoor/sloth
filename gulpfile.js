var gulp = require('gulp');
var fileInclude = require("gulp-file-include");
var exec = require('child_process').exec;
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var sass = require('gulp-sass');
var clean = require('gulp-clean');

var paths = {
    html: [
        "src/*.html",
    ],
    images: [
        "src/images/*",
    ],
    js: [
        "src/scripts/**/*.js",
    ],
    sass: [
        "src/sass/**/*.scss",
    ],
    font: [
        "src/fonts/*.ttf"
    ]
};

var output = ".temp"; // 文件构建输出地址
var dist = "dist"; // dist目录

/**
 *  Task 
 */
gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(gulp.dest(output + "/images"));
});

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(fileInclude())
        .pipe(gulp.dest(output));
});

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(gulp.dest(output + "/js"));
});

gulp.task('font', function() {
    gulp.src(paths.font)
        .pipe(gulp.dest(output + "/css/fonts"));
});

gulp.task('sass', function() {
   return gulp.src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(output + '/css'));
});

// =============压缩合并build资源============== //
gulp.task('dist', ['run.dist'], function() {
    
    gulp.src(dist+"/**/*")
        .pipe(clean({force: true}));

    gulp.src(output+"/*.html")
        .pipe(useref())
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('*.js', uglify({
            mangle: false
        })))
        .pipe(gulp.dest(dist));

    gulp.src(paths.font)
        .pipe(gulp.dest(dist+"/css/fonts"));

    gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dist+"/images"));
});

gulp.task('run.dist', function() {
    exec("node app.js /dist", function(err, stdout, stderr) {
        console.log(stdout);
        if (err) console.log("start server error:" + err);
    });
});

gulp.task('run.build', function() {
    exec("node app.js /.temp", function(err, stdout, stderr) {
        console.log(stdout);
        if (err) console.log("start server error:" + err);
    });
});

// 默认构建
gulp.task('default', ['images', 'sass', 'html', 'js', 'font', 'run.build'], function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.js, ['js']);
});