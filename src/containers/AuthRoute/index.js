import React,{Component} from 'react'
import { withRouter } from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userLoginAction from '../../actions/userState'
import {getItem, setItem} from '../../util/localStorage'
class AuthRoute extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
   	  	name:''
   	  }
   }
   
   render(){
      return null
   }

   componentDidMount(){
      let userInfo=getItem('user')
      let json_userInfo=userInfo?JSON.parse(userInfo):''
      
      //刷新页面后如果有用户信息的缓存，那么存起来
      //如果没有，说明没有登录，直接跳转到登录页面
      if(json_userInfo.login){
         json_userInfo.loginTip = false
         this.props.userLoginActions.userState(json_userInfo)
      }else{
         if(this.props.history.location.pathname=='/Login') return
         this.props.history.push('/Login')
      }
      
   }
}

const mapStateToProps = (state) => {
   return state
}

const mapDispatchtoProps = (dispatch) => {
   return {
       userLoginActions:bindActionCreators(userLoginAction, dispatch)
   }
}
export default withRouter(connect(mapStateToProps,mapDispatchtoProps)(AuthRoute))