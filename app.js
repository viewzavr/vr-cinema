export function setup(vz) {
  vz.addType( "vr-cinema-app", create );
}

// create function should return Viewzavr object
export function create( vz, opts ) {
  opts.name ||= "vr-cinema";
  var obj = vz.createObjByType( "cinema-view-cinema",opts );

  vz.feature("xml-lang");
  var screen1 = vz.createFromXmlNow(`  
<screen id="screen1" justify-content="space-between" style='width:100%; pointer-events:none'>
  <column id="left_column" gap="1em" margin="2em" style='pointer-events:all;'>
    <text id="text" text="Cinema database" >
    </text>
    <edit-params id="edit-params" input="/" only2="file interpolation refresh" >
    </edit-params>
    <text id="text_2" text="Parameters" >
    </text>
    <edit-params id="edit-params_3" input="/params" >
    </edit-params>

    <btn id="btn_tg" text="Visual objects" cmd="../oguis->trigger_visible" style='width:170px'/>
    <column id="oguis" gap='0.2em'>
      <objects-guis objects="**/FILE*/* @cinema-visual"/>
    </column>

   <objects-guis objects="/Animation_player"/>

  </column>
  

  <column id="right_column" gap="1em" margin="2em" style='pointer-events:all;'>

    <btn text="Add extra" cmd="../adder->showModal"/>
    <gui-dialog-add id="adder" add-features="cinema-extra"/>
    <btn id="btn_tg" text="Extras" cmd="../eguis->trigger_visible" style='width:170px'/>

    <column id="eguis" gap='0.2em'>
    <objects-guis objects="@cinema-extra" removable="true"/>
    </column>

  </column>

</screen>
`,null,obj,"screen1");

  screen1.activate();

  vz.register_feature( "cinema-extra", () => {} );

  var ap = vz.createObj({feature:"animation-player",name:"Animation_player",parent:obj})
  //ap.feature("animation-player");

//  findObjects( ":artefact", ... ) repeater.input = [....];
  
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