export default function go( arg ) {
   var storepath;
   var vz = vzPlayer.vz;

/*
  vz.feature( "scene_screenshot" );
      var obj = vzPlayer.getRoot();
      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f );
      });

      var oh = vzPlayer.saveToHash;
      vzPlayer.saveToHash = function( obj ) {
          var code = obj.dump();

          if (storepath) {
            fetch( storepath + "/viewzavr-player.json", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(code,null, '  ')
            });


            // F-PREVIEW-SCENES
            vz.sceneScreenShotBlob("image/png",(blob) => {
              fetch( storepath + "/preview.png", {
                method: 'POST',
                body: blob
              });
            });
            // послали
            console.log("SETTINGS: sent to server",storepath);
          }

          oh( obj );
      };
*/

    // for vzPlayer
    vz.register_feature( "save_settings", (env) => {
      var storepath;
      var obj = env.getRoot();
      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f );
      });  

      var oh = env.saveToHash;
      env.saveToHash = function(obj) {
        if (storepath) {
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
    });      


    // for vzPlayer
    vz.register_feature( "save_screen_shot", (env) => {
      vz.feature( "scene_screenshot" );

      var storepath;
      var obj = env.getRoot();
      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f );
      });  

      var oh = env.saveToHash;
      env.saveToHash = function(obj) {
        if (storepath)
          vz.sceneScreenShotBlob("image/png",(blob) => {
              fetch( storepath + "/preview.png", {
                method: 'POST',
                body: blob
              });
            });
        oh(obj);
      }
    });


}