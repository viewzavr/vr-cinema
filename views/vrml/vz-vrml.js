// прикольная версия через морфинг csv-данных..

import * as vrml from "./parse_vrml.js";
import * as utils from "../../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-vrml","Cinema: vrmls", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );

  var mesh = vz.vis.addMesh( obj, "surface" );
  var pts  = vz.vis.addPoints( obj, "points" );

  mesh.feature("cinema-visual", opts.name + "/surface");
  pts.feature("cinema-visual", opts.name + "/points");

  pts.setParam("color",[1,1,1]);
  pts.setParam("radius",0.1);
  
//  obj.gr = gr;
  mesh.setParam("flat-shading",true ); // R-FLATSHADING-VRML-DEFAULT
  mesh.setParam("shine",5 ); // todo mb move this to Dubins project?

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
//    debugger;
    mesh.positions = dat.positions;
    mesh.indices = dat.indices;
    mesh.colors = dat.colors;
    pts.positions = dat.positions;
    pts.colors = dat.colors;
  });
  
  utils.file_merge_feature( obj, parse1, interp, "@dat" );

  return obj;
}

function parse1( text ) {
  var v = vrml.construct_vrml_object_from_text( text );
  var s = vrml.get_vrml_shapes( v );
  
  var v2 = {
    positions: vrml.get_shapes_xyz_arr( s ),
    indices: vrml.get_shapes_indices_arr( s ),
    colors: vrml.get_shapes_colors_arr( s )
  }
  
  return v2;
}

function interp( v1, v2, w ) {
  if (!v2) return v1;
  if (!v1) return v2;
  if (!v1 && !v2) return { positions:[], colors: [], indices: []};

  var dat = {
    positions: utils.interp_arr( v1.positions, v2.positions, w ),
    indices: v1.indices,
    colors: utils.interp_arr( v1.colors, v2.colors, w )
  }
  return dat;
}
