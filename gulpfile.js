const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");

// HTML

const html = () => {
 return gulp.src("source/*.html")
    .pipe(htmlmin(options= { collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

//Scripts
const scripts = () => {
  return gulp.src("source/js/script/js")
    .pipe(terser())
    .pipe(rename(obj= "script.min.js"))
    .pipe (gulp.dest("build/js"));
}

exports.scripts = scripts;

//Images

const optimizeImages = () => {
  return gulp.src("source/img/*.{jpg,png.svg}")
  .pipe(squoosh())
  .pipe(gulp.dest("build/img"));
}

exports.optimizeImages = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/*.{jpg,png.svg}")
    .pipe(gulp.dest("build/img"));
}

exports.copyImages = copyImages;

//Webp

const createWebp = () => {
  return gulp.src("source/img/*.{jpg,png}")
    .pipe(webp(options= {quality: 90}))
    .pipe(gulp.dest("build/img"));
}

exports.createWebp = createWebp;

//Sprite

const sprite = () => {
  return gulp.src("source/img/*.svg")
    .pipe(svgstore(config= {
      inlineSvg: true
    }))
    .pipe(rename(obj="sprite.svg"))
    .pipe(gulp.dest("build/img"));
}

exports.sprite = sprite;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(), csso()
    ]))
    .pipe(rename(obj="style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

//Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*/ico",
    "source/img/*.svg"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//Clean

const clean = () => {
  return del(patterns="build");
};

exports.clean = clean;

//Build

const build = gulp.series (
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    sprite,
    createWebp
  ),
);

exports.build = build;

