## Lines

Purpose: render a set of line segments given in a csv file.

Solution.

A csv file should contain columns:
* X,Y,Z,X2,Y2,Z2 - coordinates of start and end point for each line segment. Required.
* R,G,B - color components of lines, floating number in 0..1 range each. Optional.
* R2,G2,B2 - color components for lines, if provided then R,G,B is for start and R2,G2,B,2 for line end. Optional.
* RADIUS - desired radius of a line's representation. Optional.

Example input:
```
X,Y,Z,X2,Y2,Z2,RADIUS,R,G,B
10.0,0.0,0, 0,0,0, 1.0, 0.0,1.0,0
20.0,5.0,4, 0,3,0, 1.0, 0.0,1.0,0
```

Example column: `FILE_lines_lin1`