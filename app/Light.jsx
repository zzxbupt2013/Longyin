import React, {Component} from 'react';
import {Layout, Menu, Icon, Input, Select, DatePicker, Button, Table, Tabs, Switch,notification} from 'antd';
import BMap from 'BMap';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const RoadData = [
    {value: 1, text: '路线一'},
    {value: 2, text: '路线二'},
    {value: 3, text: '路线三'},
];
const RegionData = [
    {value: 1, text: '区划一'},
    {value: 2, text: '区划二'},
    {value: 3, text: '区划三'},
];
const columns = [{
    title: '序号',
    dataIndex: 'order',
    fixed:'left',
    width:50,
}, {
    title: '名称',
    dataIndex: 'name',
    fixed:'left',
    width:100,
}, {
    title: '编号',
    dataIndex: 'number',
    fixed:'left',
    width:100,
}, {
    title: '照明状态',
    dataIndex: 'light_state',
}, {
    title: '照度值',
    dataIndex: 'light_value',
}, {
    title: '电流状态',
    dataIndex: 'i_state',
}, {
    title: '电流值',
    dataIndex: 'i_value',
}, {
    title: '当前状态',
    dataIndex: 'cur_state',
}, {
    title: '开启时间',
    dataIndex: 'str_time',
}, {
    title: '关闭时间',
    dataIndex: 'end_time',
}, {
    title: '记录时间',
    dataIndex: 'rec_time',
}];
let map;
class Light extends Component {
    constructor() {
        super();
        this.state = {
            startdate: '',
            enddate: '',
            roadtype: '',
            regiontype: '',
            roadname: '',
            isListHide: true,
            isTriggerHide: true,
            isLightControlHide: true,
            isRangePickerHide: true,
            triggerImgSrc: '../img/left-circle.png',
            tableData: [],
            selectedRowKeys: [],
            timeControls: [],
        };
    }

