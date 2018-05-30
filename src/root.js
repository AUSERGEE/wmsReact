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

import './static/css/app.scss'
initReactFastclick()

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
