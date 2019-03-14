/**
 * Created by ts on 2018/11/24.
 */
/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>日志管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import add from './../../../img/add.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {transformDate} from './../../../util/util'
import moment from 'moment';
import { resolve } from 'url';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const Option = Select.Option;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
class logManagement extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        startTime:'',
        endTime:'',
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:false,
        collapseStatus:true,
        typeMoreNum:false,
        operatorMoreNum:false,
        modelMoreNum:false,
        typeArr:[],
        typeArr1:[],
        operatorArr:[],
        operatorArr1:[],
        operationsArr:[],
        operationsArr1:[],
        lastId:'',
        prePageNum:'',
        time:[],
        searchDataSource:[],
        tableData:[],
        columns:[
            { title: '序号',
                width: 60,
                dataIndex: 'number',
                
            },{ title: '操作',
                dataIndex: 'buttonName',
                className:'clounWidth'
            },{ title: '模块',
                dataIndex: 'moduleName' ,
                className:'clounWidth'
            },{ title: '操作时间',
                dataIndex: 'operationTime',
                className:'clounWidth'
            },{ title: '操作者',
                dataIndex: 'account' ,
                className:'clounWidth'
            },{ title: 'IP地址',
                dataIndex: 'ip',
                className:'clounWidth'
            },
        ]
    }
    componentDidMount(){
        this.list(this.state.pageNumber,this.state.pageSize,'','',[],'','','','')
        this.tabsList()
    }
    
    handleChange2=(value)=>{
        console.log(value)
        this.setState({
            operation:value.label
        })
    }
    handleChange3=(value)=>{
        console.log(value)
        this.setState({
            operator:value.label
        })
    }
    list = (pageNumber,pageSize,startTime,endTime,moduleName,operation,operator,lastId,prePageNum) => {
        Axios.post(HttpUrl+'sys/system/log/logList',{
            pageNum:pageNumber,
            pageSize:pageSize,
            startTime:startTime,
            endTime:endTime,
            moduleNames:moduleName,
            operations:operation,
            operators:operator,
            lastId:lastId,
            prePageNum:prePageNum},httpConfig).then(res => {
            console.log(res)
            if(res.data.code === '100000'){
                
                let length=res.data.data.list.length;
                if(res.data.data.list.length==0){
                    let lastId=''
                }else{
                   let lastId=res.data.data.list[length-1].id; 
                }
                
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.total,
                    current:pageNumber,
                    loading:false,
                    lastId:lastId,
                    prePageNum:pageNumber,
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //选项卡import
    tabsList = () => {
        Axios.get(HttpUrl+'sys/system/log/queryItems').then(res => {
            console.log(res)
            if(res.data.code === '100000'){
                this.setState({
                    typeArr1:[]
                })
                let typeArr1=this.state.typeArr1
                for(let i=0;i<res.data.data.modules.length;i++){
                    typeArr1.push(<div className='checks' key={res.data.data.modules[i]}  id={res.data.data.modules[i]}
                                       style={{border:this.state.typeArr.indexOf(res.data.data.modules[i]) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.typeArr.indexOf(res.data.data.modules[i]) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(e)}>
                        { res.data.data.modules[i]}
                        <img src={ this.state.typeArr.indexOf(res.data.data.modules[i]) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    typeArr1:typeArr1
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    typeMore = () => {
        this.setState({
            typeMoreNum:!this.state.typeMoreNum
        })
    }
       //车型
       typeCheck = (e) => {
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(e.target.id)>=0){
            typeArr.splice(typeArr.indexOf(e.target.id),1)
        }else{
            typeArr.push(e.target.id)
        }
        this.setState({
            typeArr:typeArr
        })
        this.tabsList()
       
        this.list(this.state.pageNumber,this.state.pageSize,this.state.startTime,this.state.endTime,
            this.state.typeArr,this.props.form.getFieldValue('operations')||'',
            this.props.form.getFieldValue('operators')||'','','')
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.state.startTime,this.state.endTime,
            this.state.typeArr,this.props.form.getFieldValue('operations')||'',
            this.props.form.getFieldValue('operators')||'','','')
    }


    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                typeMoreNum:false,
                modelMoreNum:false,
                operatorMoreNum:false,
                typeArr1:[],
                typeArr:[],
                operationsArr1:[],
                operationsArr:[],
                operatorArr1:[],
                operatorArr:[],
                time:[],
                startTime:'',
                endTime:'',
            })
            this.tabsList()
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {

            this.list(this.state.pageNumber,this.state.pageSize,this.state.startTime,this.state.endTime,
                this.state.typeArr,this.props.form.getFieldValue('operations')||'',this.props.form.getFieldValue('operators')||'','','')
            
        })
    }
    timeChange = (moment) => {

        this.setState({
            startTime:this.transformDate(moment[0]._d),
            endTime:this.transformDate(moment[1]._d)
        })
        console.log(this.state.endTime)
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

    //删除设备
    delete = (record,action) => {
        this.form4.deleteSubmit(record,action)
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.startTime,this.state.endTime,
            this.state.typeArr,this.props.form.getFieldValue('operations')||'',
            this.props.form.getFieldValue('operators')||'',this.state.lastId,this.state.prePageNum)
    }

    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType searchTypeInfo'>
                            <FormItem label="操作">
                            { getFieldDecorator('operations')( <Input autoComplete="off"
                                    style={{width:'120px'}}
                                   />)}
                            </FormItem>
                            <FormItem label="操作者">
                            { getFieldDecorator('operators')( <Input autoComplete="off"
                                    style={{width:'120px'}}
                                   />)}
                            </FormItem>
                            <FormItem label="操作时间">
                                { getFieldDecorator('operationTime')( <RangePicker
                                    style={{width:'300px'}}
                                    showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    onChange={this.timeChange}
                                    format="YYYY-MM-DD HH:mm:ss"
                                />)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'24px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                        </div>
                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={this.state.collapseStatus ?<span>更多</span> : <span>收起</span> } key="1">
                            
                               
                              
                                <div className='searchType'>
                                    <div className='typeTitle' >模型：</div>
                                    <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px',}}>
                                        <div className='whichListener'>
                                             {
                                                this.state.typeArr1
                                             }
                                        </div>
                                             
                                    </div>
                                    {this.state.typeArr1.length >10 ?
                                    <div className='checks typemore'  onClick={this.typeMore}>
                                        {
                                            this.state.typeMoreNum ? '收起' : '更多'
                                        }
                                        <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.typeMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                    </div>:''}
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
                </div>
                <div style={{marginTop:41}}>
                    {/*<div  className='oprateHead'>*/}
                        {/*<Button type="primary" className='btn' ghost onClick={ this.deviceClassify}>*/}
                            {/*<img src={add} alt=""/>*/}
                            {/*添加</Button>*/}
                    {/*</div>*/}
                    <div className='table'>
                        <Table
                            scroll={1100}
                            columns={this.state.columns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading}
                            total={this.state.total}
                            current={this.state.current}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />
                    </div>
                </div>
                <style>
                    {`
                    .searchTypeInfo{width:100%}
                    .searchType .ant-select-selection--single{
                        height:30px
                    }
                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                `}
                </style>
            </div>
        )
    }
}

const logManagements = Form.create()(logManagement);
export default logManagements;
