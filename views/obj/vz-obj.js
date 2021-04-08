
import parse_csv from  "../../src/csv.js";
import * as DF from    "../../src/df.js";
import * as utils from "../../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-obj","Cinema: obj file", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );

  var gr  = vz.vis.addPoints( obj, "points" );
  gr.setParam("shape",2);
  gr.setParam("color",[1,0,0]);
  gr.setParam("radius",2.4);
  
  var surf  = vz.vis.addMesh( obj, "surface" );

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    gr.positions = utils.combine( [dat.X, dat.Y, dat.Z ] );
    surf.positions = gr.positions;
    surf.indices = utils.combine( [dat.I1, dat.I2, dat.I3] );
    deploy_dat_to_params( obj, dat );
  });

  utils.file_merge_feature( obj,parse_obj_to_df, interp, "@dat" );

  return obj;
}

import * as PO from "./parse_obj.js";

function parse_obj_to_df( data ) {
  var res = PO.parse_obj( data );
  return res;
  // получается нам тут df и не нужен в общем-то..
  //var df = DF.create_from_hash( res );
  //return df;
}

function interp( v1, v2, w ) {
  if (!v2) return v1;
  if (!v1) return v2;
  if (!v1 && !v2) return { X:[], Y: [], Z: [], I1: [], I2: [], I3: [] };

  var dat = {
    X: utils.interp_arr( v1.X, v2.X, w),
    Y: utils.interp_arr( v1.Y, v2.Y, w),
    Z: utils.interp_arr( v1.Z, v2.Z, w),
    I1: v1.I1, I2: v1.I2,  I3: v1.I3
  }
  return dat;
}

function deploy_dat_to_params( obj, src ) {
  Object.keys(src).forEach( function(name) {
      // console.log("publishing DF param",name);
      obj.setParam( name, src[name] );
      obj.setParamOption( name,"internal",true );
  });
}