import * as cv from "./src/cinema-viewzavr.js";

export function create( vz, opts ) {
  var ci = cv.create( vz, opts );
  ci.setParam("file","./examples/_tutorial/0-points-fly.cdb/data.csv");
  return ci;
}