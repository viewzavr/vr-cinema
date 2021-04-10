#!/usr/bin/env node
// [data.csv] file watching service/feature (actually a lib, not a feature?)

// https://github.com/pavelvasev/38parrots/blob/master/examples/_tutorial/5-websockets/fun-server.js

import WS from 'ws';
import * as FS from 'fs';
import * as path from 'path';

export default function startWatcherService(basedir) {
  //console.log(WS);

  // подключённые клиенты
  var clients = {};
  var fileSubscriptions = {}; // mapping filename => client_id (or client?)
  var webSocketServer = alloc( 5555);
  
  console.log( "started websocket server",webSocketServer.options.port );

  webSocketServer.on('connection', function(ws,request,client) {

    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id, request.url );
    
    
    var filepath = path.join( basedir, request.url );
    console.log("starting watch to",filepath);
    FS.watch( filepath,(event,path) => {
      console.log("olalaa",event,path);
      ws.send("OLALA");
    });

    ws.on('close', function() {
      console.log('соединение закрыто ' + id);
      delete clients[id];
    });

  });

  return webSocketServer.options.port;
}

function alloc(port,left=3000) {
  try {
     var p = new WS.Server({
       port: port
     });
     return p;
  }
  catch(err) {
    console.log(err);
    if (left < 0) {
      console.log("cannot find port for ws",err);
      return null;
    }
    return alloc( port+1, left-1 );
  }
}

////////////////////////////////////////

/*
import * as FS from 'fs';
console.log("starting watch");
FS.watch( "data.csv",(event,path) => {
  console.log("olalaa",event,path);
});
*/

////////////////////////////////////////



