export function setup(vz) {
  vz.addType( "vr-cinema-app", create );
}

// create function should return Viewzavr object
export function create( vz, opts ) {
  opts.name ||= "vr-cinema";
  var obj = vz.createObjByType( "cinema-view-cinema",opts );

  vzPlayer.feature("css-styles");
  vzPlayer.addStyle(`
.fine-bg-color {
  background: rgb(99 116 137 / 36%);
}
.fine-padding {
  padding: 5px;
}
.shift-padding {
  padding: 0.2em 0.2em 0.2em 0.4em;
}
.vertical-auto-scroll {
  overflow-y: auto; max-height:95vh;
}
.screen-two-side-columns {
  justify-content: space-between;
  width:100%;
  pointer-events:none;
}
.screen-two-side-columns > div {
  pointer-events:all;
}
    `
    )

  vz.feature("xml-lang");
  var screen1 = vz.createFromXmlNow(`  
<screen id="screen1" class="screen-two-side-columns">
  <column id="left_column" gap="1em" margin="2em" class="vertical-auto-scroll">
    <text id="text" text="Cinema database" >
    </text>
    <edit-params id="edit-params" input="/" only2="file interpolation refresh" >
    </edit-params>
    <text id="text_2" text="Parameters" >
    </text>
    <edit-params id="edit-params_3" input="/params" >
    </edit-params>

    <btn id="btn_tg" text="Visual objects" cmd="../oguis->trigger_visible" style='width:170px'/>
    <column id="oguis" gap='0.2em' class="shift-padding fine-bg-color">
      <objects-guis objects="**/FILE*/* @cinema-visual"/>
    </column>

    
    <btn id="btn_tg" text="Extras" cmd="../eguis->trigger_visible" style='width:170px'/>
    <column id="eguis" gap='0.2em' class="shift-padding fine-bg-color">
      <btn text="+ add new" cmd="../adder->showModal"/>
      <gui-dialog-add id="adder" add-features="cinema-extra"/>
      <objects-guis objects="@cinema-extra" removable="true"/>
    </column>
    

  </column>

  <column id="right_column" gap="1em" margin="2em" class="vertical-auto-scroll">
  </column>

</screen>
`,null,obj,"screen1");

  screen1.activate(); 

  //screen1.feature("tree_items");
  //var adder = screen1.tree_items().adder;
  var adder = screen1.ns.findChild("adder");
  var new_extras_map = vz.getCatsDic();
  /*
  { 
    "camera":vz.getTypesByCat("camera"),
    "clip":vz.getTypesByCat("clip"),
    "background":vz.getTypesByCat("background"),
    "animation":vz.getTypesByCat("animation")
  };
  */
  
  forget_types(new_extras_map,["camera","auto_scale","camera-gui-control"]);
  forget_categories(new_extras_map,find_emtpy_categories(new_extras_map));
  forget_categories(new_extras_map,["gui","cinema","examples","uncategorized"]);

  adder.setParam("input",new_extras_map);

  // manually add some extras
  var ap = vz.createObj({feature:"animation-player cinema-extra",name:"Animation_player",parent:obj})
  //ap.feature("animation-player");

//  findObjects( ":artefact", ... ) repeater.input = [....];

  vz.register_feature( "camera-manager", camera_manager );
  var cm = vz.createObj({feature:"camera-manager cinema-extra",name:"Camera manager",parent:obj})
  
  return obj;
}

/*
    <column>
      <repeater input="../fo->output">
        <column>
          <btn text='{{input.ns.name}}' cmd="..//ee->trigger_visible">
          <edit-params input="{{input.getPath()}}" id='ee'/>
        </column>
      </repeater>
      <find-objects id='fo' criteria='.artefact > .visual'/>
    </column>
*/    

/*
    <text id="text_3" text="Animations" >
    </text>
    <column id="oguis" gap='0.2em' class="shift-padding fine-bg-color">
      <objects-guis objects="@animation-player" />
    </column>

*/

function forget_types( dic, names ) {
  for (let n of Object.keys(dic)) {
    var arr = dic[n];
    arr = arr.filter( (item) => names.indexOf(item) < 0)
    /*
    for (let name of names) {
      var i = arr.indexOf(name);
      if (i >= 0) {
        debugger;
        arr=arr.slice(i);
      }
    }
    */
    dic[n] = arr;
  }
}

function find_emtpy_categories( dic ) {
    var res = [];
    for (let name of Object.keys(dic))
       if (!(dic[name].length > 0)) res.push( name )
    return res;
}

function forget_categories( dic, names=[] ) {
  for (let name of names)
    delete dic[name]
}

function camera_manager( obj ) {
  obj.addCmd("camera_to_center",() => {
     vzPlayer.camera.setParam("cameraInfo",[50,50,50,0,0,0]);
  })
  var gui = obj.vz.createObjByType("camera-gui-control",{parent:obj,name:"cgu"} );
  obj.feature("param-mirror");
  obj.addParamMirror( "camera_type","cgu->type" );

}