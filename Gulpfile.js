const gulp = require('gulp');
const concat = require('gulp-concat');
const bower = require('gulp-bower');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const merge = require('merge-stream');
const autoprefixer = require('gulp-autoprefixer');

const autoprefixer_versions = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

const config = {
    jsPath: './src/js',
    sassPath: './src/sass',
    bowerDir: './bower_components',
    cardPath: './bower_components/card'
};

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/DatPayment.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                config.sassPath
            ]
        }).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixer_versions))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function () {
    return merge(
        gulp.src([
            config.cardPath + '/dist/card.js',
        ])
        ,
        gulp.src([
            config.jsPath+"/DatPayment.js",
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
    ).pipe(concat("DatPayment.js"))
     .pipe(gulp.dest('./dist/js'))
});

gulp.task('default',function() {
    gulp.watch([config.jsPath+'/*.js'],['js']);
    gulp.watch([config.sassPath+'/*.scss'],['css']);
});