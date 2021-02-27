// прикольная версия через морфинг csv-данных..

import parse_csv from "../src/csv.js";
import * as utils from "../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-spheres","Cinema: spheres", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );
  var gr  = vz.vis.addSpheres( obj, "spheres" );
  gr.color=[1,1,1];
  obj.gr = gr;

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
//    debugger;
    gr.positions = utils.combine( [ dat.X, dat.Y, dat.Z ] );
    gr.colors = utils.combine( [ dat.R, dat.G, dat.B ] );
    gr.radiuses = dat.RADIUS || [];
    obj.signal("changed");
  });
  
  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}
