import React, {Component} from 'react';
import {Select} from 'antd';
import Wind from './sensor_components/Wind.jsx';
import Electric from './sensor_components/Electric.jsx';
import Pressure from './sensor_components/Pressure.jsx';
import Vertical from './sensor_components/Vertical.jsx';
import Tremor from './sensor_components/Tremor.jsx';
import Illumination from './sensor_components/Illumination.jsx';
import Camera from './sensor_components/Camera.jsx';

const Option = Select.Option;
class Sensor extends Component{
    constructor(){
        super();
        this.state={
            selectedDevice:'sensor_wind',
        }
    }
    handleChange(value) {
        console.log(`selected ${value}`);
        this.setState({selectedDevice:value});
    }
    showSelectedSensor(){
        switch (this.state.selectedDevice){
            case 'sensor_wind':return <Wind/>;break;
            case 'sensor_electric':return <Electric/>;break;
            case 'sensor_pressure':return <Pressure/>;break;
            case 'sensor_vertical':return <Vertical/>;break;
            case 'sensor_tremor':return <Tremor/>;break;
            case 'sensor_illumination':return <Illumination/>;break;
            case 'sensor_camera':return <Camera/>;break;
            default:return <Wind/>;break;
        }
    }
    render(){
        return (
            <div>
                <div style={{marginBottom:10,marginTop:10,marginLeft:10,marginRight:10}}>
                    <label >传感器类型：</label>
                    <Select defaultValue="sensor_wind" style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
                        <Option value="sensor_wind">风速</Option>
                        <Option value="sensor_electric">电流</Option>
                        <Option value="sensor_pressure" >压力</Option>
                        <Option value="sensor_vertical">垂直度</Option>
                        <Option value="sensor_tremor">震颤度</Option>
                        <Option value="sensor_illumination">光照度</Option>
                        <Option value="sensor_camera">摄像头</Option>
                    </Select>
                </div>
                <div style={{marginBottom:10,marginTop:10,marginLeft:10,marginRight:10}}>
                    {this.showSelectedSensor()}
                </div>
            </div>
        );
    }

}
export default Sensor;