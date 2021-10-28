import parse_csv from "../../src/csv.js";
import * as utils from "../../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-gltf","Cinema: gltf files", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );
  var nobj = vz.vis.addGltf( obj );
  nobj.feature("cinema-visual", opts.name );

  obj.trackParam( "file",function(v) {
        nobj.setParam( "src",v );
/*        
        nobj.positions = obj.cinemadb_coords_function( [ dat.X[i], dat.Y[i], dat.Z[i] ]);
        //nobj.positions = [ dat.X[i], dat.Y[i], dat.Z[i] ];
        if (dat.R || dat.G || dat.B)
            nobj.colors = [ dat.R[i] || 0, dat.G[i] || 0, dat.B[i] || 0 ];
        // todo scale
        if (dat.ROTATEX || dat.ROTATEY || dat.ROTATEZ) {
           nobj.rotations = obj.cinemadb_rotate_function( [torad(dat.ROTATEX?.[i] || 0),torad(dat.ROTATEY?.[i] || 0),torad(dat.ROTATEZ?.[i] || 0)] );
           //nobj.rotations = [torad(dat.ROTATEX?.[i] || 0),torad(dat.ROTATEY?.[i] || 0),torad(dat.ROTATEZ?.[i] || 0)];
        }
*/

  });

  utils.add_param_interpolation( obj,"X","X_",(v) => {
    let arr = Array.isArray(nobj.positions) && nobj.positions.length >= 3 ? nobj.positions.slice() : [0,0,0];
    arr[0]=v;
    nobj.positions = arr;
  });
  utils.add_param_interpolation( obj,"Y","Y_",(v) => {
    let arr = Array.isArray(nobj.positions) && nobj.positions.length >= 3 ? nobj.positions.slice() : [0,0,0];
    arr[1]=v;
    nobj.positions = arr;
  });  
  utils.add_param_interpolation( obj,"Z","Z_",(v) => {
    let arr = Array.isArray(nobj.positions) && nobj.positions.length >= 3 ? nobj.positions.slice() : [0,0,0];
    arr[2]=v;
    nobj.positions = arr;
  });
  utils.add_param_interpolation( obj,"ROTATEX","ROTATEX_",(v) => {
    let arr = nobj.rotations;
    arr = Array.isArray(arr) && arr.length >= 3 ? arr.slice() : [0,0,0];
    arr[0]=v * Math.PI / 180;
    nobj.rotations = arr;
  });
  utils.add_param_interpolation( obj,"ROTATEY","ROTATEY_",(v) => {
    let arr = nobj.rotations;
    arr = Array.isArray(arr) && arr.length >= 3 ? arr.slice() : [0,0,0];
    arr[1]=v * Math.PI / 180;
    nobj.rotations = arr;
  });  
  utils.add_param_interpolation( obj,"ROTATEZ","ROTATEZ_",(v) => {
    let arr = nobj.rotations;
    arr = Array.isArray(arr) && arr.length >= 3 ? arr.slice() : [0,0,0];
    arr[2]=v * Math.PI / 180;
    nobj.rotations = arr;
  });  
  
  //utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}

function torad( angl ) {
  return angl * Math.PI / 180.0;
}