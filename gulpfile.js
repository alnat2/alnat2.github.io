/*jshint esversion: 6 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const minify = require("gulp-babel-minify");
const htmlmin = require('gulp-html-minifier');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const liveServer = require('live-server');

const paths = {
	watch: {
		html: 'dev/*.html',
		js: 'dev/js/*.js',
		css: 'dev/css/*.css'
	}
};
const serverParams = {
	port: 4000,
	watch: 'dev'
};
// function toes5() {
// 	return gulp
// 		.src('dev/js/timer.js')
// 		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
//         .pipe(rename('dev/js/timeres5.js'))
//         .pipe(babel({
// 			presets: ['@babel/env']
// 		}))
// 		.pipe(gulp.dest('.'))
// }

function minjs() {
	return gulp
	  .src("dev/js/*.js")
	  .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
	  .pipe(minify({
		builtIns: false
	  }))
	  .pipe(gulp.dest("./js"))
}

function minhtml() {
	return gulp
	.src('dev/*.html')
	.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('./'))
}

function mincss() {
	return gulp
		.src('dev/css/*.css')
		.pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
		.pipe(csso())
		.pipe(gulp.dest('./css'))
}

function watchFiles() {
	gulp.watch(paths.watch.css, mincss);
	gulp.watch(paths.watch.html, minhtml);
	gulp.watch(paths.watch.js, minjs);
	// gulp.watch(paths.watch.js, gulp.series(toes5, minjs));
  }
// 
function liveServerStart() {
	liveServer.start(serverParams);
	// done();
  }
gulp.task('default', gulp.parallel(watchFiles, liveServerStart));
// gulp.task('default', ['reload', 'watch']);
