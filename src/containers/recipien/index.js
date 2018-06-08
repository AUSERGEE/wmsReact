import React,{Component} from 'react'
import {Modal,NavBar,Icon,Button,List,InputItem,Checkbox,WhiteSpace,Toast} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {getWxConfig,afun} from '../../util/wxConfig'
import * as tools from '../../util/tools'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
const prompt = Modal.prompt
class Recipien extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
        checkStorge:false,
        scanCodeType:1,
        prompt:false,
        confirmNum:0,
        ifWxConfigReady:false,
        alertMsg:{text:'',modal1:false}
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
                   来料收货
            </NavBar>
            <WhiteSpace/>
            <List >
             <InputItem
                 editable={false}
                 value={this.props.recipienState.orderId}
              >收货单号</InputItem>
              <InputItem
                 editable={false}
                 value={this.props.recipienState.num}
                 onChange={val=>this.props.recipienStateActions.recipienState({num:val})}
              >确认数量</InputItem>
              <InputItem
                 value={this.props.recipienState.intitStorge}
                 onChange={val=>this.props.recipienStateActions.recipienState({intitStorge:val})}
              >默认储位</InputItem>
              <Item className="checkboxAlign">
                 <div className="checkWarp">
                    <div className="checkItem" >
                        扫描储位
                        <span className="wmsCheckBox" onClick={()=>{this.props.recipienStateActions.recipienState({checkStorge:!this.props.recipienState.checkStorge})}}>
                          {
                            this.props.recipienState.checkStorge? <i className="wms-icon-checked checkedtab"></i>:<i className="wms-icon-unChecked unCheckedtab"></i>
                          }
                        </span>
                    </div>
                    <div className="checkItem">
                        超收 
                         <span className="wmsCheckBox" onClick={()=>{
                                                            this.props.recipienState.IsSplitReceipt==0
                                                            ?this.props.recipienStateActions.recipienState({IsSplitReceipt:1})
                                                            :this.props.recipienStateActions.recipienState({IsSplitReceipt:0})
                                                       
                                                       }}>
                            {
                                this.props.recipienState.IsSplitReceipt==1?<i className="wms-icon-checked checkedtab"></i>:<i className="wms-icon-unChecked unCheckedtab"></i>
                            }
                        </span>
                    </div>
                   
                  </div>
              </Item>
              <div className="inputRightBtn">
                    <InputItem
                       editable={true}
                       value={this.props.recipienState.checkStorge?this.props.recipienState.intitStorge:this.props.recipienState.text}
                       onChange={val=>this.props.recipienStateActions.recipienState({text:val})}
                       onFocus={()=>{
                           if(!this.props.recipienState.checkStorge){
                             this.setState({scanCodeType:2})  
                             this.ScanBarCode()
                           }
                           
                       }}
                       onBlur={()=>{this.setState({scanCodeType:1})}}
                       placeholder={this.state.scanCodeType==2?'请点击扫码按钮扫描条码':''}
                       extra={<Button type="primary" size="small" id="submitForm" style={{marginTop:'-6px'}}
                                    
                       >保存</Button>}
                    ></InputItem>
              </div>
              
              <InputItem
                 editable={false}
                 value={this.props.recipienState.poVal}
                 onChange={val=>this.props.recipienStateActions.recipienState({poVal:val})}
              >PO</InputItem>
              <InputItem
                 editable={false}
                 value={this.props.recipienState.matail}
                 onChange={val=>this.props.recipienStateActions.recipienState({matail:val})}
              >物料</InputItem>
              <InputItem
                 editable={false}
                 value={this.props.recipienState.org}
                 onChange={val=>this.props.recipienStateActions.recipienState({org:val})}
              >供应商</InputItem>
            </List>
            
            <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'40%'}} onClick={()=>this.props.history.push('/RecipienDtl')}>收货查看</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'28%'}} onClick={this.reset.bind(this)}>清除</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?<Button type="primary" inline style={{ width:'28%'}} onClick={this.scanCodeFunDev.bind(this)}>模拟扫码</Button>
                       :<Button type="primary" inline style={{ width:'28%'}} onClick={this.scanCodeFun.bind(this)}>扫码</Button>
                   }
                   
                </div>
            </div>
            <Modal
	          visible={this.state.prompt}
	          transparent
	          maskClosable={false}
	          onClose={this.onClose('prompt')}
	          title="确认数量"
	          footer={[{ text: '确定', onPress: () => { 
                             if(this.state.confirmNum<1){
                                Toast.fail('数量输入错误', 2)
                                return false
                             }
                             this.props.recipienStateActions.recipienState({
                                 num:this.state.confirmNum
                             })
                             this.onClose('prompt')(); 
                     } }]}
	          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
	        >
		          <div className="am-modal-input-container">
                     <div className="am-modal-input">
                        <input type="number" id="confirmNum" ref="confirmNumInput" value={this.state.confirmNum}
                          onFocus={()=>{
                          }}
                          onChange={e=>this.handleChange('confirmNum',e.target.value)} />
                     </div>
		          </div>
	        </Modal>
        </div>
      )

   }
   
   componentDidMount(){
      //this.getAccessTokey().then((res)=>{console.log(res)})
      //this.antd_prompt()
    //    wxConfig().then((res)=>{
    //        console.log('WWWWWWWWWWW--->wxConfig():callbak')
    //    })
      //this.openModal('dsds@@')
    

      setTimeout(function(){
          console.log(this.props)
          this.getOrderId()
      }.bind(this),0)
      if(this.props.recipienState.resetRecepientForm){
        this.reset() 
        this.props.recipienStateActions.recipienState({
            resetRecepientForm:false
        })      
      }

    
      //this.getStorge('CK372')
    //    getWxConfig().then((res)=>{
    //       console.log(res)
    //    })
      this.getConfig()
      let self=this
      document.getElementById('submitForm').onclick=function(){
        self.submitForm()
      }
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
       this.scanQrCode()
   }
   scanCodeFunDev(){
      let result='32176790_&_4500-783152-0S00_&_JS068_&_3000_&_783152_%26_*_&_60000_&_2017-03-17'
      let barCode=result.replace(/&/g,'%26')
      this.getFormInfo(barCode)
   }
   getConfig() { 
        let url = location.href.split('#')[0] //获取锚点之前的链接
        this.loadingToast('loading...')
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
   getAccessTokey(){
        return axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww58877fbb525792d1&corpsecret=wvaM2aIJsDBO586imwN8Fs1vmOmR2xBGNFs4PlgzS5I'
        ,).then((res)=>{
            return res.data
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
                self.getFormInfo(barCode)
                console.log('扫的是二维码')
            }
        });

       }
     

   }
   ScanBarCode(){
        let self=this
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                console.log("扫描结果："+result);
                self.getStorge(result)
                
            }
        });
   }
   test(){
       console.log('test()')
   }
   getFormInfo(barCode){
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

      axios.get(`${url2}`).then((res)=>{
            return res.data
      }).then((res)=>{
            if(res.MessageResult.IsSuccess){
                let ReceivingQuantity=res.ReceivementDetail.ReceivingQuantity
                this.props.recipienStateActions.recipienState({
                    intitStorge:res.MaterialInfo.spCode,
                    poVal:res.ReceivementDetail.PO,
                    matail:res.ReceivementDetail.MaterialCode,
                    org:res.Receivement.SupplierCode,
                    num:ReceivingQuantity,
                    QRCode:res.ReceivementDetail.QRCode,
                    QRCodeDate:res.ReceivementDetail.QRCodeDate
                })
                this.wmsPrompt(ReceivingQuantity)
                this.refs.confirmNumInput.focus()
                this.refs.confirmNumInput.select()
                // prompt('确认数量', '请输入数量', [
                //     { text: '取消' },
                // { text: '确定', onPress: value => {
                //         this.setState({
                //             num:value
                //         })
                // } },
                // ], 'default', ReceivingQuantity)

            }else{
                Toast.fail(res.MessageResult.ErrorMessage?res.MessageResult.ErrorMessage:'error', 2);
            }
            
      }).catch((e)=>{
         Toast.fail('扫码解析请求遇到了错误:001', 2);
      })

   }
   getOrderId(){
       let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetOrCreateReceiveNumber'
       let userCode=this.props.userState.user
       axios.get(url+`?userCode=${userCode}`).then((res)=>{
           return res.data
       }).then((res)=>{
           console.log(res)
           this.props.recipienStateActions.recipienState({
               orderId:res.ReceivingNumber,
               cSupplierCode:res.SupplierCode,
               supplierName:res.SupplierName
           })
       })
   }
   getStorge(ScanDataDealSpCode){
       let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/ScanDataDealSpCode'
       axios.get(url+`?barCode=${ScanDataDealSpCode}&checkreceive=false&ScanStatus=1`).then((res)=>{
           return res.data
       }).then((res)=>{
           
           if(res.MessageResult.IsSuccess){

               console.log(res)
               this.props.recipienStateActions.recipienState({
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
    wmsPrompt(initNum){
       this.setState({
          prompt:true,
          confirmNum:initNum
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
    
    submitForm() {
       Toast.loading('正在保存...',0)
       let url='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/SaveReceivingData'
       let formData={
          ReceivingNumber:this.props.recipienState.orderId,
          po:this.props.recipienState.poVal,
          materialCode:this.props.recipienState.matail,
          SupplierCode:this.props.recipienState.cSupplierCode?this.props.recipienState.cSupplierCode:this.props.recipienState.org,
          isNewReceiveNumber:false,
          IsSplitReceipt:this.props.recipienState.IsSplitReceipt,
          userCode:this.props.userState.user,
          receivingQuantity:this.props.recipienState.num,
          spCode:this.props.recipienState.intitStorge,
          QRCode:(this.props.recipienState.QRCode).replace(/&/g,'%26'),
          QRCodeDate:this.props.recipienState.QRCodeDate
       }
       let urlData=`?ReceivingNumber=${formData.ReceivingNumber}&receivingQuantity=${formData.receivingQuantity}&po=${formData.po}&materialCode=${formData.materialCode}&SupplierCode=${formData.SupplierCode}&spCode=${formData.spCode}&isNewReceiveNumber=${formData.isNewReceiveNumber}&IsSplitReceipt=${formData.IsSplitReceipt}&QRCode=${formData.QRCode}&QRCodeDate=${formData.QRCodeDate}&userCode=${formData.userCode}`
       console.log(this.props.recipienState)
       console.log(formData)
       console.log(url+urlData)
       axios.get(url+urlData).then((res)=>{
           return res.data
       }).then((res)=>{
           console.log(res)
           if(res.IsSuccess){
               Toast.hide()
               this.openModal('保存成功')
           }else{
               Toast.hide()
               this.openModal(res.ErrorMessage)
           }
       }).catch((e)=>{
            Toast.fail('error', 2);
       })
    }
    reset(){
        this.props.recipienStateActions.recipienState({
            intitStorge:null,
            poVal:'',
            matail:'',
            org:'',
            num:null,
            checkStorge:false,
            IsSplitReceipt:0
        })
        this.getOrderId()
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

const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;
const mapStateToProps = (state) => {
	return state
}
const mapDispatchtoProps = (dispatch) => {
	return {
        recipienStateActions:bindActionCreators(wmsAction,dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(Recipien)
