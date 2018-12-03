import React, {Component} from 'react';
import {Layout, Menu, Icon} from 'antd';
import Devices from './system_component/Devices.jsx';
import Sensor from './system_component/Sensor.jsx';
import TrafficCard from './system_component/TrafficCard.jsx';
import Canvas from './system_component/Canvas.jsx';
import Inspection from './system_component/Inspection.jsx';
import Analysis from './system_component/Analysis.jsx';
import Permission_user from './system_component/Permission_user.jsx';
import Warning from './system_component/Warning.jsx';
import Permission_data from './system_component/Permission_data.jsx';
import Entry from './system_component/Entry.jsx';
import 'babel-polyfill';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const rootSubmenuKeys = ['sub1', 'sub3','sub4','sub5'];

class System extends Component {
    constructor() {
        super();
        this.state = {
            openKeys: ['sub1','sub2'],
            subComponentKey:''
        };

    }
    componentDidMount(){

    }
    onMenuItemClick(item){
        this.setState({subComponentKey:item.key});
    }
    openSubComponent(){
        switch(this.state.subComponentKey){
            case '1':return <Devices/>;break;
            case '2':return <Sensor/>;break;
            case '3':return <TrafficCard/>;break;
            case '4':return <Canvas/>;break;
            case '5':return <Inspection/>;break;
            case '6':return <Analysis/>;break;
            case '7':return <Permission_user/>;break;
            case '8':return <Warning/>;break;
            case '9':return <Permission_data/>;break;
            case '20':return <Entry/>;break;
            default:return <Devices/>;break;

        }
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

    render() {

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
                    defaultSelectedKeys={['9']}
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
                        defaultSelectedKeys={['1']}
                        onOpenChange={this.onMenuOpenChange.bind(this)}
                        onClick={this.onMenuItemClick.bind(this)}
                        style={{height: '100%', borderRight: 0}}
                    >
                        <SubMenu key="sub1" title={<span><Icon type="tool"/>设备资产管理</span>}>
                            <SubMenu key="sub2" title="资产管理">
                                <Menu.Item key="1">
                                    广告设施设备
                                </Menu.Item>
                                <Menu.Item key="2">
                                    传感器设备
                                </Menu.Item>
                                <Menu.Item key="3">
                                    物联卡管理
                                </Menu.Item>
                                <Menu.Item key="4">
                                    画布
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item key="5">
                                资产巡检
                            </Menu.Item>
                            <Menu.Item key="6">
                               统计分析
                            </Menu.Item>
                            <Menu.Item key="20">
                                设备录入
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" title={<span><Icon type="tool"/>用户权限管理</span>}>
                            <Menu.Item key="7">
                                用户权限管理
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub4" title={<span><Icon type="tool"/>预警方案管理</span>}>
                            <Menu.Item key="8">
                                预警方案管理
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub5" title={<span><Icon type="tool" />数据权限管理</span>}>
                            <Menu.Item key="9">
                                数据权限管理
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content className="content_container" id="content_container_id">
                        {this.openSubComponent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
    }

}

export default System;