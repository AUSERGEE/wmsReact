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

import Vconsole from 'vconsole'
import './static/css/app.scss'
import './static/css/wmsui.scss'

initReactFastclick()
if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
   let vConsole = new Vconsole()
}
class Root extends Component {
	
	render() {
      return  (
         <Provider store={store}>
	         <div className="app">
				<Router>
				  <div>
				    <AuthRoute></AuthRoute>
					<Switch>
					   <Route path="/" exact component={HomePage}/>
					   <Route path="/Recipien" exact component={Recipien}/>
					   <Route path="/RecipienDtl" exact component={RecipienDtl}/>
					   <Route path="/RecipienCheckout" exact component={RecipienCheckout}/>
					   <Route path='/SparesRece'  component={SparesRece} />
					   <Route path='/MOpicking'  component={MOpicking} />
					   <Route path='/MoSaleReturn'  component={MoSaleReturn} />
					   <Route path='/PoSalesReturn'  component={PoSalesReturn} />
					   <Route path='/SPSalesReturn'  component={SPSalesReturn} />
					   <Route path="/Login" component={Login}/>
					   <Route path='/404' component={NotFound} />
					   <Redirect from='*' to='/404' />
				    </Switch>
	              </div>
			    </Router>
			 </div>
	     </Provider>
      )
	}
}

export default Root
