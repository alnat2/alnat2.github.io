/*jshint esversion: 6 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const minify = require("gulp-babel-minify");
const htmlmin = require('gulp-html-minifier');
const csso = require('gulp-csso');
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
gulp.task('watch', () => {
	gulp.watch(paths.watch.css, ['mincss']);
	gulp.watch(paths.watch.html, ['minhtml']);
	gulp.watch(paths.watch.js, ['toes5', 'minjs']);
});
gulp.task('reload', () => 
	liveServer.start(serverParams)
	);
gulp.task('default', ['reload', 'watch']);