import parse_csv from "../src/csv.js";
import * as utils from "../src/utils.js";


export function setup( vz ) {
  vz.addItemType( "cinema-view-triangles","Cinema: triangles", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );
  var gr  = vz.vis.addMesh( obj, "triangles" );
  
  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    
//      gr.positions = combine( [ dat.X, dat.Y, dat.Z ] );
//      gr.colors = combine( [ dat.R, dat.G, dat.B ] );
    gr.positions = utils.combine( [ dat.X, dat.Y, dat.Z, dat.X2, dat.Y2, dat.Z2, dat.X3, dat.Y3, dat.Z3 ] );
    if (dat.R2)
      gr.colors = utils.combine( [ dat.R, dat.G, dat.B,dat.R2, dat.G2, dat.B2, dat.R3, dat.G3, dat.B3 ] );
    else {
      gr.colors = utils.combine( [ dat.R, dat.G, dat.B,dat.R, dat.G, dat.B, dat.R, dat.G, dat.B ] )
    }
    

  });
  
  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}

function combine( arrays_list ) {
  if (!Array.isArray(arrays_list[0])) return [];
  
  var res = [];
  var len = arrays_list[0].length;
  for (var i=0; i<len; i++) {
    for (var j=0; j<arrays_list.length; j++)
      res.push( arrays_list[j][i] );
  }
  return res;
}