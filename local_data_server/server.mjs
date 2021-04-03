#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const process = require('process');
var dir = process.argv[2] || ".";
//console.log( process.argv );
console.log("serving dir:",dir );

var nstatic = require('node-static');
var opts = {headers: {"Access-Control-Allow-Origin": "*", 
             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"},
             "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
  } 
var fileServer = new nstatic.Server( dir,opts );

var server = require('http').createServer( reqfunc );
var fs = require('fs');

function reqfunc(request, response) {
    console.log(request.url, request.method );
    
    if (request.method == "POST") {
      var filepath = dir + request.url;
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
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}

var port = 0; // auto-detect
var host = 'localhost'; // only local iface


// feature: port scan. initial port value should be non 0
port = 8080;
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    port = port+1;
    server.listen( port,host,listenfunc);
  }
});

/////////// feature: open bro

var opener = require("opener");
server.on("listening",() => {
  var path = `http://${server.address().address}:${server.address().port}/data.csv`;
  var spath = `http://${server.address().address}:${server.address().port}/viewzavr-player.json`;
  
  var storepath = `http://${server.address().address}:${server.address().port}/viewzavr-player.json`;
  
  var opath = `http://viewzavr.com/apps/vr-cinema?datapath=${path}&settings=${spath}&storepath=${storepath}`;
  console.log("opening in bro:",opath);
  opener( opath );
});


///////////

server.listen( port,host,listenfunc);

function listenfunc() {
  console.log('server started: http://%s:%s', server.address().address, server.address().port);
  console.log(server.address());
}