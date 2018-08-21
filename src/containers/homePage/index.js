import React,{Component} from 'react'
import { NavBar} from 'antd-mobile'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as userLoginAction from '../../actions/userState'
import {getItem, setItem} from '../../util/localStorage'
import { Grid,List,Toast,Drawer,Icon } from 'antd-mobile'
class Login extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
        open:false,
        devToolState:false,
        userImgUrl:require('../../static/images/user.jpg'),
        skinIndex:0
   	  }
   }
   
   render() {
     const sidebar = (<List>
          <Item extra={
                         <span style={{color:"#0097e5"}} onClick={this.logout.bind(this)}>退出</span>
                     }>帐号已登录</Item>
          <Item extra={
                         <span style={{color:"#0097e5"}} onClick={this.devToggle.bind(this)}>{this.state.devToolState?'关闭':'开启'}</span>
                     }>{this.state.devToolState?'调试工具已开启':'调试工具已关闭'}</Item>
          <Item className="skinBox" extra={
                         <span style={{color:"#0097e5"}} >
                             <i  className={`skinTag skinTag0 ${this.state.skinIndex==0?'active':''}`}  onClick={this.toggleSkin.bind(this,0)}></i>
                             <i  className={`skinTag skinTag1 ${this.state.skinIndex==1?'active':''}`}  onClick={this.toggleSkin.bind(this,1)}></i>
                             <i  className={`skinTag skinTag2 ${this.state.skinIndex==2?'active':''}`}  onClick={this.toggleSkin.bind(this,2)}></i>
                             <i  className={`skinTag skinTag3 ${this.state.skinIndex==3?'active':''}`}  onClick={this.toggleSkin.bind(this,3)}></i>
                         </span>
                     }>主题色</Item>
      </List>);
      return (
      	<div>
           <NavBar 
              mode="dark" 
              rightContent={[<Icon key="1" type="ellipsis" onClick={this.onOpenChange.bind(this)}/>]}>
              <div className="TitWarp">
                  <img src={require('../../static/images/wmsTitImg.png')} />
              </div> 
            </NavBar>
      	 	<div style={{display:'none'}}>

                 <div className="sub-title">当前帐号</div>
                 <List >
                  <Item extra={
                         <span style={{color:"#0097e5"}} onClick={this.logout.bind(this)}>退出</span>
                     }>{this.props.userState.user}({this.props.userState.User_ScanerID})</Item>
                </List>
             </div>
             <div className="userBox">
                 <div className="useImgBox">
                     <img src={this.state.userImgUrl} />
                 </div>
                 <div className="usetTxtBox">
                      <p className="Tit_p">帐号：{this.props.userState.user}</p>
                      <p>MAC 地址：{this.props.userState.User_ScanerID}</p>
                 </div>
             </div>
             <Grid data={operateArr} columnNum={3} onClick={this.gridLink.bind(this)}/>
             {
                 
                    <Drawer
                        className="my-drawer"
                        style={{ minHeight: document.documentElement.clientHeight-45,zIndex:this.state.open?"22":"-1"}}
                        enableDragHandle
                        contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                        sidebar={sidebar}
                        position='right'
                        open={this.state.open}
                        onOpenChange={this.onOpenChange}
                    ><div></div>
                    </Drawer>
                 
                 
             }
             <div className="copyrightBar">
                <p>Copyright @ 2018  深圳创维数字技术有限公司  版权所有</p>
             </div>
        </div>
        
      )

   }
   
   componentDidMount(){
       //console.log(this.props.userState)
       if(this.props.userState.loginTip){
          Toast.info('登录成功',1, null, true)
          this.props.userLoginActions.changeLoginTip({loginTip:false})
       }
       if(JSON.parse(getItem('devToolShow'))){
           this.setState({
              devToolState:true,
           })
       }
       //获取当前主题色的序号
       this.setState({
           skinIndex:getItem('skin')===''?0:JSON.parse(getItem('skin'))
       })
       
   }
   //切换主题色
   toggleSkin(index){
      setItem('skin',index)
      this.onOpenChange()
      this.loadingToast('主题色更换中..')
      location.reload()
   }
   //九宫格元素点击跳转
   gridLink(el,index){
      //console.log(JSON.stringify(el))
      //console.log(this.props.history)
      this.props.history.push(el.link)
   }
  
   //登出操作-
   logout(){
      setItem('user','')
      this.onOpenChange()
      this.loadingToast('正在注销..')
      location.reload()
      //this.props.history.push('/')
   }
   onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
   }
   devToggle(){
        setItem('devToolShow',JSON.stringify(!JSON.parse(getItem('devToolShow'))))
        this.onOpenChange()
        this.setState({
            devToolState:!this.state.devToolState
        })
        this.loadingToast('加载调试工具..')
        location.reload()
   }
   //antd-loading封装
   loadingToast(txt) {
      Toast.loading(txt||'loading..', 0, () => {
      });
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
       link:'/RecipienCheckout'
    },
    {
       icon: require('../../static/images/beiping.png'),
       text: '备品收货',
       link:'/SparesRece'
    },
    {
       icon: require('../../static/images/lingliao.png'),
       text: 'MO领料',
       link:'/MOpicking'
    },
    {
       icon: require('../../static/images/motuiliao.png'),
       text: 'MO退料',
       link:'/MoSaleReturn'
    },
    {
       icon: require('../../static/images/tuiliao.png'),
       text: 'PO退料',
       link:'/PoSalesReturn'
    },
    {
       icon: require('../../static/images/bptuiliao.png'),
       text: '备件退料',
       link:'/SPSalesReturn'
    },
    {
       icon: require('../../static/images/yidong.png'),
       text: '异动',
       link:'/Prepare'
    },
    {
       icon: require('../../static/images/pandian.png'),
       text: '盘点',
       link:'/Inventory'
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