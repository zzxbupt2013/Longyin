import React, {Component} from 'react';
import {Form, Icon, Input, Button, Checkbox, Col, Row,Select} from 'antd';
import 'whatwg-fetch';
import 'babel-polyfill';
const FormItem = Form.Item;
const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
    'Content-Type': 'application/json',
    Authorization: 'any-string-you-like'
};
class Reset extends Component {
    constructor(){
        super();
        this.state = {
            checkcode: '',
            confirmDirty: false,
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
    getCheckCode(checkcode){
        this.setState({checkcode: 'V g S x'});
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    checkAccount(rule, value, callback) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

        if (value.length==11 || re.test(value)) {
            callback();
        } else {
            callback('用名为邮箱或手机号');
        }
    };
    handleConfirmBlur(e) {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    }

    compareToFirstPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码输入不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword(rule, value, callback) {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <div>
                <div  className="reset-logo-container">
                    <img src="../img/react-logo.png" className="reset-logo"/>
                </div>
                <div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="reset-form">
                        <FormItem hasFeedback>
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: '请输入用户名!'},{
                                    validator: this.checkAccount.bind(this)
                                }],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="邮箱/手机号"/>
                            )}
                        </FormItem>
                        <FormItem  >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入新密码!',
                                }, {
                                    validator: this.validateToNextPassword.bind(this),
                                }],
                            })(
                                <Input  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" placeholder="输入新密码，区分大小写"/>
                            )}
                        </FormItem>
                        <FormItem  >
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请确认您的密码!',
                                }, {
                                    validator: this.compareToFirstPassword.bind(this),
                                }],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password" onBlur={this.handleConfirmBlur.bind(this)} placeholder="再次输入密码"/>
                            )}
                        </FormItem>
                      {/*  <FormItem  >
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入您的手机号!' }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="输入11位手机号" />
                            )}
                        </FormItem>*/}
                        <FormItem>
                            <Row gutter={ 16 }>
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
                                    <span className="reset-form-check">{this.state.checkcode}</span>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <a className="reset-form-forgot" href="Login.html">登录</a>
                            <Button type="primary" htmlType="submit" className="reset-form-button">
                                提交
                            </Button>

                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const ResetForm = Form.create()(Reset);
export default ResetForm;