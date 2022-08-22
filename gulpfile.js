import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import {deleteAsync} from 'del';

const SOURCE_DIR = 'source';
const BUILD_DIR = 'build';

// Styles
export const styles = () => (
  gulp.src(`${SOURCE_DIR}/sass/style.scss`, { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso(),
    ]))
    .pipe(gulp.dest(`${BUILD_DIR}/css`, { sourcemaps: '.' }))
    .pipe(browser.stream())
);

// HTML
export const html = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(BUILD_DIR))
);

// Copy HTML
export const copyHtml = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(gulp.dest(BUILD_DIR))
);

// Scripts
export const scripts = () => (
  gulp.src(`${SOURCE_DIR}/js/**/*.js`, { sourcemaps: true })
    .pipe(terser())
    .pipe(gulp.dest(`${BUILD_DIR}/js`, { sourcemaps: '.' }))
    .pipe(browser.stream())
);

// Images
export const images = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Svg
export const svg = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.svg`)
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Fonts
export const fonts = () => (
  gulp.src(`${SOURCE_DIR}/fonts/*.{woff,woff2}`)
    .pipe(gulp.dest(`${BUILD_DIR}/fonts`))
);

// Others
export const others = () => (
  gulp.src(`${SOURCE_DIR}/*.ico`)
    .pipe(gulp.dest(BUILD_DIR))
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
export const clean = () => deleteAsync(BUILD_DIR);

// Watchers
const watcher = async () => {
  gulp.watch(`${SOURCE_DIR}/sass/**/*.scss`, gulp.series(styles));
  gulp.watch(`${SOURCE_DIR}/js/**/*.js`, gulp.series(scripts));
  gulp.watch(`${SOURCE_DIR}/*.html`).on('change', gulp.series(copyHtml, browser.reload));
};

// Dev
const dev = gulp.series(
  clean,
  gulp.parallel(styles, copyHtml, scripts, images, svg, fonts, others),
  server,
  watcher,
);

export default dev;
