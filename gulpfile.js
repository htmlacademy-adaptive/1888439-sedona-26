import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import {deleteAsync} from 'del';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgmin';


const SOURCE_DIR = 'source';
const BUILD_DIR = 'build';


// Styles
const optimizeStyles = () => (
  gulp.src(`${SOURCE_DIR}/sass/style.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso(),
    ]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest(`${BUILD_DIR}/css`, { sourcemaps: '.' }))
);

const createStyles = () => (
  gulp.src(`${SOURCE_DIR}/sass/style.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest(`${BUILD_DIR}/css`, { sourcemaps: '.' }))
    .pipe(browser.stream())
);

// HTML
const optimizeHtml = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(BUILD_DIR))
);

const copyHtml = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(gulp.dest(BUILD_DIR))
);

// Scripts
const optimizeScripts = () => (
  gulp.src(`${SOURCE_DIR}/js/**/*.js`, { sourcemaps: true })
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(`${BUILD_DIR}/js`, { sourcemaps: '.' }))
);

const copyScripts = () => (
  gulp.src(`${SOURCE_DIR}/js/**/*.js`, { sourcemaps: true })
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest(`${BUILD_DIR}/js`, { sourcemaps: '.' }))
    .pipe(browser.stream())
);

// Images
const copyImages = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

const optimizeImages = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(squoosh())
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

const webp = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(squoosh({ webp: {} }))
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Svg
const optimizeSvg = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.svg`)
    .pipe(svgo())
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

const svgSprite = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          name: 'removeViewBox',
          active: false,
        },
      ],
    }))
    .pipe(svgstore({
      inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Fonts
const copyFonts = () => (
  gulp.src(`${SOURCE_DIR}/fonts/*.{woff,woff2}`)
    .pipe(gulp.dest(`${BUILD_DIR}/fonts`))
);

// Others
const others = () => (
  gulp.src([
    `${SOURCE_DIR}/*.ico`,
    `${SOURCE_DIR}/manifest.json`,
    `${SOURCE_DIR}/browserconfig.xml`,
  ]).pipe(gulp.dest(BUILD_DIR))
);

// Server
const server = async () => {
  browser.init({
    server: {
      baseDir: BUILD_DIR,
    },
    cors: true,
    notify: false,
    ui: false,
  });
};

// Clean
const clean = () => deleteAsync(BUILD_DIR);

// Watchers
const watcher = async () => {
  gulp.watch(`${SOURCE_DIR}/sass/**/*.scss`, gulp.series(createStyles));
  gulp.watch(`${SOURCE_DIR}/js/**/*.js`, gulp.series(copyScripts));
  gulp.watch(`${SOURCE_DIR}/*.html`).on('change', gulp.series(copyHtml, browser.reload));
};

// Development
const dev = gulp.series(
  clean,
  gulp.parallel(
    createStyles,
    copyHtml,
    copyScripts,
    copyImages,
    webp,
    optimizeSvg,
    svgSprite,
    copyFonts,
    others
  ),
  server,
  watcher,
);

// Production
export const prod = gulp.series(
  clean,
  gulp.parallel(
    optimizeStyles,
    optimizeHtml,
    optimizeScripts,
    optimizeImages,
    webp,
    optimizeSvg,
    svgSprite,
    copyFonts,
    others
  ),
);

export default dev;
