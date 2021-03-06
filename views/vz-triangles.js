import parse_csv from "../src/csv.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-triangles","Cinema: triangles", function( opts ) {
    return create( vz, opts );
  } );
}

export function create( vz, opts ) {

  var obj = vz.createObj( opts );
  var gr  = parent.vz.vis.addMesh( obj, "triangles" );
  
  obj.addFile( "file","",function(v) {
    loadFile( v, function(res) {
      var dat = parse_csv( res );
      
      gr.positions = combine( [ dat.X, dat.Y, dat.Z ] );
      gr.colors = combine( [ dat.R, dat.G, dat.B ] );

      
    },
    function(err) {
      gr.positions = [];
    });
  });

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