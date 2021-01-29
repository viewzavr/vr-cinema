# Cinema-viewzavr view object interface

1. A view should provide a function, which returns viewzavr-component C for this view.
2. C should have following viewzavr parameters: 
* file - will be assigned with an URL (or File) to load by that view
* file2 - will be assigned with URL (or File) to second file load by that view
* w - weight parameter in range 0..1 for interpolation between files
3. As a reaction to parameters change, C should generate and control all
necessary visual components on it's behalf.

# future idea
maybe we have to consider "files" parameter which is array of N sources
and a "weights" parameters where sum(weights) = 1. Thus we may perform
better morphing from data.
