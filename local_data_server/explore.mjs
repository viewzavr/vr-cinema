// feature F-EXPLORE
// probable bug if search is too deep. maybe restrict it by count or time or depth?

import { readdir } from 'fs/promises';
import * as path from 'path';

function findFiles( startdir, cb )
{
  var res = new Promise( function (resolv, rej) {

  readdir( startdir,{withFileTypes:true} ).then( (arr) => {
    var acc = [];
    arr.forEach( f => {
      if (f.isDirectory())
        acc.push( findFiles( path.join(startdir, f.name), cb ) );
      else
        cb( path.join(startdir, f.name) );
    } );
    Promise.allSettled( acc ).then( () => resolv() );
  });
  
  });
  
  return res;
}

export function vzurl( server, cinema_relative_dir ) {
    var datapath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/data.csv`;
    var spath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;
    var storepath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;
    var opath = `https://viewzavr.com/apps/vr-cinema?datapath=${datapath}&settings=${spath}&storepath=${storepath}`;
    return opath;
}

export function explore( server, dir, request, response )
{
  var txt = "";
  var counter=0;
  findFiles( dir, function(f) {
    //console.log(f,path.basename(f).toLowerCase());
    if (path.basename(f).toLowerCase() == "data.csv") {
      console.log("match",f);
      var rel = path.relative( dir, f );
      var reldir = path.dirname( rel );
      var url = vzurl( server,"/"+reldir );
      txt = txt + `<a target='_blank' href='${url}'>${reldir}</a> `
      counter++;
    }
  }).then( function() {
      response.setHeader('Content-Type', 'text/html');
      txt = `<h3>There are ${counter} CinemaScience database(s) found</h3>` + txt;
      console.log("fin");
      response.end( txt );
  });
}
