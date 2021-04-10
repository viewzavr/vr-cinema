#!/usr/bin/env node



/*
  https://github.com/cloudhead/node-static
  https://github.com/jfhbrook/node-ecstatic/issues/259
  https://www.npmjs.com/package/ws#sending-binary-data
  https://github.com/pavelvasev/38parrots/blob/master/examples/_tutorial/5-websockets/fun-server.js
*/

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const process = require('process');
var dir = process.argv[2] || ".";
//console.log( process.argv );
console.log("serving dir:",dir );

var nstatic = require('node-static');
var nstatic_opts = {headers: {"Access-Control-Allow-Origin": "https://viewzavr.com",
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, If-Modified-Since, ETag",
             "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            },
            cache: 0 // should be 0 so node-static will respond with Cache-control: max-age=0 and that is what we need, F-FRESH-FILES
  }
  
var fileServer = new nstatic.Server( dir,nstatic_opts );

var server = require('http').createServer( reqfunc );
var fs = require('fs');

import * as E from './explore.mjs';

function reqfunc(request, response) {
    console.log(request.url, request.method );
    
    if (request.url == "/")
      return E.explore( server, dir, request, response,{watcher_port:watcher_port}  );
    
    if (request.method == "POST") {
      var filepath = dir + request.url; // TODO fix this! to be file inside url
      
      let body = '';
      console.log("method is post, will write file",filepath);
      request.on('data', (chunk) => {
          body += chunk;
      });
      request.on('end', () => {
          fs.writeFile( filepath,body, function (err) {
            if (err) return console.log(err);
            console.log("data saved");
          } );
          
          //console.log(body);
          response.setHeader( "Access-Control-Allow-Origin","*");
          response.write('OK'); 
          response.end();
      });
    }
    else
    if (request.method == "OPTIONS") {
          // https://stackoverflow.com/a/55979796
          // probably we should change our file serving method (e.g. node-static)
          // response.setHeader( "Allow","OPTIONS, GET, HEAD, POST");
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
          for (var k in nstatic_opts.headers)
            response.setHeader( k,nstatic_opts.headers[k] );
          response.write('OK'); 
          response.end();    
    }
    else
    request.addListener('end', function () {
        console.log("serving as file");
        fileServer.serve(request, response);
    }).resume();
}

var port = 0; // auto-detect
var host = 'localhost'; // only local iface

//////////// feature: port scan. initial port value should be non 0
port = 8080;
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    port = port+1;
    server.listen( port,host );
  }
});

/////////// feature: watch files
import WF from "./feature-watch-file.mjs";
var watcher_port = WF( dir );

/////////// feature: open bro

var opener = require("opener");
import * as path from 'path';

server.on("listening",() => {

  var opath;
  var datacsv_file_path = path.join( dir, "data.csv" );
  if (fs.existsSync(datacsv_file_path)) {
    opath = E.vzurl( server,"",{watcher_port:watcher_port} );
  }
  else
  {
    opath = `http://${server.address().address}:${server.address().port}/`;
  }
    console.log("opening in bro:",opath);
    opener( opath );
});


//////////////////////////

server.listen( port,host );

server.on("listening",() => {
  console.log('server started: http://%s:%s', server.address().address, server.address().port);
  //console.log(server.address());
});