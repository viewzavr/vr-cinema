
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

VR-Cinema extends CinemaScience format by the following:
1. It allows to specify 3D visual objects in artifacts. To specify type of visual object, place it right after FILE_ prefix and surround with \_. For example, FILE_lines_beta defines visual object of type `lines`.
2. It generates GUI controls to select current paramerers values in interface. Then it shows 3D visual objects according to selected values.

## Example

Let we need to visualize a point cloud which is changing in time. We write **data.csv** file of following content:
```
time, FILE_points_alfa
10, t-10.csv
20, t-20.csv
30, t-30.csv
...
```
Here we defined:
1. One parameter named `time`.
2. Values for that parameter (10,20,30,...)
3. One visual object of type `points` named alfa.
4. A mapping between values of parameter `time` and input files for visual object `FILE_points_alfa`.

VR-Cinema will generate graphical interface for `time`, allow to select its value, and show correspoding point cloud.

## List of supported 3D visual objects

* Points
* Spheres
* Lines
* Triangles
* Quads
* OBJ files
* VRML files