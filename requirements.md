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

# Ideas

* prefetch ongoing views data files?
(generate html prefetch tags)