    componentDidMount() {
        var self = this;
        broadData.add((data) => {
            console.log(data.btnClicked);
            self.setState({isLightControlHide: !data.btnClicked});
        });
        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                key: i,
                order: i+1,
                name: `设备${i+1}`,
                number: `编号${i+1}`,
                light_state: `照明状态`,
                light_value: `照度值`,
                i_state: `电流状态`,
                i_value: `电流值`,
                cur_state: `当前状态`,
                str_time: `2018-09-10 09:56`,
                end_time: `2018-09-10 10:56`,
                rec_time: `2018-09-10 10:56`,
            });
        }
        this.setState({tableData: data});
        this.openNotification();
        this.initMap();
        this.addDefaultMarker();
        var myAuto = document.getElementById('alertAudio');
        myAuto.src="../alert.mp3";
    }
    initMap(){
        // 百度地图API功能
        map = new BMap.Map("allmap", {enableMapClick: false});    // 创建Map实例
        map.centerAndZoom("深圳", 13);  // 初始化地图,设置中心点坐标和地图级别
//添加地图类型控件
        map.addControl(new BMap.MapTypeControl({
            mapTypes: [
                BMAP_NORMAL_MAP,
            ]
        }));
        map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    }
    addDefaultMarker(){
        map.clearOverlays();//添加标注前清除已有标注
        let selectedDevices = this.state.selectedRowKeys;
        let deviceData = this.state.tableData;
        var opts = {
            width: 500,     // 信息窗口宽度
            height: 300,     // 信息窗口高度
            enableMessage: true,//设置允许信息窗发送短息
            enableCloseOnClick: false//关闭点击地图取消弹窗
        };
        var point = new BMap.Point(114.025293, 22.699301);
        map.centerAndZoom(point, 14);
        // 随机向地图添加selectedDevices.length个标注
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var lngSpan = Math.abs(sw.lng - ne.lng);
        var latSpan = Math.abs(ne.lat - sw.lat);
        for (var i = 0; i < 4; i++) {
            var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            var isAlert = false;
            let sContent = `<div class="infowin_container">
    <div class="infowin_img">
        <a href="#"><img src="../img/billboard.png" style="width: 200px;height:300px" alt="无报警图片"/></a>
    </div>
    <div class="infowin_msg">
         <p>名称：XXX</p>
         <p>编号：XXXXXX</p>
         <p>时间：XXXXXX</p>
         <p>报警信息：XXXXXXXXXXXX</p>
         <p>报警牌面：XXXXXXXXXXXX</p>
      
    </div>
</div>`;
            addMarker(point, sContent, isAlert);
        }

        // 编写自定义函数,创建标注
        function addMarker(point, sContent, alert) {
            var marker = new BMap.Marker(point);
            var icon = new BMap.Icon("../img/un_alert_mid.png", new BMap.Size(19, 25));
            map.addOverlay(marker);
            var label = new BMap.Label("我是设备编号", {offset: new BMap.Size(-30, 25)});
            marker.setLabel(label);
            if (alert) {
                marker.setIcon(icon);
            }
            addClickHandler(sContent, marker);
        }

        function addClickHandler(content, marker) {
            marker.addEventListener("click", function (e) {
                    openInfo(content, e)
                }
            );
        }

        function openInfo(content, e) {
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            infoWindow.addEventListener('clickclose', function () {
                datas.btnClicked = false;
                broadData.dispatch(datas);
            });
            map.openInfoWindow(infoWindow, point); //开启信息窗口
            localStorage.currentMarker = p.getPosition().lng + p.getPosition().lat;
        }

        this.setState({isListHide: true});
    }
    addDeviceMarker() {
        map.clearOverlays();//添加标注前清除已有标注
        let selectedDevices = this.state.selectedRowKeys;
        let deviceData = this.state.tableData;
        var opts = {
            width: 500,     // 信息窗口宽度
            height: 300,     // 信息窗口高度
            enableMessage: true,//设置允许信息窗发送短息
            enableCloseOnClick:false//关闭点击地图取消弹窗
        };
        var point = new BMap.Point(114.025293, 22.699301);
        map.centerAndZoom(point, 14);
        // 随机向地图添加selectedDevices.length个标注
        var bounds = map.getBounds();
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var lngSpan = Math.abs(sw.lng - ne.lng);
        var latSpan = Math.abs(ne.lat - sw.lat);
        for (var i = 0; i < selectedDevices.length; i++) {
            var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            let sContent = `<div class="infowin_container">
  <div class="infowin_img">
    <a href="#"><img src="../img/billboard.png" style="width: 200px;height:300px" alt="无设备图片" /></a>
  </div>
  <div class="infowin_msg">
    <p>名称：${deviceData[selectedDevices[i]].name}</p>
    <p>编号：${deviceData[selectedDevices[i]].number}</p>
    <p>照明状态：${deviceData[selectedDevices[i]].light_state}</p>
    <p>照度值：${deviceData[selectedDevices[i]].light_value}</p>
    <p>电流状态：${deviceData[selectedDevices[i]].i_state}</p>
    <p>电流值：${deviceData[selectedDevices[i]].i_value}</p>
    <p>当前状态：${deviceData[selectedDevices[i]].cur_state}</p>
    <p>开启时间：${deviceData[selectedDevices[i]].str_time}</p>
    <p>关闭时间：${deviceData[selectedDevices[i]].end_time}</p>
    <p>记录时间：${deviceData[selectedDevices[i]].rec_time}</p>
    <button onclick="lightControl()">照明控制</button>
  </div>
</div>`;
            addMarker(point,sContent);
        }

        // 编写自定义函数,创建标注
        function addMarker(point,sContent) {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            var label = new BMap.Label("我是设备编号", {offset: new BMap.Size(-30, 25)});
            marker.setLabel(label);
            addClickHandler(sContent, marker);
        }

        function addClickHandler(content, marker) {
            marker.addEventListener("click", function (e) {
                    openInfo(content, e)
                }
            );
        }

        function openInfo(content, e) {
            var p = e.target;
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            infoWindow.addEventListener('clickclose',function (){
                datas.btnClicked = false;
                broadData.dispatch(datas);
            });
            map.openInfoWindow(infoWindow, point); //开启信息窗口
            localStorage.currentMarker = p.getPosition().lng + p.getPosition().lat;
        }

        this.setState({isListHide: true});
    }
    onNotificationClose(){
        console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
        var myAuto = document.getElementById('alertAudio');
        myAuto.src="";
    }
    openNotification(){
        const key = `open${Date.now()}`;
        const  btn = (
            <Button type="primary" size="small" onClick={() => {notification.close(key);
                var myAuto = document.getElementById('alertAudio');
                myAuto.src="";}}>
                我知道了
            </Button>
        );
        notification.open({
            message: 'XXX设备照明异常',
            duration:null,
            description: 'XXX设备照明异常，请及时处理 ',
            icon: <Icon type="exclamation-circle" style={{ color: '#e92635' }} />,
            style: {
                marginTop: 64,
            },
            btn,
            key,
            onClose: this.onNotificationClose.bind(this),
        });
    }
    onRangePickerChange(value, dateString) {
        console.log('Selected Time: ', value);//未格式化数据
        console.log('Formatted Selected Time: ', dateString);//格式化数据
    }

    onRangePickerOk(value) {//选择确定时的回调
        console.log('Selected Time: ', value);//未格式化数据
        let start = moment(value[0]).format("YYYY-MM-DD HH:mm");
        let close = moment(value[1]).format("YYYY-MM-DD HH:mm");
        let tempdatestrs = this.state.timeControls;
        let temp={start:start,close:close};
        tempdatestrs.push(temp);
        console.log(tempdatestrs);
        this.setState({timeControls: tempdatestrs});
        this.setState({isRangePickerHide: true});
    }

    addLightAutoControl() {
        this.setState({isRangePickerHide: false});
    }
    deleteLightAutoControl() {
        let temp = this.state.timeControls;
        temp.pop();
        console.log(temp);
        this.setState({timeControls: temp});
    }
    onLightSwitch(checked) {
        console.log(`switch to ${checked}`);
    }

    onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    }

    startDateChange(date) {
        console.log(moment(date).format("YYYY-MM-DD"));
        this.setState({startdate: moment(date).format("YYYY-MM-DD")});
    }

    endDateChange(date) {
        console.log(moment(date).format("YYYY-MM-DD"));
        this.setState({enddate: moment(date).format("YYYY-MM-DD")});
    }

    handleRoadChange(value) {
        console.log(value.label);
        this.setState({roadtype: value.label});
    }

    handleRegionChange(value) {
        console.log(value.label);
        this.setState({regiontype: value.label});
    }

    handleRoadNameChange(e) {
        this.setState({roadname: e.target.value});
    }

    triggerImgClick() {
        this.setState({isListHide: !this.state.isListHide});
    }

    showTotalItems(total) {
        return `总计${total}个设备`;
    }

    getSearchData() {
        let data = {
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            roadtype: this.state.roadtype,
            regiontype: this.state.regiontype,
            roadname: this.state.roadname,
        };
        console.log(data);
        this.setState({isListHide: false, isTriggerHide: false});
    }

    hideList() {
        this.setState({isListHide: true});
    }

    hideLightControl() {
        datas.btnClicked = false;
        broadData.dispatch(datas);
    }

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
        };
        const pagination = {
            pageSize: 4,
            total: 45,
            showTotal: this.showTotalItems.bind(this),
        };
        const hasSelected = selectedRowKeys.length > 0;
        const timeItems=this.state.timeControls.map((data,index)=>{
            console.log(data);
            return (
                <p className="time-control-item" key={index}>开关时间{index+1}:  {data.start}  ----  {data.close}</p>
            );
        });
        return (
            <Layout>
                <Header style={{padding: '0 50px 0 0'}}>
                    <div className="logo-container">
                        <img src="../img/react-logo.png" className="logo"/>
                        <h1 className="logo-title">户外广告智能管理系统</h1>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{lineHeight: '64px'}}
                    >
                        <Menu.Item key="1"><a href="Index.html">首页</a></Menu.Item>
                        <Menu.Item key="2"><a href="Light.html">照明系统</a></Menu.Item>
                        <Menu.Item key="3"><a href="#">画面检测</a></Menu.Item>
                        <Menu.Item key="4"><a href="#">数据安全</a></Menu.Item>
                        <Menu.Item key="5"><a href="#">入侵监测</a></Menu.Item>
                        <Menu.Item key="6"><a href="#">状态监测</a></Menu.Item>
                        <Menu.Item key="7"><a href="#">客户服务</a></Menu.Item>
                        <Menu.Item key="8"><a href="#">统计分析</a></Menu.Item>
                        <Menu.Item key="9"><a href="#">系统管理</a></Menu.Item>
                        <Menu.Item key="10"><a href="#">退出系统</a></Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={300} style={{background: '#fff'}}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{height: '100%', borderRight: 0}}
                        >
                            <SubMenu key="sub1" title={<span><Icon type="search" theme="outlined"/>查询广告牌</span>}>
                                <Menu.Item key="1">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="开始日期：" disabled={true}/>
                                        <DatePicker onChange={this.startDateChange.bind(this)} placeholder="选择日期"
                                                    locale={locale}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="结束日期：" disabled={true}/>
                                        <DatePicker onChange={this.endDateChange.bind(this)} placeholder="选择日期"
                                                    locale={locale}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="路线类型：" disabled={true}/>
                                        <Select labelInValue placeholder="路线类型"
                                                onChange={this.handleRoadChange.bind(this)} style={{width: '64%'}}>
                                            {RoadData.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="所属区划：" disabled={true}/>
                                        <Select labelInValue placeholder="所属区划"
                                                onChange={this.handleRegionChange.bind(this)} style={{width: '64%'}}>
                                            {RegionData.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="路线名称：" disabled={true}/>
                                        <Input placeholder="路线名称" onChange={this.handleRoadNameChange.bind(this)}
                                               style={{width: '64%'}}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <div className="item-container center-btn">
                                        <Button type="primary" onClick={this.getSearchData.bind(this)}
                                                style={{width: '80%'}}>
                                            查询
                                        </Button>
                                    </div>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content className="map-container">
                            <div id="search"><Search
                                placeholder="输入名称或者编号定位广告牌"
                                enterButton="搜索"
                                size="large"
                                onSearch={value => console.log(value)}
                            /></div>
                            <div className={this.state.isTriggerHide ? 'trigger-hide' : 'trigger-show'}>
                                <img className="trigger-img"
                                     src={this.state.isListHide ? '../img/right-circle.png' : '../img/left-circle.png'}
                                     onClick={this.triggerImgClick.bind(this)}/>
                            </div>
                            <div className={this.state.isListHide ? 'list-hide' : 'list-show'}>
                                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.tableData}
                                       pagination={pagination} locale={locale} bordered={true} scroll={{ x: 1300 }}/>
                                <span style={{marginLeft: '45%'}}>
                                   {hasSelected ? `选择了${selectedRowKeys.length} 个设备` : ''}
                                   </span>
                                <div className="center-btn">
                                    <Button type="primary" onClick={this.addDeviceMarker.bind(this)}
                                            style={{width: '50%', marginBottom: '20px'}}>
                                        地图标注
                                    </Button>
                                </div>
                            </div>
                            <div
                                className={this.state.isLightControlHide ? 'light-control-hide' : 'light-control-show'}>
                                <h1>照明灯控制配置</h1>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="手动控制" key="1">
                                        <p>点击开关进行照明灯手动控制</p>
                                        <Switch defaultChecked onChange={this.onLightSwitch.bind(this)}
                                                checkedChildren="开" unCheckedChildren="关"  style={{marginBottom: '10px',marginTop:'10px'}}/>
                                    </TabPane>
                                    <TabPane tab="自动控制" key="2">
                                        <div>
                                            <div className="time-controls">
                                                {timeItems}
                                            </div>
                                            <div
                                                className={this.state.isRangePickerHide ? 'range-picker-hide' : 'range-picker-show'}>
                                                <RangePicker
                                                    locale={locale}
                                                    showTime={{format: 'HH:mm'}}
                                                    format="YYYY-MM-DD HH:mm"
                                                    placeholder={['开启时间', '关闭时间']}
                                                    onChange={this.onRangePickerChange.bind(this)}
                                                    onOk={this.onRangePickerOk.bind(this)}
                                                />
                                            </div>
                                            <div  style={{width: '100%',marginBottom: '10px',marginTop:'10px'}}>
                                                <Button type="dashed" onClick={this.addLightAutoControl.bind(this)}>
                                                    <Icon type="plus"/> 添加时间段
                                                </Button>
                                                <Button type="dashed" onClick={this.deleteLightAutoControl.bind(this)}>
                                                    <Icon type="minus"/> 删除时间段
                                                </Button>
                                            </div>
                                                <Button type="primary"  style={{marginBottom: '10px',marginTop:'10px'}}>保存</Button>
                                        </div>
                                    </TabPane>
                                </Tabs>
                                <Button type="primary" onClick={this.hideLightControl.bind(this)}
                                        style={{width: '50%', marginBottom: '20px'}}>
                                    关闭
                                </Button>
                            </div>
                            <div id="allmap">
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }


}

export default Light;