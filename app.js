import { create_cinema } from "./src/cinema-viewzavr.js";

export function create( vz, opts ) {
  var ci = create_cinema( vz, opts );
  ci.setParam("file","./examples/_tutorial/0-points-fly.cdb/data.csv");
  return ci;
}