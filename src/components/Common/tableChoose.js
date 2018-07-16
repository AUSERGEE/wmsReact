import React,{Component} from 'react'
import {Flex} from 'antd-mobile'
export default class extends Component {
	render() {
	   return (
           <div style={{background:'#FFF'}}>
               <div className="wms-modal-wrap">
                   <div>
                       <div className="wms-modal-mask"></div>
                       <div className="wms-table-modal">
                            <div className="wms-table-box">
                                    <div className="wms-modal-content">
                                        <div className="wms-modal-header">
                                            <div className="wms-modal-title">请点击选择：</div>
                                        </div>
                                        <div className="wms-modal-body">
                                             <div className="flexTbWarp">
                                                    <div className="wmsTb x-border">
                                                           <Flex className="tbHeader">
                                                                <Flex.Item className="flex2">串号</Flex.Item>
                                                                <Flex.Item className="flex2">储位</Flex.Item>
                                                                <Flex.Item>状态</Flex.Item>
                                                                <Flex.Item>数量</Flex.Item>
                                                            </Flex>
                                                            <div className="wmsTb_Tbody">
                                                                {
                                                                    this.props.poData.map((item,index)=>{
                                                                        return (
                                                                            <Flex className="tb_tr"  key={index}
                                                                                  onClick={this.activeTr.bind(this,index)}
                                                                            >
                                                                                <Flex.Item className="flex2">{item.ReceivingNumber}</Flex.Item>
                                                                                <Flex.Item className="flex2">{item.spCode}</Flex.Item>
                                                                                <Flex.Item>{item.ReceivingState==2?'不合格':item.ReceivingState==3?'已入库':null}</Flex.Item>
                                                                                <Flex.Item>{item.ReceivingQuantity}</Flex.Item>
                                                                            </Flex>
                                                                        )
                                                                    })

                                                                }
                                                            </div>
                                                    </div>
                                              </div>
                                        </div>
                                    </div>
                                </div>    
                       </div>
                   </div>
               </div>
            </div>       
	   )
	}
    
    componentDidMount(){
       
    }
    activeTr(index) {
        this.props.changeTbIndex(index)
    }

	
}