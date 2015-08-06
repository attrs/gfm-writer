var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var pkg = require('./package.json');
var path = require('path');
var fs = require('fs');
var osenv = require('osenv');
var wrench = require('wrench');
var uuid = require('uuid');
var msi = require('msi-packager');

// common variables
var appName = 'GFM Writer';
var HOME = osenv.home() || __dirname;
var TARGET = path.resolve(__dirname, 'build');

gulp.task('build', function(done) {
  wrench.rmdirSyncRecursive(TARGET);
  
  var nw = new NwBuilder({
    appName: appName,
    appVersion: pkg.version,
    version: '0.12.3',
    files: ['./app/package.json', './app/*.html', './app/js/**', './app/css/**', './app/icons/**', './app/images/**', './app/libs/ui-aliens/dist/ui-aliens.min.inline.html', './app/libs/ui-aliens/dist/extra/**/**'],
    buildDir: TARGET,
    macIcns: './app/icons/gfmw.icns',
    winIco: './app/icons/gfmw.ico',
    cacheDir: path.resolve(HOME, './.nw-builder'),
    platforms: ['win', 'osx', 'linux']
  });

  // Log stuff you want
  nw.on('log', function (msg) {
    gutil.log('nw-builder', msg);
  });

  // Build returns a promise, return it so the task isn't called in parallel
  nw.build().then(function() {
    gutil.log('nw-builder', 'Complete!');
    done();
  }).catch(function (err) {
    gutil.log('nw-builder', err);
    done(err);
  });
});

gulp.task('build.msi', ['build'], function(done) {
  var GUID = uuid.v4();
  gutil.log('msi-packager', GUID);
  
  var source = path.resolve(TARGET, appName);
  if( !fs.existsSync(path.resolve(source, 'win64')) ) return done(new Error('source dir "' + path.resolve(source, 'win64') + '" not found'));
  if( !fs.existsSync(path.resolve(source, 'win32')) ) return done(new Error('source dir "' + path.resolve(source, 'win32') + '" not found'));
  
  msi({
    source: path.resolve(source, 'win64'),
    output: path.resolve(source, appName + '-' + pkg.version + '-x64.msi'),
    name: appName,
    upgradeCode: GUID,
    version: pkg.version,
    manufacturer: 'attrs',
    iconPath: path.resolve(__dirname, './app/icons/gfmw.ico'),
    executable: appName + '.exe',
    description: pkg.description,
    arch: 'x64',
    localInstall: false
  }, function (err) {
    if( err ) return gutil.log('msi-packager', err) && done(err) && false;
    
    msi({
      source: path.resolve(source, 'win32'),
      output: path.resolve(source, appName + '-' + pkg.version + '-x86.msi'),
      name: appName,
      upgradeCode: GUID,
      version: pkg.version,
      manufacturer: 'attrs',
      iconPath: path.resolve(__dirname, './app/icons/gfmw.ico'),
      executable: appName + '.exe',
      description: pkg.description,
      arch: 'x86',
      localInstall: false
    }, function (err) {
      if( err ) return gutil.log('msi-packager', err) && done(err) && false;

      gutil.log('msi-packager', 'Complete!');
      done();
    });
  });
});

gulp.task('default', ['build.msi']);