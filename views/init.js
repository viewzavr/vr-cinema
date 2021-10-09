import * as vz_points from "./vz-points.js";
import * as vz_spheres from "./vz-spheres.js";
import * as vz_lines  from "./vz-lines.js";
import * as vz_triangles  from "./vz-triangles.js";
import * as vz_models from "./vz-models.js";
import * as vz_vrml from "./vrml/vz-vrml.js";
import * as vz_vtkpoints from "./vtkpoints/vz-vtkpoints.js";
import * as vz_obj from "./obj/vz-obj.js";
import * as vz_quads from "./vz-quads.js";

export function setup( vz ) {
  vz_points.setup( vz );
  vz_spheres.setup( vz );
  vz_lines.setup( vz );
  vz_triangles.setup( vz );
  vz_quads.setup( vz );
  vz_models.setup( vz );
  vz_vrml.setup( vz );
  vz_vtkpoints.setup( vz );
  vz_obj.setup( vz );
}
