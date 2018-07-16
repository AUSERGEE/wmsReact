import React,{Component} from 'react'
import { List, InputItem, WhiteSpace,Button,Modal,Toast} from 'antd-mobile'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userLoginAction from '../../actions/userState'
import {getItem,setItem} from '../../util/localStorage'
import * as tool from '../../util/tools'
import axios from 'axios'
class Login extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
   	  	user:'',
   	  	pwd:'',
   	  	modal1:false,
        msg:'',
        formActive:null 
   	  }
   }
   
   render() {
      return (
      	<div className="loginSection">
          <div className="logoArea">
               <img src={require('../../static/images/wmsLogo.png')} />
          </div>
      	 	<p style={{margin:'23px 0 50px 0',fontSize:'20px',color:'#0097E5',textAlign:'center'}}>系统登录</p>
	         <List >
	          <InputItem
	            clear
              placeholder="请在此填写帐号"
              className={this.state.formActive=='user'?'formActive':''}
              ref={el => this.autoFocusInst = el}
              value={this.state.user}
              onChange={val=>this.handleChange('user',val)}
              onFocus={()=>{this.setState({formActive:'user'})}}
	          >帐号</InputItem>
	          <InputItem
	            clear
	            placeholder="请在此填写密码"
              type="password"
              className={this.state.formActive=='pwd'?'formActive':''}
              ref={el => this.autoFocusInst = el}
              value={this.state.pwd}
              onChange={val=>this.handleChange('pwd',val)}
              onFocus={()=>{this.setState({formActive:'pwd'})}}
	          >密码</InputItem>
	         
	        </List>
	        <WhiteSpace />
	        <div className='btnBox'>
              <Button type="primary" onClick={this.loginFun.bind(this)}>登录</Button>
          </div>
          <div className="copyrightBar">
              <p>Copyright @ 2018  深圳创维数字技术有限公司  版权所有</p>
          </div>
          <Modal
	          visible={this.state.modal1}
	          transparent
	          maskClosable={false}
	          onClose={this.onClose('modal1')}
	          title="提示"
	          footer={[{ text: '确定', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
	          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
	        >
		          <div >
		            {this.state.msg}
		          </div>
	        </Modal>
        </div>
      )

   }
   
   componentDidMount(){
       //this.auotLogin()
      //  axios.get('http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetCheckUserAndPwd?user=a1&pwd=a1').then(function(res){
      //    console.log(res)
      //  })
   }
   auotLogin() {  //自动登录
     setTimeout(function(){
          let userInfo=getItem('user')
          let json_userInfo=userInfo?JSON.parse(userInfo):''
          if(json_userInfo.user){
            this.setState({
                user:json_userInfo.user,
                pwd:json_userInfo.pwd
            })
          }

        },0)
   }
   handleChange(key,val){
     this.setState({
     	[key]:val
     })
   }
   loginFun(){
   	  if(this.state.user==''){
   	  	this.magAlert('帐号不能为空！')
   	  	return
   	  }else if(this.state.pwd==''){
   	  	this.magAlert('密码不能为空！')
   	  	return
   	  }

      let userInfo={user:this.state.user,pwd:this.state.pwd,login:true,loginTip:true}
      this.loadingToast('登录中..')
      console.log('1111')
      axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetCheckUserAndPwd?user=${userInfo.user}&pwd=${userInfo.pwd}`
      ).then((res)=>{
          return res.data
      }).then((res)=>{
        console.log('33333')
          if(res.messageResult.IsSuccess){   //登录成功后
            Toast.hide()
            userInfo.User_ScanerID=res.UserInfo.User_ScanerID
            this.props.userLoginActions.userState(userInfo)  //vuex
            setItem('user',JSON.stringify(userInfo))   //localstorge
            this.props.history.push('/')
          }else{
             Toast.hide()
             this.magAlert('登录验证失败，请联系管理员！')
          }
      })
   	  
   }
   
   //用户登录验证请求
   loginFetch(data){
    console.log('2222')
    console.log(fetch)
      return fetch(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetCheckUserAndPwd?user=${data.user}&pwd=${data.pwd}`
      ).then((res)=>{
          return res.json()
      })
   }
   //antd-loading封装
   loadingToast(txt) {
      Toast.loading(txt||'loading..', 0, () => {
      });
    }
  //antd-对话框封装
   magAlert(msg){
       this.setState({
         modal1:true,
         msg:msg
      });
   }
   showModal = key => (e) => {
      e.preventDefault(); // 修复 Android 上点击穿透
      this.setState({
         [key]: 'bunnn',
      });
    }
    onClose = key => () => {
	    this.setState({
	      [key]: false,
	    });
    }
    moduleFunctionTest() {
        return tool.text()
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
export default connect(mapStateToProps,mapDispatchtoProps)(Login)