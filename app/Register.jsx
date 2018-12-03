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

class Register extends Component {
    constructor() {
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
    getCheckCode(checkcode) {
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

        if (value.length==11) {
            callback();
        } else {
            callback('请输入正确的手机号');
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
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        const suffixButton=getFieldDecorator('prefix', {})(
            <Button onClick={this.getCheckCode.bind(this)} style={{ width: 100 }}>获取</Button>
        );
        return (
            <div>
               {/* <div  className="register-logo-container">
                    <img src="../img/react-logo.png" className='register-logo'/>
                </div>*/}
                <div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">
                        <FormItem {...tailFormItemLayout}>
                            <img src="../img/react-logo.png" className='register-logo'/>
                        </FormItem>
                        <FormItem label="邮箱" {...formItemLayout}>
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '请输入正确的邮箱账号!',
                                }, {
                                    required: true, message: '请输入邮箱!',
                                }],
                            })(
                                <Input placeholder="邮箱账号"/>
                            )}
                        </FormItem>
                        <FormItem label="密码" {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '请输入密码!',
                                }, {
                                    validator: this.validateToNextPassword.bind(this),
                                }],
                            })(
                                <Input type="password" placeholder="输入密码，区分大小写"/>
                            )}
                        </FormItem>
                        <FormItem label="确认密码" {...formItemLayout}>
                            {getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: '请确认您的密码!',
                                }, {
                                    validator: this.compareToFirstPassword.bind(this),
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur.bind(this)} placeholder="再次输入密码"/>
                            )}
                        </FormItem>
                        <FormItem label="手机号" {...formItemLayout} hasFeedback>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: '请输入手机号!' },{
                                    validator: this.checkAccount.bind(this)
                                }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="输入11位手机号" />
                            )}
                        </FormItem>
                        <FormItem label="验证码" {...formItemLayout}>
                            <Row gutter={16}>
                                <Col span={10}>
                                    {getFieldDecorator('checkCode', {
                                        rules: [{required: true, message: '请输入验证码!'}],
                                    })(
                                        <Input placeholder="验证码"/>
                                    )}
                                </Col>
                                <Col span={5}>
                                    <Button onClick={this.getCheckCode.bind(this)}>获取</Button>
                                </Col>
                                <Col span={9}>
                                    <span className="register-form-check">{this.state.checkcode}</span>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" >
                                注册
                            </Button>
                            <a href="Login.html" className="register-form-used">使用已有账户登录</a>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

}

const RegisterForm = Form.create()(Register);
export default RegisterForm;