# Wafe fronts

> [Run online](https://viewzavr.com/apps/vr-cinema/?datapath=https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts/data.csv)

In N. N. Krasovskii Institute of Mathematics and Mechanics, the problem of the propagation of wave fronts
in three-dimensional space is investigated by Dynamic systems department. The case of a spherical vectogram of velocities 
of a unit radius centered at the origin is considered. As the initial set, we consider a parametrically given curve
```
x = 2 cos t
y = sin t
z = cos^2 t
t ∈ [0,2π]
```
In current study, 30 sections of growing wave fronts was computed and approximated with triangles [1].

To visualize it, the following [Cinema database](https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts/) was created.
It's [data.csv](https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts/data.csv) has following content:
```
n,	FILE_triangles_surf
1,	surface/1.txt
2,	surface/2.txt
3,	surface/3.txt
…
30,	surface/30.txt
```

That is, in this file we declared one parameter `n` and one visual object of type triangles (`FILE_triangles_surf`).
The  files  in  subdirectory `surface` ([1.txt](https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts/surface/1.txt) ...  [30.txt](https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts/surface/30.txt)) represent sections of wave fronts and  have  the  following  form  of content:
```
X,Y,Z,X2,Y2,Z2,X3,Y3,Z3
-1.858, -0.0137, 0.8582, -1.8535, -0.0425, 0.8554, -1.8332, -0.0432, 0.8793
-1.858, -0.0137, 0.8582, -1.8332, -0.0432, 0.8793, -1.8376, -0.0139, 0.8821
...
```

These files defines coordinates for triangles that forms the surface of given front. 
With data.csv they provide enough information for creating visualization.

A mathematicial running visualization then is able to choose value of parameter `n` and see corresponding wave front.

> 1. A. A. Uspenskii, P. D. Lebedev, On the structure of the singular set of solutions in one class of 3d time-optimal control problems, 
> Vestnik Udmurtskogo Universiteta. Matematika. Mekhanika. Kompyuternye Nauki 31 (2021) 471–486. doi:[10.35634/vm210309](http://dx.doi.org/10.35634/vm210309).

