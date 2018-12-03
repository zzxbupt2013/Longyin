import React, {Component} from 'react';
import {Layout, Menu, Icon, Input, Select, DatePicker, Button, Table, Tabs, Switch, notification} from 'antd';
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
    fixed: 'left',
    width: 100,
}, {
    title: '名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 100,
}, {
    title: '编号',
    dataIndex: 'number',
    fixed: 'left',
    width: 100,
}, {
    title: '时间',
    dataIndex: 'time_stamp',
    width:200
}, {
    title: '画布等级',
    dataIndex: 'canvas_grade',
    width:100
}, {
    title: '报警信息',
    dataIndex: 'alert_msg',
    width:200,
}, {
    title: '当前风力',
    dataIndex: 'cur_wind',
    width:100
}, {
    title: '报警牌面',
    dataIndex: 'alert_board',
    width:100
}, {
    title: '报警图片',
    dataIndex: 'alert_img',
    width:100,
    render: (image) => (<img src={image} className='alert-img'/>),
}];
let map;
class Screen extends Component {
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
            isAlertDetailHide: true,
            triggerImgSrc: '../img/left-circle.png',
            tableData: [],
            selectedRowKeys: [],
            timeControls: [],
        };
    }

    componentDidMount() {
        /*  var self = this;
          broadData.add((data) => {
              console.log(data.btnClicked);
              self.setState({isLightControlHide: !data.btnClicked});
          });*/
        let data = [];
        for (let i = 0; i < 46; i++) {
            data.push({
                key: i,
                order: i+1,
                name: `设备${i+1}`,
                number: `编号${i+1}`,
                time_stamp: '2018-09-08 15:45',
                canvas_grade: `画布等级${i+1}`,
                alert_msg: '报警描述信息',
                cur_wind: '7级',
                alert_board: '牌面',
                alert_img: '../img/billboard.png',
            });
        }
        this.setState({tableData: data});
      /*  for(let i=0;i<10;i++){
            this.openNotification();
            console.log(i);
        }*/
        this.openNotification();
        this.initMap();
        /*var myAuto = document.getElementById('alertAudio');
        myAuto.src = "../alert.mp3";*/
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
    addDeviceMarker() {
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
        for (var i = 0; i < selectedDevices.length; i++) {
            var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            var isAlert =true;
            if (i % 2 == 0) {
                isAlert = false;
            }
            let sContent = `<div class="infowin_container">
    <div class="infowin_img">
        <a href="#"><img src="../img/billboard.png" style="width: 200px;height:300px" alt="无报警图片"/></a>
    </div>
    <div class="infowin_msg">
        <p>名称：${deviceData[selectedDevices[i]].name}</p>
        <p>编号：${deviceData[selectedDevices[i]].number}</p>
        <p>报警信息：${deviceData[selectedDevices[i]].alert_msg}</p>
        <p>当前风力：${deviceData[selectedDevices[i]].cur_wind}</p>
        <p>画布等级：${deviceData[selectedDevices[i]].canvas_grade}</p>
    </div>
</div>`;
            addMarker(point,sContent,isAlert);
        }

        // 编写自定义函数,创建标注
        function addMarker(point,sContent, alert) {
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

    onNotificationClose() {
        console.log('Notification was closed. Either the close button was clicked or duration time elapsed.');
        var myAuto = document.getElementById('alertAudio');
        myAuto.src = "";
    }

    openNotification() {
        const key = `open${Date.now()}`;
        const btn = (
            <div>
                <Button type="primary" size="small" onClick={() => {
                    notification.close(key);
                    var myAuto = document.getElementById('alertAudio');
                    myAuto.src = "";
                }}>
                    我知道了
                </Button>
                <Button type="primary" size="small" style={{marginLeft:'5px'}} onClick={this.showAlertDetail.bind(this)}>
                    查看详情
                </Button>
            </div>

        );
        notification.open({
            message: 'XXX设备画布异常',
            duration: null,
            description: 'XXX设备画布异常，请及时处理 ',
            icon: <Icon type="exclamation-circle" style={{color: '#e92635'}}/>,
            style: {
                marginTop: 64,
            },
            btn,
            key,
            onClose: this.onNotificationClose.bind(this),
        });
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
    showAlertDetail(){
        this.setState({isAlertDetailHide: false});
    }
    hideAlertDetail(){
        this.setState({isAlertDetailHide: true});
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
                        defaultSelectedKeys={['3']}
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
                                       pagination={pagination} locale={locale} bordered={true} scroll={{x: 1150}}/>
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
                            <div className={this.state.isAlertDetailHide ? 'alert-detail-msg-hide' : 'alert-detail-msg-show'}>
                                <h1 style={{fontSize:'medium'}}>设备详情信息</h1>
                                <div style={{width:'500px',height:'300px'}}>
                                    <div className="alert-detail-img">
                                        <a href="#"><img src="../img/billboard.png" style={{width:'200px',height:'300px'}}
                                                         alt="无报警图片"/></a>
                                    </div>
                                    <div className="alert-detail-msg">
                                        <p>名称：XXX</p>
                                        <p>编号：XXXXXX</p>
                                        <p>时间：XXXXXX</p>
                                        <p>报警信息：XXXXXXXXXXXX</p>
                                        <p>报警牌面：XXXXXXXXXXXX</p>
                                        <p>当前风力：XXXXXXXX</p>
                                        <p>画布等级：XXXXXX</p>
                                    </div>
                                </div>
                                <div style={{textAlign:'center'}}>
                                    <Button type="primary" onClick={this.hideAlertDetail.bind(this)}
                                            style={{width: '50%', marginBottom: '20px',marginTop:'20px'}}>
                                        关闭
                                    </Button>
                                </div>
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

export default Screen;