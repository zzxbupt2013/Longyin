import React, {Component} from 'react';
import {Layout, Menu, Breadcrumb,Modal,Button,Form, Icon, Input, Drawer} from 'antd';
const FormItem = Form.Item;
const {Header, Content, Footer} = Layout;
class Index extends Component {
    constructor() {
        super();
        this.state = {
            checkcode: '',
            visible: false,
        };
    }
    handleSubmit(){
         let values={
             oldpass:document.getElementById("old-pass").value,
             newpass:document.getElementById("new-pass").value
         };
         console.log(values);
    }
    showDrawer(){
        this.setState({
            visible: true,
        });
    }
    hideDrawer(){
        this.setState({
            visible: false,
        });
    }
    render() {
        console.log(localStorage.currentUser);
        const currentUser = localStorage.currentUser;
        return (
            <Layout className="layout">
                <Header style={{background: '#b1b1b1'}}>
                    <div className="logo-container">
                        <img src="../img/react-logo.png" className="logo"/>
                    </div>
                    <div className="title-container">
                        <h1>户外广告智能管理系统</h1>
                    </div>
                    <div className="right-container">
                        <span>欢迎您：{currentUser}</span>
                        <ul>
                            <li>
                                <a href="Login.html">登出</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" onClick={this.showDrawer.bind(this)}>修改密码</a>
                            </li>
                        </ul>
                    </div>
                </Header>
                <Content className="content-container">
                    <div className="nav-img-container">
                        <div className="nav-img">
                            <a href="Light.html"> <img src="../img/react-logo.png" /></a>
                            <a href="Light.html" className="nav-a">照明系统</a>
                        </div>
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">画面检测</a>
                        </div>
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">数据安全监测</a>
                        </div>
                    </div>
                    <div className="nav-img-container">
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">入侵监测</a>
                        </div>
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">状态监测</a>
                        </div>
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">客户服务</a>
                        </div>
                    </div>
                    <div className="nav-img-container-last">
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">统计分析</a>
                        </div>
                        <div className="nav-img">
                            <a href="#"> <img src="../img/react-logo.png" /></a>
                            <a href="#" className="nav-a">系统管理</a>
                        </div>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    Copy right ©2018龙音技术部出品
                </Footer>
                <Drawer
                    title="修改密码"
                    closable={false}
                    onClose={this.hideDrawer.bind(this)}
                    visible={this.state.visible}
                >
                    <div>
                        <label>旧密码：</label>
                        <Input id="old-pass" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                               placeholder="旧密码"/>
                    </div>
                    <div>
                        <label>新密码：</label>
                        <Input id="new-pass" prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                               placeholder="新密码"/>
                    </div>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)} className="modify-btn">
                            提交
                        </Button>

                </Drawer>
            </Layout>
        );
    }
}

export default Index;