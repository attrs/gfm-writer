var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg = require('./package.json');
var path = require('path');
var osenv = require('osenv');

var HOME = osenv.home() || __dirname;

gulp.task('build', function () {
  var nw = new NwBuilder({
    appName: 'GFM Writer',
    appVersion: pkg.version,
    version: '0.12.3',
    files: './app/**',
    macIcns: './app/icons/gfmw.icns',
    //winIco: './app/icons/gfmw.ico',
    buildDir: './dist',
    cacheDir: path.resolve(HOME, './.nw-builder'),
    platforms: ['win', 'osx', 'linux']
  });

  // Log stuff you want
  nw.on('log', function (msg) {
    gutil.log('nw-builder', msg);
  });

  // Build returns a promise, return it so the task isn't called in parallel
  return nw.build().catch(function (err) {
    gutil.log('nw-builder', err);
  });
});

gulp.task('default', ['build']);