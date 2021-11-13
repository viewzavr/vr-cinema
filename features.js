export function setup(vz,module) {
  vz.register_feature_set( module ); // здесь фичи заведеным нами через апи системы в мозги системы
  //return vz.features( module ); // здесь фичи являются автономным деревом
}

export function main2(vzPlayer) {
   let obj = vzPlayer.vz.createObjByType("cinema-view-cinema");
   vzPlayer.setRoot( obj );  
   console.log("MAIN PERFORMED")
}

export function auto_load_settings(vzPlayer) {
  var obj = vzPlayer.getRoot();
  var vz = vzPlayer.vz;
  var loaded_settings_url;

      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        var settings_url = vz.getDir( f ) + "viewzavr-player.json";

        if (settings_url == loaded_settings_url) {
          console.log("SETTINGS: source file changed, but settings path not, SO NOT fetching settings from server",settings_url );
          return;
        }
        loaded_settings_url = settings_url;

        // see also: feature-restore-on-base-change.js
        console.log("SETTINGS: source file changed, fetching settings from server",settings_url );
        vzPlayer.loadJson2( settings_url ).then( (data) =>  {
          setTimeout( () => {
            // need erase incoming url from settings - we have own one
            if (typeof( data?.children?.scene?.params?.file ) !== "undefined")
              delete data.children.scene.params['file'];
            console.log("SETTINGS: source file changed, applying settings from server",settings_url,data );
            vzPlayer.restoreFromDump( data, true );
          }, 500 );
        }).catch( (err) => {} );
        
      });

};

/////////////////////////////////////////////////////

export function hash_settings(vzPlayer) {
  vzPlayer.loadFromHash().then( () => {
    vzPlayer.startSavingToHash();
  });
};

/////////////////////////////////////////////////////

export function auto_save_settings( vzPlayer ) {
      var storepath;
      var obj = vzPlayer.getRoot();
      var vz = vzPlayer.vz;

      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f );
      });

      var oh = vzPlayer.saveToHash;
      vzPlayer.saveToHash = function(obj2) {
        if (storepath) {
            var code = vzPlayer.dump();
            var path = storepath + "/viewzavr-player.json";

            var str = JSON.stringify( code );
            if (str.indexOf("Camera rotate") > 0)
               debugger;
            
            fetch( path, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(code,null, '  ')
            });
           // послали
           console.log("SETTINGS: sent to server",path);
        }
        oh(obj2);
      }
}

/////////////////////////////////////////////////////

//auto_save_screenshot.prepend_features = "scene_screenshot";
export function auto_save_screenshot( vzPlayer ) {
      vzPlayer.feature( "scene_screenshot" );
      var vz = vzPlayer.vz;

      var storepath;
      var obj = vzPlayer.getRoot();
      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f );
      });  

      var oh = vzPlayer.saveToHash;
      vzPlayer.saveToHash = function(obj2) {
        if (storepath)
          vzPlayer.sceneScreenShotBlob("image/png",(blob) => {
              fetch( storepath + "/preview.png", {
                method: 'POST',
                body: blob
              });
            });
        oh(obj2);
      }
}

/////////////////////////////////////////////////////

export function show_file_progress() {

var div = document.createElement("div");
div.id = "fileProgress";
document.body.appendChild(div);

var sheet = document.createElement('style')
sheet.innerHTML = `
        div#fileProgress {
          position:fixed;
          /*top: 2px; */
          bottom: 2px;
          right: 2px;
          /*padding: 2px; */
          padding: 0px;
          background-color: rgba( 0,119,0,0.5 );
          color: rgba(200,200,200,1);
          z-index: 10005;
        }

        div#fileProgress .la_error {
          animation: blinker 2s linear infinite;
        }

        @keyframes blinker {
          50% { opacity: 0.4; }
        }

        div#fileProgress .la_error {
          background-color: #700;
          color: #fff;
        }
`;
document.body.appendChild(sheet);

}

////////////////////////////////////////////////////////////

export function commands_socket( vzPlayer ) {
  var cmdpath = getParameterByName("cmdpath");
  if (cmdpath) {
    go( vzPlayer, cmdpath )
  }
}

function go( vzPlayer, socket_path ) {

  loadFile( socket_path, function(msg) {
    console.log("msg",msg);
    var rootobj = vzPlayer.getRoot();
    if (rootobj)
      rootobj.signalTracked("refresh");
  });

}

/////////////////////////////////////////////////////////////
export function datapath_from_url(vzPlayer) {
  var obj = vzPlayer.getRoot();
  var vz = vzPlayer.vz;
  // datapath from query should be the last in processsing order!
  // it should override that what is in params!
  var file = getParameterByName("datapath") || vz.getDir( import.meta.url ) + "./examples/tutorial/0-points-fly.cdb/data.csv";
      
  if ((obj?.params?.file || "") == "") {
     console.log("we set file",file );
     obj.setParam("file",file);
  }

}

