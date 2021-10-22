// feature F-EXPLORE
// probable bug if search is too deep. maybe restrict it by count or time or depth?

import { readdir } from 'fs/promises';
import * as fs from 'fs'; // F-PREVIEW-SCENES
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

export function vzurl_view( server, cinema_file_url, options={} ) {
    var viewzavr_player_url = options.vr_cinema_url || "https://viewzavr.com/apps/vr-cinema";
    if (typeof(viewzavr_player_url) == "function") {
        viewzavr_player_url = viewzavr_player_url( `http://${server.address().address}:${server.address().port}` );
    }  
    var opath = `${viewzavr_player_url}?datapath=${cinema_file_url}`;
    return opath;
}

export function vzurl( server, cinema_relative_dir,options={} ) {
    var datapath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/data.csv`;
    var spath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;
    var storepath = `http://${server.address().address}:${server.address().port}${cinema_relative_dir}/viewzavr-player.json`;

    var opath = vzurl_view( server, datapath,options ) + `&settings=${spath}&storepath=${storepath}`; //todo remove
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

      // F-PREVIEW-SCENES {
      var preview_url;
      let preview_path = path.join( path.dirname(f), "preview.png" );
      if (fs.existsSync(preview_path))
        preview_url = "/"+reldir + "/preview.png"; 
      // F-PREVIEW-SCENES }

      urls.push( {url,reldir,preview_url} );
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
        
        var txt = vis2( urls );

        response.setHeader('Content-Type', 'text/html');
        console.log("listing sent");
        response.end( txt );
      //}
  });
}

function vis0( urls ) {
  var counter = urls.length;
  var txt = urls.map( (rec) => `<li><a target='_blank' href='${rec.url}'>${rec.reldir}</a></li>`).join("\n");
  txt = `<h3>There are ${counter} CinemaScience database(s) found</h3> <ul class='list_noimages'>${txt}</ul> ${txtimg}`;
  return txt;
}


function vis1( urls ) { // F-PREVIEW-SCENES
  var counter = urls.length;
var txt = urls.map( (rec) => {
          let i = rec.preview_url ? `<br/> <img src='${rec.preview_url}' width=240/>` : "";
          let ii = rec.preview_url ? "with_img" : "";
          return `<li class='${ii}'><a target='_blank' href='${rec.url}'>${rec.reldir} ${i}</a></li>`
        } ).join("\n");
        txt = `<h3>There are ${counter} CinemaScience database(s) found</h3> 
<style>
  ul li.with_img { 
    display: inline-block; 
  }
</style>        
<ul class='list_noimages'>${txt}</ul>`;

return txt;
}

function vis2( urls ) { // F-PREVIEW-SCENES
  var counter = urls.length;
var txt = "", txtimg = "";
        urls.forEach( (rec) => {
          if (rec.preview_url)
            txtimg += `
<a style="display:inline-block" target='_blank' href='${rec.url}'>
  <span>
    <img src='${rec.preview_url}' width=240/>
    <br/>
    ${rec.reldir}
  </span>
</a>
  `;
          else
            txt += `<li><a target='_blank' href='${rec.url}'>${rec.reldir}</a></li>`
        })
        txt = `<h3>There are ${counter} CinemaScience database(s) found</h3> <ul class='list_noimages'>${txt}</ul> ${txtimg}`;  
return txt;
}