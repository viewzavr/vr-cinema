# viewzavr-cinema

Viewzavr-based CinemaScience 3d viewer and it's components.
A successor of https://github.com/pavelvasev/38parrots

# run online

http://viewzavr.com/apps/vr-cinema/

# run on local machine

* `npx vr-cinema` (when current directory is CinemaScience database)
* `npx vr-cinema path-to-dir`

will start local http server for specified dir and open browser with online version of vr-cinema for that database.


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
