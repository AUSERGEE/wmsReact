import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex,Drawer} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import ReturnChoose from '../../components/Common/spReturnChoose'

class Prepare extends Component {
    constructor(props) {
          super(props)
          this.state = {
              prepareData:null,
              activeTrIndex:null,
              spPrompt:true,
              spcode:''
          }
    }
        
   render() {
     const alert = Modal.alert;
      return (
         <div>
            {<NavBar mode="dark" className="fixHeader"
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   异动
            </NavBar> }
            <div style={{height:'45px'}}></div>
            <div className="wmsTb_wrap">
               <div className="wmsTb x-border prepareTb_w_set">
                    <div className="tbHeader">
                            <div className="">id</div>
                            <div className="tb_w_sub">物料</div>
                            <div className="">仓位</div>
                            <div>储位</div>
                            <div>供应商</div>
                            <div>出入库</div>
                            <div>备料数量</div>
                            <div>仓管员</div>
                    </div>
                    <div className="wmsTb_Tbody">
                    {
                        this.state.prepareData
                        ?(  this.state.prepareData.map((item,index)=>{
                                return (
                                    <div key={index} 
                                         data-orderid={item['id']}
                                         onClick={this.activeTr.bind(this,index)}
                                         className={`tb_tr ${this.state.activeTrIndex===index?'active':''}`}
                                    >
                                        <div className="tb_td">{item['id']}</div>
                                        <div className="tb_td tb_w_sub">{item['物料']}</div>
                                        <div className="tb_td">{item['仓位']}</div>
                                        <div className="tb_td">{item['储位']}</div>
                                        <div className="tb_td">{item['供应商']}</div>
                                        <div className="tb_td">{item['出入库']}</div>
                                        <div className="tb_td">{item['备料数量']}</div>
                                        <div className="tb_td">{item['仓管员']}</div>
                                    </div>
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
            <div style={{height:'80px'}}></div>
            <div className="bottomBar">
               <div className="btnGroup">
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ width:'100%'}} 
                           onClick={()=>{this.pcScanCode()}}
                        >
                             模拟扫码</Button>
                        ):(<Button type="primary" inline style={{ width:'100%'}} 
                            
                           >扫码</Button>
                        )
                   }
                </div>
             </div>
             <Modal //
                visible={this.state.spPrompt}
                transparent
                maskClosable={false}
                title="扫描储位"
                footer={[{ text: '取消', onPress: () => { 
                               this.onClose('spPrompt')();
                        }},{ text: '确定', onPress: () => { 
                              
                               this.onClose('spPrompt')();  
                        }}]}
	         >
		          <div className="am-modal-input-container">
                     <div className="am-modal-input">
                        <input type="text" placeholder="点击此处扫描储位" id="confirmNum" ref="confirmNumInput" value={this.state.spcode}
                          onClick={()=>{
                                process.env.NODE_ENV !== 'production'
                                ?this.pcScanSpCode()
                                :this.scanSpCode()
                          }}
                          />
                     </div>
		          </div>
	         </Modal>
         </div>
      )
   }
  
   componentDidMount(){
      this.getConfig()  //初始化微信扫码接口调用
      this.getData()  //请求数据
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
        let result='40017646_&_47FY-A10450-0100_&_GH052_&_*_&_*_&_*_&_1080000_&_2017-01-19'; //'32178156_&_0604-000000-01_&_MS011_&_100PCS_&_BLANK LABEL_&_1_&_100PCS_&_2017-07-20' 
        let barCode=result.replace(/&/g,'%26')
        this.spcode=barCode;
     }
     
     getData(){
        let self=this,
            userCode=this.props.userState.user;
        Toast.loading('loading...',0);
        axios.get(`http://wmspda.skyworthdigital.com:9001/webapi/api/MoveAction/getPrepareDataGrid?`
            +`userCode=${userCode}`
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log(res,110);
            if(res.messageResult.IsSuccess){
                this.setState({
                    prepareData:JSON.parse(res.sResultJsonStr)
                })
                console.log(this.state.prepareData,111);
            }else{
                self.openModal(res.ErrorMessage);
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
        })
     }
     activeTr(index){
        if(index===this.state.activeTrIndex){
            this.setState({
                activeTrIndex:-1
            })
        }else{
            this.setState({
                activeTrIndex:index
            })
        }
        
    }

    //pc端调试-模拟扫描储位码 -
    pcScanSpCode(){
        this.setState({
            spcode:'IA09-1-3-4'
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
                    self.scanDataDealCode(result,2)
                }
            });
 
        }
        
    }
    //根据扫描到的码请求数据
    scanDataDealCode(barCode,scanStatus){
        Toast.loading('loading...',0);
        let prepareId=this.state.prepareData[this.state.activeTrIndex].id;
        let selt=this;
        let url=`http://wmspda.skyworthdigital.com:9001/webApi/api/MoveAction/scanDataDealBarCode?`
                +`prepareId=${prepareId}&barCode=${barCode}`
                +`&scanStatus=${scanStatus}`
        axios.get(url
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            if(scanStatus==1){
                console.log(res,222111111);
                
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
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
    preSpPrompt(){
        this.setState({
             prompt:true,
             confirmNumInput:this.state.confirmNumInput==0?this.state.confirmReturNum:this.state.confirmNumInput
        });
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
export default connect(mapStateToProps,mapDispatchtoProps)(Prepare)
