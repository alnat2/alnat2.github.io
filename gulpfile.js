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
	gulp.src('dev/js/timer.js')
        .pipe(rename('dev/js/timeres5.js'))
        .pipe(babel())
		.pipe(gulp.dest('.'))
	);
gulp.task("minjs", () =>
	gulp.src("dev/js/*.js")
	  .pipe(minify())
	  .pipe(gulp.dest("./js"))
	);
	gulp.task('minhtml', () =>
		gulp.src('dev/*.html')
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest('./'))
	);
	gulp.task('mincss', () =>
    gulp.src('dev/css/*.css')
      .pipe(csso())
      .pipe(gulp.dest('./css'))
	);
gulp.task('watch', () => 
	liveServer.start(serverParams)
	);