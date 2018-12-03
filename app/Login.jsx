import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Col, Row} from 'antd';
import 'whatwg-fetch';
import 'babel-polyfill';

const FormItem = Form.Item;
const API_URL = 'http://10.108.95.123:3000';
class Login extends Component {
    constructor() {
        super();
        this.state = {
            checkcode: '',
        };
    }

    /*componentDidMount() {
        fetch(API_URL + '/cards', {headers: API_HEADERS})
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({checkcode: responseData});
            })
            .catch((error) => {
                console.log('Error fetching and parsing data', error);
            });
    }*/
    getCheckCode() {
        let checkcode='';
        let self=this;
        $.ajax({
            url: API_URL+"/verficode",
            type: "GET",
            success: function (result) {
                console.log('success'+result);
                checkcode=result;
                console.log(checkcode);
                self.setState({checkcode: checkcode});
            },
            error:function(error){
                alert(error);
            }
        });

    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                localStorage.currentUser = values.userName;
                console.log( localStorage.currentUser);
                let dataSend=values;
                $.ajax({
                    url: API_URL+"/signin",
                    type: "POST",
                    data:dataSend,
                    success: function (result) {
                        console.log('success'+result);
                    },
                    error:function(error){
                        alert(error.responseText);
                        //console.log(error);
                    }
                });
            }
        });
    }
    checkAccount(rule, value, callback) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

        if (value.length==11 || re.test(value)) {
            callback();
        } else {
            callback('用户名为邮箱或手机号');
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <div className="login-logo-container">
                    <img src="../img/react-logo.png" className="login-logo"/>
                </div>
                <div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                        <FormItem hasFeedback>
                            {getFieldDecorator('userName', {
                                rules: [
                                    {required: true, message: '请输入用户名!'
                                    },{validator: this.checkAccount.bind(this)

                                }],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="邮箱/手机号"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="密码"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Row gutter={16}>
                                <Col span={12}>
                                    {getFieldDecorator('checkCode', {
                                        rules: [{required: true, message: '请输入验证码!'}],
                                    })(
                                        <Input placeholder="验证码"/>
                                    )}
                                </Col>
                                <Col span={6}>
                                    <Button onClick={this.getCheckCode.bind(this)}>获取</Button>
                                </Col>
                                <Col span={6}>
                                    <span className="login-form-check">{this.state.checkcode}</span>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <a href="Register.html">注册账号</a>
                            <a className="login-form-forgot" href="Reset.html">忘记密码</a>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>

                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const LoginForm = Form.create()(Login);
export default LoginForm;