import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal} from 'antd-mobile'
import axios from 'axios'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../../actions/wmsState'
class RecipienConfirm extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
        GiftsGRNDetailList:null,
        activeTrIndex:-1
   	  }
   }
   
   render() {
      return (
      	<div className="recipienConfirm" style={style.pageinit}>
           <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   收货查看
           </NavBar>
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
                        this.state.GiftsGRNDetailList
                        ?(  this.state.GiftsGRNDetailList.map((item,index)=>{
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
                   <Button type="primary" inline style={{ marginRight: '2%',width:'49%'}} onClick={this.recpienConfirm.bind(this)}>收货</Button>
                   <Button type="primary" inline style={{ width:'49%'}} onClick={this.clearTr.bind(this)}>清除</Button>
                </div>
            </div>
        </div>
      )
    }
    componentDidMount(){
        this.GetGiftsGRNDetailList()
        console.log(this.props.children)
    }
    GetGiftsGRNDetailList() {
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        let userScanerID=this.props.userState.User_ScanerID
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/GetGiftsGRNDetailList?userCode=${userCode}&userScanerID=${userScanerID}`).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log(res)
            if(res.messageResult.IsSuccess){
                this.setState({
                    GiftsGRNDetailList:res.sResultJsonStr==""?"":JSON.parse(res.sResultJsonStr)
                })
            }
            
            console.log('AAA'+this.state.GiftsGRNDetailList)
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('GetGiftsGRNDetailList:error', 1)
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
    clearTr() {
        if(this.state.activeTrIndex==-1){
            Toast.fail('请选择要清除的收货单', 1.4)
            return
        }

        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        let receivingNumber=this.state.GiftsGRNDetailList[this.state.activeTrIndex]['收货单号']
        let baseUrl='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/clearGiftsGRNDetail?'
        axios.get(`${baseUrl}receivingNumber=${receivingNumber}&userCode=${userCode}`)
        .then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            Toast.info('清除成功',1, null, true)
            this.setState({
                GiftsGRNDetailList:res.sResultJsonStr==""?"":JSON.parse(res.sResultJsonStr)
            })
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('clearTr:error', 1)
        })

    }
    //确认收货
    recpienConfirm() {
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        let baseUrl='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAGiftsReceiving/SaveReceiveingData?'
        axios.get(`${baseUrl}userCode=${userCode}`)
        .then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            if(res.messageResult.IsSuccess){
                Toast.info(res.messageResult.Message,1, null, true)
                this.setState({
                    GiftsGRNDetailList:res.sResultJsonStr==""?"":JSON.parse(res.sResultJsonStr)
                })
                this.getOrderId()
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('recpienConfirm:error', 1)
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
 
   
}
const style = {
   pageinit:{
     position:'fixed',
     top:'0',
     left:'0',
     right:'0',
     bottom:'0',
     background:'#FFF',
     zIndex:9
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
export default connect(mapStateToProps,mapDispatchtoProps)(RecipienConfirm)
