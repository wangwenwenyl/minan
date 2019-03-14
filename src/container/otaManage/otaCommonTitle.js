/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import ArrowDown from './../../img/arrow.png'
import checkedArrow from './../../img/checkedArrow.png'
import actionimg from './../../img/actionimg.png'
import add from './../../img/add.png'
import {HttpUrl,httpConfig} from './../../util/httpConfig'
import {transformDate} from './../../util/util'
import moment from 'moment';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class commonTitle extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeArr:[],
        typeArr2:[],
        modelArr:[],
        modelArr2:[],
        useArr:[],
        time:[],
        timeFlag:0,
        typeBoxWidth:'',
        typeInnerBoxWidth:"",
        modelBoxWidth:'',
        modelInnerBoxWidth:""
    }
    componentDidMount(){
        this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr)
        this.eqmTypesList()
        this.eqmSeriesList(this.state.typeArr)
    }
    //设备类型
    eqmTypesList = () => {
        Axios.get(HttpUrl+'ota-mag/file/getEqmTypes').then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    typeArr2:[]
                })
                let length=res.data.data.length
                let typeArr2=this.state.typeArr2
                for(let i=0;i<length;i++){
                    typeArr2.push(<div className='checks' key={res.data.data[i].id} title={res.data.data[i].val.length>6 ? res.data.data[i].val : ''} id={res.data.data[i].id}
                        style={{border:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(e)}> 
                    { res.data.data[i].val} 
                    <img src={ this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    typeArr2:typeArr2
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //设备型号
    eqmSeriesList = (typeArr) => {
        Axios.post(HttpUrl+'ota-mag/file/getEqmSeriesNames',{
            'eqmTypeIds':typeArr
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    modelArr2:[]
                })
                let length=res.data.data.length
                let modelArr2=this.state.modelArr2
                for(let i=0;i<length;i++){
                    modelArr2.push(<div className='checks' key={res.data.data[i].id} title={res.data.data[i].val.length>6 ? res.data.data[i].val : ''} id={res.data.data[i].id}
                        style={{border:this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.modelCheck(e)}> 
                    { res.data.data[i].val} 
                    <img src={ this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    modelArr2:modelArr2
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //类型选择
    typeCheck = (e) => {
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(Number(e.target.id))>=0){
            typeArr.splice(typeArr.indexOf(Number(e.target.id)),1)
        }else{
            typeArr.push(Number(e.target.id))
        }
        this.setState({
            typeArr:typeArr
        })
        this.eqmTypesList()
        this.eqmSeriesList(typeArr)
        this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.timeFlag,this.props.form.getFieldValue('keyword'),this.props.form.getFieldValue('searchTime'))
    }
    //型号
    modelCheck = (e) => {
        let modelArr=this.state.modelArr
        if(modelArr.indexOf(Number(e.target.id))>=0){
            modelArr.splice(modelArr.indexOf(Number(e.target.id)),1)
        }else{
            modelArr.push(Number(e.target.id))
        }
        this.setState({
            modelArr:modelArr
        })
        this.eqmSeriesList(this.state.typeArr)
        this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.timeFlag,this.props.form.getFieldValue('keyword'),this.props.form.getFieldValue('searchTime'))
    }
     //使用状态
     useCheck = (e) => {
        let useArr=this.state.useArr
        if(useArr.indexOf(Number(e.target.id))>=0){
            useArr.splice(useArr.indexOf(Number(e.target.id)),1)
        }else{
            useArr.push(Number(e.target.id))
        }
        this.setState({
            useArr:useArr
        })
        this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.timeFlag,this.props.form.getFieldValue('keyword'),this.props.form.getFieldValue('searchTime'))
    }
    //类型获取更多
    typeMore = () => {  
        this.setState({
            typeMoreNum:!this.state.typeMoreNum
        })
    }
    //型号更多
    modelMore = () => {
        this.setState({
            modelMoreNum:!this.state.modelMoreNum
        })
    }
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
        if(!this.state.collapseStatus){
            setTimeout(() => {
                this.setState({
                    typeBoxWidth:document.getElementById("typeBox").offsetWidth,
                    modelBoxWidth:document.getElementById("modelBox").offsetWidth,
                    typeInnerBoxWidth:document.getElementById("typeInnerBox").offsetWidth,
                    modelInnerBoxWidth:document.getElementById("modelInnerBox").offsetWidth
                })
            }, 0);
        }
    }
    //时间类型选择
    handleChange = (value) => {
        this.setState({
            timeFlag:value
        })
    }
    //时间选择
    dateChange = (moment,dateStrings,string) => {
        this.setState({
            time:dateStrings
        })
    }
    //查询
    search = () => {
        this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.timeFlag,this.props.form.getFieldValue('keyword'),this.state.time)
    }
    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                typeArr:[],
                typeArr2:[],
                modelArr:[],
                modelArr2:[],
                useArr:[],
                time:[],
                timeFlag:0
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.eqmTypesList()
            this.eqmSeriesList(this.state.typeArr)
            this.props.fileList(this.state.typeArr,this.state.modelArr,this.state.useArr)
        })
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {useArr}=this.state
        return (
        <div className="content-title">
                <Form layout="inline">
                    <div className='searchType' style={{width:'100%'}}>
                        <FormItem label="关键字搜索">
                            { getFieldDecorator('keyword')( <Input 
                                style={{width:'200px'}}
                                placeholder={ this.props.statusType === '1' ? '请输入文件名称' : '请输入任务名称' }
                                autoComplete='off'/>)
                            }
                        </FormItem>
                        {
                            this.props.statusType === '1' ?
                            <FormItem label="发版时间">
                                { getFieldDecorator('searchTime')( <RangePicker
                                    getCalendarContainer={triggerNode => triggerNode.parentNode}
                                    style={{width:'340px'}} 
                                    showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                }}
                                onChange={this.dateChange}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />)}
                            </FormItem>
                            :
                            <span >
                                <FormItem>
                                    {
                                        getFieldDecorator('timeFlag',{
                                            initialValue:'0'
                                        })( <Select 
                                            style={{width:'125px',marginRight:'20px',marginLeft:'30px',height:'28px'}} 
                                            onChange={ this.handleChange}
                                            >
                                            <Option value='0' >升级开始时间</Option>
                                            <Option value='1' >升级结束时间</Option>
                                        </Select>)
                                    }
                                </FormItem>
                                <FormItem>
                                    { getFieldDecorator('searchTime')( <RangePicker
                                        getCalendarContainer={triggerNode => triggerNode.parentNode}
                                        style={{width:'340px'}} 
                                        showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    onChange={this.dateChange}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />)}
                                </FormItem>
                            </span>
                        }
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.clearCondition} style={{margin:'0px'}}>清除条件</Button>
                    </div>
                    <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                            <div className='searchType'>
                                <div className='typeTitle' >设备类型：</div>
                                <div className='moreBox' id='typeBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>
                                    <span id='typeInnerBox' style={{display:'inline-block'}}>
                                        {
                                            this.state.typeArr2
                                        }
                                    </span>
                                </div>
                                <div>
                                    {
                                         this.state.typeInnerBoxWidth+50 >this.state.typeBoxWidth ?
                                        <div className='checks typemore'  onClick={this.typeMore}>
                                            {
                                                this.state.typeMoreNum ? '收起' : '更多'
                                            }
                                            <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.typeMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                        </div>
                                        : ''
                                    }
                                </div>
                            </div>
                            <div className='searchType' id='xinghao'>
                                <div className='typeTitle' >设备型号：</div>
                                <div className='moreBox' id='modelBox' style={{height:this.state.modelMoreNum ? 'auto' : '50px',maxHeight:this.state.modelArr2.length>35 ? '200px' : '',overflow:this.state.modelMoreNum ? 'scroll' : 'hidden'}}>
                                    <span id='modelInnerBox' style={{display:'inline-block'}}>
                                        {   
                                            this.state.modelArr2
                                        }
                                    </span>
                                </div>
                                <div>
                                    {
                                        this.state.modelInnerBoxWidth+50 >this.state.modelBoxWidth ?
                                        <div className='checks typemore'  onClick={this.modelMore}>
                                            {
                                                this.state.modelMoreNum ? '收起' : '更多'
                                            }
                                            <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.modelMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                        </div>
                                        : ''
                                    }
                                </div>
                            </div>
                            {
                                this.props.statusType === '1' ? 
                                <div className='searchType'>
                                    <div className='typeTitle' >使用状态：</div>
                                    <div className='moreBox' style={{height:'50px'}}>
                                        <div className='checks'   id='0'
                                        style={{border:useArr.indexOf(0) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(0) >=0 ? '#3689FF' :'#999'}}   onClick={ (e) => this.useCheck(e)}> 
                                            未使用
                                            <img src={ useArr.indexOf(0) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks'   id='1'
                                        style={{border:useArr.indexOf(1) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(1) >=0 ? '#3689FF' :'#999'}}   onClick={ (e) => this.useCheck(e)}> 
                                            已使用
                                            <img src={ useArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks'   id='2'
                                        style={{border:useArr.indexOf(2) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(2) >=0 ? '#3689FF' :'#999',marginRight:'40px'}}   onClick={ (e) => this.useCheck(e)}> 
                                            禁用
                                            <img src={ useArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='searchType'>
                                    <div className='typeTitle' >状态：</div>
                                    <div className='moreBox' style={{height:'50px'}}>
                                        <div className='checks'   id='0'
                                        style={{border:useArr.indexOf(0) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(0) >=0 ? '#3689FF' :'#999'}}   onClick={ (e) => this.useCheck(e)}> 
                                            任务未开始
                                            <img src={ useArr.indexOf(0) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks'   id='1'
                                        style={{border:useArr.indexOf(1) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(1) >=0 ? '#3689FF' :'#999'}}   onClick={ (e) => this.useCheck(e)}> 
                                            任务进行中
                                            <img src={ useArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks'   id='2'
                                        style={{border:useArr.indexOf(2) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:useArr.indexOf(2) >=0 ? '#3689FF' :'#999',marginRight:'40px'}}   onClick={ (e) => this.useCheck(e)}> 
                                            任务已结束
                                            <img src={ useArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Panel>
                    </Collapse>
                </Form>
            <style>
                {`

                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                    .action span{color:#3689FF;}
                    .popoverBox div,img:hover{cursor: pointer;}
                    .searchType .ant-form-item-label{width:78px;}
                    .ant-form-inline .ant-form-item{margin-right:0px;}
                    .remintText{text-align:center;font-size:16px;}
                    .ant-select-selection{height:28px;}
                `}
            </style>
        </div>
        )
    }
}

const commonTitles = Form.create()(commonTitle);
export default commonTitles;