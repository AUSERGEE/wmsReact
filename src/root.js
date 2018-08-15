import React,{Component} from 'react';
import {Provider} from 'react-redux';
import './static/css/main';
//import Routers from './routes/index';
import configureStore from './store/configureStore';
const store = configureStore();
//react-router：
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import NotFound from './components/Common/NotFound';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group' 
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件
import 'react-animated-router/animate.css'; //引入默认的动画样式定义 lxf:该css已经被修改过了

import initReactFastclick from 'react-fastclick'

import Layout from './containers/layout'
import Login from './containers/Login'
import AuthRoute from  './containers/AuthRoute'
import HomePage from './containers/homePage'
import Recipien from './containers/recipien'
import RecipienDtl from './containers/recipienDtl'
import RecipienCheckout from './containers/recipienCheckout'
import SparesRece from './containers/sparesRece'
import MOpicking from './containers/MO-picking'
import MoSaleReturn from './containers/MoSalesReturn'
import PoSalesReturn from './containers/PoSalesReturn'
import SPSalesReturn from './containers/SPSalesReturn'
import Inventory from './containers/Inventory'
import Prepare from './containers/Prepare'
import Vconsole from 'vconsole'

import './static/css/wmsui.scss'
import {getItem, setItem} from './util/localStorage'

//根据缓存判断加载哪个主题色样式文件，默认是app.js
var aa=''
if(getItem('skin')=='0'){
	aa='app'
}else if(getItem('skin')=='1'){
	aa='app-skin1'
}else if(getItem('skin')=='2'){
	aa='app-skin2'
}else if(getItem('skin')=='3'){
	aa='app-skin3'
}else{
	aa='app'
}
require([`./static/css/${aa}.scss`], function(list){
    
});

initReactFastclick()
//手机端调试工具vconsole
// if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
//    let vConsole = new Vconsole()
// }
class Root extends Component {
	
	render() {
      return  (
         <Provider store={store}>
	         <div className="app">
				<Router>
				  <div>
				    <AuthRoute></AuthRoute> 
					<AnimatedRouter>  {/*引入第三方路由切换动画组件*/}
						<Switch>
						{/* <Route path="/" exact component={AuthRoute}/> */}
						<Route path="/" exact component={HomePage}/>
						<Route path="/Recipien" exact component={Recipien}/>
						<Route path="/RecipienDtl" exact component={RecipienDtl}/>
						<Route path="/RecipienCheckout" exact component={RecipienCheckout}/>
						<Route path='/SparesRece' exact component={SparesRece} />
						<Route path='/MOpicking' exact component={MOpicking} />
						<Route path='/MoSaleReturn' exact component={MoSaleReturn} />
						<Route path='/PoSalesReturn' exact component={PoSalesReturn} />
						<Route path='/SPSalesReturn' exact component={SPSalesReturn} />
						<Route path='/Inventory' exact component={Inventory} />
						<Route path='/Prepare' exact component={Prepare} />
						<Route path="/Login" exact component={Login}/>
						<Route path='/404'  component={NotFound} />
						<Redirect from='*' to='/404' />
						</Switch>
				    </AnimatedRouter>
	              </div>
			    </Router>
			 </div>
	     </Provider>
      )
	}
	componentDidMount(){
		//如果开了调试工具，则显示调试工具
		//由于在react中没有找到页面跳转的事件，或者其他的触发方式，
		//所以开启调试工具后还需要刷新页面重新进入才会起作用
		if(!getItem('devToolShow')){
			setItem('devToolShow',false)
		}else{
			if(JSON.parse(getItem('devToolShow'))){
				var vConsole = new Vconsole()
			}
		}
		
	}

}

export default Root
