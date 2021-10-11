import parse_csv from "../../src/csv.js";
import * as utils from "../../src/utils.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-gltf","Cinema: gltf files", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );

  obj.cinemadb_path_function = function(v) { return v;};
  obj.cinemadb_coords_function = function(v) { return v;};
  obj.cinemadb_rotate_function = function(v) { return v;};

  obj.trackParam( "@dat",function(v) {
      var dat = obj.getParam("@dat");
      if (!obj.models_obj)
        obj.models_obj = parent.vz.create_obj( {}, {parent:obj,name:"models"});
        
      var existing_co = obj.models_obj.ns.getChildren().length;
      if (existing_co != dat.length) {
        if (existing_co > dat.length) {
          var more = existing_co-dat.length;
          while (more > 0) {
            var c = obj.models_obj.ns.getChildren()[ obj.models_obj.ns.getChildren().length-1 ];
            c.remove();
            more--;
          }
        }
        else
        {
          var need = dat.length-existing_co;
          while (need > 0) {
            var nobj = parent.vz.vis.addGltf( obj.models_obj );
            need--;
          }
        }
      }
      
      //var dir = v.substring( 0, v.lastIndexOf("/")+1 ); // todo: local files..
      
      var arr = [];
      //console.log("making models",dat.length);
      for (var i=0; i<dat.length; i++) {
        var nobj = obj.models_obj.ns.getChildren()[i];
        //parent.vz.vis.addGltf( obj.models_obj );
        var path = obj.cinemadb_path_function( dat.src[ i ] ); // todo change interface here.. to consider current path..
        
        nobj.setParam( "src",path );
        nobj.positions = obj.cinemadb_coords_function( [ dat.X[i], dat.Y[i], dat.Z[i] ]);
        //nobj.positions = [ dat.X[i], dat.Y[i], dat.Z[i] ];
        if (dat.R || dat.G || dat.B)
            nobj.colors = [ dat.R[i] || 0, dat.G[i] || 0, dat.B[i] || 0 ];
        // todo scale
        if (dat.ROTATEX || dat.ROTATEY || dat.ROTATEZ) {
           nobj.rotations = obj.cinemadb_rotate_function( [torad(dat.ROTATEX?.[i] || 0),torad(dat.ROTATEY?.[i] || 0),torad(dat.ROTATEZ?.[i] || 0)] );
           //nobj.rotations = [torad(dat.ROTATEX?.[i] || 0),torad(dat.ROTATEY?.[i] || 0),torad(dat.ROTATEZ?.[i] || 0)];
        }
        
        // idea: instead of passing animations, pass any object param.............
        // thus we may create a player of any viewzavr objects (not only models but any!)
        // and setup any properties via this interface.... mmmm....
        function setanim(n) {
          n = n.toString();
          var data = dat["ANIMATION_"+n];
          if (data) {
            //debugger;
            nobj.setParam( "animation_"+n, data[i] );
          }
        }
        setanim(0);
        setanim(1);
        setanim(2);
        setanim(3);
        setanim(4);
      }

  });
  
  utils.file_merge_feature( obj,parse_csv, utils.interp_csv, "@dat" );

  return obj;
}

function torad( angl ) {
  return angl * Math.PI / 180.0;
}