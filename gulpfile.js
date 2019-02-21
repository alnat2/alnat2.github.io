/*jshint esversion: 6 */
const gulp = require('gulp');
const minify = require("gulp-babel-minify");
const htmlmin = require('gulp-html-minifier');
const csso = require('gulp-csso');
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");

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
  }
  
gulp.task('default', gulp.parallel(watchFiles));
