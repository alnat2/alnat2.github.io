/*jshint esversion: 6 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const minify = require("gulp-babel-minify");
 
gulp.task('toes5', () =>
	gulp.src('js/timer.js')
        .pipe(rename('js/timeres5.js'))
        .pipe(babel())
		.pipe(gulp.dest('.'))
	);
gulp.task("minify", () =>
	gulp.src("js/*.js")
	  .pipe(minify({
		mangle: {
		  keepClassName: true
		}
	  }))
	  .pipe(gulp.dest("build"))
  );