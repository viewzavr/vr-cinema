
import parse_csv from  "../../src/csv.js";
import * as DF from    "../../src/df.js";
import * as utils from "../../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-vtkpoints","Cinema: vtk points", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );

  var gr  = vz.vis.addPoints( obj, "points" );
  gr.setParam("shape",2);
  gr.setParam("color",[1,0,0]);
  gr.setParam("radius",2.4);

  obj.trackParam( "@dat",function(v) {
    var dat = obj.getParam("@dat");
    gr.positions = utils.combine( [dat.X, dat.Y, dat.Z ] );
    
    deploy_dat_to_params( obj, dat );
  });

  utils.file_merge_feature( obj,parse_vtk, utils.interp_csv, "@dat",loadFileBinary );
  
  var co = vz.createObjByType( {parent:obj, type:"colorize-scalars"} );
  co.createLinkTo( { param: "input_scalars", from: obj.getPath() + "->visco_coeffs" } );
  gr.createLinkTo( { param: "colors", from: co.getPath() + "->output_colors" } );

  return obj;
}

import { VTKLoader } from "./threejs-extract/VTKLoader.js";

function parse_vtk( data ) {
  var loader = new VTKLoader();
  var df = loader.parse( data );
//  console.log("parse_vtk: df=",df );
  return df;
}

function deploy_dat_to_params( obj, src ) {
  DF.get_column_names(src).forEach( function(name) {
      // console.log("publishing DF param",name);
      obj.setParam( name, DF.get_column(src,name) );
      obj.setParamOption( name,"internal",true );
  });
}