import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {getWxConfig,afun} from '../../util/wxConfig'
import * as tools from '../../util/tools'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import qs from 'qs'
class RecipienCheckout extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         recipienNum:'',
         scanProblem:'',
         num:'',
         storage:'',
         PO:'',
         meterial:'',
         prompt:false,
         listReceivingNumber:[],
         resultId:null,
         chooseOrderIndex:0,
         afterChoose:false,
         barCode:'',
         alertMsg:{text:'',modal1:false},
         ReceivementDetail:'',
         OldCheckResult:'',
         scanStatus:1,
         CheckResult:''
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
                   来料检验
            </NavBar>
            <WhiteSpace/>
            <List >
              <InputItem
                 editable={false}
                 value={this.state.recipienNum}
              >收货号</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.scanProblem}
                 onClick={this.scanQrCodeByInput.bind(this)}
              >扫描不良</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.num}
              >数量</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.storage}
              >储位</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.PO}
              >PO
              </InputItem>
              <InputItem
                  editable={false}
                  value={this.state.meterial}
              >物料</InputItem>
             </List>
             <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} onClick={this.saveData.bind(this)}>确认</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} onClick={this.reset.bind(this)} >清除</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?<Button type="primary" inline style={{ width:'32%'}} onClick={this.pcScanCode.bind(this)}>模拟扫码</Button>
                       :<Button type="primary" inline style={{ width:'32%'}} onClick={this.scanQrCode.bind(this)}>扫码</Button>
                   }
                   
                </div>
             </div>
             <Modal
                visible={this.state.prompt}
                transparent
                maskClosable={false}
                title="请选择收货单号:"
                footer={[{ text: '确定', onPress: () => { 
                              this.setState({
                                  prompt:false
                              })  
                              this.getFormInfo()
                              if(this.state.resultId>100) {        }
                              this.setState({afterChoose:true})
                              
                        } }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
              >
                   <div>
                      <ul className="chooseOrderList">
                      {
                         this.state.listReceivingNumber.map((item,index)=>{
                            return <li key={index}  data-index={index}
                                       className={`chooseOrderItem ${(this.state.chooseOrderIndex)==index?'active':''}`}
                                       onClick={(e)=>{ 
                                           this.setState({chooseOrderIndex:e.target.dataset.index})
                                           
                                       }}
                                   >
                                       <span className="order_checkIc">
                                          <Icon type='check' />
                                       </span>
                                       {item}
                                   </li>
                         })

                      }
                      </ul>
                      
                   </div>
              </Modal>
              <Modal
                    visible={this.state.afterChoose}
                    transparent
                    maskClosable={false}
                    title="请选择检验状态:"
                   
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                    >
                    <div>
                        <List >
                                {
                                    ['宽收或特采','改判','取消'].map((item,index)=>{
                                        return <List.Item className={'btnListItem'} key={index}
                                                          onClick={()=>{
                                                             this.getResultState(index)
                                                             this.setState({
                                                                afterChoose:false
                                                             })
                                                          }}
                                                >
                                                    {item}
                                                </List.Item>
                                    })
                                }
                        </List>
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
      let result='32176790_&_4500-783152-0S00_&_JS068_&_3000_&_783152_%26_*_&_60000_&_2017-03-17'
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
        this.setState({
            chooseOrderIndex:0
        })
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
    //扫描不良
    scanQrCodeByInput(event){
        Toast.loading('loading...',0)
        let self=this
        this.setState({
            scanStatus:2
        })
        if(!this.state.ifWxConfigReady){
            return false
        }else{
         wx.scanQRCode({
             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
             scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
             success: function (res) {
                 Toast.hide()
                 var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                 console.log("扫描不良结果："+result)
                 self.setState({
                    scanProblem:result
                 })
             }
         });
 
        }
    }
    //根据扫码结果获取收货单号数组
    scanDataDealCode(barCode){
       Toast.loading('loading...',0)
       axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMaterialCheck/scanDataDealBarCode?barCode=${barCode}&scanStatus=1`
       ).then((res)=>{
           return res.data
        }).then(res => {
           Toast.hide()
           console.log(res)
           this.setState({
             listReceivingNumber:res.ListReceivingNumber,
             resultId:res.messageResult.ResultId,
             prompt:true
           })
        }).catch(e=>{
           console.log(e)
           Toast.hide()
           Toast.fail('error', 1);
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
           let receiveDtl=res.ReceivementDetail
           this.setState({
              recipienNum:receiveDtl.ReceivingNumber,
              num:receiveDtl.ReceivingQuantity,
              storage:receiveDtl.spCode,
              PO:receiveDtl.PO,
              meterial:receiveDtl.MaterialCode,
              CheckResult:receiveDtl.CheckResult,
              ReceivementDetail:receiveDtl
           })
        }).catch(e=>{
           console.log(e)
           Toast.hide()
            Toast.fail('error', 1);
        })
    }
    //
    getResultState(checkState){
       if(checkState==0){
           this.reset()
       }else{
            Toast.loading('loading...',0)
            axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMaterialCheck/getReceiveingResultState?checkState=${checkState}&CheckResult=${this.state.CheckResult}
            `
            ).then((res)=>{
              return res.data
            }).then(res => {
               Toast.hide()
               this.setState({
                 OldCheckResult:res.OldCheckResult
               })
               if(res.messageResult.IsSuccess){
                   this.openModal('操作成功')
               }else{
                   this.openModal(res.messageResult.ErrorMessage)
               }
            }).catch(e=>{
              Toast.hide()
              console.log(e)
              Toast.fail('error', 1);
            })
        }
    }

    //表单重置
    reset(){
        this.setState({
            recipienNum:'',
            num:'',
            storage:'',
            PO:'',
            meterial:'',
            CheckResult:''
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
    saveData() {
        Toast.loading('loading...',0)
        let QRCode=this.state.ReceivementDetail.QRCode.replace(/&/g,'%26')
        let url =`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMaterialCheck/saveReceivingCheckData?`
        +`receivingNumber=${this.state.recipienNum}&po=${this.state.PO}&qrCode=${QRCode}`
        +`&rceivingItemNo=${this.state.ReceivementDetail.ReceivingItemNo}&checkResult=${this.state.CheckResult}`
        +`&materialCode=${this.state.ReceivementDetail.MaterialCode}&receivedQuantity=${this.state.ReceivementDetail.ReceivedQuantity}`
        +`&spCode=${this.state.ReceivementDetail.spCode}&oldCheckResult=${this.state.OldCheckResult}`
        +`&scanStatus=${this.state.scanStatus}&userCode=${this.props.userState.user}`
        
        console.log("确认操作提交的链接："+url)
        axios.get(url
            ).then((res)=>{
              return res.data
            }).then(res => {
               Toast.hide()
               console.log(res)
               if(res.IsSuccess){
                 this.openModal(res.ErrorMessage)
                 this.reset()
               }else{
                 this.openModal(res.ErrorMessage)
               }
            }).catch(e=>{
              Toast.hide()
              console.log(e)
              Toast.fail('error', 1);
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
export default connect(mapStateToProps,mapDispatchtoProps)(RecipienCheckout)
