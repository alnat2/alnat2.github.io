/*jshint esversion: 6 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
 
gulp.task('default', () =>
	gulp.src('js/timer.js')
        .pipe(rename('js/timeres5.js'))
        .pipe(babel())
		.pipe(gulp.dest('.'))
	);