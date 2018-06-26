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
                  this.state.lineData.length>0
                  ?(
                    <Picker data={this.state.lineData} cols={1}  className="forss" 
                            
                            onOk={(v) => {
                                this.pickCallback(v).then(()=>{
                                    //异步操作，使线体先保存，后取
                                    this.getSendingMaterial()
                                })
                            }} 
                            value={this.state.pickerValue}>
                        <List.Item arrow="horizontal">选择线体</List.Item>
                    </Picker>
                  ):(
                    <List.Item >...</List.Item>
                  )

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
                   <Button type="primary" inline style={{ margin: '0 auto',width:'99%',display:'block'}} 
                           onClick={()=>{
                               console.log(this.state.lineData,'232')
                               if(!this.state.pickerValue[0]){
                                  this.openModal('请选择线体')
                                  return
                               }
                               this.props.history.push(`/MOpicking/MOdtl/${this.state.pickerValue[0]}`)}  
                           } >领料查看</Button>
                  
                </div>
             </div>
             <Route path='/MOpicking/MOdtl/:line' exact component={MOdtl}/>
             <Route path='/MOpicking/MOitemDtl' exact component={MOitemDtl}/>
        </div>
      )
    }
    componentDidMount(){
       this.GetDataByLine()
       
    }
    
    componentWillReceiveProps(nextProps){
        if (nextProps.location.pathname== "/MOpicking") {
            this.getSendingMaterial()
        } 
    }
   
    GetDataByLine(){
        this.getMaterialLineData().then((res)=>{
            if(res.messageResult.IsSuccess){
                if(res.sResultJsonStr==""){
                    Toast.fail('获取线体失败', 1)
                    return 
                }
                let lineArr=JSON.parse(res.sResultJsonStr)
                let lineData=[]
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
        console.log(this.state.pickerValue)
        let baseUrl='http://wmspda.skyworthdigital.com:9001/webApi/api/PDAMoSendingMaterial/getSendingMaterialByuserCodeAndLine?'
        axios.get(`${baseUrl}userCode=${userCode}&line=${this.state.pickerValue[0]}`).then((res)=>{
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
    pickCallback (v){
        this.setState({pickerValue:v})
        return Promise.resolve()
    }
    openModal(text){
        this.setState({
            alertMsg:{text:text,modal1:true}
        })
    }
    activeTr(trItem){
        console.log(trItem)
        this.props.history.push({
            pathname:'/MOpicking/MOitemDtl',
            query:{
              line:this.state.pickerValue[0],
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
