import React,{Component} from 'react'
import {Modal} from 'antd-mobile'
export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
          modal1: true
        };
      }
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }
    componentDidMount() {
        
    }
    render() {
        return (
            <div>
                 <Modal
                    visible={this.state.modal1}
                    transparent
                    maskClosable={false}
                    title="提示"
                    footer={[{ text: '确定', onPress: () => {  this.props.closeAlert()} }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                       <div>{this.props.alertMsg.text}</div>
                 </Modal>
            </div>
        )
    }
}
