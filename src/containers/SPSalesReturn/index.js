import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex,Drawer} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import ReturnChoose from '../../components/Common/spReturnChoose'

class SPSalesReturn extends Component {
    constructor(props) {
          super(props)
          this.state = {
             returnNum:null,
             serialNum:'',
             spcode:'',
             confirmReturNum:null,
             moveReason:'',
             documentTxt:'',
             receiveState:null,
             resultArr:[],
             ChooseTbOpen:false,
             prompt:false,
             confirmNumInput:null,
             alertMsg:{text:'',modal1:false}
          }
    }
        
   render() {
    
      return (
         <div>
            {
              this.state.alertMsg.modal1?<WmsAlert alertMsg={this.state.alertMsg} closeAlert={this.closeAlert.bind(this)}/>:null
            }
            {<NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   备品退料
            </NavBar> }
            <WhiteSpace/>
            <List>
              <InputItem
                 editable={false}
                 value={this.state.returnNum}
              >退料数量</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.serialNum}
              >串号</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.spcode}
                 onClick={()=>{
                    process.env.NODE_ENV !== 'production'
                    ?this.scanDataSpCode('IA09-1-3-4')
                    :this.scanSpCode()
                   }
                 }
              >储位</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.confirmReturNum}
                 onClick={this.wmsPrompt.bind(this)}
              >确认退料数量</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.moveReason}
                 onChange={val=>this.setState({moveReason:val})}
              >移动原因</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.documentTxt}
                 onChange={val=>this.setState({documentTxt:val})}
              >凭证抬头文本</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.receiveState}
              >收货状态</InputItem>
            </List>
       
            {/* <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>this.saveSalesReturn()}
                   >确定</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>this.reset()}   
                   >取消</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ width:'32%'}} 
                         onClick={()=>{this.pcScanCode()}}>
                             模拟扫码</Button>
                        ):(<Button type="primary" inline style={{ width:'32%'}} 
                               onClick={this.scanQrCode.bind(this)}     
                           >扫码</Button>
                        )
                   }
                </div>
             </div> */}
             <div className="bottomBar">
               <div className="btnGroup">
                   <div style={{ marginRight: '0%',width:'30%'}} className="clBtn" onClick={()=>this.saveSalesReturn()}>确定</div>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?<div className="cirBtn" onClick={()=>{this.pcScanCode()}}><div className="btnBg"></div><img src={require('../../static/images/scanbtn.png')}/></div>
                       :<div className="cirBtn" onClick={this.scanQrCode.bind(this)}><div className="btnBg"></div><img src={require('../../static/images/scanbtn.png')}/></div>
                   }
                   <div style={{ marginRight: '0%',width:'30%',float:'right'}} className="clBtn" onClick={()=>this.reset()}>取消</div>
                </div>
            </div>
             {
                 this.state.ChooseTbOpen?(<ReturnChoose 
                 spScanData={this.state.resultArr}  changeTbIndex={this.changeTbIndex.bind(this)} />):null
             }
             <Modal
	          visible={this.state.prompt}
	          transparent
	          maskClosable={false}
	          onClose={this.onClose('prompt')}
	          title="确认退料数"
	          footer={[{ text: '确定', onPress: () => { 
                             if(this.state.confirmNumInput<1){
                                Toast.fail('数量输入错误', 2)
                                return false
                             }
                             this.setState({
                                confirmReturNum:this.state.confirmNumInput
                             })
                             this.onClose('prompt')(); 
                     } }]}
	         >
		          <div className="am-modal-input-container">
                     <div className="am-modal-input">
                        <input type="number" id="confirmNum" ref="confirmNumInput" value={this.state.confirmNumInput}
                          onFocus={()=>{
                          }}
                          onChange={e=>this.handleChange('confirmNumInput',e.target.value)}/>
                     </div>
		          </div>
	        </Modal>
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
        let result='32178241_&_5832-2AHTAU-1301_&_JS104_&_24PCS_&_130*160*1.6MM  2L_&_1_&_24PCS_&_2017-04-11'; //'32178156_&_0604-000000-01_&_MS011_&_100PCS_&_BLANK LABEL_&_1_&_100PCS_&_2017-07-20' 
        let barCode=result.replace(/&/g,'%26')
        this.scanDataDealCode(barCode,1)
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
     //根据扫描到的码请求数据
    scanDataDealCode(barCode,scanStatus){
        Toast.loading('loading...',0)
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReturn/scanDataDealBarCode?`
             +`barCode=${barCode}&scanStatus=${scanStatus}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log(res)
            if(res.messageResult.IsSuccess){
                var returnArr=JSON.parse(res.sResultJsonStr);
                
                this.setState({
                    resultArr:returnArr
                })
                this.chooseItem(this.state.resultArr)
            }else{
                this.openModal(res.messageResult.ErrorMessage)
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
        })
    }
    //点击扫描储位输入框时，打开扫码
    scanSpCode(){
        let self=this
        if(!this.state.ifWxConfigReady){
            return false
        }else{
            console.log('wx.scanQRCode')
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                    self.scanDataSpCode(result)
                }
            });
 
        }
        
    }
    //扫描储位的码--后台判断是否存在，存在的话就填上
    scanDataSpCode(spCode){
        let self=this
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAPoReturnMaterial/scanDataDealBarCode?barCode=${spCode}&scanStatus=2`
        ).then((res)=>{
            return res.data
         }).then(res => {
            if(res.messageResult.IsSuccess){
                this.setState({
                    spcode:spCode
                })
            }else{
                Toast.info(res.messageResult.ErrorMessage)
            }
         }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
         })
     }
    chooseItem(arr){
       this.setState({
         ChooseTbOpen:true
       })
    }
    changeTbIndex(index){
        let poScanData=this.state.resultArr
        this.setState({
            ChooseTbOpen:false
        })
        this.setState({
             returnNum:poScanData[index].ReceivingQuantity,
             serialNum:poScanData[index].ReceivingNumber,
             spcode:poScanData[index].spCode,
             confirmReturNum:poScanData[index].ReceivingQuantity,
             receiveState:poScanData[index].ReceivingStateName,
             batchCode:poScanData[index].RBatchCode,
             factory:poScanData[index].Factory,
             storehouseCode:poScanData[index].storehouseCode,
             materialCode:poScanData[index].MaterialCode
        })
    }

    //扫描储位的码--后台判断是否存在，存在的话就填上
    scanDataSpCode(spCode){
        let self=this
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAPoReturnMaterial/scanDataDealBarCode?barCode=${spCode}&scanStatus=2`
        ).then((res)=>{
            return res.data
         }).then(res => {
            if(res.messageResult.IsSuccess){
                this.setState({
                    spcode:spCode
                })
            }else{
                Toast.info(res.messageResult.ErrorMessage)
            }
         }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
         })
     }

     saveSalesReturn(){
        let self=this
        let receiveingNumber=this.state.serialNum,
            batchCode=this.state.batchCode,
            factory=this.state.factory,
            spCode=this.state.spcode,
            storehouseCode=this.state.storehouseCode,
            materialCode=this.state.materialCode
          
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReturn/Save?`
                  +`receiveingNumber=${receiveingNumber}&batchCode=${batchCode}&`
                  +`factory=${factory}&spCode=${spCode}&`
                  +`storehouseCode=${storehouseCode}&materialCode=${materialCode}`
        ).then((res)=>{
            return res.data
         }).then(res => {
            if(res.messageResult.IsSuccess){
                Toast.info(res.messageResult.Message,1.4)
                self.reset()
            }else{
                Toast.info(res.messageResult.ErrorMessage,1.4)
            }
         }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
         })

    }
     wmsPrompt(initNum){
        this.setState({
             prompt:true,
             confirmNumInput:this.state.confirmNumInput==0?this.state.confirmReturNum:this.state.confirmNumInput
        });
     }
     onClose = key => () => {
	    this.setState({
	      [key]: false,
	    });
    }
    handleChange(key,val){
        this.setState({
            [key]:val
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
    reset(){
        this.setState({
            returnNum:null,
            serialNum:'',
            spcode:'',
            confirmReturNum:null,
            moveReason:'',
            documentTxt:'',
            receiveState:null,
            resultArr:[],
            ChooseTbOpen:false,
            confirmNumInput:null,
        })
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
export default connect(mapStateToProps,mapDispatchtoProps)(SPSalesReturn)