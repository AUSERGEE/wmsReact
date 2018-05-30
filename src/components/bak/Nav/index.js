import React, {Component} from 'react'
import { TabBar } from 'antd-mobile'
import { withRouter } from 'react-router'
class Nav extends Component {
	constructor (props){
    	super(props)
		this.state = {
		  selectedTab: '1'
		}
    }

	render () {
        return (
            <div style={{ position: 'fixed', height: '52px', width: '100%', bottom: 0 }}>
		         <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white" >
			          <TabBar.Item title="首页" key="index"
			            icon={<div style={{  width: '22px',  height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selectedIcon={<div style={{ width: '22px', height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selected={this.state.selectedTab=='1'}  onPress={() => {
			              this.setState({
			                selectedTab: '1',
			              });
			              this.props.history.push('/')
			            }}
			            data-seed="logId"
			          >
			          </TabBar.Item>
			          <TabBar.Item title="列表" key="list"
			            icon={<div style={{  width: '22px',  height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selectedIcon={<div style={{ width: '22px', height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selected={this.state.selectedTab=='2'}  onPress={() => {
			              this.setState({
			                selectedTab: '2',
			              });
			              //console.log(Router)
			              this.props.history.push('/List')
			              //return (<Redirect to="/chat" />)
			              //Router.push('/List')
			              
			            }}
			            data-seed="logId"
			          >
			          </TabBar.Item>
			          <TabBar.Item title="b" key="b"
			            icon={<div style={{  width: '22px',  height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selectedIcon={<div style={{ width: '22px', height: '22px', background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
			            />
			            }
			            selected={this.state.selectedTab=='3'} badge={1} onPress={() => {
			              this.setState({
			                selectedTab: '3',
			              });
			            }}
			            data-seed="logId"
			          >
			          </TabBar.Item>
			       </TabBar>
			       

			    </div>
        )

	}
}

export default withRouter(Nav);