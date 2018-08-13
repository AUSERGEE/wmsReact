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
       setTimeout(()=>{
        console.log(1212112121221222)
        let userInfo=getItem('user')
        let json_userInfo=userInfo?JSON.parse(userInfo):''
        //刷新页面后如果有用户信息的缓存，那么存起来
        //如果没有，说明没有登录，直接跳转到登录页面
        console.log(json_userInfo,'登录判断')
        if(json_userInfo.user){
           json_userInfo.loginTip = false
           this.props.userLoginActions.userState(json_userInfo)
        }else{
           if(this.props.history.location.pathname=='/Login') return
           console.log('登录判断222')
           this.props.history.push('/Login')
        }
       },20)
       
      
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