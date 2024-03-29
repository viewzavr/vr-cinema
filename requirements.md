# Requirements

## R-INTERPOLATION [x]
Interpolation mode required for views.

## R-RESTORE [x]
Cinema views should restore their params from window hash.

## R-NOJUMP-ON-PARAM-CHANGE [x]
When changing cinema parameters, if data is not loaded yet it should not go to 
interpolation with old data.

## R-NOJUMP-ON-W-CHANGE [x]
When stepping over cinema line boundary, there should be no jumps if data not loaded yet
for new line.

## R-FLATSHADING-VRML-DEFAULT 
Vrml surface should have flat shading by default, required for Dubins car visualization (ehh).

## R-INTERPOLATION-OPTIONAL [x]
It should be able to turn it off, in case if data is not appropriate for interpolation.

## R-USABLE-NAVIGATION
Navigation in scene is sometimes not usable thanks to default behaviour of orbitcontrol.
=>
## F-CAMERA-CHANGE-FOCUSPOINT
Intersect current camera ray with visual objects in scene and focus rotation on nearest point of intersection.

## R-KEEP-SLIDER-IN-RANGE [x]
If data is reloaded, sometimes current parameter values in gui goes out of range.
This situation should be tracked and current gui param value should go into new range.

## R-PAUSE-ANIM-WHILE-LOAD [x]
We had such feature with TextLoader, and have to port it to current version too.
DONE - at viewlang level.

## R-REFRESH [x]
We should be able to reload data.csv with easy.
Branch: do it automatically by some sort of signal.

### R-FOLLOW-GROW [x]
When refreshing in R-REFRESH, if we were in some sense "last" position of some parameter (maybe primary/first)
then refreshing should switch to next (newer, maybe last) paremeter value, if one is determined after refresh process.

### R-CLEAR-CACHE
We should clear file cache when refreshing data.csv in R-REFRESH. E.g. files loaded again with same name should
be at least fetched again (maybe with 304 reponse). This is because these files actually might change too,
and because we cache parsed objects from them in utils.js in memory, we need to consider all this.

### R-MULTIPLE
Allow to specify multiple inputs for visual object. E.g data.csv:
```
FILE_points_a
alfa.csv
beta.csv
```
in that case both alfa.csv and beta.csv should be shown. Same if some parameter corresponds to multiple values.
This will allow to generate complex scenes of objects of same nature, for example chess game.

### R-CINEMA-CINEMA [x]
Provide a cinema artefact, e.g. cinema db referring to cinema db in artifact column.

### R-ROTATE-OBJ
There is a need to show obj file rotated by 90. Or at least gltf.
### R-POSITION-GLTF [x]
There is a need to position and rotate gltf file.
### F-ARTIFACT-PARAMS [x]
To solve R-ROTATE-OBJS and R-POSITION-GLTF, provide a way to setup params for artifacts. 
E.g. FILE_points_a->rotatex, and this corresponds to setting some parameter (attitribute) of visual objects.

## F-PARAMS-FIRST [x]
If parameter is specified after artefact, it should be dropped. This is according to CinemaScience spec.
First parameters list, then artefacts list.

## F-CINEMA-CLONE-PARAMS [x]
If loading cinema from cinema, clone parameters to upper cinema.
So they all are joined. Same for "interpolation" mode.

## F-COMBINE-EMTPY-COLUMNS [x]
During combine of columns of source file of visual object,
if some required column is absent, consider it as columns of zeroes.

## F-COMBINE-EMPTY-VALUES [x]
If during combine value is absent, consider it zero.

## F-BLANK [x]
if blank path specified, that means no data should be displayed in artifact.

## [x] F-LOCAL-VIEWZAVR
index.html should use local viewzavr, not internet-based.

## [x] F-PREVIEW-SCENES
Save preview images to Cinema scenes and show them in explore screen.

## [x] R-DIR-MODE
Allow to specify dir other than current directory in command line.

## [x] R-URL-MODE
Allow following: npx vr-cinema url-to-remote-dir which means visualize remote dir.
If url ends with data.csv, consider dir of that file (and probably load data.csv as specified in command line).

## [x] R-AUTO-GUESS-MODE
If vr-cinema is runned with -d key, this is dir mode.
If vr-cinema is runned with -u key, this is remote url mode.
If vr-cinema is runned just with arg, auto-guess what is it.

# [x] F-OPEN-FOLDER
If running in local mode (client is 127.0.0.1), allow to open folders by starting explorer/nautilus.
Also, maybe, allow to open it in browser in index mode.

# Ideas

* prefetch ongoing views data files?
(generate html prefetch tags for all artefacts?)
https://3perf.com/blog/link-rels/
or maybe just for ongoing artefacts during animation
or just load next artefact..
https://blog.bitsrc.io/faster-page-loads-by-prefetching-links-during-idle-time-5abe42dacf9
see linkPrefetchStrategy (or preload?)

* somehow do that loaders used in vr-cinema will be available in other viewzavr programs?

## I-SHOW-DATACSV
Probably good idea - a button to show current data csv. For learning and control purposes.

# I-SAVE-THUMBS
Together with viewzavr-player.json, save thumb files.

# I-KEEP-HISTORY
Maybe, keep a history of viewzavr-player.json. Maybe in separate files, or maybe in 1 big file (including thumbs?)

# I-OPEN-URL
npx vr-cinema https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts-2/ [data.csv] - open scene of that url.
thus we may define not only dirs, but urls. But in that case -d arg is not usable....
npx vr-cinema --url https://viewzavr.com/apps/vr-cinema-samples/wafe-fronts-2/
Need to solve: --url arg, or [auto-guess].

