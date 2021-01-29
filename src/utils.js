var cache = {};

export function cachedLoad( url, transform_func ) {

function genpromis() {
  return new Promise(
      function( resolv,reject ) {
        loadFile( url, function(res) {
          resolv( transform_func(res) );
        }
        ,
        function(err) {
          console.error("cachedLoad: error loading file url=",url,"err=",err);
          resolv( transform_func("") );
        }
        )
        }
    );
}

  if (typeof(url) == "string") {
    if (!cache[url]) cache[url] = genpromis();
    return cache[url];
  }
  
  return genpromis();
}

export function combine( arrays_list ) {
  if (!Array.isArray(arrays_list[0])) return [];

  var res = [];
  var len = arrays_list[0].length;
  for (var i=0; i<len; i++) {
    for (var j=0; j<arrays_list.length; j++)
      res.push( arrays_list[j][i] );
  }
  return res;
}


export function interp_arr( arr1, arr2, w ) {
  var acc = [];
  if (!arr1) return []; // ну так вот странно пока
//  if (!arr1) arr1=arr2;
  if (!arr2) arr2=arr1;
//  if (!arr1) return []; // ну так вот странно пока
   
  for (var i=0; i<arr1.length; i++) {
    if (typeof(arr1[i]) == "string") // todo optimize 
      acc.push( arr1[i] );
    else
      acc.push( arr1[i] + w * (arr2[i] - arr1[i]) );
  }
  return acc;
}

export function interp_csv( csv1, csv2, w ) {
  if (!csv1) return { colnames: [], length: 0}
  if (!csv2) return csv1;
  
  var res = {};
  res.colnames = csv1.colnames;
  res.length = csv1.length;
  res.colnames.forEach(function(name) {
    res[ name ] = interp_arr( csv1[name], csv2[name], w );
  });
  
//  console.log("intterp csv1",csv1,"csv2",csv2);
//  console.log("interpolated csv is",res );
  
  return res;
};

export function file_merge_feature( obj,parser,interp,dataparam ) {
  obj.addFile( "file","",function(v) {
    cachedLoad(v,parser).then(function(dat) {
      dat1 = dat;
      f(1);
    });
  });
  
  obj.addFile( "file2","",function(v) {
    cachedLoad(v,parser).then(function(dat) {
      dat2 = dat;
      f(2);
    });
  });
  
  obj.addSlider( "w",0,0,1,0.01,function(v) {
    w=v;
    f(4); // this should not be called if files are still loaded!
  });
  
  var dat1, dat2, w
  var f = function() {
    if (obj.removed) return;
  
    var dat = interp( dat1, dat2, w );
    obj.setParam( dataparam, dat );
  }
  
  ///////////// feature: R-NOJUMP-ON-PARAM-CHANGE and R-NOJUMP-ON-W-CHANGE
  // in other case data will jump while files are loading
  // maybe better to assign [files] instead of [file] and [file2]
  // and move them into Promise.all
  // but in that case we have to track that they are not changed manually
  // which is possible, btw
  // TODO: this doesnt work. setFile_v1 -> flag, setFile_v2 -> flag, loaded_v1 => flag cleared
  // idea: create promises for each file, and reassign them to some vars
  
  obj.trackParam("file",function() { data_pending = data_pending | 1; } );
  obj.trackParam("file2",function() { data_pending = data_pending | 2; } );
  var data_pending=0;
  
  var orig_f = f;
  f = function(reason) {
    if (reason < 4) data_pending = data_pending & (~reason);
    if (data_pending) return;
    orig_f();
  }
}
