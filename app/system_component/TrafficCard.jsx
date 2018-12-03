import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button} from 'antd';

class TrafficCard extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                width: '10%',
            },
            {
                title: '物联卡卡号',
                dataIndex: 'traffic_card_number',
                width: '20%',
            },
            {
                title: '关联设备ID',
                dataIndex: 'associated_device_id',
                width: '20%',
            },
            {
                title: '流量',
                dataIndex: 'traffic_num',
                width: '10%',
            },
            {
                title: '安装日期',
                dataIndex: 'install_date',
                width: '10%',
            },
            {
                title: '到期日期',
                dataIndex: 'maturity_date',
                width: '10%',
            },
            {
                title: '续费记录',
                dataIndex: 'continue_record',   //值与物联卡卡号等同
                width: '10%',
                render: (trafficId) => {
                    return (
                        <span>
                             <a href="javascript:;" onClick={() => {
                                 console.log(trafficId);
                                 this.showTrafficRecord(trafficId)
                             }}>查看详情</a>
                        </span>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'action', //值与物联卡卡号等同
                width: '10%',
                render: (trafficId) => {
                    return (
                        <span>
                            <a href="javascript:;" onClick={() => {
                                console.log(trafficId);
                                this.handleEditTraffic(trafficId);
                            }}>修改</a>
                            <Divider type="vertical"/>
                            <Popconfirm title="确定删除?" onConfirm={() => {
                                this.handleDeleteTraffic(trafficId);
                            }}>
                                <a href="javascript:;">删除</a>
                            </Popconfirm>
                         </span>
                    );
                },
            },
        ];
        this.state = {
            checkedTrafficId: '',
            linkedTrafficId: '',
            isTrafficRecordShow: false,
            isTrafficEditShow: false,
            trafficData: [],
            recordListData: [],
        }
    }

    componentDidMount() {
        this.getTrafficCardNum();
    }

    getTrafficCardNum() {
        let tableData = [];
        for (let i = 0; i < 100; i++) {
            tableData.push({
                key: i,
                order: i + 1,
                traffic_card_number: `物联卡${i + 1}`,
                associated_device_id: `关联设备${i + 1}`,
                traffic_num: 100,
                install_date: '2018-09-10',
                maturity_date: '2019-09-10',
                continue_record: `物联卡${i + 1}`,
                action:`物联卡${i + 1}`,
            });
        }
        this.setState({trafficData: tableData});
    }

    showTrafficRecord(trafficId) {
        this.setState({
            isTrafficRecordShow: true,
            isTrafficEditShow: false,
            checkedTrafficId: trafficId,
        });
        let recordData = [];
        for (let i = 0; i < 10; i++) {
            recordData.push({
                record: '续费：2018-09-10'
            });
        }
        this.setState({recordListData: recordData});
    }

    handleEditTraffic(trafficId) {
        this.setState({
            isTrafficRecordShow: false,
            isTrafficEditShow: true,
            checkedTrafficId: trafficId,
        });
    }
    handleDeleteTraffic(trafficId) {
        console.log(trafficId);
        const dataSource = [...this.state.trafficData];
        this.setState({trafficData: dataSource.filter(item => item.traffic_card_number !== trafficId)});
    }

    handleChangeLinkId() {
        let newId = document.getElementById("change_associated_device_id").value;
        console.log(newId);
    }

    handleModalCancel() {
        this.setState({
            isTrafficRecordShow: false,
            isTrafficEditShow: false,
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
                <Table columns={this.columns} dataSource={this.state.trafficData} pagination={false} style={{
                    marginTop: 5, marginBottom: 5, marginRight: 5, marginLeft: 5
                }} id="printTable"/>
                <Button type="primary" style={{marginTop: 16, marginLeft: '50%'}}
                        onClick={this.printTableExport.bind(this)}>
                    打印
                </Button>
                <Modal
                    title="续费详情"
                    width={600}
                    footer={null}
                    visible={this.state.isTrafficRecordShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom: '10px'}}>
                        <label style={{fontSize: 'large'}}>物联卡卡号:{this.state.checkedTrafficId}</label>
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
                                return (<List.Item>{item.record}</List.Item>)
                            }}
                        />
                    </div>
                </Modal>
                <Modal
                    title="修改关联设备"
                    width={600}
                    footer={null}
                    visible={this.state.isTrafficEditShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom: '10px'}}>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>物联卡卡号:{this.state.checkedTrafficId}</label>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>关联设备ID:{this.state.linkedTrafficId}</label>
                        </div>

                        <Input id="change_associated_device_id" placeholder="请输入新的关联设备ID"/>
                        <Button type="primary" onClick={this.handleChangeLinkId.bind(this)} style={{marginTop: '5px'}}>
                            保存
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }

}

export default TrafficCard;