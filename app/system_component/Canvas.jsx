import React, {Component} from 'react';
import {Table, Tag, Popconfirm, Divider, Modal,List,Input,Button,DatePicker} from 'antd';
class Canvas extends Component{
    constructor() {
        super();
        this.columns = [
            {
                title: '序号',
                dataIndex: 'order',
                width: '5%',
            },
            {
                title: '画布ID',
                dataIndex: 'canvas_id',
                width: '10%',
            },
            {
                title: '所属广告牌ID',
                dataIndex: 'associated_device_id',
                width: '20%',
            },
            {
                title: '挂画日期',
                dataIndex: 'install_date',
                width: '10%',
            },
            {
                title: '换画日期',
                dataIndex: 'change_date',
                width: '10%',
            },
            {
                title: '是否破损',
                dataIndex: 'is_damaged',
                width: '5%',
            },
            {
                title: '画布等级',
                dataIndex: 'canvas_level',
                width: '10%',
            },
            {
                title: '画布材质',
                dataIndex: 'canvas_material',
                width: '10%',
            },
            {
                title: '材质说明',
                dataIndex: 'material_msg',
                width: '10%',
            },
            {
                title: '操作',
                dataIndex: 'operation',   //值与画布ID等同
                width: '10%',
                render: (canvasId) => {
                    return (
                        <span>
                              <a href="javascript:;" onClick={() => {
                                  console.log(canvasId);
                                  this.handleEditCanvas(canvasId);
                              }}>修改</a>
                             <Divider type="vertical"/>
                            <Popconfirm title="确定删除?" onConfirm={() => {
                                this.handleDeleteCanvas(canvasId);
                            }}>
                                <a href="javascript:;">删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            },
        ];
        this.state = {
            checkedCanvasId: '',
            linkedCanvasId: '',
            isCanvasRecordShow: false,
            isCanvasEditShow: false,
            canvasData: [],
            recordListData: [],
        }
    }

    componentDidMount() {
        this.getCanvasCardNum();
    }

    getCanvasCardNum() {
        let tableData = [];
        for (let i = 0; i < 100; i++) {
            tableData.push({
                key: i,
                order: i + 1,
                canvas_id: `画布${i + 1}`,
                associated_device_id: `关联设备${i + 1}`,
                install_date: '2018-09-10',
                change_date: '无',
                is_damaged: '否',
                canvas_level: '二',
                canvas_material:'刀刮布',
                material_msg:'320克',
                operation:`画布${i + 1}`,
            });
        }
        this.setState({canvasData: tableData});
    }
    handleEditCanvas(canvasId) {
        this.setState({
            isCanvasRecordShow: false,
            isCanvasEditShow: true,
            checkedCanvasId: canvasId,
        });
    }
    handleDeleteCanvas(canvasId) {
        console.log(canvasId);
        const dataSource = [...this.state.canvasData];
        this.setState({canvasData: dataSource.filter(item => item.canvas_id !== canvasId)});
    }
    handleChangeLinkId() {
        let newId = document.getElementById("change_associated_device_id").value;
        console.log(newId);
    }

    handleModalCancel() {
        this.setState({
            isCanvasRecordShow: false,
            isCanvasEditShow: false,
        });
    }
   onChange(date, dateString) {
        console.log(date, dateString);
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
                <Table columns={this.columns} dataSource={this.state.canvasData} pagination={false} style={{
                    marginTop: 5, marginBottom: 5, marginRight: 5, marginLeft: 5
                }} id="printTable"/>
                <Button type="primary" style={{marginTop: 16, marginLeft: '50%'}}
                        onClick={this.printTableExport.bind(this)}>
                    打印
                </Button>
                <Modal
                    title="修改画布信息"
                    width={600}
                    footer={null}
                    visible={this.state.isCanvasEditShow}
                    onCancel={this.handleModalCancel.bind(this)}
                >
                    <div style={{marginBottom: '10px'}}>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>画布ID:{this.state.checkedCanvasId}</label>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>新的关联设备ID:</label>
                            <Input id="change_associated_device_id" placeholder="请输入新的关联设备ID"/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>是否破损:</label>
                            <Input id="is_damaged_id" placeholder="请输入是/否"/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>画布等级:</label>
                            <Input id="canvas_level_id" placeholder="请输入画布等级"/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>画布材质：</label>
                            <Input id="canvas_material_id" placeholder="请输入画布材质名称"/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>材质说明：</label>
                            <Input id="material_msg_id" placeholder="请输入画布材质描述"/>
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <label style={{fontSize: 'large'}}>换画日期：</label><br/>
                            <DatePicker onChange={this.onChange.bind(this)} />
                        </div>
                        <Button type="primary" onClick={this.handleChangeLinkId.bind(this)} style={{marginTop: '5px'}}>
                            保存
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }


}
export default Canvas;