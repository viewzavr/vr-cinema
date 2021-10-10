// на самом деле этот код вот в этом файле это часть index.html по своему существу, т.е. часть точки входа в приложение
// и по уму там и надо писать.. а то раскидан слой по 2м файлам

//
import * as cv from "./src/cinema-viewzavr.js";

export function setup( vz ) {
  cv.setup( vz );

  return vzPlayer.loadPackage( vz.getDir( import.meta.url ) + "./views/list.txt" );
}

export function create( vz, opts ) {
  var ci = cv.create( vz, opts );
//  var file = getParameterByName("datapath") || "./examples/_tutorial/0-points-fly.cdb/data.csv";
//  ci.setParam("file",file);
//  ci.addParam("update",function() {
//  });

  return ci;
}