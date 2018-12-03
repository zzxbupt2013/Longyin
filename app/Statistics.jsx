import React, {Component} from 'react';
import {Layout, Menu, Icon, Input, Select, DatePicker, Button, Table, Tabs, Switch, notification} from 'antd';
import BMap from 'BMap';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
import locale from 'antd/lib/date-picker/locale/zh_CN';

import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const Search = Input.Search;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const rootSubmenuKeys = ['sub1', 'sub2'];
const RoadData = [
    {value: 1, text: '路线一'},
    {value: 2, text: '路线二'},
    {value: 3, text: '路线三'},
    {value: 4, text: '全部'},
];
const RegionData = [
    {value: 1, text: '区划一'},
    {value: 2, text: '区划二'},
    {value: 3, text: '区划三'},
    {value: 4, text: '全部'},
];
const DateTypes = [
    {value: 1, text: '年'},
    {value: 2, text: '月'},
    {value: 3, text: '日'},
];
const DevicesType = [
    {value: 1, text: '设备一'},
    {value: 2, text: '设备二'},
    {value: 3, text: '设备三'},
    {value: 4, text: '全部'},
];
const columns = [{
    title: '所属区划',
    dataIndex: 'areaname',
    width: 100,
}, {
    title: '路线类型',
    dataIndex: 'roadtype',
    width: 100,
}, {
    title: '路线名称',
    dataIndex: 'roadname',
    width: 100,
}, {
    title: '已投放使用',
    dataIndex: 'used',
    width: 100
}, {
    title: '未投放使用',
    dataIndex: 'un_used',
    width: 100
}, {
    title: '广告牌总数',
    dataIndex: 'total',
    width: 100,
},];
const columns_alert = [{
    title: '所属区划',
    dataIndex: 'areaname',
    width: 100,
}, {
    title: '路线类型',
    dataIndex: 'roadtype',
    width: 100,
}, {
    title: '路线名称',
    dataIndex: 'roadname',
    width: 100,
}, {
    title: '设备类型',
    dataIndex: 'dev_type',
    width: 100
}, {
    title: '日期类型',
    dataIndex: 'date_type',
    width: 100
}, {
    title: '故障次数',
    dataIndex: 'fault_num',
    width: 100,
},{
    title: '报警次数',
    dataIndex: 'alert_num',
    width: 100,
},{
    title: '总次数',
    dataIndex: 'total',
    width: 100,
},];
class Statistics extends Component {
    constructor() {
        super();
        this.state = {
            startdate: '',
            enddate: '',
            roadtype: '',
            regiontype: '',
            roadname: '',
            datetype: '',
            devicetype: '',
            tableData: [],
            tableDataAlert: [],
            isDevicesAlertHide: true,
            isDevicesHide: true,
            openKeys: ['sub1'],
        };
    }

    componentDidMount() {
    }

