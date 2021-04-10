export default function go( socket_path ) {

  loadFile( socket_path, function(msg) {
    console.log("msg",msg);
    var rootobj = vzPlayer.getRoot();
    if (rootobj)
      rootobj.signalTracked("refresh");
  });
  
}

/*

function loadFileWebsocket( path, istext, handler, errhandler ) {
  // https://learn.javascript.ru/websockets
  
  var socket = new WebSocket( path );
  socket.onmessage = function(event) {
    var msg = event.data;
    console.log("msg",msg);
    //handler( event.data );
  };
        
  socket.onerror = function( event ) {
    setFileProgress( path,"WEBSOCKET ERROR");
      setTimeout( function() {
         setFileProgress( path );
       }, 25000 );
    if (errhandler)
      errhandler(event,path);
  }
  var result = {};
  result.abort = function() { socket.close(); }
  result.stoploading = function() { socket.close() }
  return result;
}
*/