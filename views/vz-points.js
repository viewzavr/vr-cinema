// прикольная версия через морфинг csv-данных..

import parse_csv from "../src/csv.js";
import * as utils from "../src/utils.js";

export default function cinema_points( parent,name ) {

  var obj = parent.vz.create_obj( {}, {parent:parent, name:name} );
  var gr  = parent.vz.vis.addPoints( obj, "points" );
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
