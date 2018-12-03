import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button,DatePicker,Tabs , Select} from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class AddRecord extends Component{
    constructor(){
        super();
        this.state={
            selectedRecordType:'',
            recordDate:'',
        };
    }
    handleSelectChange(value){
        console.log(`selected ${value}`);
        this.setState({selectedRecordType:value});
    }
    onRecordDateChange(date, dateString){
        console.log(date, dateString);
        this.setState({recordDate:dateString});
    }
    saveAddRecord(){
        console.log('添加成功');
    }
    render(){
        return (
            <div>
                <div>
                    <label >记录类型：</label>
                    <Select style={{ width: 120 }} onChange={this.handleSelectChange.bind(this)}>
                        <Option value="dev_error">设备故障</Option>
                        <Option value="dev_abnormal">设备异常</Option>
                        <Option value="dev_connect" >连接性</Option>
                        <Option value="dev_lost">设备丢失</Option>
                        <Option value="dev_warranty">保期排查</Option>
                        <Option value="dev_repair">报修维修</Option>
                    </Select>
                </div>
                <div>
                    <label >记录日期：</label>
                    <DatePicker onChange={this.onRecordDateChange.bind(this)} />
                </div>
                <div>
                    <label >记录描述：</label>
                   <Input id="record_msg" placeholder="请输入描述信息"/>
                </div>
                <div>
                    <Button type="primary" onClick={this.saveAddRecord.bind(this)}>
                       添加
                    </Button>
                </div>
            </div>
        );
    }

}
export default AddRecord;