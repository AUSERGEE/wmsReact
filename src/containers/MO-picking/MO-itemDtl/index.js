import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker} from 'antd-mobile'
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
         barCode:''
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
            <div className="wmsTb_wrap">
               <div className="wmsTb x-border">
                    <div className="tbHeader">
                            <div className="tb_w_sub">收货单号</div>
                            <div className="tb_w_sub">物料号</div>
                            <div className="tb_w_sub">批次号</div>
                            <div>数量</div>
                            <div>储位</div>
                    </div>
                    <div className="wmsTb_Tbody">
                    {
                        this.state.tableArr.length>0
                        ?(  this.state.tableArr.map((item,index)=>{
                                return (
                                    <div key={index} 
                                         onClick={this.activeTr.bind(this,index)}
                                         data-orderid={item['收货单号']}
                                         className={`tb_tr ${this.state.activeTrIndex===index?'active':''}`}
                                    >
                                        <div className="tb_td tb_w_sub">{item['收货单号']}</div>
                                        <div className="tb_td tb_w_sub">{item['物料号']}</div>
                                        <div className="tb_td tb_w_sub">{item['批次号']}</div>
                                        <div className="tb_td">{item['数量']}</div>
                                        <div className="tb_td">{item['储位']}</div>
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

            <div className="bottomBar">
               <div className="btnGroup">
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} 
                       onClick={()=>{this.pcScanCode()}} >模拟扫码</Button>)
                       :(<Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} 
                       onClick={()=>{}} >扫码</Button>)
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
        let result='32178156_&_0604-000000-01_&_MS011_&_100PCS_&_BLANK LABEL_&_1_&_100PCS_&_2017-07-20'
        let barCode=result.replace(/&/g,'%26')
        this.scanDataDealCode(barCode)
        this.setState({
            barCode:barCode
        }) 
    }

    //根据扫码结果获取数据
    scanDataDealCode(barCode){
        Toast.loading('loading...',0)
        axios.get(`XXXXX：：：：http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/scanDataDealBarCode?barCode=${barCode}`
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
