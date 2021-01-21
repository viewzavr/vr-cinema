// перспективная версия через морфинг viewzavr-объектов..

import parse_csv from "../src/csv.js";
import * as utils from "../src/utils.js";

export function cinema_points( parent,name,visible ) {

  var obj = parent.vz.create_obj( {}, {parent:parent, name:name} );
  var gr  = parent.vz.vis.addPoints( obj, "points" );
  obj.gr = gr;

  obj.addFile( "file","",function(v) {
    utils.cachedLoad( v,parse_csv ).then( function(dat) {

      gr.positions = utils.combine( [ dat.X, dat.Y, dat.Z ] );
      gr.colors = utils.combine( [ dat.R, dat.G, dat.B ] );
      gr.radiuses = dat.RADIUS || [];
      obj.signal("changed");
    });
  });
  
  // т.е. по большому счету мне даже это делать не надо.. ибо дефолтный морф пойдет в детей да и все..
  obj.morph = function (src1, src2, w) {
    obj.gr.morph( src1.gr, src2.gr, w );
    // gr.positions = utils.interp_arr( src1.gr.positions, src2.gr.positions, w );
    // gr.colors = utils.interp_arr( src1.gr.colors, src2.gr.colors, w );
    // gr.radiues = utils.interp_arr( src1.gr.radiuses, src2.gr.radiues, w );
  }
  obj.visible = visible;

  return obj;
}

export function generate_morphed_version( parent, name, func ) {
  var obj = func( parent, name, true );
  var obj1 = func( obj, name );
  var obj2 = func( obj, name );
  
  obj.addFile( "file1","",function(v) {
    obj1.setParam( "file",v );
  });
  
  obj.addFile( "file2","",function(v) {
    obj2.setParam( "file",v);
  });

  function f() {
    obj.morph( obj1, obj2, obj.getParam("w") );
  }

  obj1.track("changed",f );
  obj2.track("changed",f );
  obj.addSlider( "w",0,0,1,0.01,f);
}