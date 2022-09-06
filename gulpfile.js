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
const html = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(BUILD_DIR))
);

// Copy HTML
const copyHtml = () => (
  gulp.src(`${SOURCE_DIR}/*.html`)
    .pipe(gulp.dest(BUILD_DIR))
);

// Scripts
const scripts = () => (
  gulp.src(`${SOURCE_DIR}/js/**/*.js`, { sourcemaps: true })
    .pipe(terser())
    .pipe(gulp.dest(`${BUILD_DIR}/js`, { sourcemaps: '.' }))
    .pipe(browser.stream())
);

// Copy images
const copyImages = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Optimize images
const optimizeImages = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(squoosh())
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);


// Create webp
const webp = () => (
  gulp.src(`${SOURCE_DIR}/img/**/*.{jpg,jpeg,png}`)
    .pipe(squoosh({ webp: {} }))
    .pipe(gulp.dest(`${BUILD_DIR}/img`))
);

// Svg
const svg = () => (
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
const fonts = () => (
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
  gulp.watch(`${SOURCE_DIR}/sass/**/*.scss`, gulp.series(styles));
  gulp.watch(`${SOURCE_DIR}/js/**/*.js`, gulp.series(scripts));
  gulp.watch(`${SOURCE_DIR}/*.html`).on('change', gulp.series(copyHtml, browser.reload));
};

// Development
const dev = gulp.series(
  clean,
  gulp.parallel(
    styles,
    copyHtml,
    scripts,
    copyImages,
    webp,
    svg,
    svgSprite,
    fonts,
    others
  ),
  server,
  watcher,
);

// Production
export const prod = gulp.series(
  clean,
  gulp.parallel(
    styles,
    html,
    scripts,
    optimizeImages,
    webp,
    svg,
    svgSprite,
    fonts,
    others
  ),
);

export default dev;
