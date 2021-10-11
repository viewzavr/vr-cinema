## Triangles

Purpose: render a set of triangles given in a csv file.

A csv file may contain columns:
* X,Y,Z,X2,Y2,Z2,X3,Y3,Z3 - coordinates of triangles. Required.
* R,G,B - red green blue color components for faces. Float number from 0 to 1 each. Optional.
* R2,G2,B2,R3,G3,B3,R4,G4,B4 - red green blue color components for vertices. Float number from 0 to 1 each. Optional.

Example input:
```
X,Y,Z,X2,Y2,Z2,X3,Y3,Z3
-0.722, 0, 1.7765, -0.7867, -0.0107, 1.8822, -0.7891, -0.0353
-0.7867, -0.0107, 1.8822, -0.9391, -0.0314, 2.0604, -0.9375, -0.0958, 2.0588
-0.9391, -0.0314, 2.0604, -1.1175, -0.0522, 2.2125, -1.1119, -0.1563, 2.2049
....
```

Example column name in data.csv: FILE_triangles_a

<!--
Example scene: [0-points-fly.cdb](../../examples/tutorial/0-points-fly.cdb/)
-->
