# Flying points example

> [Run online](https://viewzavr.com/apps/vr-cinema/?datapath=./examples/_tutorial/0-points-fly.cdb/data.csv)

In this example we visualize a set of points, whose cooridinates change during time.

We put point coordinates in files NN.csv, whose content is following:
```
X, Y, Z
3.98, 9.00, 10.52
6.30, 9.02, 2.57
9.46, 3.33, 1.29
1.63, 7.95, 8.27
7.77, 10.29, 7.65
...
```

Then we create `data.csv` file (eg. cinema database) of following content.
```
time, FILE_points_alfa
0,  dat/00.csv
10, dat/01.csv
20, dat/02.csv
30, dat/03.csv
...
```

> Here we use a subdirectory named `dat` for storing actual data files. You may use any directories or not use them at all.

Thus we achieve following visualization:

![](http://showtime.lact.in/resizer_st/fit/340/340//files/visual/2020-03-13/2020-03-13-at-12-32-28.png)
![](http://showtime.lact.in/resizer_st/fit/340/340//files/visual/2020-03-14/2020-03-14-at-22-29-47.png)

Software generates slider interface for parameter T, and user might change parameter value using that slider,
and see how points change their coordinates:

![](http://showtime.lact.in/resizer_st/fit/340/340//files/visual/2020-03-14/2020-03-14-at-22-44-22.png)
![](http://showtime.lact.in/resizer_st/fit/340/340//files/visual/2020-03-14/2020-03-14-at-22-44-27.png)
![](http://showtime.lact.in/resizer_st/fit/340/340//files/visual/2020-03-14/2020-03-14-at-22-44-29.png)
