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