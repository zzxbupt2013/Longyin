import React, {Component} from 'react';
import {Pagination, Button, Modal, Row, Col} from 'antd';
import EditableTable from './Devices_Detail.jsx';

class Devices extends Component {
    constructor() {
        super();
        this.state = {
            device_num: 0,
            currentPage: 1,
            showDetail: false,
            modalVisible: false,
            deviceId:'',
            deviceCurList1:[],
            deviceCurList2:[],
        };
    }

    componentDidMount() {
        this.setState({device_num: 30});
        let data1=[];
        for(let i=0;i<4;i++){
            data1.push({
                deviceNumber:'黄亦路设备'+(i+1),
                deviceImgSrc:'../img/billboard.png'
            });
        }
        this.setState({deviceCurList1: data1});
        let data2=[];
        for(let i=4;i<8;i++){
            data2.push({
                deviceNumber:'黄亦路设备'+(i+1),
                deviceImgSrc:'../img/billboard.png'
            });
        }
        this.setState({deviceCurList2: data2});
    }
    onPageChange(page, pageSize) {
        console.log(page);
        console.log(pageSize);
        this.setState({currentPage: page});
        if(page===1){
            let data1=[];
            for(let i=0;i<4;i++){
                data1.push({
                    deviceNumber:'黄亦路设备'+(i+1),
                    deviceImgSrc:'../img/billboard.png'
                });
            }
            this.setState({deviceCurList1: data1});
            let data2=[];
            for(let i=4;i<8;i++){
                data2.push({
                    deviceNumber:'黄亦路设备'+(i+1),
                    deviceImgSrc:'../img/billboard.png'
                });
            }
            this.setState({deviceCurList2: data2});
        }
        else {
            let data1=[];
            for(let i=0;i<4;i++){
                data1.push({
                    deviceNumber:'黄亦路设备'+((page-1)*8+(i+1)),
                    deviceImgSrc:'../img/billboard.png'
                });
            }
            this.setState({deviceCurList1: data1});
            let data2=[];
            for(let i=4;i<8;i++){
                data2.push({
                    deviceNumber:'黄亦路设备'+((page-1)*8+(i+1)),
                    deviceImgSrc:'../img/billboard.png'
                });
            }
            this.setState({deviceCurList2: data2});
        }

    }


    showModal = (deviceId) => {
        this.setState({
            modalVisible: true,
            deviceId:deviceId,
        });
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }

    render() {
        const Cols1=this.state.deviceCurList1.map((item,index)=>{
            let deviceNumber=item.deviceNumber;
            return (
                <Col className="gutter-row" span={6} key={index}>
                    <div className="gutter-box">
                        <div className="devices_col">
                            <img src={item.deviceImgSrc}/>
                            <span>编号：{item.deviceNumber}</span>
                            <a href="#" onClick={this.showModal.bind(this,deviceNumber)}>查看详情</a>
                        </div>
                    </div>
                </Col>
            );
        });
        const Cols2=this.state.deviceCurList2.map((item,index)=>{
            return (
                <Col className="gutter-row" span={6} key={index}>
                    <div className="gutter-box">
                        <div className="devices_col">
                            <img src={item.deviceImgSrc}/>
                            <span>编号：{item.deviceNumber}</span>
                            <a href="#" onClick={this.showModal.bind(this)}>查看详情</a>
                        </div>
                    </div>
                </Col>
            );
        });
        return (
            <div className="gutter-example">

                <div style={{textAlign: 'center'}}>
                    <h1 style={{fontSize: 'large'}}>广告设施设备</h1>
                </div>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}} style={{marginTop:'50px',marginLeft:'10px',marginRight:'10px'}}>
                    {Cols1}
                </Row>
                <Row gutter={{xs: 8, sm: 16, md: 24, lg: 32}} style={{marginTop:'50px',marginLeft:'10px',marginRight:'10px'}}>
                    {Cols2}
                </Row>
                <Modal
                    title="设备资产详情"
                    width={600}
                    footer={null}
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                >
                    <div style={{marginBottom:'10px'}}>
                        <label style={{fontSize:'large'}}>设备编号:{this.state.deviceId}</label>
                    </div>
                    <EditableTable/>
                </Modal>
                <div className="pagination_container">
                    <Pagination
                        total={this.state.device_num}
                        showTotal={total => `总共 ${total} 个广告牌`}
                        pageSize={8}
                        defaultCurrent={1}
                        current={this.state.currentPage}
                        onChange={this.onPageChange.bind(this)}
                    />
                </div>
            </div>
        );
    }

}

export default Devices;