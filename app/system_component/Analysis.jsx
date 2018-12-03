import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal, List, Input, Button, DatePicker, Tabs, Select} from 'antd';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/bar'

class Analysis extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                width: '10%',
            },
            {
                title: '设备类型',
                dataIndex: 'dev_type',
                width: '10%',
            },
            {
                title: '设备名称',
                dataIndex: 'dev_name',
                width: '10%',
            },
            {
                title: '设备ID',
                dataIndex: 'dev_id',
                width: '20%',
            },
            {
                title: '维修次数',
                dataIndex: 'fix_num',
                width: '10%',
            },
            {
                title: '故障率',
                dataIndex: 'error_rate',
                width: '20%',
                defaultSortOrder: 'descend',
                sorter: (a, b) => {
                    let ac = parseInt(a.error_rate.substring(0, a.error_rate.length - 1));
                    let bc = parseInt(b.error_rate.substring(0, a.error_rate.length - 1));
                    return ac - bc;
                },
            },
            {
                title: '故障异常信息',
                dataIndex: 'error_detail',   //值与设备ID等同
                width: '20%',
                render: (devId) => {
                    return (
                        <span>
                             <a href="javascript:;" onClick={() => {
                                 console.log(devId);
                                 this.showErrorDetail(devId);
                             }}>查看详情</a>
                        </span>
                    );
                },
            },
        ];
        this.state = {
            selectedDevType: '',
            selectedDevID:'',
            isErrorDetailShow: false,
            devData: [],
            errorDetailList: [],
        };
    }

    componentDidMount() {
        let x_data = ['广告牌', '摄像头', '风速', '压力', '电流', '画布', '震颤度', '光照度', '垂直度'];
        let dev_num = [100, 300, 100, 100, 100, 300, 300, 300, 100];
        let error_num = [1, 3, 4, 3, 2, 5, 6, 7, 4];
        let fix_num = [1, 3, 4, 3, 2, 5, 6, 7, 4];
        this.createBarChart(x_data, dev_num, error_num, fix_num);
    }

    showErrorDetail(devId) {
        this.setState({isErrorDetailShow: true,selectedDevID:devId});
        let recordData=[];
        for(let i=0;i<10;i++){
            recordData.push({
                error:'故障异常详情'
            });
        }
        this.setState({errorDetailList:recordData});
    }

    handleSelectChange(value) {
        console.log(`selected ${value}`);
        this.setState({selectedDevType: value});
        let tableData = [];
        for (let i = 0; i < 100; i++) {
            tableData.push({
                key: i,
                order: i + 1,
                dev_type: value,
                dev_name: `设备${i + 1}`,
                dev_id: `设备ID${i + 1}`,
                fix_num: (i + 1) * 2,
                error_rate: `${i + 1}%`,
                error_detail: `设备${i + 1}`,
            });
        }
        this.setState({devData: tableData});

    }

    createBarChart(x_data, dev_num, error_num, fix_num) {
        console.log('create');
        let chart_devices = echarts.init(document.getElementById('bar_chart'));
        let option = {
            title: {
                text: '所有设备',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['设备数量', '故障异常次数', '维修次数']
            },
            xAxis: {
                type: 'category',
                data: x_data
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            series: [
                {
                    name: '设备数量',
                    type: 'bar',
                    data: dev_num
                },
                {
                    name: '故障异常次数',
                    type: 'bar',
                    data: error_num
                },
                {
                    name: '维修次数',
                    type: 'bar',
                    data: fix_num
                }
            ]
        };
        chart_devices.setOption(option);
    }
    handleModalCancel() {
        this.setState({isErrorDetailShow: false});
    }
    render() {
        const pagination = {
            pageSize: 10,
        };
        return (
            <div>
                <div>
                    <div id="bar_chart" style={{width: '100%', height: '400px'}}>

                    </div>
                </div>
                <div>
                    <label>设备类型：</label>
                    <Select style={{width: 120}} onChange={this.handleSelectChange.bind(this)}>
                        <Option value="dev_wind">风速</Option>
                        <Option value="dev_electric">电流</Option>
                        <Option value="dev_pressure">压力</Option>
                        <Option value="dev_canvas">画布</Option>
                        <Option value="dev_vertical">垂直度</Option>
                        <Option value="dev_tremor">震颤度</Option>
                        <Option value="dev_illumination">光照度</Option>
                        <Option value="dev_camera">摄像头</Option>
                        <Option value="dev_billboard">广告牌</Option>
                    </Select>
                </div>
                <div>
                    <Table columns={this.columns} dataSource={this.state.devData}
                           pagination={pagination}  bordered={true}/>
                </div>
                <Modal
                    title="故障信息详情"
                    width={600}
                    footer={null}
                    visible={this.state.isErrorDetailShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom:'10px'}}>
                        <label style={{fontSize:'large'}}>设备ID:{this.state.selectedDevID}</label>
                    </div>
                    <div>
                        <List
                            bordered
                            dataSource={this.state.errorDetailList}
                            renderItem={item => {
                                    return  (<List.Item>{item.error}</List.Item>)
                            }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }

}

export default Analysis;