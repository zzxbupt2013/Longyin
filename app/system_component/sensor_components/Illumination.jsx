import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button} from 'antd';

class Illumination extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                width: '10%',
            },
            {
                title: '传感器ID',
                dataIndex: 'sensor_id',
                width: '20%',
            },
            {
                title: '关联设备ID',
                dataIndex: 'associated_device_id',
                width: '20%',
            },
            {
                title: '安装维修记录',
                dataIndex: 'ins_ser_record',   //值与传感器ID等同
                width: '20%',
                render: (sensorId) => {
                    return (
                        <a href="javascript:;" onClick={() => {
                            console.log(sensorId);
                            this.showSensorRecords(sensorId);
                        }}>查看详情</a>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'action', //值与传感器ID等同
                width: '30%',
                render: (sensorData) => {
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => {
                                console.log(sensorData);
                                this.handleEditSensor(sensorData);
                            }}>修改</a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定删除?" onConfirm={() => {
                                this.handleDeleteSensor(sensorData[0]);
                            }}>
                                <a href="javascript:;">删除</a>
                            </Popconfirm>
                         </span>
                    );
                },
            },

        ];
        this.state = {
            checkedSensorId: '',
            linkedSensorId: '',
            sensorTotalNum: 20,
            isSensorRecordShow: false,
            isSensorEditShow: false,
            sensorData:[],
            recordListData:[],
        }
    }

    componentDidMount() {
        this.getSensorNum();
    }
    getSensorNum(){
        let tableData=[];
        for(let i=0;i<20;i++){
            tableData.push({
                key:i,
                order:i+1,
                sensor_id:`光照度传感器${i+1}`,
                associated_device_id:`关联设备${i+1}`,
                ins_ser_record:`光照度传感器${i+1}`,
                action:[`光照度传感器${i+1}`,`关联设备${i+1}`],
            });
        }
        this.setState({sensorData:tableData});
    }
    showSensorRecords(sensorId) {
        this.setState({
            isSensorRecordShow: true,
            isSensorEditShow: false,
            checkedSensorId:sensorId,
        });
        let recordData=[{install:'安装：2018-09-09'}];
        for(let i=0;i<10;i++){
            recordData.push({
                sevice:'维修：2018-09-10'
            });
        }
        this.setState({recordListData:recordData});

    }

    handleDeleteSensor(sensorId) {
        console.log(sensorId);
        const dataSource = [...this.state.sensorData];
        this.setState({sensorData: dataSource.filter(item => item.sensor_id !== sensorId)});
    }

    handleEditSensor(sensorData) {
        this.setState({
            isSensorRecordShow: false,
            isSensorEditShow: true,
            checkedSensorId:sensorData[0],
            linkedSensorId:sensorData[1],
        });
    }
    handleChangeLinkId(){
        let newId=document.getElementById("change_associated_device_id").value;
        console.log(newId);
    }
    handleModalCancel() {
        this.setState({
            isSensorRecordShow: false,
            isSensorEditShow: false
        });
    }
    printTableExport() {
        var tableToPrint = document.getElementById('printTable');//将要被打印的表格
        var newWin = window.open("");//新打开一个空窗口
        newWin.document.write(tableToPrint.outerHTML);//将表格添加进新的窗口
        newWin.document.close();//在IE浏览器中使用必须添加这一句
        newWin.focus();//在IE浏览器中使用必须添加这一句
        newWin.print();//打印
        newWin.close();//关闭窗口
    }

    printListExport() {
        var tableToPrint = document.getElementById('printList');//将要被打印的表格
        var newWin = window.open("");//新打开一个空窗口
        newWin.document.write(tableToPrint.outerHTML);//将表格添加进新的窗口
        newWin.document.close();//在IE浏览器中使用必须添加这一句
        newWin.focus();//在IE浏览器中使用必须添加这一句
        newWin.print();//打印
        newWin.close();//关闭窗口
    }

    render() {

        return (
            <div>
                <Tag color="orange" style={{marginBottom: '5px', marginTop: '5px',fontSize:'large'}}>传感器总数：</Tag>
                <Tag color="orange" style={{marginBottom: '5px', marginTop: '5px', marginLeft: '5px',fontSize:'large'}}>
                    {this.state.sensorTotalNum}
                </Tag>
                <Table columns={this.columns} dataSource={this.state.sensorData} id="printTable" pagination={false}/>
                <Button type="primary" style={{marginTop: 16, marginLeft: '50%'}}
                        onClick={this.printTableExport.bind(this)}>
                    打印
                </Button>
                <Modal
                    title="安装维修详情"
                    width={600}
                    footer={null}
                    visible={this.state.isSensorRecordShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom:'10px'}}>
                        <label style={{fontSize:'large'}}>光照度传感器ID:{this.state.checkedSensorId}</label>
                        <Button type="primary" style={{marginLeft: 16}}
                                onClick={this.printListExport.bind(this)}>
                            打印
                        </Button>
                    </div>
                    <div>
                        <List
                            id="printList"
                            bordered
                            dataSource={this.state.recordListData}
                            renderItem={item => {
                                if(item.install){
                                    return  (<List.Item>{item.install}</List.Item>)
                                }else{
                                    return  (<List.Item>{item.sevice}</List.Item>)
                                }
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    title="修改关联设备"
                    width={600}
                    footer={null}
                    visible={this.state.isSensorEditShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom:'10px'}}>
                        <div style={{marginTop:'5px'}}>
                            <label style={{fontSize:'large'}}>光照度传感器ID:{this.state.checkedSensorId}</label>
                        </div>
                        <div style={{marginTop:'5px'}}>
                            <label style={{fontSize:'large'}}>关联设备ID:{this.state.linkedSensorId}</label>
                        </div>

                        <Input id="change_associated_device_id" placeholder="请输入新的关联设备ID"/>
                        <Button type="primary" onClick={this.handleChangeLinkId.bind(this)} style={{marginTop:'5px'}}>
                            保存
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }

}

export default Illumination;