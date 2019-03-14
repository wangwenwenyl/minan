/**
 * Created by www  on 2018/7/13.
 */
import React, { Component } from 'react';
import Axios from 'axios'
import moment from 'moment';
import { httpConfig,HttpUrl } from "./../../../util/httpConfig";
import { permission } from './../../../util/permission';
import {validatorMobile,validatorPhone,validatoeEmail,keycode} from './../../../util/validator'
import { Link } from 'react-router-dom';
import {Radio,message, Tabs,Progress,Modal,Card, Form, Input,Select, Row, Col, Button,} from 'antd';
import { resolve } from 'url';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
class logModals extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        logModal:false,
        tabkey:'',
        percent:20,
        startFlag:false,
        permissionModal:false,
        record:'',
        currentLog:'',
        historyLog:''
    };
    componentDidMount () {
       
    }
    logs = (record,check) => {
        new Promise(resolve => {
            if(check=='查看详情'){
                this.setState({
                    logModal:true,
                    record:record,
                    tabkey:'1'
                })
            }else if(check=='历史日志'){
                this.setState({
                    logModal:true,
                    record:record,
                    tabkey:'2'
                })
            }
            resolve(true)
        }).then( v => {
            this.getRecordData()
        })
    }
    reload = () => {
        this.getRecordData()
    }
    getRecordData = () => {
        Axios.post(HttpUrl+'ota-mag/task/getSubTaskDetails',{
            'subTaskEquipmentId':this.state.record.subTaskEquipmentId
        }).then( res => {
             if(res.data.code === '100000'){
                this.setState({
                    currentLog:res.data.data
                })
             }else{
                console.log(res.data.message)
             }
        })
        Axios.post(HttpUrl+'ota-mag/task/equipmentUpgradeRecord',{
            'equipmentId':this.state.record.equipmentId
        }).then( res => {
            if(res.data.code==='10000'&& res.data.result==='SUCCESS'){
                const historyLog=[]
                for(let i=0;i<res.data.data.length;i++){
                    historyLog.push(
                        <div key={i}>
                            <Col xxl={6} xl={6} lg={6} md={6} style={{marginTop:'20px'}}>
                                <div>当前版本：{res.data.data[i].currentVersion}</div>
                                <div>目标版本：{res.data.data[i].targetVersion}</div>
                            </Col>
                            <Col xxl={18} xl={18} lg={18} md={18}>
                                <div className='progressItem'  style={{marginTop:'15px'}}>
                                    <span style={{display:'inline-block',width:'80px'}}>1、{res.data.data[i].downloadStatus=='doing' ? '下载中' :
                                                res.data.data[i].downloadStatus=='fail' ? '下载失败' :
                                                res.data.data[i].downloadStatus=='suc' ? '下载成功' : ''
                                            }</span>
                                    <Progress percent={res.data.data[i].downloadPercent ? Number(res.data.data[i].downloadPercent) : 0} style={{width:'55%',margin:'0px 10px'}} status={ res.data.data[i].downloadStatus=='fail' ? 'exception' : 'success'}/>
                                    <span>{ res.data.data[i].downloadStartTime ? this.transformDate(res.data.data[i].downloadStartTime) : ""}</span>
                                    <br/>
                                    <span style={{display:'inline-block',width:'80px'}}>2、{ res.data.data[i].rewritePercent== 0 ? '安装失败' : '安装成功' }</span>
                                    <Progress  percent={ 100 } style={{width:'55%',margin:'0px 10px'}} status={ res.data.data[i].rewritePercent== 0 ? 'exception' : 'success'}/>
                                    <span>{res.data.data[i].rewriteStartTime ? this.transformDate(res.data.data[i].rewriteStartTime) : ''}</span>
                                </div>
                            </Col>
                        </div>
                    )
                }
                this.setState({
                    historyLog:historyLog
                })
             }else{
                console.log(res.data.message)
             }
        })
    }
    // restart = () => {
    //     this.setState({
    //         startFlag:!this.state.startFlag
    //     })
    // }
    // finish = () => {
    //     this.setState({
    //         permissionModal:true
    //     })
    // }
    cancelPermission = () => {
        this.setState({
            permissionModal:false
        })
    }
    sure = () => {
        this.setState({
            logModal:false,
            record:''
        })
    }
    cancel = () => {
        this.setState({
            logModal:false,
            record:''
        })
    }
    //中国标准时间转化为yy-mm-dd
    transformDate = (date) => {
        const d=new Date(date)
        const year= d.getFullYear()
        const month=( (d.getMonth()+1)>9 ? (d.getMonth()+1) :'0'+(d.getMonth()+1) )
        const day=d.getDate()>9 ? d.getDate():'0'+d.getDate();
        const h=d.getHours()>9 ? d.getHours() : '0' + d.getHours()
        const minus=d.getMinutes()>9 ?d.getMinutes() : '0' +d.getMinutes()
        const second=d.getSeconds()>9 ? d.getSeconds() : '0' +d.getSeconds()
        return (year+'-'+month+'-'+day + ' ' + h + ':' + minus + ':' + second)
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const detailData=this.state.detailData
        return (
            <div className="gutter-example">
                <Row>
                    <Col className="gutter-row " >
                        <Modal
                            title='查看详情'
                            visible={this.state.logModal}
                            okText="确定"
                            cancelText="取消"
                            onOk={ this.sure}
                            onCancel={ this.cancel}
                            maskClosable={false}
                            destroyOnClose={true}
                            className='log'
                        >
                            <div>
                                <Tabs defaultActiveKey={this.state.tabkey}>
                                    <TabPane tab="当前日志" key="1">
                                        <div className='btnBox'>
                                            <div style={{float:'left',fontSize:'16px'}}>
                                                <div>   
                                                    vin: {this.state.currentLog.vin }
                                                </div>
                                            </div>
                                            <div style={{float:'right'}}>
                                                <Button  type="primary" ghost onClick={this.reload} style={{borderRadius:'5px',width:'60px',height:'26px'}}>刷新</Button>
                                            </div>
                                        </div>
                                        <br/>
                                        <div>
                                            <Row>
                                                <Col  xxl={6} xl={6} lg={6} md={6}>
                                                    <div>设备类型：{this.state.currentLog.eqmTypeName}</div>
                                                    <div>当前版本：{this.state.currentLog.currentVersion}</div>
                                                    <div>目标版本：{this.state.currentLog.targetVersion}</div>
                                                </Col>
                                                <Col xxl={18} xl={18} lg={18} md={18}>
                                                    <div className='progressItem' style={{marginBottom:'30px'}}>
                                                        {/* <span>1、{ this.state.currentLog.downloadPercent !== "100" ? "正在下载" : "下载完成"}</span> */}
                                                        <span>1、{ this.state.currentLog.downloadStatus}</span>
                                                        <Progress percent={this.state.currentLog.downloadPercent ? Number(this.state.currentLog.downloadPercent) : 0} style={{width:'55%',margin:'0px 10px'}} />
                                                        <span>{this.state.currentLog.downloadTime && this.transformDate(this.state.currentLog.downloadTime)}</span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xxl={6} xl={6} lg={6} md={6} >
                                                    
                                                </Col>
                                                <Col xxl={18} xl={18} lg={18} md={18}>
                                                {
                                                    this.state.currentLog.downloadPercent !== '100'
                                                    ? "" :
                                                    <div className='progressItem'>
                                                        <span>2、{ this.state.currentLog.rewritePercent == 0 ? '安装失败' : '安装成功' }</span>
                                                        <Progress percent={100 }  style={{width:'55%',margin:'0px 10px'}} status={ this.state.currentLog.rewritePercent== 0 ? 'exception' : 'success'}/>
                                                        <span>{this.state.currentLog.rewriteTime&&this.transformDate(this.state.currentLog.rewriteTime)}</span>
                                                    </div>
                                                }
                                                    {/* <div className='progressItem'>
                                                    {
                                                        this.state.currentLog.downloadPercent !== '100'
                                                        ? 
                                                        <div>
                                                            <span>2、准备安装 </span>
                                                            <Progress percent={0}  style={{width:'55%',margin:'0px 10px'}} />
                                                            <span>{this.state.currentLog.rewriteTime&&this.transformDate(this.state.currentLog.rewriteTime)}</span>
                                                        </div>
                                                        :
                                                        <div>
                                                            <span>2、{ this.state.currentLog.rewritePercent == 0 ? '安装失败' : '安装成功' }</span>
                                                            <Progress percent={100 }  style={{width:'55%',margin:'0px 10px'}} status={ this.state.currentLog.rewritePercent== 0 ? 'exception' : 'success'}/>
                                                            <span>{this.state.currentLog.rewriteTime&&this.transformDate(this.state.currentLog.rewriteTime)}</span>
                                                        </div>
                                                    }   
                                                    </div> */}
                                                </Col>
                                            </Row>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="历史日志" key="2">
                                    <div className='btnBox'>
                                            <p style={{fontSize:'16px'}}>
                                                vin: {this.state.currentLog.vin}
                                            </p>
                                            <p >
                                                <span>设备类型：{this.state.currentLog.eqmTypeName}</span>
                                                <span style={{marginLeft:'20px'}}>最终版本：{this.state.currentLog.targetVersion}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <Row>
                                                {
                                                    this.state.historyLog
                                                }
                                            </Row>
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </Modal>
                        <Modal
                        title='登录密码验证'
                        visible={this.state.permissionModal}
                        okText="提交"
                        cancelText="取消"
                        onOk={ this.surePermission}
                        onCancel={ this.cancelPermission}
                        maskClosable={false}
                        destroyOnClose={true}
                        >
                            <Form style={{margin:'auto',textAlign:'center'}}>
                                <div >请输入当前登录账户的密码</div>
                                <FormItem>  
                                    {
                                        getFieldDecorator('permission')(
                                            <Input style={{width:'60%'}}  onKeyDown={keycode} autoComplete='off'/>
                                        )
                                    }
                                </FormItem>
                            </Form>
                        </Modal>
                    </Col>
                </Row>
                <style>
                    {`
                        .ant-form-item:not(:first-child){margin-top:10px;}
                        .account .opt{width:175px !important}
                        .btnBox:after{display:table;clear:both;content:''}
                        .log{width:800px !important;}
                        .progressItem{padding:15px 10px;background:#F4F4F4;}
                        .progressItem .ant-progress-inner{background:#fff;}
                        .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    `}
                </style>
            </div>
        )
    }
}
const logModal=Form.create()(logModals)
export default logModal