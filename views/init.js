
import * as vz_lines  from "./vz-lines.js";
import * as vz_models from "./vz-models.js";
import * as vz_vrml from "./vrml/vz-vrml.js";
import * as vz_vtkpoints from "./vtkpoints/vz-vtkpoints.js";
import * as vz_obj from "./obj/vz-obj.js";

export function setup( vz ) {
  vz_lines.setup( vz );
  vz_models.setup( vz );
  vz_vrml.setup( vz );
  vz_vtkpoints.setup( vz );
  vz_obj.setup( vz );

  return vzPlayer.loadPackage( vz.getDir( import.meta.url ) + "./list.txt" );
}
