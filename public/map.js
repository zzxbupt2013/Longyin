
// 百度地图API功能
var map = new BMap.Map("allmap", {enableMapClick:false});    // 创建Map实例
map.centerAndZoom("深圳", 13);  // 初始化地图,设置中心点坐标和地图级别
//添加地图类型控件
map.addControl(new BMap.MapTypeControl({
    mapTypes: [
        BMAP_NORMAL_MAP,
    ]
}));
map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
