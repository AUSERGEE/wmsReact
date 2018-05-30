import React,{Component} from 'react'
import { Button,NavBar,WhiteSpace} from 'antd-mobile'
export default class extends Component {
	render() {
	   return (
           <div style={{background:'#FFF'}}>
              <p className='L_p'>当前路径：{this.props.history.location.pathname}</p>
              <p className='L_p'>
                  redux-flag:{this.props.flag} 
                  <Button onClick={this.changeFlag.bind(this)}  type="primary" inline size="small" style={{marginLeft:'10px'}}>修改flag</Button>
              </p>
              <p className='L_p'>
                 调用父组件方法：<Button onClick={this.alertFun.bind(this,'abc')}  type="primary" inline size="small" >alert "abc"</Button>
              </p>
              <p className='L_p'>
                 页面跳转<Button onClick={this.push.bind(this)}  type="primary" inline size="small" >list</Button>
              </p>
           </div>
	   )
	}

	changeFlag () {
        this.props.flagActions.flag()
	}

	alertFun(text) {
		this.props.alertFun(text)
	}
	push () {
		this.props.history.push('/List')
	}
}