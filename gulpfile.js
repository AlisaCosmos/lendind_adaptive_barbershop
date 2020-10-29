
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const uglify = require("gulp-uglify");



// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload)  
});

// Task to minify HTML
gulp.task('minify-html', function() {
    return gulp.src('source/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('build'));
});

// Styles
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle:'compressed'}).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

// js
gulp.task('js', function () {
    return gulp.src([
        'source/js/form.js',
        'source/js/navigation.js',
        'source/js/main.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));

});

// Sprites
gulp.task('sprite', function (cd) {
    var spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath:'../img/sprite.png',
      cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cd();
  });

// Delete
gulp.task('clean', function del(cd){
    return rimraf('build', cd);
});

// Copy fonts
gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

// Copy imgs
gulp.task('copy:img', function() {
    return gulp.src('./source/img/**/*.*')
     .pipe(gulp.dest('build/img'));
});

 // Copy
 gulp.task('copy', gulp.parallel('copy:fonts', 'copy:img'));

 //Watchers

gulp.task('watch', function(){
    gulp.watch('source/*.html', gulp.series('minify-html'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('source/js/**/*.js', gulp.series('js'));
});


gulp.task('default', gulp.series(
    'clean',
    gulp.series('minify-html', 'styles:compile', 'js','sprite', 'copy'),
    gulp.parallel('watch', 'server')
    )
);
// gulp.task('default', 
// gulp.series('clean', 'minify-html', 'styles:compile', 'sprite', 'copy'), 
//     gulp.parallel('watch', 'server')
//     );


