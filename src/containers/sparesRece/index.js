import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import {
    Route,
    Switch
  } from 'react-router-dom'
import RecipienConfirm from '../../containers/sparesRece/RecipienConfirm'
class SparesRece extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         modal1:false,
         alertMsg:{text:'',modal1:false},
         checkIndex:0,
         scanDataDealBarCode:null
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
                   备品收货
            </NavBar>
            <WhiteSpace/>
            <List >
              <InputItem
                 editable={false}
                 value={this.props.recipienState.spareOrderId}
              >单号</InputItem>
              <List.Item className="checkboxAlign">
                 <div className="Checkone">
                      {
                         ['备品','赠品','客供料'].map((item,index)=>{
                             return <div className="checkItem" key={index} onClick={()=>{
                                                                     this.setState({
                                                                         checkIndex:index
                                                                     })
                                                               }}
                                    >
                                        <span className="wmsCheckBox" >
                                          { this.state.checkIndex==index?<i className="wms-icon-checked checkedtab"></i>:<i className="wms-icon-unChecked unCheckedtab"></i>}
                                        </span>
                                        {item}
                                    </div>
                         })
                      }
                 </div>
              </List.Item>
              <InputItem
                 editable={false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.Factory:null}
              >工厂</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.storehouseCode:null}
              >仓位</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.MaterialCode:null}
              >物料</InputItem>
              <InputItem
                 editable={this.state.scanDataDealBarCode?true:false}
                 type="number"
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.ReceivingQuantity:null}
                 onChange={val=>{
                     let NewScanDataDealBarCode=this.state.scanDataDealBarCode
                     NewScanDataDealBarCode.giftsGRNDetail.ReceivingQuantity=val
                     this.setState({scanDataDealBarCode:NewScanDataDealBarCode})
                 }}
              >数量</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.spCode:null}
                 onClick={()=>{
                     process.env.NODE_ENV !== 'production'
                     ?this.scanDataSpCode('PA13-2-1-5')
                     :this.scanSpCode()
                   }
                 }
                
              >扫描储位</InputItem>
              <InputItem
                 editable={this.state.scanDataDealBarCode?true:false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.MobileReason:null}
                 placeholder="必填"
                 onChange={val=>{
                    let NewScanDataDealBarCode=this.state.scanDataDealBarCode
                    NewScanDataDealBarCode.giftsGRNDetail.MobileReason=val
                    this.setState({scanDataDealBarCode:NewScanDataDealBarCode})
                 }}
              >移动原因</InputItem>
              <InputItem
                 editable={this.state.scanDataDealBarCode?true:false}
                 value={this.state.scanDataDealBarCode?this.state.scanDataDealBarCode.giftsGRNDetail.DocumentHeader:null}
                 className="font-small"
                 onChange={val=>{
                    let NewScanDataDealBarCode=this.state.scanDataDealBarCode
                    NewScanDataDealBarCode.giftsGRNDetail.DocumentHeader=val
                    this.setState({scanDataDealBarCode:NewScanDataDealBarCode})
                 }}
              >凭证抬头文本</InputItem>
              
             </List>
             <div className="bottomBar x-border-top">
               <div className="btnGroup">
                   
                   <Button type="primary" inline 
                           style={{ marginRight: '2%',width:'23%',padding:'4px',lineHeight:'49px'}}
                           className="buttonFontSmall"
                           onClick={()=>{
                               this.props.history.push('/SparesRece/RecipienConfirm')
                           }}
                           >收货查看</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'23%'}} onClick={this.temporarySave.bind(this)}>暂存</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?<Button type="primary" inline style={{ marginRight: '2%', width:'23%'}} onClick={()=>{this.pcScanCode()}}>模拟扫码</Button>
                       :<Button type="primary" inline style={{ marginRight: '2%', width:'23%'}} onClick={()=>{this.scanQrCode()}}>扫码</Button>
                   }
                   <Button type="primary" inline style={{width:'23%'}} onClick={()=>{this.clearForm()}}> 清除</Button>
                  
                   
                </div>
             </div>
             
             <Route path='/SparesRece/RecipienConfirm' exact component={RecipienConfirm}/>
             
        </div>
      )
    }
    componentDidMount(){
       this.getConfig()
       this.getOrderId()  //页面刷新时重新请求单号
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

    //用与pc端模拟调试扫码后的效果
    pcScanCode() {
      console.log('1111')
      let result='32178156_&_0604-000000-01_&_MS011_&_100PCS_&_BLANK LABEL_&_1_&_100PCS_&_2017-07-20'
      let barCode=result.replace(/&/g,'%26')
      this.scanDataDealCode(barCode)
      this.setState({
        barCode:barCode
      }) 
    }
    //手机端扫描二维码
    scanQrCode(){
        let self=this
        Toast.loading('loading...',0)
        if(!this.state.ifWxConfigReady){
            return false
        }else{
         wx.scanQRCode({
             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
             scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
             success: function (res) {
                 Toast.hide()
                 var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                 console.log("扫描结果："+result)
                 let barCode=result.replace(/&/g,'%26')
                 self.setState({
                    barCode:barCode
                 })
                 self.scanDataDealCode(barCode)
             }
         });
 
        }
    }
    //点击扫描储位输入框时，打开扫码
    scanSpCode(){
        console.log('1111')
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
                    console.log("扫描结果："+result)
                    self.scanDataSpCode(result)
                }
            });
 
        }
        
    }
    //通过扫描储位的码获取数据
    scanDataSpCode(spCode){
       let self=this
       axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/scanDataDealBarCode?barCode=${spCode}&scanStatus=2`
       ).then((res)=>{
           return res.data
        }).then(res => {
           console.log(res)
           let NewScanDataDealBarCode=self.state.scanDataDealBarCode
           if(!NewScanDataDealBarCode){
                self.openModal('操作顺序有误！')
                return
           }
           //更新（覆盖）组件状态：
           NewScanDataDealBarCode.giftsGRNDetail.Factory=res.giftsGRNDetail.Factory
           NewScanDataDealBarCode.giftsGRNDetail.storehouseCode=res.giftsGRNDetail.storehouseCode
           NewScanDataDealBarCode.giftsGRNDetail.spCode=res.giftsGRNDetail.spCode
           self.setState({scanDataDealBarCode:NewScanDataDealBarCode})
        }).catch(e=>{
           console.log(e)
           Toast.hide()
           Toast.fail('error', 1);
        })
    }
    //根据扫码结果获取数据
    scanDataDealCode(barCode){
       Toast.loading('loading...',0)
       axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/scanDataDealBarCode?barCode=${barCode}`
       ).then((res)=>{
           return res.data
        }).then(res => {
           Toast.hide()
           console.log(res)
           this.setState({
                scanDataDealBarCode:res
           })
        }).catch(e=>{
           console.log(e)
           Toast.hide()
           Toast.fail('error', 1);
        })
    }
    
    //请求单号
    getOrderId(){
        let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/GetReceivingNumber'
        let userCode=this.props.userState.user
        axios.get(url+`?userCode=${userCode}`).then((res)=>{
            return res.data
        }).then((res)=>{
            this.props.recipienStateActions.recipienState({
                spareOrderId:res
            })  
        })
    }
    //根据收货单号获取收货单信息
    getFormInfo=()=>{
        Toast.loading('loading...',0)
        let receivingNumber=this.state.listReceivingNumber[this.state.chooseOrderIndex]
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMaterialCheck/getReceiveMentDetailByReceivingNumber?receivingNumber=${receivingNumber}&barCode=${this.state.barCode}
        `
        ).then((res)=>{
           return res.data
        }).then(res => {
           Toast.hide()
          
        }).catch(e=>{
           console.log(e)
           Toast.hide()
            Toast.fail('error', 1);
        })
    }
    //暂存
    temporarySave() {
        if(!this.state.scanDataDealBarCode){
            Toast.fail('没有可以暂存的数据', 1)
            return
        }
        let self=this
        Toast.loading('loading...',0)
        let giftsGRNDetail=this.state.scanDataDealBarCode.giftsGRNDetail
        let SpareField1=giftsGRNDetail.SpareField1.replace(/&/g,'%26')
        let stype=this.state.checkIndex+1
        let url = `http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/temporarySaveReceiveingData?`
                +`userCode=${this.props.userState.user}&receivingNumber=${this.props.recipienState.spareOrderId}`
                +`&receivingQuantity=${giftsGRNDetail.ReceivingQuantity}&spCode=${giftsGRNDetail.spCode}`
                +`&materialCode=${giftsGRNDetail.MaterialCode}&factory=${giftsGRNDetail.Factory}`
                +`&spareField1=${SpareField1}&supplierCode=${this.state.scanDataDealBarCode.GiftsGRN.SupplierCode}`
                +`&storehouseCode=${giftsGRNDetail.storehouseCode}&mobileReason=${giftsGRNDetail.MobileReason}`
                +`&stype=${stype}&documentHeader=${giftsGRNDetail.DocumentHeader}`
        console.log('暂存请求:'+url)
        axios.get(
            url
        ).then((res)=>{
           return res.data
        }).then(res => {
           Toast.hide()

           if(res.messageResult.IsSuccess){
               self.openModal(res.messageResult.Message)
               self.reset()
               self.props.recipienStateActions.recipienState({
                  spareOrderId:res.m_ReceivingNumber
               })  
           }else{
               self.openModal(res.messageResult.ErrorMessage)
           }
        }).catch(e=>{
           console.log(e)
           Toast.hide()
           Toast.fail('error', 1);
        })
    }
    //表单重置
    reset(){
        this.setState({
            scanDataDealBarCode:null
        })
    }
    clearForm(){
        this.reset()
        this.getOrderId()
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
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
   
}

const mapStateToProps = (state) => {
	return state
}
const mapDispatchtoProps = (dispatch) => {
	return {
        recipienStateActions:bindActionCreators(wmsAction,dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(SparesRece)

