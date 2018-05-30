import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,Checkbox,WhiteSpace } from 'antd-mobile'
import wx from 'weixin-js-sdk'
import fetchJsonp from 'fetch-jsonp'
class Recipien extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
        num:222,
   	    intitStorge:111,
        text:'闪电似的送',
        poVal:'31233333',
        matail:'dsd',
        org:'dsdsd',
        checkStorge:false
   	  }
   }
   
   render() {
      return (
      	<div>
      	    <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   来料收货
            </NavBar>
            <WhiteSpace/>
            <List >
              <InputItem
                 editable={false}
                 value={this.state.num}
                 onChange={val=>this.setState({num:val})}
              >确认数量</InputItem>
              <InputItem
                 value={this.state.intitStorge}
                 onChange={val=>this.setState({intitStorge:val})}
              >默认储位</InputItem>
              <div className="inputRightBtn">
                    <InputItem
                       editable={true}
                       value={this.state.text}
                       onChange={val=>this.setState({text:val})}
                       extra={<Button type="primary" size="small" style={{marginTop:'-6px'}}>保存</Button>}
                    ></InputItem>
              </div>
              <Item className="checkboxAlign">
                 扫描储位<AgreeItem style={{display:'inline-block',height:'22px',lineHeight:'22px',padding:'0px'}} data-seed="logId" onChange={e => console.log('checkbox', e)} />
              </Item>
              <InputItem
                 editable={false}
                 value={this.state.poVal}
                 onChange={val=>this.setState({poVal:val})}
              >PO</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.matail}
                 onChange={val=>this.setState({matail:val})}
              >物料</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.org}
                 onChange={val=>this.setState({org:val})}
              >供应商</InputItem>
            </List>
            <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'40%'}}>收货查看</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'28%'}}>清除</Button>
                   <Button type="primary" inline style={{ width:'28%'}} onClick={this.scanCodeFun.bind(this)}>扫码</Button>
                </div>
            </div>
        </div>
      )

   }
   
   componentDidMount(){
   	  
      console.log(wx)
      //this.getAccessTokey().then((res)=>{console.log(res)})
   }
   loginFetch(data){
      return fetch(`http://172.28.0.203:8002/PDAService.asmx?op=Getusr_pda&${data.user}&${data.pwd}`
      ).then((res)=>{
          return res.json()
      })
   }
   //扫码按钮事件函数
   scanCodeFun(){
       //this.getConfig()
       this.getConfig()
   }

   getConfig() { 
        let url = location.href.split('#')[0] //获取锚点之前的链接
        fetch(`http://wmspda.skyworthdigital.com:9001/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
            return res.json()
        }).then(res => {
            this.wxInit(res);
        })
   }
   getAccessTokey(){
        return fetch('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww58877fbb525792d1&corpsecret=wvaM2aIJsDBO586imwN8Fs1vmOmR2xBGNFs4PlgzS5I'
        ,).then((res)=>{
            return res.json()
        })
   }
   wxInit(res) {
      wx.config({
          debug: true,
          appId: 'ww58877fbb525792d1',
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['checkJsApi', 'scanQRCode']
     });
    
     wx.ready(function() {
       wx.checkJsApi({
            jsApiList: ['scanQRCode'],
            success: function (res) {
            }
        });
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert("扫描结果："+result);
            }
        });

     });
     wx.error(function(err) {
        console.log(JSON.stringify(err))
     });
   }

}

const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;
export default Recipien
