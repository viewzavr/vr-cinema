export function setup(vz,module) {
  vz.register_feature_set( module );
}

/////////////////////////////////////////////////////

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
      vzPlayer.saveToHash = function(obj) {
        if (storepath) {
            var code = obj.dump();
            
            fetch( storepath + "/viewzavr-player.json", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(code,null, '  ')
            });
           // послали
           console.log("SETTINGS: sent to server",storepath);
        }
        oh(obj);
      }
}

/////////////////////////////////////////////////////

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
      vzPlayer.saveToHash = function(obj) {
        if (storepath)
          vzPlayer.sceneScreenShotBlob("image/png",(blob) => {
              fetch( storepath + "/preview.png", {
                method: 'POST',
                body: blob
              });
            });
        oh(obj);
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