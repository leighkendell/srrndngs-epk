//Define all plugins
var gulp               = require('gulp');
var sass               = require('gulp-sass');
var sourcemaps         = require('gulp-sourcemaps');
var cache              = require('gulp-cached');
var imagemin           = require('gulp-imagemin');
var filter             = require('gulp-filter');
var autoprefixer       = require('gulp-autoprefixer');
var uglify             = require('gulp-uglify');
var rename             = require('gulp-rename');
var notify             = require("gulp-notify");
var plumber            = require('gulp-plumber');
var browserSync        = require('browser-sync');
var reload             = browserSync.reload;

//Define file paths
var js_src             = 'js/*.js';
var js_dest            = 'js/min';
var sass_src           = 'css/*.scss';
var sass_dest          = 'css';
var img_src            = 'images/*';
var img_dest           = 'images/optimised';

//Sass
gulp.task('sass', function () {
    gulp.src(sass_src)
        //Notify on error
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

        //Source maps init
        .pipe(sourcemaps.init())

        //Process sass
        .pipe(sass({
            outputStyle: 'compressed'
        }))

        //Autoprefix that css!
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        //Write source map
        .pipe(sourcemaps.write('./'))

        //Output the compiled sass to this directory
        .pipe(gulp.dest(sass_dest))

        //Filtering stream to only css files
        .pipe(filter('**/*.css'))

        //Inject changes via browsersync
        .pipe(reload({stream: true}))

        //Notify on successful compile
        .pipe(notify("Compiled: <%= file.relative %>"));
});

//Scripts
gulp.task('scripts', function () {
    gulp.src(js_src)
        //Notify on error
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

        //Cache files to avoid processing files that haven't changed
        .pipe(cache('scripts'))

        //Add .min suffix
        .pipe(rename({ suffix: '.min' }))

        //Minify
        .pipe(uglify())

        //Output the processed js to this directory
        .pipe(gulp.dest(js_dest))

        //Inject changes via browsersync
        .pipe(reload({stream: true}))

        //Notify on successful compile
        .pipe(notify("Minified: <%= file.relative %>"));
});

//Images
gulp.task('images', function () {
    return gulp.src(img_src)
        //Notify on error
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))

        //Cache files to avoid processing files that haven't changed
        .pipe(cache('images'))

        //Optimise images
        .pipe(imagemin({
            progressive: true
        }))

        //Output the optimised images to this directory
        .pipe(gulp.dest(img_dest))

        //Inject changes via browsersync
        .pipe(reload({stream: true}))

        //Notify on successful compile
        .pipe(notify("Optimised: <%= file.relative %>"));
});

//Browsersync
gulp.task('browsersync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    //Watch for changes
    gulp.watch(sass_src, ['sass']);
    gulp.watch(js_src, ['scripts']);
    gulp.watch('images/**/*', ['images']);
    gulp.watch("**/*.html").on("change", reload);
});

//Default
gulp.task('default', ['browsersync'], function() {
    gulp.start('sass', 'scripts');
});
