import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter,Route,Switch } from 'react-router-dom'
import Login from './container/login/login'
import Home from './home'
import 'antd/dist/antd.css'
import './index.css'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './redux/reducer'
import Authroute from './component/authrouter/authrouter'
import largeScreen from './container/largeScreenMonitoring/largeScreen'  //大屏监控

import carMonitor from './container/remoteMonitor/carMonitor/carMonitor'
const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension?window.devToolsExtension() : f=>f
))

ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
        <div style={{height:"100%"}}>
            <Authroute></Authroute>
            <Switch>
                <Route exact path='/' component={ Login }/>
                <Route path='/page' component={ Home } />
                <Route exact path="/largeScreenMonitoring/largeScreen" component={largeScreen} /> {/* 大屏监控 */}
                <Route exact path='/carMonitor/:vin' component={carMonitor}/>
            </Switch>
        </div>
    </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
);
