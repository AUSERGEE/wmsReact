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
         tableArr:[]
   	  }
   }
   
   render() {
      return (
      	<div className="subPage">
            <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   领料查看
            </NavBar>
            <WhiteSpace/>
            <div className="flexTbWarp">
               <div className="wmsTb x-border">
                   <Flex className="tbHeader">
                        <Flex.Item>扫描汇总数量</Flex.Item>
                        <Flex.Item>线体</Flex.Item>
                        <Flex.Item className="flex2">物料</Flex.Item>
                    </Flex>
                    <div className="wmsTb_Tbody">
                    {
                        this.state.tableArr.length>0
                        ?(  this.state.tableArr.map((item,index)=>{
                                return (
                                    <Flex className="tb_tr" key={index} >
                                        <Flex.Item>{item['扫描汇总数量']}</Flex.Item>
                                        <Flex.Item>{item['线体']}</Flex.Item>
                                        <Flex.Item className="flex2">{item['物料']}</Flex.Item>
                                    </Flex>
                                )
                            })
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
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>{this.sendMaterial()}}
                   >发料</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                           onClick={()=>{ this.clearMoReceive()}}          
                   >清除</Button>
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
       this.getPicking()
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
    getPicking(){
        let userCode=this.props.userState.user
        //let userCode='a1'
        let line=this.props.match.params.line
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/getPickingToView?`+
                   `userCode=${userCode}&line=${line}`).then((res)=>{
            return res.data
        }).then(res => {
            console.log(res)
            if(res.messageResult.IsSuccess){
                this.setState({
                    tableArr:JSON.parse(res.sResultJsonStr)
                })
            }
            
        }).catch(e=>{
            //console.log(e)
            Toast.hide()
            Toast.fail('error', 1)
        })
    }

    //pc端调试-模拟手机端扫码效果
    pcScanCode(){
        let result='40017771_&_471U-M74120-0140_&_WH025_&_15000_&_IC MC74HC125ADR2G_&_1_&_15000_&_2017-3-6'
        let barCode=result.replace(/&/g,'%26')
        this.scanDataDealCode(barCode)
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
                 Toast.hide()
                 var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
                 console.log("扫描结果："+result)
                 let barCode=result.replace(/&/g,'%26')
                 self.scanDataDealCode(barCode)
             }
         });
 
        }
    }
    //根据扫码结果获取数据
    scanDataDealCode(barCode){
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        //let userCode='a1'
        let line=this.props.match.params.line
        //let line='YJ'
        console.log(this.props.match.params.line,'params.line')
        
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/scanOneDataDealBarCode`
             +`?barcode=${barCode}&userCode=${userCode}&line=${line}`
        ).then((res)=>{
            return res.data
            }).then(res => {
                Toast.hide()
                console.log(res)


                if(res.sResultJsonStr!=""){
                    let aTableArr=[]
                    let sResultArr=JSON.parse(res.sResultJsonStr)
                    let arrItem={
                        '扫描汇总数量':sResultArr[0]['未领数量'],
                        '线体':this.props.match.params.line,
                        '物料':sResultArr[0]['MaterialCode']
                    }
                    aTableArr.push(arrItem)
                    console.log(aTableArr)
                    this.setState({
                        tableArr:aTableArr
                    })
                }else{
                    Toast.info("sResultJsonStr为空",1.6)
                }
            }).catch(e=>{
                console.log(e)
                Toast.hide()
                Toast.fail('error', 1);
            })
    }
    //clear
    clearMoReceive() {
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        //let userCode='a1'
        let line=this.props.match.params.line
        //let line='YJ'
        
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/clearDeleteMoReceiveDetailtemp?`
              +`userCode=${userCode}&line=${line}`
        ).then((res)=>{
            return res.data
            }).then(res => {
                Toast.hide()
                console.log(res)
                if(res.messageResult.IsSuccess){
                    if(res.sResultJsonStr==""){
                        this.setState({
                            tableArr:[]
                        }) 
                        Toast.info('清除成功',1.6)
                    }
                }else{
                    Toast.fail('error', 1)
                }
            }).catch(e=>{
                console.log(e)
                Toast.hide()
                Toast.fail('error', 1);
            })
    }
    
    //发料
    sendMaterial(){
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        //let userCode='a1'
        let line=this.props.match.params.line
        //let line='YJ'
        
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/sendingOutMoMaterial?`	
                 +`userCode=${userCode}&line=${line}`
        ).then((res)=>{
            return res.data
            }).then(res => {
                Toast.hide()
                console.log(res)
                if(res.messageResult.IsSuccess){
                    Toast.info(res.messageResult.Message, 1.6)
                }else{
                    Toast.info(res.messageResult.ErrorMessage, 1.6)
                }
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
