/**
 * Created by www  on 2018/7/13.
 */
import React, { Component } from 'react';
import Axios from 'axios'
import {message,Radio,Tabs, Form, Input, Icon, Select, Row, Col, Button,Breadcrumb, Popover,DatePicker,Progress} from 'antd';
let time=''
class logModals extends Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        year:'',
        month:'',
        date:'',
        hours:'',
        minus:'',
        seconds:'',
    };
    componentDidUpdate(){
        time=this.props.time
    }
    componentDidMount () {
        this.init()
        this.remainTime(time)
        this.setState({
            time:time
        })
    }
    init = () => {
        setInterval(() => {
            this.remainTime(time)
        },1000)
    }
    remainTime = (end) =>{
  
        let a = new Date(end);
        let b = new Date();
        let a1 = a.getTime();
        let b1 = b.getTime();
        let c = a1 - b1;
        if(c<0){
            c=0
        }
        let c1 = new Date(c);
        this.setState({
            year:c1.getFullYear()- 1970,
            month:c1.getMonth(),
            date:Math.floor(c/(24*3600*1000)),
            hours:Math.floor((c%(24*3600*1000))/(3600*1000)),
            minus:Math.floor((c%(3600*1000))/(60*1000)),
            seconds:Math.floor(((c%(3600*1000))%(60*1000))/(1000))
        })
    }
    render() {
        return (
            <span className="gutter-example" >
                <span>任务时效倒计时：</span>
                <span  className='retimeBg'>
                {
                    this.state.year
                }
                </span>
                <span>年</span>
                <span className='retimeBg'>
                    {
                        this.state.month
                    }
                </span>
                <span>月</span>
                <span className='retimeBg'>
                    {
                        this.state.date
                    }
                </span>
                <span>日</span>
                <span className='retimeBg'>
                    {
                        this.state.hours
                    }
                </span>
                <span>时</span>
                <span className='retimeBg'>
                    {
                        this.state.minus
                    }
                </span>
                <span>分</span>
                <span className='retimeBg'>
                    {
                        this.state.seconds
                    }
                </span>
                <span>秒</span>
                    <style>
                        {` 
                            .retimeBg{background:#d8d8d8;border-radius:2px;display:inline-block;width:30px;height:40px;text-align:center;line-height:40px;margin-right:3px;margin-left:3px;margin-top:14px;font-size:24px;color:#000;}
                        `}
                    </style>
                  
            </span>
            
        )
    }
}
const logModal=Form.create()(logModals)
export default logModal