# Requirements

## R-INTERPOLATION
Interpolation mode required for views.

## R-RESTORE
Cinema views should restore their params from window hash.

## R-NOJUMP-ON-PARAM-CHANGE
When changing cinema parameters, if data is not loaded yet it should not go to 
interpolation with old data.

## R-NOJUMP-ON-W-CHANGE
When stepping over cinema line boundary, there should be no jumps if data not loaded yet
for new line.

## R-FLATSHADING-VRML-DEFAULT
Vrml surface should have flat shading by default, required for Dubins car visualization (ehh).

## R-INTERPOLATION-IS-A-FEATURE
It should be able to turn it off, in case if data is not appropriate for interpolation.

## R-KEEP-SLIDER-IN-RANGE
If data is reloaded, sometimes current parameter values in gui goes out of range.
This situation should be tracked and current gui param value should go into new range.

# Ideas

* prefetch ongoing views data files?
(generate html prefetch tags for all artefacts?)
https://3perf.com/blog/link-rels/
or maybe just for ongoing artefacts during animation
or just load next artefact..
https://blog.bitsrc.io/faster-page-loads-by-prefetching-links-during-idle-time-5abe42dacf9
see linkPrefetchStrategy (or preload?)

* somehow do that loaders used in vr-cinema will be available in other viewzavr programs?

## R-PAUSE-ANIM-WHILE-LOAD
We had such feature with TextLoader, and have to port it to current version too.
DONE - at viewlang level.

## R-REFRESH
We should be able to reload data.csv with easy.
Branch: do it automatically by some sort of signal.

### R-FOLLOW-GROW
When refreshing in R-REFRESH, if we were in some sense "last" position of some parameter (maybe primary/first)
then refreshing should switch to next (newer, maybe last) paremeter value, if one is determined after refresh process.

### R-CLEAR-CACHE
We should clear file cache when refreshing data.csv in R-REFRESH. E.g. files loaded again with same name should
be at least fetched again (maybe with 304 reponse). This is because these files actually might change too,
and because we cache parsed objects from them in utils.js in memory, we need to consider all this.

