## Spheres

Purpose: render a set of spheres given in a csv file.

A csv file may contain columns:
* X,Y,Z - coordinates of spheres centers. Required.
* R,G,B - red green blue color components for spheres. Float number from 0 to 1 each. Optional
* RADIUS - desired radius of spheres. Optional, default 1.0.

Example input:
```
X,Y,Z, R,G,B
0,0,0, 1,1,1
0,1,0  1,0,1
1,0,0  1,1,0
59.20,2.95,82.41,0.50,0.00,1.00
56.87,7.15,81.46,0.50,0.00,1.00
54.45,10.49,84.03,0.50,0.00,1.00
```

Example column name in data.csv: FILE_spheres_q

<!--
Example scene: [0-points-fly.cdb](../../examples/tutorial/0-points-fly.cdb/)
--->
