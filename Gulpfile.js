var gulp = require('gulp');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var babel = require('gulp-babel');
var merge = require('merge-stream');

var config = {
    jsPath: './src/js',
    sassPath: './src/sass',
    bowerDir: './bower_components',
    cardPath: './bower_components/card'
};

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
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
});