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

export function vzurl( server, cinema_relative_dir,options={} ) {
    var datapath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/data.csv`;
    var spath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;
    var storepath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;
    var viewzavr_player_url = options.vr_cinema_url || "https://viewzavr.com/apps/vr-cinema";
    if (typeof(viewzavr_player_url) == "function") {
        viewzavr_player_url = viewzavr_player_url( `http://${server.address().address}:${server.address().port}` );
    }

    var opath = `${viewzavr_player_url}?datapath=${datapath}&settings=${spath}&storepath=${storepath}`;
    // +feature watch file
    if (options.watcher_port) {
       var wpath = `ws://${server.address().address}:${options.watcher_port}${cinema_relative_dir}/data.csv`;
       opath = opath + `&cmdpath=${wpath}`;
       // может быть нужен другой подход.. сделать за всеми data.csv...?
    }
    return opath;
}

export function explore( server, dir, request, response, options={} )
{
  var txt = "";
  var counter=0;
  //var lasturl; // I-AUTOOPEN-ONCE-SCENE
  var urls = [];
  findFiles( dir, function(f) {
    //console.log(f,path.basename(f).toLowerCase());
    if (path.basename(f).toLowerCase() == "data.csv") {
      console.log("match",f);
      var rel = path.relative( dir, f );
      var reldir = path.dirname( rel );
      var url = vzurl( server,"/"+reldir, options );
      urls.push( {url,reldir} );
      //lasturl = url; // I-AUTOOPEN-ONCE-SCENE
      //txt = txt + `<li><a target='_blank' href='${url}'>${reldir}</a></li>`
      counter++;
    }
  }).then( function() {
    /*
      if (counter == 1) { // I-AUTOOPEN-ONCE-SCENE
        response.writeHead(301,{Location: url});
        response.end();
      }
      else
      {
        */
        urls = urls.sort( (r1, r2) => {
            if (r1.reldir > r2.reldir) return 1;
            if (r1.reldir < r2.reldir) return -1;
            return 0;
        });
        var txt = urls.map( (rec) => `<li><a target='_blank' href='${rec.url}'>${rec.reldir}</a></li>`).join("\n");
        response.setHeader('Content-Type', 'text/html');
        txt = `<h3>There are ${counter} CinemaScience database(s) found</h3> <ul class='list_noimages'>${txt}</ul>`;
        console.log("listing sent");
        response.end( txt );
      //}
  });
}
