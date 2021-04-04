#!/usr/bin/env node

//console.log( process.argv );
//var cmd = (process.argv[2] == "off" ? "uninstall" : "install");
var cmd = "uninstall";

import * as CP from 'child_process';



import * as path from 'path';
import { fileURLToPath } from 'url';

function localpath( name ) {
  const __dirname = fileURLToPath(import.meta.url)
  const d2 = path.dirname( __dirname );
  return path.join( d2, name );
}

var isWin = process.platform === "win32";
console.log("cmd=",cmd,"isWin=",isWin);

if (isWin) {
  var n = localpath( `setup-windows/${cmd}.cmd` );
  console.log("calling",n);
  var p = CP.exec(n);
  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}
else
{
  var n = localpath( `setup-linux/${cmd}.sh` );
  console.log("calling",n);
  var p = CP.exec(n);
  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}