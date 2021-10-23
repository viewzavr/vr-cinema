///////////////// feature

// requirement: when db changes, set it's params to previous db
// requirement: when system reloads, set params to original state
// requirement: when user switches to some cinema db, and then to another, and then back to first,
//              parameters configured for first should be restored!
// requirement: when user refreshes db, viewzavr should use previous state
//              (it should return to it's original parameters and attributes of visual objects.)

export default function addRestoreStateFeature( obj ) {

  var subtreeState = {};

  obj.chain( "assignData",function( csv_data_object,path_function,coords_function, rotate_function ) {

    mergeDeep( subtreeState, obj.dump() );
    // on every data change, we save it settings in a merged fashion, and then use these settings
    // to setup new cinema configuration. it is ok if there are some objects missing, they will
    // be just skipped. Params will be assigned, yep. Todo assign only existing params?..

    this.orig( csv_data_object,path_function,coords_function, rotate_function );

    console.log("FEATURE-RESTORE: restoring state",subtreeState)
    // now, all artefacts are already created, and we may setup them..
    return obj.vz.createChildrenByDump( subtreeState, obj, true ); // manual params mode
  });

  var tmrid;
  obj.chain("reactOnParamChange",function() {
     if (tmrid) clearTimeout( tmrid );
     var q = this.orig;
     tmrid = setTimeout( function() { q(); }, 0 );
  });

  // track when object is restored from external sources (for example window hash)
  obj.chain("restoreFromDump",function(dump,...rest) {
    subtreeState = dump;
    return  this.orig( dump,...rest );
  });

}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return mergeDeep(target, ...sources);
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
