import React, {Component} from 'react';
import img_404 from '../../static/images/404.png';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router'
import {Button} from 'antd-mobile'
export default withRouter(class extends Component {
    render() {
        return (
            <div className="pageNofind">
                <div className="pageErrorTitle">404</div>
                <p>抱歉，页面出错了！</p>
                <Button type="primary" inline onClick={this.routerPush.bind(this)}>返回首页</Button>
            </div>
        )
    }

    routerPush() {
       this.props.history.push('/')
    }
})