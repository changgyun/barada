var gulp = require ('gulp'),
    sass = require ('gulp-sass'),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    mainBowerFiles = require("gulp-main-bower-files"),
    filter = require("gulp-filter"),
    flatten = require("gulp-flatten"),
    browserSync = require ('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    reload = browserSync.reload;

var target = {
    sassSrc : 'stylePublic/sass/**/*.scss',
    sassApp : 'stylePublic/sass/app.scss',
    resourceSrc : 'stylePublic/resource/**/*',
    jsSrc : 'stylePublic/js/**/*',
    cssDest : 'dist/css',
    jsDest : 'dist/js',
    resourceDest : 'dist/resource',
    fontDest : 'dist/font',
    dest : 'dist'
};

gulp.task ('sass', function (){
    gulp.src(target.sassApp)
        //.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sass({}).on('error', sass.logError))
        .pipe(gulp.dest(target.cssDest))
        .pipe(sourcemaps.write())
        .pipe(reload({stream:true}));
});

gulp.task("vendor", function() {
    var jsFilter = filter("**/*.js", {restore: true}),
        cssFilter = filter("**/*.css", {restore: true}),
        fontFilter = filter([ "**/*.eot", "**/*.svg", "**/*.ttf", "**/*.woff", "**/*.woff2" ], {restore: true});
    gulp
        .src("bower.json")
        .pipe(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest(target.jsDest))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concat("vendor.css"))
        .pipe(gulp.dest(target.cssDest))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(flatten())
        .pipe(gulp.dest(target.fontDest));
});

gulp.task("resource", function() {
    gulp
        .src(target.resourceSrc)
        .pipe(gulp.dest(target.resourceDest));

});

gulp.task("clean", function() {
    return gulp
        .src([target.dest], {read: false})
        .pipe(clean({force: true}));
});

gulp.task('default', ['resource', 'vendor', 'sass'], function(){
    browserSync({server: target.dest});
    gulp.watch(target.sassSrc, ['sass']);
});