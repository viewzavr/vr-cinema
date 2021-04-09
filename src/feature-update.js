// вот надо вызывать.. а так может быть она на уровне прототипа смогла бы?..
export default function install( obj ) {
  obj.addCmd("refresh",function() {
    obj.signalTracked("file");
  });
}
