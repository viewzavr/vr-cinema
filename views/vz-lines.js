import parse_csv from "../src/csv.js";
import * as utils from "../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-lines","Cinema: lines", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );
  var gr  = vz.vis.addLines( obj, "lines" );
  
  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    gr.positions = utils.combine( [ dat.X, dat.Y, dat.Z, dat.X2, dat.Y2, dat.Z2 ] );
    gr.colors = utils.combine( [ dat.R, dat.G, dat.B,dat.R2, dat.G2, dat.B2 ] );
    gr.radiuses = dat.RADIUS || [];
    obj.signal("changed");
  });

  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}
