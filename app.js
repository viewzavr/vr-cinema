export function setup(vz) {
  vz.addType( "vr-cinema-app", create );
}

// create function should return Viewzavr object
export function create( vz, opts ) {
  opts.name ||= "vr-cinema";
  var obj = vz.createObjByType( "cinema-view-cinema",opts );

  vz.feature("xml-lang");
  var screen1 = vz.createFromXmlNow(`  
<screen id="screen1" content-padding="2em" >
  <column id="column" gap="1em" >
   <text id="text" text="Cinema database" >
   </text>
   <edit-params id="edit-params" input="/" only="file interpolation" >
   </edit-params>
   <text id="text_2" text="Parameters" >
   </text>
   <edit-params id="edit-params_3" input="/params" >
   </edit-params>
  </column>
</screen>
 `,null,obj,"screen1");

  screen1.activate();
  
  return obj;
}