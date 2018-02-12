/*jshint esversion: 6 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const minify = require("gulp-babel-minify");
const htmlmin = require('gulp-html-minifier');
const csso = require('gulp-csso');
const liveServer = require('live-server');

serverParams = {
	port: 4000,
	watch: 'dev'
};

gulp.task('toes5', () =>
	gulp.src('js/timer.js')
        .pipe(rename('js/timeres5.js'))
        .pipe(babel())
		.pipe(gulp.dest('.'))
	);
gulp.task("minjs", () =>
	gulp.src("js/*.js")
	  .pipe(minify({
		mangle: {
		  keepClassName: true
		}
	  }))
	  .pipe(gulp.dest("build"))
	);
	gulp.task('minhtml', () =>
		gulp.src('./*.html')
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest('build'))
	);
	gulp.task('mincss', () =>
    gulp.src('css/*.css')
      .pipe(csso())
      .pipe(gulp.dest('build'))
	);
gulp.task('watch', () => 
	liveServer.start(serverParams)
	);