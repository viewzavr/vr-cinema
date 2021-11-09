export function setup(vz,module) {
  vz.register_feature_set( module ); // здесь фичи заведеным нами через апи системы в мозги системы
}

// самое веселое
// задача - добавить фильтрацию данных в csv-колонку art
// по колонке args.column
import * as df from "./df.js";

// идея сделать - не то чтобы фильтр, а типа slice с аргументами start,length,every
// хотя по идее можно и разделить, добавить еще limit..
// ну в общем надо придумать какие операции нужны. это по идее операции на полями в терминах Миши.
// но не просто операции а интерактивные.
export function filter( art, args ) {
   //console.log("FILTER feature attached")

   var orig = art.setParam;
   var params_obj = art.ns.parent.ns.parent.params_obj;
   var tracking_unlisten;

   art.setParam = function(name,value,manual) {
      if (name != "@dat") return orig( name,value,manual);

      if (tracking_unlisten) tracking_unlisten();

      if (!df.is_df(value)) return orig( name,value,manual);

      var vals = df.get_column( value, args.column );
      if (!vals) return orig( name, value, manual );

      var pname = args.column;

      params_obj.addSlider( pname, 0,0, vals.length-1, 1 );
      params_obj.setParamOption(pname,"values",vals );

      tracking_unlisten = params_obj.trackParam( pname, (v) => {
           // интересно что тут v
           // console.log("see v=",v);
           // здесь v это индекс
           var newdf = df.slice( value, v, v+1 );
           orig( name, newdf, manual );
      });
      params_obj.signalParam( pname );

      //orig( name, value, manual );
   }
}
// идея - добавиться в список синема-параметров родителя
// поиску это не помешает, а вот параметры смогут переходить к родителю
// плюс будет генерироваться слайдер согласно interpolation mode..
// короче это сломается, когда я решу замержить это с суб-базами синема...
// или если в основном файле тоже будет t и будет режим интреполяции



//////////////// фича set
export function set( art, args ) {
   //console.log("SET feature attached")

   var orig = art.setParam;
   var params_obj = art.ns.parent.ns.parent.params_obj;

   art.setParam = function(name,value,manual) {
      if (name != "@dat") return orig( name,value,manual);

      if (!df.is_df(value)) return orig( name,value,manual);

      for (let colname of Object.keys( args )) {
         var colvalue = args[colname];
         var colarr;
         
         if (typeof(colvalue) == "string" && colvalue.slice(0,2) == "->" ) {
            colarr = value[ colvalue.slice( 2 ) ] || [];
         }
          else
            colarr = new Array( df.get_length(value) ).fill(colvalue);
         // todo ссылки на колонки
         df.add_column( value, colname, colarr ) 
      }
      orig( name, value, manual );
    }
}

//////////////// фича skip_every
// я вижу что это в целом - операции над df, да и все..
export function skip_every( art, args ) {
   //console.log("SET feature attached")

   var orig = art.setParam;
   var params_obj = art.ns.parent.ns.parent.params_obj;

   art.setParam = function(name,value,manual) {
      if (name != "@dat") return orig( name,value,manual);
      if (!df.is_df(value)) return orig( name,value,manual);
      value = df.skip_every( value, args.step )
      orig( name, value, manual );
    }
}