import React,{Component} from 'react'
import {Flex,NavBar,Icon} from 'antd-mobile'

class recipienDtl extends Component {
   constructor(props) {
   	  super(props)
   	  this.state = {
   	  	name:''
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
             <div className="wmsTb">
                <Flex className="tbHeader">
                    <Flex.Item>121</Flex.Item>
                    <Flex.Item className="flex2">121</Flex.Item>
                    <Flex.Item>121</Flex.Item>
                </Flex>
             </div>
         </div>
      )
   }
}

export default recipienDtl