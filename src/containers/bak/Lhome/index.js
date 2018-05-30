import React,{Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as flagAction from '../../actions/flag'
import { Button,NavBar,WhiteSpace,Modal,Toast} from 'antd-mobile'
import './style.css'
import Child from './subPage/children.js'
class Lhome extends Component {
    constructor(props) {
		super(props)
		this.state = {
		  modelShow: true
		}
	}
	// showAlert = () => {
 //     const alert = Modal.alert;
	//  alert('删除', '确定删除么???', [
 //        { text: 'Cancel', onPress: () => console.log('cancel'), style: 'default' },
 //        { text: 'OK', onPress: () => console.log('ok'), style: { fontWeight: 'bold' } },
 //     ])
	// };
    showAlert (text)  {
    	alert(text)
    }
	render() {
		return (
			<div>
              <NavBar mode="dark">首页</NavBar>
              <p className='L_p'>当前路径：{this.props.history.location.pathname}</p>
              <p className='L_p'>
                  <Button onClick={this.prinfHistoryObj.bind(this)}  type="primary" inline size="small" style={{marginLeft:'10px'}}>点击打印history对象</Button>
              </p>
              <p className='L_p'>
                  redux-flag:{this.props.flag} 
                  <Button onClick={this.changeFlag.bind(this)}  type="primary" inline size="small" style={{marginLeft:'10px'}}>修改flag</Button>
              </p>
              <p className='L_p' style={{ color: 'green' }}>行间样式</p>
              <p className='L_p'>
                 <Button onClick={this.showAlert.bind(this,'123')}  type="primary" inline size="small" >alert "123"</Button>
              </p>
              <WhiteSpace size="lg" />
              <span>子组件：</span>
              <div style={{ border: '2px solid #22b7aa' }}>
                 <Child {...this.props} alertFun={this.showAlert.bind(this)}/>
              </div>
              <p className='L_p' ref='asyncTxt'>
                  异步操作：未开始
                  <Button onClick={this.callFun.bind(this)}  type="primary" inline size="small" style={{marginLeft:'10px'}}>开始</Button>
              </p>
	           
            </div>

		)
	}

	componentDidMount () {
	}
	prinfHistoryObj () {
		console.log(this.props.history)
	}
	changeFlag () {
        this.props.flagActions.flag()
	}
	async callFun () {
		this.refs.asyncTxt.innerHTML='异步操作：开始'
		Toast.loading('异步三秒区')
	    await this.sleep(3000)
	    Toast.hide()
	    this.refs.asyncTxt.innerHTML='异步操作：已结束'
	}
	sleep (time) {
	    return new Promise(function (resolve, reject) {
	        setTimeout(function () {
	            resolve();
	        }, time);
	    })
	}
}

const mapStateToProps = (state) => {
	return state
}

const mapDispatchtoProps = (dispatch) => {
	return {
      flagActions:bindActionCreators(flagAction, dispatch)
	}
}

export default connect(mapStateToProps,mapDispatchtoProps)(Lhome)