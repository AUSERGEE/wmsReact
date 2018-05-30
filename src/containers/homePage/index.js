import React,{Component} from 'react'
import { NavBar} from 'antd-mobile'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userLoginAction from '../../actions/userState'
import {getItem, setItem} from '../../util/localStorage'
import { Grid,List,Toast } from 'antd-mobile'
class Login extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
   	  	
   	  }
   }
   
   render() {
      return (
      	<div>
           <NavBar mode="dark">WMS</NavBar>
      	 	   <p>

                 <div className="sub-title">当前帐号</div>
                 <List >
                  <Item extra={<span style={{color:"#0097e5"}} onClick={this.logout.bind(this)}>退出</span>}>{this.props.userState.user}</Item>
                </List>
             </p>
             <div className="sub-title">功能列表 </div>
             <Grid data={operateArr} columnNum={3} onClick={this.gridLink.bind(this)}/>
        </div>
      )

   }
   
   componentDidMount(){
       console.log(this.props.userState)
       if(this.props.userState.loginTip){
          Toast.info('登录成功',1, null, true)
          this.props.userLoginActions.changeLoginTip({loginTip:false})
       }

       
   }

   //九宫格元素点击跳转
   gridLink(el,index){
      //console.log(JSON.stringify(el))
      //console.log(this.props.history)
      this.props.history.push(el.link)
   }

   //登出操作-清空本地缓存
   logout(){
      setItem('user','')
      location.reload()
   }
   
}

//功能列表数组
const operateArr=[
    {
       icon: require('../../static/images/lailiao.png'),
       text: '来料收货',
       link:'/Recipien'
    },
    {
       icon: require('../../static/images/jianyan.png'),
       text: '来料检验',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/beiping.png'),
       text: '备品收货',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/lingliao.png'),
       text: 'MO领料',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/tuiliao.png'),
       text: 'MO退料',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/tuiliao.png'),
       text: 'PO退料',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/tuiliao.png'),
       text: '备件退料',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/yidong.png'),
       text: '异动',
       link:'sdfffff'
    },
    {
       icon: require('../../static/images/pandian.png'),
       text: '盘点',
       link:'sdfffff'
    }

]
// const data = Array.from(new Array(9)).map((_val, i) => ({
//   icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
//   text: operateArr[i].text,
//   link:'sdfffff'
// }));
const Item = List.Item
const mapStateToProps = (state) => {
	return state
}

const mapDispatchtoProps = (dispatch) => {
	return {
       userLoginActions:bindActionCreators(userLoginAction, dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(Login)