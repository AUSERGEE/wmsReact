import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../../actions/wmsState'
import WmsAlert from '../../../components/Common/wmsAlert'
import axios from 'axios'
class MOdtl extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         modal1:false,
         tableArr:[],
         barCode:'',
         prompt:false,
         confirmNum:0,
         scanTwoData:null
   	  }
   }

   render() {
      return (
      	<div className="subPage">
            <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   MO-数据行
            </NavBar>
            <WhiteSpace/>
            <List >
              <InputItem
                 editable={false}
                 value={this.props.location.query.line}
              >线体</InputItem>
              <InputItem
                 editable={false}
                 value={this.props.location.query.materialCode}
              >物料号</InputItem>
            </List>
            <WhiteSpace/>
            <div className="flexTbWarp">
               <div className="wmsTb x-border">
                    <Flex className="tbHeader">
                        <Flex.Item>未领数量</Flex.Item>
                        <Flex.Item>供应商</Flex.Item>
                        <Flex.Item className="flex2">条码日期</Flex.Item>
                    </Flex>
                    <div className="wmsTb_Tbody">
                    {
                        this.state.scanTwoData
                        ?(  
                            <Flex className="tb_tr">
                                <Flex.Item>{this.state.scanTwoData.sumPickingQty}</Flex.Item>
                                <Flex.Item>{this.state.scanTwoData.supplierCode}</Flex.Item>
                                <Flex.Item className="flex2">{this.state.scanTwoData.qrCodeDate}</Flex.Item>
                            </Flex>
                             
                         ):(
                                [1,2,3,4,5,6].map((item,index)=>{
                                    return (
                                        <div key={index} className='tb_tr'></div>
                                    )
                                })
                         )
                    }
                 </div>
              </div>
           </div>

            <div className="bottomBar">
               <div className="btnGroup">
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} 
                       onClick={()=>{this.pcScanCode()}} >模拟扫码</Button>)
                       :(<Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} 
                       onClick={()=>{this.scanQrCode()}} >扫码</Button>)
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
                                let data=this.state.scanTwoData
                                data.sumPickingQty=this.state.confirmNum
                                this.setState({
                                    scanTwoData:data
                                })
                                this.confirmSumPickingQty()
                                this.onClose('prompt')(); 
                        } }]}
                wrapProps={{ onTouchStart: this.onWrapTouchStart }}
	        >
		          <div className="am-modal-input-container">
                     <div className="am-modal-input">
                        <input type="number" id="confirmNum" ref="confirmNumInput" value={this.state.confirmNum}
                          onChange={e=>this.handleChange('confirmNum',e.target.value)} />
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
        let result='40015393_&_47ER-F61371-0080_&_FH044_&_*_&_*_&_*_&_20000_&_2017-2-17'
        let barCode=result.replace(/&/g,'%26')
        this.scanDataDealCode(barCode)
        this.setState({
            barCode
        }) 
    }

    //移动端扫码
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
                 self.scanDataDealCode(barCode)
                 self.setState({
                    barCode
                 })
             }
         });
        }
    }
    //根据扫码结果获取数据
    scanDataDealCode(barCode){
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        let line=this.props.location.query.line
        let materialCode=this.props.location.query.materialCode
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/scanTwoDataDealBarCode?`+
          `qrCode=${barCode}&userCode=${userCode}&line=${line}&materialCode=${materialCode}`
        ).then((res)=>{
            return res.data
            }).then(res => {
                Toast.hide()
                console.log(res)
                
                if(res.messageResult.IsSuccess){
                    this.wmsPrompt(res.sumPickingQty)
                    this.setState({
                        scanTwoData:res
                    })
                }else{
                    Toast.info(res.messageResult.ErrorMessage,1.8)
                }
                console.log(this.state.scanTwoData,'00')
            }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
            })
    }

    //确认领料数量
    confirmSumPickingQty(){
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        console.log(this.state.scanTwoData.qrCodeDate)
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/confirmSumPickingQty?`
                  +`sumPickingQty=${this.state.scanTwoData.sumPickingQty}&line=${this.props.location.query.line}`
                  +`&materialCode=${this.props.location.query.materialCode}&supplierCode=${this.state.scanTwoData.supplierCode}`
                  +`&qrCodeDate=${this.state.scanTwoData.qrCodeDate}&userCode=${userCode}&qrCode=${this.state.barCode}`
        ).then((res)=>{
            return res.data
            }).then(res => {
                Toast.hide()
                console.log(res)
                console.log(this.state.scanTwoData,'111')
                let aScanTwoData=this.state.scanTwoData
                if(res.sResultJsonStr==""){
                    this.setState({
                        scanTwoData:null
                    })
                }else{
                    let resultArr=JSON.parse(res.sResultJsonStr)
                    aScanTwoData.sumPickingQty=resultArr[0]["未领数量"]
                    aScanTwoData.supplierCode=resultArr[0]["供应商代码"]
                    aScanTwoData.qrCodeDate=resultArr[0]["条码日期"]
                    this.setState({
                        scanTwoData:aScanTwoData
                    })
                }
                
                
                
                console.log(this.state.scanTwoData,'22')
            }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1);
            })
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
        })
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
    wmsPrompt(initNum){
        this.setState({
           prompt:true,
           confirmNum:initNum
        });
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
export default connect(mapStateToProps,mapDispatchtoProps)(MOdtl)
