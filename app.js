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

    <text id="text_3" text="Animations" >
    </text>
    <column id="oguis" gap='0.2em' class="shift-padding fine-bg-color">
      <objects-guis objects="@animation-player" />
    </column>

  </column>
  

  <column id="right_column" gap="1em" margin="2em" class="vertical-auto-scroll">

    <column class="fine-padding">
    <btn id="btn_tg" text="Extras" cmd="../eguis->trigger_visible" style='width:170px'/>
    <column id="eguis" gap='0.2em' class="shift-padding fine-bg-color">
      <btn text="+ add new" cmd="../adder->showModal"/>
      <gui-dialog-add id="adder" add-features="cinema-extra"/>
      <objects-guis objects="@cinema-extra" removable="true"/>
    </column>
    </column>

  </column>

</screen>
`,null,obj,"screen1");

  screen1.activate();
 

  var ap = vz.createObj({feature:"animation-player cinema-extra",name:"Animation_player",parent:obj})
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