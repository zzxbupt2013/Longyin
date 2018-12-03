import React from 'react';
import ReactDOM from 'react-dom';
import System from './System.jsx';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <System/>
    </LocaleProvider>,
    document.getElementById('system')
);