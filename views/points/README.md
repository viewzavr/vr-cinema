## Points

Purpose: render a set of points given in a csv file.

A csv file may contain columns:
* X,Y,Z - coordinates of points. Required.
* R,G,B - red green blue color components. Float number from 0 to 1 each. Optional
* RADIUS - desired radius of points's representation. Optional.

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

Example column name in data.csv: FILE_points_mypts

Example scene: [0-points-fly.cdb](../../examples/tutorial/0-points-fly.cdb/)
