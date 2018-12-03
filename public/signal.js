var broadData = new signals.Signal();
var datas = {};
function lightControl() {
    datas.btnClicked=true;
    broadData.dispatch(datas);
}
