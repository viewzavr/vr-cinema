## Quads

Purpose: render a set of quads given in a csv file.

A csv file may contain columns:
* X,Y,Z,X2,Y2,Z2,X3,Y3,Z3,X4,Y4,Z4 - coordinates of quads. Required.
* R,G,B - red green blue color components for quads. Float number from 0 to 1 each. Optional.
* R2,G2,B2,R3,G3,B3,R4,G4,B4 - red green blue color components for vertices. Float number from 0 to 1 each. Optional.

Example input:
```
X,Y,Z,X2,Y2,Z2,X3,Y3,Z3,X4,Y4,Z4
-0.722, 0, 1.7765, -0.7867, -0.0107, 1.8822, -0.7891, -0.0353, 1.8865, -0.7178, 0, 1.77
-0.7867, -0.0107, 1.8822, -0.9391, -0.0314, 2.0604, -0.9375, -0.0958, 2.0588, -0.7891, -0.0353, 1.8865
-0.9391, -0.0314, 2.0604, -1.1175, -0.0522, 2.2125, -1.1119, -0.1563, 2.2049, -0.9375, -0.0958, 2.0588
....
```

Example column name in data.csv: FILE_quads_sigma

<!--
Example scene: [0-points-fly.cdb](../../examples/tutorial/0-points-fly.cdb/)
-->
