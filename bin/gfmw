#!/usr/bin/env node

var findpath = require('nodewebkit').findpath;
var spawn = require('child_process').spawn;
var path = require('path');

process.title = 'GFM Writer';

var nwpath = findpath();
var apppath = path.resolve(__dirname, '../');
var argv = process.argv;
var argc = [apppath];

for(var i=2; i < argv.length; i++) {
  argc.push(argv[i]);
}

console.log('nwpath', nwpath);
console.log('cwd', process.cwd());

spawn(nwpath, argc, {
  cwd: process.cwd(),
  stdio: 'inherit'
});