import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button,DatePicker,Tabs , Select} from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class QueryRecord extends Component{
    constructor(){
        super();
        this.state={
            selectedRecordType:'',
            recordListData:[],
            startDate:'',
            endDate:'',
        };
    }
    componentDidMount(){

    }
    getRecordListData(recordtype){
        let recordData=[];
        for(let i=0;i<10;i++){
            recordData.push({
                record:`${recordtype}记录${i}`
            })
        }
        this.setState({recordListData:recordData});
    }
   handleSelectChange(value){
       console.log(`selected ${value}`);
       this.setState({selectedRecordType:value});
   }
   onStartDateChange(date, dateString){
       console.log(date, dateString);
       this.setState({startDate:dateString});
   }
   onEndDateChange(date, dateString){
       console.log(date, dateString);
       this.setState({endDate:dateString});
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
                    <label >开始日期：</label>
                    <DatePicker onChange={this.onStartDateChange.bind(this)} />
                </div>
                <div>
                    <label >结束日期：</label>
                    <DatePicker onChange={this.onEndDateChange.bind(this)} />
                </div>
                <div>
                   <Button type="primary" onClick={this.getRecordListData.bind(this,this.state.selectedRecordType)}>
                       查询
                   </Button>
                </div>
                <div>
                    <List
                        bordered
                        dataSource={this.state.recordListData}
                        renderItem={item => (<List.Item>{item.record}</List.Item>)}
                    />
                </div>
            </div>
        );
    }

}
export default QueryRecord;