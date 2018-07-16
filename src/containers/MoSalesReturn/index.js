import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
class MoSalesReturn extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         Molist:[],
         barCode:'',
         scanData:null,
         moveReason:'',  //移动原因
         voucher:'',  //凭证抬头
         pickerValue:[],
         alertMsg:{text:'',modal1:false},
         ifWxConfigReady:false,
         PickingQuantity:0,
         comfirmQuantity:0
   	  }
   }
   
   render() {
      return (
        
      	<div>
            {
              this.state.alertMsg.modal1?<WmsAlert alertMsg={this.state.alertMsg} closeAlert={this.closeAlert.bind(this)}/>:null
            }
            <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   MO退料
            </NavBar>
            <WhiteSpace/>
            <List >
               <Picker data={this.state.scanData?this.state.scanData.moList:[]} cols={1}  className="forss" 
                            
                            onOk={(v) => {
                                if(v.length==0||v[0]==this.state.pickerValue[0]) return
                                this.pickCallback(v).then(()=>{
                                    //异步操作，使线体先保存，后取
                                    this.getBindMoponmr()
                                })
                            }} 
                            value={this.state.pickerValue}>
                        <List.Item arrow="horizontal">选择MO</List.Item>
                 </Picker>
              <InputItem
                 editable={false}
                 value={this.state.PickingQuantity}
              >退料数量</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.comfirmQuantity}
                 onChange={val=>{
                    this.setState({comfirmQuantity:val})
                 }}
                 onBlur={val=>{
                    if(!this.isRealNum(val)){
                        this.openModal('只能输入数字！')
                        this.setState({comfirmQuantity:this.state.PickingQuantity})
                    }else if(val<=0){
                        this.openModal('不能小于等于0！')
                        this.setState({comfirmQuantity:this.state.PickingQuantity})
                    }else if(val>parseInt(this.state.PickingQuantity)){
                        this.openModal('不能大于退料数量')
                        this.setState({comfirmQuantity:this.state.PickingQuantity})
                    }
                    
                 }}

              >确认数量</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.scanData?this.state.scanData.curMoDtl.spCode:''}
                 onClick={()=>{
                    process.env.NODE_ENV !== 'production'
                    ?this.pcQrScan()  
                    :this.qrScan()
                 }}
              >确认储位</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.moveReason}
                 onChange={val=>this.setState({moveReason:val})}
              >移动原因</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.voucher}
                 onChange={val=>this.setState({voucher:val})}
              >凭证抬头</InputItem>
            </List>

             <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>this.saveSalesReturn()}
                   >确定</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>{this.pageReset()}}   
                   >取消</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ width:'32%'}} 
                             onClick={()=>{this.pcScanCode()}} >
                             模拟扫码</Button>
                        ):(<Button type="primary" inline style={{ width:'32%'}} 
                                   onClick={this.scanQrCode.bind(this)}
                           >扫码</Button>
                        )
                   }
                </div>
             </div>
        </div>
      )
    }
    componentDidMount(){
       this.getConfig()
    }
    getConfig() { 
        let url = location.href.split('#')[0] //获取锚点之前的链接
        Toast.loading('loading...',0)
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/Common/GetSignature?url=${url}`).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log("this.wxInit(res)")
            this.wxInit(res);
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('调用扫码功能遇到了错误', 1);
        })
    }
    wxInit(res) {
        let self=this
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
                  console.log('wx.checkJsApi-return:'+JSON.stringify(res))
              }
        });
        console.log('AAAAA')
        self.setState({
            ifWxConfigReady:true
        })

      });
      wx.error(function(err) {
          console.log(JSON.stringify(err))
      });
    }
  	


    //pc端调试-模拟手机端扫码效果
    pcScanCode(){
        let result='40015393_&_47ER-F61371-0080_&_FH044_&_*_&_*_&_*_&_20000_&_2017-2-17'
        let barCode=result.replace(/&/g,'%26')
        this.scanDataDealCode(barCode,1)
        this.setState({
            barCode:barCode
        }) 
    }
    //手机端扫描二维码
    scanQrCode(){
        let self=this
        if(!this.state.ifWxConfigReady){
            return false
        }else{
         wx.scanQRCode({
             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
             scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
             success: function (res) {
                 var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                 console.log("扫描结果："+result)
                 let barCode=result.replace(/&/g,'%26')
                 self.setState({
                    barCode:barCode
                 }) 
                 self.scanDataDealCode(barCode,1)
             }
         });
 
        }
    }
    //pc端模拟扫描储位码
    pcQrScan() {
        let barCode='PA13-2-2-2'
        this.scanDataDealCode(barCode,2)
    }
    //移动端扫描储位码
    qrScan(){
        let self=this
        if(!this.state.ifWxConfigReady){
            return false
        }else{
         wx.scanQRCode({
             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
             scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
             success: function (res) {
                 var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                 console.log("扫描结果："+result)
                 self.scanDataDealCode(result,2)
             }
         });
 
        }
    }
    //根据扫描到的码请求数据
    scanDataDealCode(barCode,scanStatus){
        Toast.loading('loading...',0)
        let aScanStatus=scanStatus
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSalesReturn/scanDataDealBarCode?`
             +`barCode=${barCode}&scanStatus=${aScanStatus}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            if(aScanStatus==1){
                    //数据处理
                    let moList=JSON.parse(res.sResultJsonStr).map((item,index)=>{
                        return {label:item.MO,value:item.MO}
                    })
                    let scanData={
                        moList,
                        curMoDtl:JSON.parse(res.dataResultJsonStr)[0],
                        qrCode:res.qrCode
                    }
                    this.setState({
                        scanData
                    })
                    this.setState({
                        pickerValue:[moList[0].value],
                        PickingQuantity:scanData.curMoDtl.PickingQuantity,
                        comfirmQuantity:scanData.curMoDtl.PickingQuantity
                    })
            }else if(aScanStatus==2){
                if(res.messageResult.IsSuccess){
                    let scanData=this.state.scanData
                    scanData.curMoDtl.spCode=barCode
                    this.setState({
                        scanData
                    })
                }else{
                    this.openModal(res.messageResult.ErrorMessage)
                }
            }
            
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
        })
    }
    pickCallback (v){
        this.setState({pickerValue:v})
        return Promise.resolve()
    }
    getBindMoponmr (){
        Toast.loading('loading...',0)
        let mo=this.state.pickerValue[0],
            qrCode=(this.state.scanData.qrCode).replace(/&/g,'%26')
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSalesReturn/getBindMoPonmr?`
               +`mo=${mo}&qrCode=${qrCode}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            let scanData=this.state.scanData
            scanData.curMoDtl=JSON.parse(res.sResultJsonStr)[0]
            this.setState({
                scanData,
                PickingQuantity:scanData.curMoDtl.PickingQuantity,
                comfirmQuantity:scanData.curMoDtl.PickingQuantity
            })
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
        })
    }
    saveSalesReturn(){
        Toast.loading('loading...',0)
        let mo=this.state.pickerValue[0],
            userCode=this.props.userState.user,
            returnId=this.state.scanData.curMoDtl.id,
            spCode=this.state.scanData.curMoDtl.spCode,
            mobileReason=this.state.moveReason,
            documentHeader=this.state.voucher,
            retQrCode=this.state.barCode,
            returnQty=this.state.PickingQuantity

        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSalesReturn/saveSalesReturn?`
              +`userCode=${userCode}&mo=${mo}&`
              +`returnId=${returnId}&spCode=${spCode}&`
              +`mobileReason=${mobileReason}&documentHeader=${documentHeader}&`
              +`retQrCode=${retQrCode}&returnQty=${returnQty}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            if(res.messageResult.IsSuccess){
                this.openModal(res.messageResult.Message)
                this.pageReset()
            }else{
                this.openModal(res.messageResult.ErrorMessage)
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
        })
    }
    pageReset() {
        this.setState({
            barCode:'',
            scanData:null,
            moveReason:'',  //移动原因
            voucher:'',  //凭证抬头
            pickerValue:[],
            PickingQuantity:0,
            comfirmQuantity:0
        })
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
        })
    }
    closeAlert(){
        this.setState({
            alertMsg:{text:'',modal1:false}
        })
    }
    isRealNum(val){
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
        if(val === "" || val ==null){
            return false;
        }
        if(!isNaN(val)){
            return true;
        }else{
            return false;
        }
    }  
}
const mapStateToProps = (state) => {
	return state
}
const mapDispatchtoProps = (dispatch) => {
	return {
        recipienStateActions:bindActionCreators(wmsAction,dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(MoSalesReturn)
