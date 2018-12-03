import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button,DatePicker,Tabs , Select} from 'antd';
import QueryRecord from './inpection_sub/QueryRecord.jsx';
import AddRecord from './inpection_sub/AddRecord.jsx';
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Inspection extends Component{
    constructor(){
        super();
        this.state={

        };
    }
    onTabChange(key){
        console.log(key);
    }
    render(){
        return (
            <div>
                <Tabs defaultActiveKey="1" onChange={this.onTabChange()}>
                    <TabPane tab="查询记录" key="1">
                        <QueryRecord/>
                    </TabPane>
                    <TabPane tab="新增记录" key="2">
                        <AddRecord/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }

}
export default Inspection;