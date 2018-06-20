import React,{Component} from 'react'
import {NavBar,Icon,Button,List,InputItem,WhiteSpace,Toast,Modal,Picker} from 'antd-mobile'
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
class MOpicking extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         modal1:false,
         pickerValue:[],
         tableArr:[]
   	  }
   }
   
   render() {
      return (
      	<div>
            <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   MO领料
            </NavBar>
            <WhiteSpace/>
            <List >
                <Picker data={seasons} cols={1}  className="forss" onOk={v => this.setState({pickerValue:v})} value={this.state.pickerValue}>
                    <List.Item arrow="horizontal">选择线体</List.Item>
                </Picker>
            </List>
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
                   <Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} onClick={()=>{this.props.history.push('/MOpicking/MOdtl')}} >领料查看</Button>
                  
                </div>
             </div>
             <Route path='/MOpicking/MOdtl' exact component={MOdtl}/>
             <Route path='/MOpicking/MOitemDtl' exact component={MOitemDtl}/>
        </div>
      )
    }
    componentDidMount(){
       this.getMaterialLineData()
       
    }
    
    getMaterialLineData() {
        Toast.loading('loading...',0)
        let userCode=this.props.userState.user
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/getAllSendingMaterialLineByuserCode?userCode=${userCode}`).then((res)=>{
            return res.data
        }).then(res => {
            Toast.hide()
            console.log(res)
            
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('获取线体错误', 1);
        })
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
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
