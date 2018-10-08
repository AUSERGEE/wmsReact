import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import MOdtl from '../../containers/MO-picking/MO-dtl'
import MOitemDtl from '../../containers/MO-picking/MO-itemDtl'
import {
    Route,
    Switch
  } from 'react-router-dom'
import { isNull } from 'util';

class MOpicking extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         modal1:false,
         pickerValue:[],
         tableArr:[],
         lineData:[],
         lineDataLen:0,
         materialData:[],
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
                   MO领料
            </NavBar>
            <WhiteSpace/>
            <List >
                {
                  
                    <Picker data={this.state.lineData} cols={1}  className="forss" 
                            
                            onOk={(v) => {
                                this.pickCallback(v).then(()=>{
                                    //异步操作，使线体先保存，后取
                                    this.getSendingMaterial()
                                })
                            }} 
                            value={this.props.recipienState.moPickerArr}>
                        <List.Item arrow="horizontal">选择线体</List.Item>
                    </Picker>
                  

                }
                
            </List>
            <div className="flexTbWarp">
               <div className="wmsTb x-border">
                   <Flex className="tbHeader">
                        <Flex.Item className="flex2">物料号</Flex.Item>
                        <Flex.Item>未发数量</Flex.Item>
                        <Flex.Item>扫描数量</Flex.Item>
                    </Flex>
                    <div className="wmsTb_Tbody">
                    {
                        this.state.materialData.length>0
                        ?(  this.state.materialData.map((item,index)=>{
                                return (
                                    <Flex className="tb_tr" key={index}
                                          onClick={this.activeTr.bind(this,item)}
                                    >
                                        <Flex.Item className="flex2">{item['物料号']}</Flex.Item>
                                        <Flex.Item>{item['未发数量']}</Flex.Item>
                                        <Flex.Item>{item['扫描数量']}</Flex.Item>
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
                   
                   <Button type="primary" inline style={{ margin: '0 auto',marginRight: '2%',width:'49%'}} 
                           onClick={()=>{
                               console.log(this.state.lineData,'232')
                               if(!this.props.recipienState.moPickerArr[0]){
                                  this.openModal('请选择线体')
                                  return
                               }
                               this.props.history.push(`/MOpicking/MOdtl/${this.props.recipienState.moPickerArr[0]}`)}  
                           } >领料查看</Button>

                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ width:'49%'}} 
                             onClick={()=>{this.pcScanCode()}} >
                             模拟扫码</Button>
                        ):(<Button type="primary" inline style={{ width:'49%'}} 
                                   onClick={this.scanQrCode.bind(this)}
                           >扫码</Button>
                        )
                   }
                  
                </div>
             </div>
             <Route path='/MOpicking/MOdtl/:line' exact component={MOdtl}/>
             <Route path='/MOpicking/MOitemDtl' exact component={MOitemDtl}/>
        </div>
      )
    }
    componentDidMount(){
       this.GetDataByLine()
       this.getConfig()
    }
    
    componentWillReceiveProps(nextProps){
        if (nextProps.location.pathname== "/MOpicking"&&this.props.recipienState.moPickerArr[0]) {
            this.getSendingMaterial()
            //console.log(nextProps,101)
        } 
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
    GetDataByLine(){
        var lineData=[]
        var self=this
        this.getMaterialLineData().then((res)=>{
            if(res.messageResult.IsSuccess){
                if(res.sResultJsonStr==""){
                    self.openModal('暂无MO领料')
                    return 
                }
                let lineArr=JSON.parse(res.sResultJsonStr)
                
                //[{'线体':22},{'线体':23}]
                lineArr.forEach((item,index)=>{
                    lineData.push({label:item['线体'],value:item['线体']})
                })
                this.setState({
                    lineData:lineData
                })
                console.log(this.state.lineData)
                console.log(this.state.lineData.length)
            }else{
                Toast.fail('获取线体失败', 1)
            }

       })

    }
    //获取线体可选择内容
    getMaterialLineData() {
        return new Promise((resolve, reject) => {
            Toast.loading('loading...',0)
            let userCode=this.props.userState.user
            //let userCode='a1'
            axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/getAllSendingMaterialLineByuserCode?userCode=${userCode}`).then((res)=>{
                return res.data
            }).then(res => {
                Toast.hide()
                resolve(res)
                
            }).catch(e=>{
                reject(e)
            })

        })
        
    }
    //由用户选择的线体获取对应的数据
    getSendingMaterial() {
        let userCode=this.props.userState.user
        Toast.loading('loading...',0)
        console.log(this.props.recipienState.moPickerArr)
        let baseUrl='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/getSendingMaterialByuserCodeAndLine?'
        axios.get(`${baseUrl}userCode=${userCode}&line=${this.props.recipienState.moPickerArr[0]}`).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            this.setState({
                materialData:JSON.parse(res.sResultJsonStr)
            })
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('获取线体错误', 1);
        })
    }

    //pc端调试-模拟手机端扫码效果
    pcScanCode(){
        let barcode='40017771_&_474R-G57190-0060_&_WH025_&_15000_&_IC MC74HC125ADR2G_&_1_&_15000_&_2017-3-6'
        
        this.searchBarcode(barcode)
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
                 self.searchBarcode(result)
             }
         });
 
        }
    }
    searchBarcode(barcode){
        let secondStr=barcode.split('_&_')[1]
        console.log(secondStr)
        let self=this
        let ifFind=false
        this.state.materialData.map((item,index)=>{
            if(item['物料号']==secondStr){
                ifFind=true
                self.activeTr(item)
                
            }
        })
        if(!ifFind){
            Toast.fail('没有对应选项', 2);
        }
    }
    pickCallback (v){
        //this.setState({pickerValue:v})
        this.props.recipienStateActions.recipienState({
            moPickerArr:v
        })
        return Promise.resolve()
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
        })
    }
    activeTr(trItem){
        console.log(trItem,200000)
        this.props.history.push({
            pathname:'/MOpicking/MOitemDtl',
            query:{
              line:this.props.recipienState.moPickerArr[0],
              materialCode:trItem['物料号']
            }
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
const seasons = [
      {
        label: '2013',
        value: '2013',
      },
      {
        label: '2014',
        value: '2014',
      }
]

const mapStateToProps = (state) => {
	return state
}
const mapDispatchtoProps = (dispatch) => {
	return {
        recipienStateActions:bindActionCreators(wmsAction,dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(MOpicking)
