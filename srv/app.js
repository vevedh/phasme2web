'use strict';
const forever = require('forever-monitor');

var cacemsvr = new forever.Monitor('src/index-ssl.js', {
  uid: 'cacemsvr',
  append: true,
  silent: true,
  watch: true,
  sourceDir: './',
  workingDir: './',
  watchDirectory: './src',
  logFile: './cacemsvr.log',
  outFile: './svrout.log',
  errFile: './svrerror.log',
});

/*var admsvr = new (forever.Monitor)("srcadm/index.js", {
    uid: "admsvr",
    append: true,
    silent: true,
    watch: true,
    sourceDir: "./",
    workingDir: "./",
    watchDirectory: "./srcadm",
    logFile: "./admsvr.log",
    outFile: "./admout.log",
    errFile: "./admerror.log"
    });


var sshsvr = new (forever.Monitor)("src/sshapp/index.js", {
      uid: "ssh2svr",
      append: true,
      silent: true,
      watch: true,
      sourceDir: "./",
      workingDir: "./",
      watchDirectory: "./src/sshapp",
      logFile: "./ssh2svr.log",
      outFile: "./ssh2out.log",
      errFile: "./ssh2error.log"
      });
*/
cacemsvr.on('exit', function () {
  console.log('Le serveur web est arreté !!');
});



cacemsvr.start();
//admsvr.start();
//sshsvr.start();
