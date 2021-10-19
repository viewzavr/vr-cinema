#!/usr/bin/env node

import * as path from 'path';

// F_LOCAL_CINEMA {
  import { URL } from 'url'; // in Browser, the URL in native accessible on window
  const __filename = new URL('', import.meta.url).pathname;
  const __dirname = new URL('.', import.meta.url).pathname; // Will contain trailing slash
// F_LOCAL_CINEMA }

/*
  https://github.com/cloudhead/node-static
  https://github.com/jfhbrook/node-ecstatic/issues/259
  https://www.npmjs.com/package/ws#sending-binary-data
  https://github.com/pavelvasev/38parrots/blob/master/examples/_tutorial/5-websockets/fun-server.js
*/

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var fs = require('fs');
var process = require('process');

var dir = process.argv[2] || ".";
//console.log( process.argv );
console.log("serving dir:",dir );

// R-SECURE
if (fs.existsSync( path.join( dir,".ssh"))) {
  console.log("It seems you are running from user home dir. This is not recommended because all your files might be visible via HTTP, including .ssh credentials. Exiting." );
  process.exit(1);
}

var nstatic = require('node-static');
var nstatic_opts = {
                     cache: 0 // should be 0 so node-static will respond with Cache-control: max-age=0 and that is what we need, F-FRESH-FILES
                   }
/*  
var headers = {
             "Access-Control-Allow-Origin" : "*",
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, If-Modified-Since, ETag",
             "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            }  
*/            
  
var fileServer = new nstatic.Server( dir,nstatic_opts );
//console.log("project dir",__dirname + "/../")
var fileServerCinema = new nstatic.Server( __dirname + "/../",nstatic_opts ); // F-LOCAL-CINEMA

var server = require('http').createServer( reqfunc );


import * as E from './explore.mjs';
//import url from 'url';

function reqfunc(request, response) {
    console.log(request.url, request.method );
    
    //for (var k in nstatic_opts.headers) 
    if (request.headers.origin) {
        //const u =  url.parse ( request.headers.referer );
        response.setHeader( "Access-Control-Allow-Origin",request.headers.origin ); // F-REQESTER-CORS
        response.setHeader( "Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, If-Modified-Since, ETag" );
        response.setHeader( "Access-Control-Allow-Methods","GET,HEAD,OPTIONS,POST,PUT" );
    }
    
    if (request.url == "/")
      return E.explore( server, dir, request, response, explore_params );
    
    if (request.method == "POST") {
      var filepath = dir + request.url; // TODO fix this! to be file inside url
      // R-SECURE
      var relative = path.relative( dir, filepath );
      var is_inside = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
      if (path.basename( filepath ) != "viewzavr-player.json" || !is_inside) {
        console.log("POST to invalid url, breaking");
        response.end();
        return;
      }      
      
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
          //response.setHeader( "Access-Control-Allow-Origin","*");
          //response.write('OK');
          response.end();
      });
    }
    else
    if (request.method == "OPTIONS") {
          // https://stackoverflow.com/a/55979796
          // probably we should change our file serving method (e.g. node-static)
          // response.setHeader( "Allow","OPTIONS, GET, HEAD, POST");
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/OPTIONS
          //for (var k in nstatic_opts.headers) response.setHeader( k,nstatic_opts.headers[k] );
          // response.write('OK'); 
          response.end();
    }
    else
    request.addListener('end', function () {

        let url = new URL(request.url,'http://localhost');
        if (url.pathname.startsWith("/local-vr-cinema")) {
          url.pathname = url.pathname.substring(16);
          request.url = url.toString();
          console.log("serving as project file");
          fileServerCinema.serve(request, response); // F-LOCAL-CINEMA
        }
        else {
          console.log("serving as dir file");
          fileServer.serve(request, response);
        }
    }).resume();
}

var port = 0; // auto-detect
var host = process.env.VR_HOST || '127.0.0.1'; // only local iface

/////////// feature: watch files
import WF from "./feature-watch-file.mjs";
var watcher_server = WF( dir, host );
var watcher_port = 0;

///////////
//var vr_cinema_url = (host == "127.0.0.1" ? "https://viewzavr.com/apps/vr-cinema" : "http://viewzavr.com/apps/vr-cinema");
var vr_cinema_url = "/local-vr-cinema"; // F-LOCAL-CINEMA
var explore_params = {watcher_port, vr_cinema_url};

//////////// feature: port scan. initial port value should be non 0
port = 8080;
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    port = port+1;
    server.listen( port,host );
  }
});

/////////// feature: open bro

var opener = require("opener");


watcher_server.on("listening",() => {
 watcher_port = watcher_server.address().port;
 console.log("websocket server listening on port",watcher_port );

server.on("listening",() => {

  var opath;
  var datacsv_file_path = path.join( dir, "data.csv" );
  if (fs.existsSync(datacsv_file_path)) {
    opath = E.vzurl( server,"",explore_params );
  }
  else
  {
    opath = `http://${server.address().address}:${server.address().port}/`;
  }
    console.log("opening in bro:",opath);
    opener( opath );
});
});


//////////////////////////

server.listen( port,host );

server.on("listening",() => {
  console.log('server started: http://%s:%s', server.address().address, server.address().port);
  //console.log(server.address());
});
