// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var addsrc = require('gulp-add-src');
var uglify = require('gulp-uglify');

//js
var jshint = require('gulp-jshint');

//html
var pug = require('gulp-pug');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

//css
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sassLint = require('gulp-sass-lint');

// -------------------------------------
//   Options
// -------------------------------------


/* ==========================================================================
   css gulp
   ========================================================================== */

gulp.task('build', ['sass', 'pug']);

gulp.task('sassLint', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/application.scss')
        .pipe(sass({
        //   outputStyle: 'compressed',
          includePaths: [
            'scss',
            'node_modules/breakpoint-sass/stylesheets'
          ]
        }))
        .pipe(gulp.dest('dist/css'))
        // .pipe(sassLint({
        //     options: {
        //         formatter: 'stylish',
        //         'merge-default-rules': false
        //     },
        //     files: { ignore: '**/*.scss' },
        //     rules: {
        //         'no-ids': 1,
        //         'no-mergeable-selectors': 0
        //     },
        //     configFile: 'config/.sass-lint.yml'
        // }))
        // .pipe(sassLint.format())
        // .pipe(sassLint.failOnError())
        .pipe(connect.reload());
});

//minify css
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('dist/css/application.css')
        .pipe(cleanCSS())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(connect.reload());
});

/* ==========================================================================
   html gulp
   ========================================================================== */

gulp.task('pug', function buildHTML() {
    return gulp.src('pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

/* ==========================================================================
   javscript gulp
   ========================================================================== */

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['script/jquery.min.js', 'script/tether.min.js', 'script/boostrap.js', 'script/**/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

/* ==========================================================================
   common gulp
   ========================================================================== */

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/**/*.scss', ['sass', 'minify-css']);
    gulp.watch('pug/*.pug', ['pug']);
});

// connect
gulp.task('connect', function() {
    connect.server({
        port: 9000,
        root: 'dist',
        livereload: true
    });
});

// Default Task
gulp.task('default', ['sass', 'pug', 'connect', 'watch']);