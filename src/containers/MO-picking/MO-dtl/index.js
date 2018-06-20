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
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} >发料</Button>
                   <Button type="primary" inline style={{ marginRight: '2%',width:'32%'}} >返回</Button>
                   <Button type="primary" inline style={{ width:'32%'}} >清除</Button>
                   
                </div>
             </div>
        </div>
      )
    }
    componentDidMount(){

       
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
