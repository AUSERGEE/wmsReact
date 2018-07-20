import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker,Flex,Drawer} from 'antd-mobile'
import wx from 'weixin-js-sdk'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import WmsAlert from '../../components/Common/wmsAlert'
import axios from 'axios'
import ReturnChoose from '../../components/Common/spReturnChoose'

class Inventory extends Component {
    constructor(props) {
          super(props)
          this.state = {
              material:'',
              supplier:'',
              space:'',  //仓位
              spCode:'',  //储位
              comfirmNum:'', //确认数量
              confirmNumInput:'', //输入框的临时确认数量
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
                   盘点
            </NavBar> }
            <WhiteSpace/>
            <List>
              <InputItem
                 editable={false}
                 value={this.state.material}
              >物料</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.supplier}
              >供应商</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.space}
              >仓位</InputItem>
              <InputItem
                 editable={false}
                 value={this.state.spCode}
                 onClick={()=>{
                    process.env.NODE_ENV !== 'production'
                    ?this.scanDataSpCode('IA09-1-3-4')
                    :this.scanSpCode()
                   }
                 }
              >储位</InputItem>
              <InputItem
                 editable={true}
                 value={this.state.comfirmNum}
                 onClick={this.wmsPrompt.bind(this)}
              >确认数量</InputItem>
            </List>
       
            <div className="bottomBar">
               <div className="btnGroup">
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                     
                   >确定</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} 
                         
                   >取消</Button>
                   {
                       process.env.NODE_ENV !== 'production'
                       ?(<Button type="primary" inline style={{ width:'32%'}} 
                           onClick={()=>{this.pcScanCode()}}
                        >
                             模拟扫码</Button>
                        ):(<Button type="primary" inline style={{ width:'32%'}} 
                              
                           >扫码</Button>
                        )
                   }
                </div>
             </div>
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
                                    comfirmNum:this.state.confirmNumInput
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

     //根据扫描到的码请求数据
     scanDataDealCode(barCode,scanStatus){
        Toast.loading('loading...',0);
        let url='';
        let selt=this;
        if(scanStatus==1){
            url=`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAInventoryMaterital/scanDataDealBarCode?`
            +`barCode=${barCode}&scanStatus=${scanStatus}`
        }
        axios.get(url
        ).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            if(scanStatus==1){
                console.log(res);
                Toast.info('数据读取成功', 1);
                if(res.messageResult.IsSuccess){
                    selt.setState({
                        material:res.inventoryCheckDetail.MaterialCode,
                        supplier:res.inventoryCheckDetail.SupplierCode,
                        space:res.inventoryCheckDetail.storehouseCode,  
                        spCode:res.inventoryCheckDetail.storehouseCode,  
                        comfirmNum:res.inventoryCheckDetail.Quantity
                    })
                }
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('请求数据失败', 1);
        })
    }

    //扫描储位的码--后台判断是否存在，存在的话就填上
    scanDataSpCode(spCode){
        let self=this,
            scanStatus=2,
            materialCode=this.state.material,
            supplierCode=this.state.supplier
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAInventoryMaterital/scanDataDealBarCode?`
              +`barCode=${spCode}&scanStatus=${scanStatus}`
              +`&materialCode=${materialCode}&supplierCode=${supplierCode}`
        ).then((res)=>{
            return res.data
         }).then(res => {
             console.log(res);
            if(res.messageResult.IsSuccess){
                this.setState({
                    spCode:spCode
                })
                Toast.info('储位扫描完成',1)
            }else{
                self.openModal(res.ErrorMessage);
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
    wmsPrompt(){
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
    closeAlert(){
        this.setState({
            alertMsg:{text:'',modal1:false}
        })
    }
    reset(){
        this.setState({
            material:'',
              supplier:'',
              space:'',  
              spCode:'',  
              comfirmNum:'' 
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
export default connect(mapStateToProps,mapDispatchtoProps)(Inventory)