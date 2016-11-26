var gulp = require('gulp');
var concat = require('gulp-concat');
var bower = require('gulp-bower');
var babel = require('gulp-babel');

var config = {
    jsPath: './src/js',
    bowerDir: './bower_components',
    cardPath: './bower_components/card'
};

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

gulp.task('js', function () {
        gulp.src([
            config.cardPath + '/dist/card.js',
            config.jsPath+"/DatPayment.js"
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat("DatPayment.js"))
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default',function() {
    gulp.watch([config.jsPath+'/*.js'],['js']);
});