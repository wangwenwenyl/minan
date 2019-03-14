import React from 'react'
// import Axios from 'axios'
import { withRouter } from 'react-router-dom'

class Authroutes extends React.Component{
    componentWillMount(){
        const token = sessionStorage.getItem('token')
        if(this.props.location.pathname!="/largeScreenMonitoring/largeScreen"){
        if(token){
            if(this.props.location.pathname != '/'){
                this.props.history.push(this.props.location.pathname)
            }else{
                this.props.history.push('/page/1')
            }
        }else{
            this.props.history.push('/')
        }}
    }
    render(){
        return null
    }
}

const Authroute = withRouter(Authroutes)
export default Authroute