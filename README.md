# viewzavr-cinema

Viewzavr-based CinemaScience 3D viewer.

# How to use

## Prepare
1. Create a CinemaScience database with 3D scene according to docs on https://github.com/pavelvasev/38parrots
2. Install latest nodejs and npm https://nodejs.org/en/download/

## Run

Execute in command line:
* `npx vr-cinema` to open visualization for cinemascience 3d scene in current directory.
* `npx vr-cinema path-to-dir` to open visualization from another directory.

This will start local http server for specified dir and open browser with online version of vr-cinema for that database.

# Online version

http://viewzavr.com/apps/vr-cinema/

# implemented features

* Interpolates data from two neighbouring files.

# how to add your own type

Create new viewzavr component with type `cinema-view-MYID`.
Then use that MYID in artefacts names: `FILE_{MYID}_some`, for example: FILE_vtkpoints_lava.
See [views](views) dir for example.

# copyright

The presented approach for 3d scene description is developed in Computer visualization lab 
of N.N. Krasovskii Institute of Russian Academy of Sciences led by scientific supervision 
of [V. L. Averbukh](https://www.researchgate.net/profile/Vladimir_Averbukh) in 2020. www.cv.imm.uran.ru

2021 (c) Pavel Vasev
