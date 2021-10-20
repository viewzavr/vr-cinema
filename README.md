# vr-cinema

VR-Cinema is a 3D scientific visualization software. It works in a web browser, and utilizes CinemaScience-based scene format for input.


![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-12/2020-03-12-at-11-47-04.gif)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-12/2020-03-12-at-14-13-10.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-12/2020-03-12-at-14-24-20.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-11/2020-03-11-at-14-25-15.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-11/2020-03-11-at-10-35-30.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-05/2020-03-05-at-14-16-05.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-04/2020-03-04-at-13-43-27.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-02/2020-03-02-at-20-28-43.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-02/2020-03-02-at-22-47-20.png)
![](http://showtime.lact.in/resizer_st/fit/160/160//files/visual/2020-03-02/2020-03-02-at-20-29-14.png)


# How to use

### 1. Prepare computer
Install latest nodejs https://nodejs.org/en/download/

### 2. Prepare scene

Create a file with scene description. See [format documentation](format.md) for details.

### 3. Start visualization

Execute in command line:
* `npx vr-cinema` to start visualization in current directory.
* `npx vr-cinema -d path-to-dir` to start visualization from another directory.

This will start local http server and open browser with VR-Cinema for specified CinemaScience database.

# Online version

You may use online demo of VR-Cinema to visualize your data: http://viewzavr.com/apps/vr-cinema/

# Windows Explorer menu / GNOME Nautilus menu

You may add "Open with VR-Cinema..." menu for Explorer in Windows and in Nautilus in GNOME/Linux
to start VR-Cinema. Use following commands:
* `npx -p vr-cinema vr-cinema-setup` - add menu
* `npx -p vr-cinema vr-cinema-setup-off` - remove menu

# Features

* 10+ visual object types (points, lines, triangles, ..., graphical files, ...).
* Animations across selected Cinema parameter, and video movies.
* Interpolation of input files, allowing to see transitions between your data. May be turned ON/OFF.

# how to add your own type

Create new viewzavr component with type `cinema-view-MYID`.
Then use that MYID in artefacts names: `FILE_{MYID}_some`, for example: FILE_vtkpoints_lava.
See [views](views) dir for example.

# copyright

The presented approach for 3d scene description is developed in Computer visualization lab 
of N.N. Krasovskii Institute of Russian Academy of Sciences led by scientific supervision 
of [V. L. Averbukh](https://www.researchgate.net/profile/Vladimir_Averbukh) in 2020. www.cv.imm.uran.ru

2021 (c) Pavel Vasev