////////////////////////////////////////// фича организации анимации

export function animate(env) {
  env.setAnimate = (func,milliseconds) => {
    if (!(milliseconds>0)) return;

    window.requestAnimationFrame( animframe );

    var t0 = performance.now();
    var tfinish = t0 + milliseconds;
    var bstop = false;
    function animframe() {
      var t = performance.now();
      if (t < tfinish && !bstop) {
         func( (t - t0) / milliseconds );
         window.requestAnimationFrame( animframe );
      }
      else
        func( 1.0 );
    }

    return () => { bstop=true; }
  }
}

////////////////////////////////////////// todo - сделать фичей camera manager?

const mouse = new THREE.Vector2();
export function camera_intesecting_objects( vzPlayer ) {
  // по клику это странно. тут не одна поверхность а много объектов и надо уметь высказать свое желание явно
  // даблклик выглядит как явное.
  var gr = vzPlayer.vz.createObjByType( "lines", {parent: vzPlayer.getRoot(),name: "camera-cursor-hilite"})
  var gr2 = vzPlayer.vz.createObjByType( "lines", {parent: gr,name: "pt"})
  //var gr = vzPlayer.vz.createObjByType( "points", {parent: vzPlayer.getRoot(),name: "camera-cursor-hilite"})
  gr.setParam("color",[1,1,0]);
  gr.setParam("additive",true);
  gr2.setParam("color",[1,1,0]);
  gr2.setParam("additive",true);
  gr2.linkParam("visible","..->visible");
  // vz.setParam( [gr,gr2], ...


  gr.feature("timers animate");

  var camanim;

  threejs.renderer.domElement.addEventListener( 'dblclick', sceneClick, false );  
  function sceneClick( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    do_intersect(mouse,(pt) => {
       var coords = [
                      pt[0],pt[1],0,   pt[0],pt[1],pt[2],
                      0,pt[1],pt[2],   pt[0],pt[1],pt[2],
                      pt[0],0,pt[2],   pt[0],pt[1],pt[2]
                    ]
       gr.setParam("positions",coords);
       gr.setParam("visible",true)
       gr2.setParam("positions",pt);
       gr.setTimeout( () => {
          gr.setParam("visible",false)
       },2000);

       var c = qmlEngine.rootObject.scene3d.cameraCenter.slice();
       if (camanim) camanim();
       camanim = gr.setAnimate( (t) => {
          var pt2 = [0,0,0];
          pt2[0] = c[0] + (pt[0]-c[0])*t;
          pt2[1] = c[1] + (pt[1]-c[1])*t;
          pt2[2] = c[2] + (pt[2]-c[2])*t;
          
          //console.log(t,pt2)
          qmlEngine.rootObject.scene3d.cameraCenter = pt2;
       },500,"camove");

       //gr.setInterval
       //qmlEngine.rootObject.scene3d.cameraCenter = arr;
    });
  }
}

const raycaster = new THREE.Raycaster();

var rcp2 = {
  Mesh: {},
  Line: { threshold: 10 },
  LOD: {},
  Points: { threshold: 10 },
  Sprite: {}
}
var rcp1 = {
  Mesh: {},
  Line: { threshold: 1 },
  LOD: {},
  Points: { threshold: 1 },
  Sprite: {}
}


function do_intersect(pts = new THREE.Vector2(0,0), cb ) {
  //const pts = new THREE.Vector2(0,0);
  raycaster.setFromCamera( pts, threejs.camera );
  //console.log("intersecting ",{pts});
  raycaster.params = rcp1;
  var intersects = raycaster.intersectObjects( threejs.scene.children );
  //console.log("results:",{intersects})
  var j = intersects.findIndex( (e) => e?.object?.visible);
  // идея в том что если не смогли с мелкими радиусами что-то найти, поищем с более крупными
  // но конечно надо это как-то по уму делать
  if (!(j>=0)) {
    raycaster.params = rcp2;
    intersects = raycaster.intersectObjects( threejs.scene.children );
    j = intersects.findIndex( (e) => e?.object?.visible);
  }

  //console.log({j})
  if (j >= 0) {
    var pt = intersects[j].point;
    //console.log("setting center to",pt)
    var arr  = [pt.x, pt.y, pt.z];
    //qmlEngine.rootObject.scene3d.cameraCenter = arr;
    if (cb) cb(arr);
  }
  
  /*
  for ( let i = 0; i < intersects.length; i ++ ) {
    //console.log( intersects[ i ] );
    if (intersects[ i ].object && intersects[ i ].object.visible) {
      var pt = intersects[i].point;
      var arr  = [pt.x, pt.y, pt.z];
      qmlEngine.rootObject.scene3d.cameraCenter = arr;
      if (cb) cb(arr);
      break;
    }
  } 
  */ 
    
}