    createBarChart(x_data, used_data, unused_data) {
        console.log('create');
        let chart_devices = echarts.init(document.getElementById('bar_chart'));
        let option = {
            title: {
                text: '广告设施统计',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['已投放', '未投放']
            },
            xAxis: {
                type: 'category',
                data: x_data
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            series: [
                {
                    name: '已投放',
                    type: 'bar',
                    data: used_data
                },
                {
                    name: '未投放',
                    type: 'bar',
                    data: unused_data
                }
            ]
        };
        chart_devices.setOption(option);

    }
    createBarChartAlert(x_data, fault_data, alert_data) {
        let chart_devices = echarts.init(document.getElementById('bar_chart_alert'));
        let option = {
            title: {
                text: '监控报警统计',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['故障次数', '报警次数']
            },
            xAxis: {
                type: 'category',
                data: x_data
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            series: [
                {
                    name: '故障次数',
                    type: 'bar',
                    data: fault_data
                },
                {
                    name: '报警次数',
                    type: 'bar',
                    data: alert_data
                }
            ]
        };
        chart_devices.setOption(option);
        console.log('create');

    }
    onMenuOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
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

    handleDateTypeChange(value) {
        console.log(value.label);
        this.setState({datetype:value.label});
    }

    handleDeviceTypeChange(value) {
        console.log(value.label);
        this.setState({devicetype: value.label});
    }

    getSearchData() {
        let table_data = [];
        for (let i = 0; i < 10; i++) {
            table_data.push({
                key: i,
                areaname: this.state.regiontype,
                roadtype: this.state.roadtype,
                roadname: this.state.roadname,
                used: `${i + 10}`,
                un_used: `${i + 12}`,
                total: `${i + i + 22}`,
            });
        }
        this.setState({tableData: table_data});
        this.setState({isDevicesAlertHide: true, isDevicesHide: false});
        let data = {
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            roadtype: this.state.roadtype,
            regiontype: this.state.regiontype,
            roadname: this.state.roadname,
        };
        console.log(data);

        let len = (moment(this.state.enddate) - moment(this.state.startdate)) / (1000 * 24 * 60 * 60);
        let used_data = [];
        let unused_data = [];
        let x_data = [];
        if (len == 0) {
            let str = moment(this.state.startdate).format("YYYY-MM-DD");
            x_data.push(str);
            used_data.push(8);
            unused_data.push(9);
        } else {
            for (let i = 0; i <= len; i++) {
                let str = moment(moment(this.state.startdate).add(i, 'd')).format("YYYY-MM-DD");
                console.log(str);
                x_data.push(str);
                used_data.push((i + 1) * 2);
                unused_data.push(i + 1);
            }
        }
        console.log(len);
        let sum_used = used_data.reduce(function (prev, cur) {
            return prev + cur;
        });
        let sum_unused = unused_data.reduce(function (prev, cur) {
            return prev + cur;
        });
        used_data.push(sum_used);
        unused_data.push(sum_unused);
        x_data.push('总数');
        this.createBarChart(x_data, used_data, unused_data);
    }
    getSearchDataAlert(){
        let data_alert=[];
        for (let i = 0; i < 10; i++) {
            data_alert.push({
                key: i,
                areaname: this.state.regiontype,
                roadtype: this.state.roadtype,
                roadname: this.state.roadname,
                dev_type:this.state.devicetype,
                date_type:this.state.datetype,
                fault_num: `${i + 10}`,
                alert_num: `${i + 12}`,
                total: `${i + i + 22}`,
            });
        }
        this.setState({tableDataAlert: data_alert});
        let self=this;
        this.setState({isDevicesAlertHide: false, isDevicesHide: true});
        let data = {
            startdate: this.state.startdate,
            enddate: this.state.enddate,
            roadtype: this.state.roadtype,
            regiontype: this.state.regiontype,
            roadname: this.state.roadname,
            datetype:this.state.datetype,
            devicetype:this.state.devicetype,
        };
        console.log(data);
        //计算两个时间之间的年份差
        function calculateYear(start,end){
            var startdate=moment(start);
            var enddate=moment(end);
            return enddate.year()-startdate.year();
        }
        //计算两个时间之间的月份差
        function calculateYearMonth(start,end){
            var startdate=moment(start);
            var enddate=moment(end);
            var yeardiff=enddate.year()-startdate.year();
            return yeardiff*12+enddate.month()-startdate.month();
        }
        function createBarByDay(){
            let len = (moment(self.state.enddate) - moment(self.state.startdate)) / (1000 * 24 * 60 * 60);
            let fault_data = [];
            let alert_data = [];
            let x_data = [];
            if (len == 0) {
                let str = moment(self.state.startdate).format("YYYY-MM-DD");
                x_data.push(str);
                fault_data.push(8);
                alert_data.push(9);
            } else {
                for (let i = 0; i <= len; i++) {
                    let str = moment(moment(self.state.startdate).add(i, 'd')).format("YYYY-MM-DD");
                    console.log(str);
                    x_data.push(str);
                    fault_data.push((i + 1) * 2);
                    alert_data.push(i + 1);
                }
            }
            console.log(len);
            let sum_fault_data = fault_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            let sum_alert_data = alert_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            fault_data.push(sum_fault_data);
            alert_data.push(sum_alert_data);
            x_data.push('总数');
            self.createBarChartAlert(x_data, fault_data, alert_data);
        }
        function createBarByMonth(){
            let len = calculateYearMonth(self.state.startdate,self.state.enddate);
            let fault_data = [];
            let alert_data = [];
            let x_data = [];
            if (len == 0) {
                let str = moment(self.state.startdate).format("YYYY-MM");
                x_data.push(str);
                fault_data.push(8);
                alert_data.push(9);
            } else {
                for (let i = 0; i <= len; i++) {
                    let str = moment(moment(self.state.startdate).add(i, 'M')).format("YYYY-MM");
                    console.log(str);
                    x_data.push(str);
                    fault_data.push((i + 1) * 2);
                    alert_data.push(i + 1);
                }
            }
            console.log(len);
            let sum_fault_data = fault_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            let sum_alert_data = alert_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            fault_data.push(sum_fault_data);
            alert_data.push(sum_alert_data);
            x_data.push('总数');
            self.createBarChartAlert(x_data, fault_data, alert_data);
        }
        function createBarByYear(){
            let len = calculateYear(self.state.startdate,self.state.enddate);
            let fault_data = [];
            let alert_data = [];
            let x_data = [];
            if (len == 0) {
                let str = moment(self.state.startdate).format("YYYY");
                x_data.push(str);
                fault_data.push(8);
                alert_data.push(9);
            } else {
                for (let i = 0; i <= len; i++) {
                    let str = moment(moment(self.state.startdate).add(i, 'y')).format("YYYY");
                    console.log(str);
                    x_data.push(str);
                    fault_data.push((i + 1) * 2);
                    alert_data.push(i + 1);
                }
            }
            console.log(len);
            let sum_fault_data = fault_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            let sum_alert_data = alert_data.reduce(function (prev, cur) {
                return prev + cur;
            });
            fault_data.push(sum_fault_data);
            alert_data.push(sum_alert_data);
            x_data.push('总数');
            self.createBarChartAlert(x_data, fault_data, alert_data);
        }
        switch (this.state.datetype){
            case '年':createBarByYear();break;
            case '月':createBarByMonth();break;
            case '日':createBarByDay();break;
            default:createBarByDay();break;
        }
    }
    render() {
        const pagination = {
            pageSize: 4,
            total: 10,
        };
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
                        defaultSelectedKeys={['8']}
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
                            openKeys={this.state.openKeys}
                            onOpenChange={this.onMenuOpenChange.bind(this)}
                            style={{height: '100%', borderRight: 0}}
                        >
                            <SubMenu key="sub1" title={<span><Icon type="bar-chart"/>广告设施统计</span>}>
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
                                        <Input style={{width: '32%'}} defaultValue="所属区划：" disabled={true}/>
                                        <Select labelInValue placeholder="所属区划"
                                                onChange={this.handleRegionChange.bind(this)} style={{width: '64%'}}>
                                            {RegionData.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <div className="item-container">
                                        <Input style={{width: '32%'}} defaultValue="路线类型：" disabled={true}/>
                                        <Select labelInValue placeholder="路线类型"
                                                onChange={this.handleRoadChange.bind(this)} style={{width: '64%'}}>
                                            {RoadData.map(d => <Option key={d.value}>{d.text}</Option>)}
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
                                    <div className="item-container  center-btn">
                                        <Button type="primary" onClick={this.getSearchData.bind(this)}
                                                style={{width: '80%'}}>
                                            查询
                                        </Button>
                                    </div>
                                </Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="bar-chart"/>监控报警统计</span>}>
                                <Menu.Item key="1">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="开始日期：" disabled={true}/>
                                        <DatePicker onChange={this.startDateChange.bind(this)} placeholder="选择日期"
                                                    locale={locale}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="结束日期：" disabled={true}/>
                                        <DatePicker onChange={this.endDateChange.bind(this)} placeholder="选择日期"
                                                    locale={locale}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="所属区划：" disabled={true}/>
                                        <Select labelInValue placeholder="所属区划"
                                                onChange={this.handleRegionChange.bind(this)} style={{width: '64%'}}>
                                            {RegionData.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="4">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="路线类型：" disabled={true}/>
                                        <Select labelInValue placeholder="路线类型"
                                                onChange={this.handleRoadChange.bind(this)} style={{width: '64%'}}>
                                            {RoadData.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="路线名称：" disabled={true}/>
                                        <Input placeholder="路线名称" onChange={this.handleRoadNameChange.bind(this)}
                                               style={{width: '64%'}}/>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="6">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="日期类型：" disabled={true}/>
                                        <Select labelInValue placeholder="日期类型" defaultValue={{key:"日"}}
                                                onChange={this.handleDateTypeChange.bind(this)} style={{width: '64%'}}>
                                            {DateTypes.map(d => <Option key={d.text}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="7">
                                    <div className="item-container center-btn">
                                        <Input style={{width: '32%'}} defaultValue="设备类型：" disabled={true}/>
                                        <Select labelInValue placeholder="设备类型"
                                                onChange={this.handleDeviceTypeChange.bind(this)} style={{width: '64%'}}>
                                            {DevicesType.map(d => <Option key={d.value}>{d.text}</Option>)}
                                        </Select>
                                    </div>
                                </Menu.Item>
                                <Menu.Item key="8">
                                    <div className="item-container center-btn">
                                        <Button type="primary" onClick={this.getSearchDataAlert.bind(this)}
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
                            <div className={this.state.isDevicesHide ? 'devices-hide' : 'devices-show'}>
                                <div className="bar_chart_container">
                                    <div id="bar_chart">

                                    </div>
                                </div>
                                <div className="table_container">
                                    <Table columns={columns} dataSource={this.state.tableData}
                                           pagination={pagination} locale={locale} bordered={true}/>
                                </div>
                                <div className="center-btn">
                                    <Button type="primary"
                                            style={{width: '100px', marginBottom: '20px', marginTop: '20px'}}>
                                        打印导出
                                    </Button>
                                </div>
                            </div>
                            <div className={this.state.isDevicesAlertHide ? 'alert-hide' : 'alert-show'}>
                                <div className="bar_chart_container">
                                    <div id="bar_chart_alert">

                                    </div>
                                </div>
                                <div className="table_container">
                                    <Table columns={columns_alert} dataSource={this.state.tableDataAlert}
                                           pagination={pagination} locale={locale} bordered={true}/>
                                </div>
                                <div className="center-btn">
                                    <Button type="primary"
                                            style={{width: '100px', marginBottom: '20px', marginTop: '20px'}}>
                                        打印导出
                                    </Button>
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }

}

export default Statistics;