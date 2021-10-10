
# VR-Cinema scene format

VR-Cinema is an extension to [CinemaScience scene format](https://github.com/cinemascience/cinema/blob/master/specs/dietrich/01/cinema_specD_v012.pdf).
CinemaScience is a modern format developed to store very huge data sets. In the format, a data is stored in a directory called Cinema database. This directory should contain an meta-information file named **data.csv**, in the CSV text format. This file contains a table with columns for parameters and columns for data artifacts. Artifacts can be images, grids, csv files; i.e., anytype of data that can be written to disk. Thus this table defines a mapping between parameters and artifacts.

<!--
Thus **data.csv** derermines:
* a list of parameters, 
* a list of values of those parameters, 
* a list of artifacts, 
* and a relation between parameters values and artifacts. 
-->

<!--
VR-Cinema extends CinemaScience format by the following:
1. It allows to specify 3D visual objects as artifacts. To specify type of visual object, place it right after FILE_ prefix and surround with \_. For example, FILE_lines_beta defines visual object of type `lines`.
2. It generates GUI controls to select current paramerers values in interface. Then it shows 3D visual objects according to selected values.
-->

VR-Cinema allows to specify 3D visual objects as artifacts. To specify type of visual object, place it right after FILE_ prefix and surround with \_. For example, `FILE_lines_beta` defines visual object of type `lines`.

VR-Cinema generates GUI controls to select current paramerers values in interface. Then it shows 3D visual objects according to selected values.

## Example

Let we need to visualize a point cloud which is changing in time. We write **data.csv** file of following content:

```
time, FILE_points_alfa
0,  00.csv
10, 01.csv
20, 02.csv
30, 03.csv
...
```
Here we define:
1. One parameter named `time`.
2. Values for that parameter (10,20,30,...)
3. One visual object of type `points` named alfa.
4. A mapping between values of parameter `time` and input files for visual object `FILE_points_alfa`.

VR-Cinema will generate graphical interface for `time`, allow to select its value, and show correspoding point cloud.

[Run online](https://viewzavr.com/apps/vr-cinema/?datapath=./examples/_tutorial/0-points-fly.cdb/data.csv) | [More details on this example](./examples/_tutorial/0-points-fly.cdb)

## Multiple parameters and visual objects
You may define arbitrary number of parameters and visual objects. Example of **data.csv**:
```
alfa, beta, FILE_points_alfa, FILE_lines_beta, FILE_points_teta, FILE_obj_surf
10, 0.15, 1.csv, lines-1.csv, pts-beta.csv, constant-surf.obj
20, 0.15, 2.csv, lines-1.csv, pts-beta.csv, constant-surf.obj
20, 0.25, 2-0.25.csv, lines-1.csv, pts-beta.csv, constant-surf.obj
...
```

## List of supported 3D visual objects

* [Points](views/points)
* Spheres
* Lines
* Triangles
* Quads
* OBJ files
* VRML files
