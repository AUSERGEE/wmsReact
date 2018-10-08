import React,{Component} from 'react'
import {Flex,NavBar,Icon,Button,Toast} from 'antd-mobile'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as wmsAction from '../../actions/wmsState'
import axios from 'axios'
class recipienDtl extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
         name:'',
         receiveData:null   
   	  }
   }
   render(){
      return (
         <div>
            <NavBar mode="dark" 
                   icon={<Icon type="left" />}
                   onLeftClick={() => this.props.history.goBack()}>
                   收货查看
            </NavBar>
            <div className="wmsTb_wrap">
                <div className="wmsTb x-border">
                        <div className="tbHeader">
                                <div className="tb_w_sub">PO</div>
                                <div className="tb_w_three">物料号</div>
                                <div>收货数量</div>
                                <div className="tb_w_sub">储位</div>
                        </div>
                        <div className="wmsTb_Tbody">

                    {   
                        this.state.receiveData
                        ?(this.state.receiveData.map((item,index)=>{
                                return (
                                    <div className="tb_tr" key={index}>
                                        <div className="tb_td tb_w_sub">{item.PO}</div>
                                        <div className="tb_td tb_w_three">{item.物料号}</div>
                                        <div className="tb_td">{item.收货数量}</div>
                                        <div className="tb_td tb_w_three">{item.储位}</div>
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
                   <Button type="primary" inline style={{ marginRight: '2%',width:'49%'}} onClick={this.clearReceive.bind(this)}>清除</Button>
                   <Button type="primary" inline style={{ width:'49%'}} onClick={this.receiving.bind(this)}>收货</Button>
                </div>
            </div>
         </div>
      )
   }

   componentDidMount(){
      setTimeout(function(){
          this.GetReceiveDetail()
      }.bind(this),0)
   }
   GetReceiveDetail(){
        
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/GetReceiveDetailQuery?userCode=${this.props.userState.user}&receivingNumber=${this.props.recipienState.orderId}`).then((res)=>{
            return res.data
        }).then(res => {
            //console.log(JSON.parse(res.jsonStr))
            if(res.jsonStr!=''){
                this.setState({
                    receiveData:JSON.parse(res.jsonStr)
                })
            }else{
                Toast.info('暂无数据', 1)
            }
            
        }).catch(e=>{
            //console.log(e)
            Toast.hide()
            Toast.fail('error', 1)
        })
   }
   clearReceive(){
        Toast.loading('清除中...', 0);
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/clearReceiveDetail?userCode=${this.props.userState.user}&receivingNumber=${this.props.recipienState.orderId}`).then((res)=>{
            return res.data
        }).then(res => {
            console.log(res.messageResult.IsSuccess)
            if(res.messageResult.IsSuccess){
                this.setState({
                    receiveData:null
                }) 
                Toast.hide()
                Toast.info('清除成功', 1,()=>{
                    this.props.recipienStateActions.recipienState({
                        resetRecepientForm:true
                    })
                    this.props.history.push('/Recipien')
                });
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1)
        })
   }
   receiving(){
        Toast.loading('收货中...', 0);
        axios.get(`http://wmspda.skyworthdigital.com:9001/webApi/api/PDAService/receivingOperation?userCode=${this.props.userState.user}&receivingNumber=${this.props.recipienState.orderId}&supplierCode=${this.props.recipienState.cSupplierCode}&supplierName=${this.props.recipienState.supplierName}`).then((res)=>{
            return res.data
        }).then(res => {
            console.log(res.IsSuccess)
            if(res.IsSuccess){
                Toast.hide()
                Toast.info('操作成功', 1,()=>{
                    this.props.recipienStateActions.recipienState({
                        resetRecepientForm:true
                    })
                    this.props.history.push('/Recipien')
                });
            }else{
                Toast.hide()
                Toast.info('操作失败', 1);
            }
        }).catch(e=>{
            console.log(e)
            Toast.hide()
            Toast.fail('error', 1)
        })
   }
}

const mapStateToProps = (state) => {
	return state
}

const mapDispatchtoProps = (dispatch) => {
	return {
        recipienStateActions:bindActionCreators(wmsAction, dispatch)
	}
}
export default connect(mapStateToProps,mapDispatchtoProps)(recipienDtl)