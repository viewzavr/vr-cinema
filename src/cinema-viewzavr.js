// Viewzavr component with CinemaScience 3d logic and views

// Q1: how we will implement just multiple files viewer?

import cinema from "./cinema.js";
import parse_csv from "./csv.js";

////////////////////////////
import * as views from "../views/init.js";
import * as colorize_scalars from "./colorize-scalars.js";
import addUpdateFeature from "./feature-refresh.js";
import addRestoreStateFeature from "./feature-restore-on-base-change.js";

export function setup( vz ) {
  vz.addItemType( "cinema-view-cinema","Cinema 3d viewer",function( opts ) {
    return create( vz, opts );
  }, {label:"special"} );
  colorize_scalars.setup( vz );
  return views.setup( vz );
}

////////////////////////////////
export function create( vz, opts ) {
  if (!opts.name) opts.name = "cinema";
  var obj = vz.create_obj( {}, opts );
  
  obj.cinemadb = cinema();
  
  obj.addFile("file","",function(v) {
    loadFile( v,function(res) { // viewlang's func
      //obj.setParam( "csv_data", parse_csv( res ) );
      //obj.newContent(res);
      // вот тут наверное точка стыковки.. file должен присваивать другой параметр да и все
      // ну или я не знаю, что.. ну пусть пока будет assignData интерфейс, потом может 
      // под параметры переделаем..
      // хотя парадокс - для запоминания при экспорте - на вход идет файл или объект или как?
      
      var dir = v.substring( 0, v.lastIndexOf("/")+1 );
      var path_function = function(path) {
        //console.log(">>>>>>>>>> path=",path,"dir=",dir);
        return add_dir_if( path, dir );
      }
      // todo: local files
      obj.assignData( parse_csv(res),path_function);
    },
    function(err) {
      //obj.newContent("");
      obj.assignData( parse_csv(""),function(path) {});
    });
  });
  
  obj.addCheckbox("interpolation",false, () => {
     //obj.refresh();
     
      if (!obj.cinemadb) return;
      if (!obj.cinemadb.getParamNames()) return;
      obj.generateParams()
      obj.generateArtefacts();
      obj.reactOnParamChange();
      
  } );
  
  // это здесь для файла?
  obj.newContent = function(txt) {
      obj.assignData( parse_csv(txt),function(path) {
      });
/*  
      obj.cinemadb.setContent(txt);
      obj.generateParams();
      obj.generateArtefacts();
      obj.reactOnParamChange();
*/
  }
  
  // csv_data_object это по факту data-frame
  obj.assignData = function( csv_data_object,path_function,coords_function, rotate_function ) {
    obj.cinemadb.setDbContent( csv_data_object );
    obj.cinemadb_path_function = path_function;
    obj.cinemadb_coords_function = coords_function || function(coords) { return coords; };
    obj.cinemadb_rotate_function = rotate_function || function(coords) { return coords; };
    
    //obj.clearArtefacts();
    obj.generateParams();
    obj.generateArtefacts();
    obj.reactOnParamChange();
  }
  
  obj.interpolationMode = () => obj.params.interpolation;
  
  obj.useConcreteValues = (name) => {
    if (obj.interpolationMode())
      return obj.cinemadb.isStringColumn(name);
    return true;
  }

  obj.generateParams = function() {
    if (obj.params_obj) obj.params_obj.remove();
    obj.params_obj = vz.create_obj( {}, {parent:obj,name:"params"});
    obj.cinemadb.getParamNames().forEach( function(name) {
      var vals = obj.cinemadb.getDifferentParamValues( name );
      console.log("generating param: name=",name,"vals=",vals );
      var min = vals[0];
      var max = vals[ vals.length-1 ];
      // todo check if string - setup combo..
      
      if (obj.useConcreteValues( name )) {
        obj.params_obj.addCombo( name, 0,vals, function(v) {
          obj.reactOnParamChange();
        });
        obj.params_obj.setParamOption(name,"values",vals );
      }
      else
      obj.params_obj.addSlider( name, min, min, max, 0.01, function(v) {
        // R-KEEP-SLIDER-IN-RANGE
        // strange construction to keep parameter in ranges
        // todo move this as somewhat feature of parameter behaviour
        // maybe turned on optionally
        if (v < min) 
          obj.params_obj.setParam( name, min );
        else
          if (v > max) obj.params_obj.setParam( name, max );
        else
          obj.reactOnParamChange();
      });
      obj.params_obj.setParamOption( name,"sliding",false );
    });
    //obj.params_obj.addCheckbox("interpolation",true, obj.generateParams);
  }

  obj.reactOnParamChange = function() {
    if (!obj.art_obj) return;
  
    var req = {};
    obj.cinemadb.getParamNames().forEach( function(name) {

      if (obj.useConcreteValues(name)) {
        var index = obj.params_obj.getParam( name );
        req[name] = obj.params_obj.getParamOption( name,"values" )[ index ];
      }
      else
        req[name] = obj.params_obj.getParam( name );
    });

    var [ found_i1, dist1, found_i2, dist2 ]  = obj.cinemadb.findNearestOnGrid( req );

    if (found_i2 < 0) {
      found_i2 = found_i1;
      dist2 = 0;
      dist1 = 0;
      //w=0;
    }

    var sum_dist = dist1 + dist2;
    var w = sum_dist > 0 ? dist1 / sum_dist : 0;
    //console.log("w",w,"found_i1=",found_i1,"dist1=",dist1,"found_i2=",found_i2,"dist2=",dist2,"req=",req);    
    
    // feature: interpolation is optional
    if (!obj.interpolationMode()) w = 0;

    obj.cinemadb.getArtNames().forEach( function(name) {
      var artsrc1 = obj.cinemadb.data[ name ][ found_i1 ];
      artsrc1 = obj.cinemadb_path_function( artsrc1 );
      var artsrc2 = obj.cinemadb.data[ name ][ found_i2 ];
      artsrc2 = obj.cinemadb_path_function( artsrc2 );

      var art = obj.art_obj.ns.getChildByName(name);
      if (art) {
        art.setParam("file",artsrc1 );
        art.setParam("file2",artsrc2 );
        art.setParam("w",w );
      }
      else
      {
        console.error("artefact view not found in art_obj list. name=",name);
      }
      
      // feature: prefertch
      var artsrc3 = obj.cinemadb.data[ name ][ found_i2+1 ];
      if (artsrc3) {
        artsrc3 = obj.cinemadb_path_function( artsrc3 );
        linkPrefetchStrategy( artsrc3 );
      }

    });
  };
  
  obj.clearArtefacts = function() {
    if (obj.art_obj) {
      obj.art_obj.remove();
      obj.art_obj = undefined;
    }
  }
  
  obj.generateArtefacts = function() {
    if (obj.art_obj) obj.art_obj.remove();
    obj.art_obj = vz.create_obj( {}, {parent:obj,name:"artefacts"});

    obj.art_obj.cinemadb_path_function = obj.cinemadb_path_function; // loaders need this

    obj.cinemadb.getArtNames().forEach( function(name) {
      //var nama = name.split("FILE_")[1];
      var nama = name;
      
      var type = name.split("_")[1];
      
      var artfunc = obj.getArtFunc( type );
      if (!artfunc) {
        console.error("cinema-viewavr: no type func for type=",type );
      }
      else 
      {
        var art = artfunc( {parent:obj.art_obj, name:nama} );
        art.cinemadb_path_function = obj.cinemadb_path_function;
        art.cinemadb_coords_function = obj.cinemadb_coords_function;
        art.cinemadb_rotate_function = obj.cinemadb_rotate_function;
      }
      //vz.create_obj( {}, {parent:obj.art_obj,name:nama} );
      // ...
    });
    

  }
  

  
/*  this is original way to provide view types

function tablica() {
  var h = {
    "points" : vz_points,
    "lines"  : vz_lines,
    "triangles"  : vz_triangles,
    "models" : vz_models,
    "vrml"   : vz_vrml,
    "cinema" : create,
  }
  return h;
}

  obj.getArtFunc = function( art_type ) {
     return obj.tablica[ art_type ];
  }
  
  // table of art_type -> function of view creator..
  obj.tablica = tablica();
  obj.addViewType = function( art_type, func ) {
    obj.tablica[ art_type ] = func;
  }
*/

  obj.getArtFunc = function( art_type ) {
    var type = "cinema-view-" + art_type;
    return vz.getTypeFunc( type );
  }
  
  addRestoreStateFeature( obj );
  addUpdateFeature( obj ); // update-feature should be after "restore-state" feature

  return obj;
}


///////////////// helper

function add_dir_if( path, dir ) {
  if (path[0] == "/") return path;
  if (path.match(/\w+\:\/\//)) return path;
  if (path[0] == "." && path[1] == "/") path = path.substring( 2 );
  return dir + path;
}

////////////// feature: prefetch
    function linkPrefetchStrategy0(url) {
        return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        //link.rel = 'prefetch';
        link.href = url;
        link.rel = 'preload';
        link.as = 'fetch'; // https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
        link.onload = resolve;
        link.onerror = reject;
        document.head.appendChild(link);
        });
    };
    
    // subfeature: prefetch once to avoid page vanishing by links and also chrome logs every prefetch to net log
    var prefetchedCache = {};
    function linkPrefetchStrategy(url) {
      return; // todo debug
    
      if (prefetchedCache[url]) return;
      prefetchedCache[url] = true;
      linkPrefetchStrategy0(url);
    }