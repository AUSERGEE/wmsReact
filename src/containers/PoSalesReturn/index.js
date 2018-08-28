import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex,Drawer} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import ChooseTb from '../../components/Common/tableChoose'
class PoSalesReturn extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         alertMsg:{text:'',modal1:false},
         PickingQuantity:'',
         PO:'',
         storage:'',
         confirmPickingQuantity:'',
         reason:'',
         headerTxt:'',
         receiveStatus:'',
         open:false,
         poScanData:null,
         ChooseTbOpen:false,
         prompt:false,
         confirmNumInput:'',
         receivementDetail:null,
         returnXm:'',
         factory:'',
         storehouseCode:'',
         unit:'',
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
                   PO退料
            </NavBar> }
            <WhiteSpace/>
            <List>
              <InputItem
                 editable={false}
                 value={this.state.PickingQuantity}
              >退料数量</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.PO}
              >PO</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.storage}
                 onClick={()=>{
                    process.env.NODE_ENV !== 'production'
                    ?this.scanDataSpCode('IA09-1-3-4')
                    :this.scanSpCode()
                   }
                 }
              >储位</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.confirmPickingQuantity}
                 onClick={this.wmsPrompt.bind(this)}
              >确认退料数量</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.reason}
                 onChange={val=>this.setState({reason:val})}
              >移动原因</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.headerTxt}
                 onChange={val=>this.setState({headerTxt:val})}
              >凭证抬头文本</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.receiveStatus==2?'不合格':this.state.receiveStatus==3?'已入库':null}
              >收货状态</InputItem>
            </List>
             {/* <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>this.saveSalesReturn()}
                   >确定</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>{this.reset()}}   
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
             </div> */}
             <div className="bottomBar">
               <div className="btnGroup">
                   <div style={{ marginRight: '0%',width:'30%'}} className="clBtn" onClick={()=>this.saveSalesReturn()}>确定</div>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?<div className="cirBtn" onClick={()=>{this.pcScanCode()}}><div className="btnBg"></div><img src={require('../../static/images/scanbtn.png')}/></div>
                       :<div className="cirBtn"  onClick={this.scanQrCode.bind(this)}><div className="btnBg"></div><img src={require('../../static/images/scanbtn.png')}/></div>
                   }
                   <div style={{ marginRight: '0%',width:'30%',float:'right'}} className="clBtn" onClick={()=>{this.reset()}}>取消</div>
                </div>
            </div>
             {
                 this.state.ChooseTbOpen?(<ChooseTb changeTbIndex={this.changeTbIndex.bind(this)}
             poData={this.state.poScanData} />):null
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
                                confirmPickingQuantity:this.state.confirmNumInput
                             })
                             this.onClose('prompt')(); 
                     } }]}
	          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
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
        let result='40017771_&_471U-M74120-0140_&_WH025_&_15000_&_IC MC74HC125ADR2G_&_1_&_15000_&_2017-3-6'
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
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAPoReturnMaterial/scanDataDealBarCode?`
             +`barCode=${barCode}&scanStatus=${scanStatus}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log(res)

            //模拟有多条数据的假数据：
            var PCTestArr=[{"PO":"XX0040017771","RBatchCode":"P17030700016","PurchaseDocNum":"00001","MaterialCode":"471U-M74120-0140","spCode":"IA02-1-3-2","Factory":"7000","storehouseCode":"NM70","Unit":"PC","ReceivingNumber":"S17030700018","ReceivingQuantity":"50000.000","ReceivingState":"3","CheckState":"1"},{"PO":"0040017771","RBatchCode":"P17030700016","PurchaseDocNum":"00001","MaterialCode":"471U-M74120-0140","spCode":"IA02-1-3-2","Factory":"7000","storehouseCode":"NM70","Unit":"PC","ReceivingNumber":"S17030700018","ReceivingQuantity":"50000.000","ReceivingState":"3","CheckState":"1"},{"PO":"0040017771333","RBatchCode":"P17030700016","PurchaseDocNum":"00001","MaterialCode":"471U-M74120-0140","spCode":"IA02-1-3-2","Factory":"7000","storehouseCode":"NM70","Unit":"PC","ReceivingNumber":"S17030700018","ReceivingQuantity":"50000.000","ReceivingState":"2","CheckState":"1"}]
            if(res.messageResult.IsSuccess){
                this.setState({
                    poScanData:JSON.parse(res.sResultJsonStr), // PCTestArr
                    receivementDetail:res.receivementDetail,
                    returnXm:res.returnXm
                })
                this.chooseItem()
            }else{
                Toast.fail('请求失败', 1);
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
                    storage:spCode
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
    chooseItem(){
        let poScanData=this.state.poScanData
        console.log(poScanData)
        if(this.state.returnXm=='X'){
            this.setState({
                PickingQuantity:receivementDetail.ReceivingQuantity,
                PO:receivementDetail.PO,
                storage:receivementDetail.spCode,
                confirmPickingQuantity:receivementDetail.ReceivingQuantity,
                receiveStatus:receivementDetail.ReceivingState,
                materialCode:receivementDetail.MaterialCode,
                factory:receivementDetail.Factory,
                storehouseCode:receivementDetail.storehouseCode,
                unit:receivementDetail.Unit,
            })
        }else{
            if(poScanData.length==1){
                this.setState({
                    PickingQuantity:poScanData[0].ReceivingQuantity,
                    PO:poScanData[0].PO,
                    storage:poScanData[0].spCode,
                    confirmPickingQuantity:poScanData[0].ReceivingQuantity,
                    receiveStatus:poScanData[0].ReceivingState,
                    materialCode:poScanData[0].MaterialCode,
                    factory:poScanData[0].Factory,
                    storehouseCode:poScanData[0].storehouseCode,
                    unit:poScanData[0].Unit,
                })
            }else{
                console.log(poScanData)
                this.setState({
                    ChooseTbOpen:true
                })
            }
        }
       
    }
    changeTbIndex(index){
        let poScanData=this.state.poScanData
        this.setState({
            ChooseTbOpen:false
        })
        this.setState({
            PickingQuantity:poScanData[index].ReceivingQuantity,
            PO:poScanData[index].PO,
            storage:poScanData[index].spCode,
            confirmPickingQuantity:poScanData[index].ReceivingQuantity,
            receiveStatus:poScanData[index].ReceivingState,
            materialCode:poScanData[index].MaterialCode,
            factory:poScanData[index].Factory,
            storehouseCode:poScanData[index].storehouseCode,
            unit:poScanData[index].Unit,
        })
    }
    saveSalesReturn(){
        let self=this
        let userCode=this.props.userState.user,
            receivementDetail=this.state.receivementDetail,
            returnXm=this.state.returnXm,
            inputQty=this.state.confirmPickingQuantity,
            mobileReason=this.state.reason,
            documentHeader=this.state.headerTxt,
            pO=this.state.PO,
            purchaseDocNum=receivementDetail.PurchaseDocNum,
            materialCode=this.state.materialCode,
            factory=this.state.factory,
            storehouseCode=this.state.storehouseCode,
            unit=this.state.unit,
            receivingNumber=this.state.PickingQuantity
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAPoReturnMaterial/SavePOReturnMaterialCodeData?`
                +`userCode=${userCode}&returnXm=${returnXm}`
                +`&inputQty=${inputQty}&mobileReason=${mobileReason}`
                +`&documentHeader=${documentHeader}&pO=${pO}`
                +`&purchaseDocNum=${purchaseDocNum}&materialCode=${materialCode}`
                +`&factory=${factory}&storehouseCode=${storehouseCode}`
                +`&unit=${unit}&receivingNumber=${receivingNumber}`
        ).then((res)=>{
            return res.data
         }).then(res => {
            if(res.messageResult.IsSuccess){
                Toast.info(res.messageResult.Message,1.4)
                this.reset()
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
              confirmNumInput:this.state.confirmNumInput==""?this.state.confirmPickingQuantity:this.state.confirmNumInput
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
    reset(){
        this.setState({
            PickingQuantity:'',
            PO:'',
            storage:'',
            confirmPickingQuantity:'',
            reason:'',
            headerTxt:'',
            receiveStatus:null,
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
export default connect(mapStateToProps,mapDispatchtoProps)(PoSalesReturn)
