import * as utils from "./utils.js";

// R-REFRESH, R-FOLLOW-GROW, R-CLEAR-CACHE

// вот надо вызывать.. а так может быть она на уровне прототипа смогла бы?..
export default function install( obj ) {
  obj.addCmd("refresh",function() {
    // R-FOLLOW-GROW
    tracking = null;
    var names = obj.cinemadb.getParamNames() || [];
    if (names[0]) {
      var pn = names[0];
      var vals = obj.cinemadb.getDifferentParamValues( pn );
      var val_fin = vals[ vals.length-1 ];
      var pv = obj.params_obj.getParam( pn );
      console.log("comparing: val_fin=",val_fin,"pv=",pv,"pn=",pn);
      if (pv == val_fin) {
        // ok a case for R-FOLLOW-GROW
        console.log("tracking assigned");
        tracking = pn;
      }
    }
    // R-CLEAR-CACHE
    utils.clearCache();

    // R-REFRESH
    obj.signalTracked("file");
  });

  var tracking;
  
  // R-FOLLOW-GROW
  obj.chain( "assignData",function( csv_data_object,path_function,coords_function, rotate_function ) {
    if (tracking) console.time("ASSIGNDATA");
    var promis = this.orig( csv_data_object,path_function,coords_function, rotate_function );
    if (tracking) {
      var vals = obj.cinemadb.getDifferentParamValues( tracking );
      var val_fin = vals[ vals.length-1 ];
      var origt=tracking;
      promis.then( function() {
        console.timeEnd("ASSIGNDATA");
        obj.params_obj.setParam( origt, val_fin );
        /*
        obj.params_obj.trackParam( origt,function(v) {
          var pv = obj.params_obj.getParam( origt );      
          console.log("EEEEEMM check",origt,pv,v);
          debugger;
        });
        */
        console.log("SETTED tracked param=",origt,"to val=",val_fin );
      });
      tracking = null;
    }
  });

}
