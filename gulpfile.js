var gulp           = require('gulp');
var sass           = require('gulp-ruby-sass');
var autoprefixer   = require('gulp-autoprefixer');
var minifycss      = require('gulp-minify-css');
var rename         = require('gulp-rename');
var clean          = require('gulp-clean');
var livereload     = require('gulp-livereload');
var lr             = require('tiny-lr');
var server         = lr();
var imagemin       = require('gulp-imagemin');
var uglify         = require('gulp-uglify');
var cache          = require('gulp-cache');
var notify         = require("gulp-notify");
var plumber        = require('gulp-plumber');
var browserSync    = require('browser-sync');

//Styles task
gulp.task('styles', function(){
    return gulp.src('css/*.scss')
        .pipe(plumber())
        .pipe(sass({style: 'compressed'}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(notify("Styles task completed"));
});

//Scripts task
gulp.task('scripts', function(){
    return gulp.src('js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js/min'))
        .pipe(browserSync.reload({stream:true, once: true}))
        .pipe(notify("Scripts task completed"));
});

//Image min task
gulp.task('images', function(){
    return gulp.src('images/*')
        .pipe(plumber())
        .pipe(cache(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
        .pipe(gulp.dest('images/optimised'))
        .pipe(browserSync.reload({stream:true, once: true}))
        .pipe(notify("Images task completed"));
});

//Clean out the images directory
gulp.task('clean', function() {
  return gulp.src('images/**/*', {read: false})
    .pipe(clean())
    .pipe(notify("Clean task completed"));
});

//Browser Sync
gulp.task('browser-sync', function() {
    browserSync.init(null, {
      proxy: "surroundings.epk"
    });
});

//Default Task - Run browser sync and watch for changes
gulp.task('default', ['browser-sync'], function () {
    // Watch .scss files
    gulp.watch('css/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/*.js', ['scripts']);

    // Watch images
    gulp.watch('images/*', ['images']);
});
