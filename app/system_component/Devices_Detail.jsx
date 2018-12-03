import React, {Component} from 'react';
import {Table, Input, Button, Popconfirm, Form, Icon, Upload, Tooltip} from 'antd';
import XLSX from 'xlsx';
import 'babel-polyfill'

let excelTableData = [];
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({editing}, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const {editing} = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    }

    render() {
        const {editing} = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{margin: 0}}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                    <div
                                        className="editable-cell-value-wrap"
                                        style={{paddingRight: 24}}
                                        onClick={this.toggleEdit}
                                    >
                                        {restProps.children}
                                    </div>
                                )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '标签',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        }, {
            title: '详细信息',
            dataIndex: 'address',
            width: '50%',
            editable: true,
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    this.state.dataSource.length >= 1
                        ? (
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="javascript:;">删除</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                name: '位置描述',
                address: '马朱路与京福路交口东南角',
            }, {
                key: '1',
                name: 'GPS',
                address: 'GPS信息',
            }],
            count: 2,
        };
    }

    componentDidUpdate() {
        console.log(this.state.dataSource);
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({dataSource: dataSource.filter(item => item.key !== key)});
    }

    handleAdd = () => {
        const {count, dataSource} = this.state;
        const newData = {
            key: count,
            name: `标签 ${count}`,
            address: `详细信息 ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({dataSource: newData});
    }

    printExport() {
        var tableToPrint = document.getElementById('printTable');//将要被打印的表格
        var newWin = window.open("");//新打开一个空窗口
        newWin.document.write(tableToPrint.outerHTML);//将表格添加进新的窗口
        newWin.document.close();//在IE浏览器中使用必须添加这一句
        newWin.focus();//在IE浏览器中使用必须添加这一句
        newWin.print();//打印
        newWin.close();//关闭窗口
    }

    importExcelData() {
        let importData = [];
        for (let i = 0; i < excelTableData.length; i++) {
            importData[i] = {
                key: i,
                name: excelTableData[i][0],
                address: excelTableData[i][1],
            }
        }
        this.setState({
            dataSource: importData,
            count: excelTableData.length,
        });
    }

    importExcelFile(obj) {
        const self = this;
        const f = obj.target.files[0];
        var rABS = false; // true: readAsBinaryString ; false: readAsArrayBuffer
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header: 1});
            console.log(jsonArr);
            excelTableData = jsonArr;
            self.importExcelData();
        };
        if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
        obj.target.value = '';
    }

    render() {
        const {dataSource} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const self = this;
        return (
            <div>
                <div>
                    <Button onClick={this.handleAdd} type="primary" style={{marginBottom: 16, marginRight: 10}}>
                        添加新项
                    </Button>
                    <Button type="primary" onClick={() => document.getElementById("excelInput").click()}>
                        <Icon type="upload"/> 导入
                        <input type="file"
                               id="excelInput"
                               style={{display: 'none'}}
                               onChange={this.importExcelFile.bind(this)}
                               accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
                    </Button>
                </div>

                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    id="printTable"
                />
                <div>
                    <Button type="primary" style={{marginBottom: 16, marginTop: 16}}>
                        保存
                    </Button>
                    <Button type="primary" style={{marginBottom: 16, marginLeft: 10}}
                            onClick={this.printExport.bind(this)}>
                        打印
                    </Button>
                </div>

            </div>
        );
    }
}

export default EditableTable;
          