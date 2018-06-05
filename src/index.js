import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';
import 'antd-mobile/dist/antd-mobile.css';


ReactDOM.render(
    <Root/>,
    document.getElementById('root')
);
console.log('index.js->process.env.NODE_ENV:'+process.env.NODE_ENV)
if (module.hot && process.env.NODE_ENV !== 'production') {
    module.hot.accept();
};
