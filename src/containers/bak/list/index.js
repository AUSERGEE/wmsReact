import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as flagAction from '../../actions/flag'
import { PullToRefresh,Toast,NavBar} from 'antd-mobile';
class List extends Component {
	componentDidMount(){
		this.props.flagActions.fetchListData()
	}
    constructor(props){
        super(props)
        this.state = {
		  fetchData: {},
		  refreshing: false,
          down: false,
          height: document.documentElement.clientHeight-80,
          data: [],
		}
    }
    creatHtml(){
    	const aDiv=(()=>{
	     	return (
             <div>函数生成的模版</div>
	     	)
	     })()
	     console.log(aDiv)
    }
    getData(){
      alert('sd')
    }
	render () {
	  const templateA=<span onClick={()=>alert('123')}>使用变量生成的带点击事件的模版dom</span>
	  return (
         <div>
            <NavBar mode="dark">列表页</NavBar>
            {
				JSON.stringify(this.props.fetchList)!='{}'
				?(
			     console.log(this.props.fetchList),
			     this.creatHtml(),
			     <PullToRefresh
				        ref={el => this.ptr = el}
				        style={{
				          height: this.state.height,
				          overflow: 'auto',
				        }}
				        indicator={this.state.down ? {} : { deactivate: '上拉可以刷新' }}
				        direction={this.state.down ? 'down' : 'up'}
				        refreshing={this.state.refreshing}
				        onRefresh={() => {
				          this.setState({ refreshing: true });
				          this.getData();
				          setTimeout(() => {
				            this.setState({ refreshing: false });
				          }, 1000);
				        }}
				      >
                      {
                      	this.props.fetchList.data.map((item,index)=> {
		                 	return (
		                 		<li key={index} className='listItem'>
		                 		  <p>{item.name}</p>
		                 		  {templateA}
		                        </li>
		                 	)
		                 })
                      }
				   </PullToRefresh> 
		                 
                 )
				:Toast.loading('加载中')
            }
            
         </div>
	  )
	}
}

const mapStateToProps = (state) => {
	return state
}

const mapDispatchtoProps = (dispatch) => {
	return {
      flagActions:bindActionCreators(flagAction, dispatch)
	}
}

export default connect(mapStateToProps,mapDispatchtoProps)(List)

