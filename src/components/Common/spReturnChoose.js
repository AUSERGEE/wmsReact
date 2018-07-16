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
                                            <div className="wmsTb_wrap">
                                                <div className="wmsTb x-border" style={{width:'767px'}}>
                                                        <div className="tbHeader">
                                                                <div className="tb_w_sub">物料号</div>
                                                                <div className="tb_w_sub">批次号</div>
                                                                <div className="tb_w_sub">收货号</div>
                                                                <div>退货数量</div>
                                                                <div>储位</div>
                                                                <div>仓位</div>
                                                        </div>
                                                        <div className="wmsTb_Tbody">
                                                        {
                                                           this.props.spScanData.map((item,index)=>{
                                                                    return (
                                                                        <div key={index} 
                                                                         className={`tb_tr`}
                                                                         onClick={this.activeTr.bind(this,index)}
                                                                        >
                                                                            <div className="tb_td tb_w_sub">{item['MaterialCode']}</div>
                                                                            <div className="tb_td tb_w_sub">{item['RBatchCode']}</div>
                                                                            <div className="tb_td tb_w_sub">{item['ReceivingNumber']}</div>
                                                                            <div className="tb_td">{item['ReceivingQuantity']}</div>
                                                                            <div className="tb_td">{item['spCode']}</div>
                                                                            <div className="tb_td">{item['storehouseCode']}</div>
                                                                        </div>
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
        console.log(this.props.spScanData)
    }
    activeTr(index) {
        this.props.changeTbIndex(index)
    }

	
}