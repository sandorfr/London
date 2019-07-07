const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');
const psList = require('ps-list');
const adminApiClient = require("@tryghost/admin-api");
const fs = require('fs');
const path = require('path');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var beeper = require('beeper');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function css(done) {
    var processors = [
        easyimport,
        customProperties({ preserve: false }),
        colorFunction(),
        autoprefixer({ browsers: ['last 2 versions'] }),
        cssnano()
    ];

    pump([
        src('assets/css/*.css', { sourcemaps: true }),
        postcss(processors),
        dest('assets/built/', { sourcemaps: '.' }),
        livereload()
    ], handleError(done));
}

function js(done) {
    pump([
        src('assets/js/*.js', { sourcemaps: true }),
        uglify(),
        dest('assets/built/', { sourcemaps: '.' }),
        livereload()
    ], handleError(done));
}

function zipper(done) {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**', "!.data/**",
            "!.debug/**",
            "!.devcontainer/**",
            "!.token"
        ]),
        zip(filename),
        dest(targetDir)
    ], handleError(done));
}

async function ghost() {
    var exec = require("child_process").exec;
    const processes = await psList();

    const ghostProcess = processes.filter(x => x.cmd == "/usr/local/bin/node current/index.js");

    if (ghostProcess.length) {
        process.kill(ghostProcess[0].pid)
    }

    exec(
        "node current/index.js",
        { cwd: process.env.GHOST_INSTALL, env: process.env, detached: true },
        function callback(error, stdout, stderr) {
        }
    );
};

async function deployThemeViaApi(done) {

    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    const themePath = path.join(__dirname, targetDir, filename);

    const url = "http://localhost:2368";

    const client = new adminApiClient({
        url,
        key: fs.readFileSync(path.join(__dirname, '.token'), { encoding: 'utf8' }),
        version: "v2"
    });

    await client.themes.upload({ file: themePath });
};

const cssWatcher = () => watch('assets/css/**', css);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, hbsWatcher);
const build = series(css, js);
const dev = series(build, serve, watcher);


const zipBuild = series(build, zipper);

const dockerCssWatcher = () => watch('assets/css/**', series(zipBuild, deployThemeViaApi));
const dockerHbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs', '!node_modules/**/*.hbs'], series(zipBuild, deployThemeViaApi));
const dockerWatcher = parallel(dockerCssWatcher, dockerHbsWatcher);

const dockerDev = series(ghost, zipBuild, deployThemeViaApi, dockerWatcher);

exports.ghost = ghost;
exports.build = build;
exports.zip = zipBuild;
exports.dev = dev;
exports.default = dockerDev;
