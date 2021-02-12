// an abstract Javascript code for processing CinemaScience databases

import parse_csv from "./csv.js";
import * as df from "./df.js";

export default function cinema() {
  var obj = {};

  // вот это вредное место. не должно быть тут парсинга. тут надо csv-объект приравнивать
  // update: переделал. но - зачем это здесь вообще теперь?
  // todo наверное это надо убрать тогда? ну или оставить для простоты..
  obj.setTextContent = function(text) {
    obj.setDbContent( parse_csv( text ) );
  }

  obj.setDbContent = function( csv_data_object ) {
    obj.data = csv_data_object;
    obj.datalen = df.get_length( obj.data );
    obj.paramnames = [];
    obj.artnames = [];
    df.get_column_names( obj.data ).forEach( function(v) { 
      if (/^FILE_/.test(v))
        obj.artnames.push(v)
      else
        obj.paramnames.push(v);
    });
  }
  
  obj.getParamNames = function() {
    return obj.paramnames;
  }
  obj.getArtNames = function() {
    return obj.artnames;
  }  
  
  obj.findNearest = function( req, distfunc ) {
    if (!distfunc) distfunc = distf;
    var nearest_i=-1;
    var nearest_dist;
    for (var i=0; i<obj.datalen; i++) {
      var dist = distfunc( req,obj.data,i );
      if (nearest_i < 0 || nearest_dist > dist ) {
        nearest_i = i;
        nearest_dist = dist;
      }
    }
    return nearest_i;
  }
  
  // returns nearest 2 rows (for interpolation)
  // return format: [i1,dist1,i2,dist2]
  obj.findNearest2 = function( req, distfunc ) {
    if (!distfunc) distfunc = distf;
    var nearest_i=-1;
    var nearest_dist=-1;
    var nearest_i2=-1;
    var nearest_dist2=-1;
    for (var i=0; i<obj.datalen; i++) {
      var dist = distfunc( req,obj.data,i );
      if (nearest_i < 0 || nearest_dist > dist ) {
        // push..
        nearest_i2 = nearest_i;
        nearest_dist2 = nearest_dist;
        // assign
        nearest_i = i;
        nearest_dist = dist;
      }
      else
      if (nearest_i2 < 0 || nearest_dist2 > dist ) {
        nearest_i2 = i;
        nearest_dist2 = dist;
      }
    }
    return [nearest_i,nearest_dist,nearest_i2,nearest_dist2];
  }

  function distf( request, dataobj, i ) {
    var diff = 0;
    Object.keys(request).forEach( function(name) {
        var reqval = request[name];

        var datval = (df.get_column( dataobj, name ) || [])[i];
        
        if (df.is_string_column( dataobj,name )) {
          if (reqval != datval) diff = diff + 1;
        }
        else
        if (datval === undefined || reqval === undefined) {
          
        }
        else
        {
          diff = diff + Math.abs(reqval - datval);
        }
      });
    return diff;
  }
  
//////////////////////  
  // is request is less than dataobj value?
  function lessf( request, dataobj, i ) {
    var lesscount = 0;
    Object.keys(request).forEach( function(name) {
        var reqval = request[name];
        var datval = (obj.data[ name ] || [])[i];
        if (datval === undefined || reqval === undefined) {
        }
        else
        {
          if (reqval < datval)
            lesscount++;
          else
            lesscount--;
        }
      });
    return lesscount > 0;
  } 
  
  // returns 2 rows where 1st is nearest and less than request, and second is nearest and more than request
  // return format: [i1,dist1,i2,dist2]
  obj.findNearestOnGrid = function( req, distfunc, lessfunc ) {
    if (!distfunc) distfunc = distf;
    if (!lessfunc) lessfunc = lessf;
    var nearest_i=-1;
    var nearest_dist=-1;
    var nearest_i2=-1;
    var nearest_dist2=-1;
    for (var i=0; i<obj.datalen; i++) {
      var dist = distfunc( req,obj.data,i );
      if (!lessfunc( req, obj.data, i )) {
        if (nearest_i < 0 || nearest_dist > dist ) {
          nearest_i = i;
          nearest_dist = dist;
        }
      }
      else
      {
        if (nearest_i2 < 0 || nearest_dist2 > dist ) {
          nearest_i2 = i;
          nearest_dist2 = dist;
        }      
      }
    }
    return [nearest_i,nearest_dist,nearest_i2,nearest_dist2];
  }  

  obj.getDifferentParamValues = function(name) {
    var vals = {};
    var valsarr = [];
    (obj.data[ name ] || []).forEach( function(v) {
      if (!vals[v]) {
        vals[v] = 1;
        valsarr.push(v);
      }
    });
    // stringparam
    if (df.is_string_column( obj.data, name )) return valsarr; // no need to sort, seems - show as is.
    return valsarr.sort(function(a,b){return a-b;});
  };
  
  obj.isStringColumn = function(name) {
    return df.is_string_column( obj.data, name );
  }

  return obj;
}