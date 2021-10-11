export default function go( arg ) {
   var storepath;
   var vz = vzPlayer.vz;

      var obj = vzPlayer.getRoot();
      obj.trackParam( "file",function() {
        var f = obj.getParam("file");
        storepath = vz.getDir( f ) + "viewzavr-player.json";
      });

      var oh = vzPlayer.saveToHash;
      vzPlayer.saveToHash = function( obj ) {
          var code = obj.dump();

          if (storepath) {
          fetch( storepath, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(code,null, '  ')
          });
          // послали
          console.log("SETTINGS: sent to server",storepath);
          }

          oh( obj );
      };

}

