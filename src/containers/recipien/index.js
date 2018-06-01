import React,{Component} from 'react'
import {Modal,NavBar,Icon,Button,List,InputItem,Checkbox,WhiteSpace,Toast} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import fetchJsonp from 'fetch-jsonp'
import wxConfig from '../../util/wxConfig'
import * as tools from '../../util/tools'
const prompt = Modal.prompt
class Recipien extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
        orderId:'1212213323232',
        num:null,
   	    intitStorge:null,
        text:'',
        poVal:'',
        matail:'',
        org:'',
        checkStorge:false,
        scanCodeType:1
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
                 value={this.state.orderId}
              >收货单号</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.num}
                 onChange={val=>this.setState({num:val})}
              >确认数量</InputItem>
              <InputItem
                 value={this.state.intitStorge}
                 onChange={val=>this.setState({intitStorge:val})}
              >默认储位</InputItem>
              <Item className="checkboxAlign">
                 <div className="checkWarp">
                    <div className="checkItem">
                        扫描储位<AgreeItem style={{display:'inline-block',height:'22px',lineHeight:'22px',padding:'0px'}} data-seed="logId"
                        onChange={e => this.setState({checkStorge:!this.state.checkStorge})} />
                    </div>
                    <div className="checkItem">
                        超收 <AgreeItem style={{display:'inline-block',height:'22px',lineHeight:'22px',padding:'0px'}} data-seed="logId"
                        />
                    </div>
                  </div>
              </Item>
              <div className="inputRightBtn">
                    <InputItem
                       editable={true}
                       value={this.state.checkStorge?this.state.intitStorge:this.state.text}
                       onChange={val=>this.setState({text:val})}
                       onFocus={()=>{this.setState({scanCodeType:2})}}
                       onBlur={()=>{this.setState({scanCodeType:1})}}
                       placeholder={this.state.scanCodeType==2?'请点击扫码按钮扫描条码':''}
                       extra={<Button type="primary" size="small" style={{marginTop:'-6px'}}>保存</Button>}
                    ></InputItem>
              </div>
              
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
                   <Button type="primary" inline style={{ marginRight: '2%',width:'40%'}} onClick={()=>this.props.history.push('/RecipienDtl')}>收货查看</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'28%'}}>清除</Button>
                   <Button type="primary" inline style={{ width:'28%'}} onClick={this.scanCodeFun.bind(this)}>扫码</Button>
                </div>
            </div>
        </div>
      )

   }
   
   componentDidMount(){
      //this.getAccessTokey().then((res)=>{console.log(res)})
      //this.antd_prompt()
      //wxConfig()
      console.log(this.props)
      this.getOrderId()
      let result='32176790_&_4500-783152-0S00_&_JS068_&_3000_&_783152_%26_*_&_60000_&_2017-03-17'
      let barCode=result.replace(/&/g,'%26')
      this.getFormInfo(barCode)
      //this.getStorge('CK372')
      if(this.state.scanCodeType==1){alert('dddd')}
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
        this.loadingToast('loading...')
        fetch(`http://wmspda.skyworthdigital.com:9001/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
            return res.json()
        }).then(res => {
            Toast.hide()
            this.wxInit(res);
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('调用扫码功能遇到了错误', 1);
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
          debug: false,
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
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                alert(JSON.stringify(res))
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                alert("扫描结果："+result);
                console.log('this.state.scanCodeType:'+this.state.scanCodeType)
                if(this.state.scanCodeType==1){
                   console.log('001')
                   let barCode=result.replace(/&/g,'%26')
                   console.log(barCode)
                   this.getFormInfo(barCode)
                   console.log('扫的是二维码')
                }else{
                    this.getStorge(result)
                    alert('扫的是条码')
                }
                
            }
        });

     });
     wx.error(function(err) {
        console.log(JSON.stringify(err))
     });
   }

   getFormInfo(barCode){
      console.log('002:in the getFormInfo(barCode)')
      let formData = new FormData()
      formData.append("barCode",barCode)
      formData.append("checkreceive",false)
      formData.append("ScanStatus",1)
      let params={
        "barCode":barCode
      }
      let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/ScanDataDealBarCode'
      let url2=`${url}?barCode=${barCode}&checkreceive=false&ScanStatus=1`
      let url3='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/ScanDataDealBarCodeTest'


      console.log('003:before fetch')
      fetch(`${url2}`,{
            method:"GET",   //请求方法
      }).then((res)=>{
            return res.json()
      }).then((res)=>{
             console.log('004:')
            if(res.MessageResult.IsSuccess){
                let ReceivingQuantity=res.ReceivementDetail.ReceivingQuantity
                this.setState({
                    intitStorge:res.MaterialInfo.spCode,
                    poVal:res.ReceivementDetail.PO,
                    matail:res.ReceivementDetail.MaterialCode,
                    org:res.Receivement.SupplierCode,
                    num:ReceivingQuantity
                })
                prompt('确认数量', '请输入数量', [
                    { text: '取消' },
                { text: '确定', onPress: value => {
                        this.setState({
                            num:value
                        })
                } },
                ], 'default', ReceivingQuantity)

            }else{
                Toast.fail(res.MessageResult.ErrorMessage?res.MessageResult.ErrorMessage:'error', 2);
            }
            
            
      }).catch((e)=>{
         Toast.fail('扫码解析请求遇到了错误', 2);
      })

   }
   getOrderId(){
       let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetOrCreateReceiveNumber'
       fetch(url+`?userCode="A1"`).then((res)=>{
           return res.json()
       }).then((res)=>{
           console.log(res)
           this.setState({
               orderId:res.ReceivingNumber
           })
       })
   }
   getStorge(ScanDataDealSpCode){
       let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/ScanDataDealSpCode'
       fetch(url+`?barCode=${ScanDataDealSpCode}&checkreceive=false&ScanStatus=1`).then((res)=>{
           return res.json()
       }).then((res)=>{
           
           if(res.MessageResult.IsSuccess){

               console.log(res)
               this.setState({
                 text:res.ReceivementDetail.spCode                
               })
           }else{
              Toast.fail(res.MessageResult.ErrorMessage?res.MessageResult.ErrorMessage:'error', 2);
           }
       }).catch((e)=>{
            Toast.fail('扫码解析请求遇到了错误', 2);
       })
   }
   antd_prompt(){
    prompt('defaultValue', 'defaultValue for prompt', [
        { text: 'Cancel' },
        { text: 'Submit', onPress: value => console.log(`输入的内容:${value}`) },
      ], 'default', '100')
    }

    loadingToast(txt) {
        Toast.loading(txt,0);
    }
}


const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;
export default Recipien
