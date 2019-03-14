/**
 * Created by ts on 2018/11/24.
 */
/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>日志管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Row, Col, Button ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import DetailOrDeal from './detailOrDeal'
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import add from './../../../img/add.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {transformDate,disabledDate} from './../../../util/util'

import moment from 'moment';

const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
class historyAlarm extends Component{
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
        modelMoreNum:false,
        typeArr:[],
        typeArr2:[],
        levelArr:[],
        dealArr:[],
        statusArr:[],
        time:[],
        searchDataSource:[],
        tableData:[],
        columns:[
            { title: '序号',
                width: 60,
                dataIndex: 'number',
                fixed: 'left'
            },{ title: 'Vin',
                dataIndex: 'vin',
               
            },{ title: '上报时间',
                dataIndex: 'uploadStartTime' ,
               
            },{ title: '消失时间',
                dataIndex: 'uploadEndTime',
              
            },{ title: '报警状态',
                dataIndex: 'alarmStatus' ,
                render:(text,record)=>{
                    if(Number(text) === 1){
                        return(
                            <div>发生</div>
                        )
                    }else {
                        return(
                            <div>消失</div>
                        )
                    }
                }
               
            },{ title: '最高报警等级',
                dataIndex: 'level',
                
            },{ title: '报警详情',
            dataIndex: 'warningInfo',
           
            },{ title: '处理状态',
            dataIndex: 'dealStatus',
            render:(text,record)=>{
                if(Number(text) === 1){
                    return(
                        <div>已处理</div>
                    )
                }else {
                    return(
                        <div>待处理</div>
                    )
                }
            }
            
            },{title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',
            render: (text,record) => {
                return (
                    <div className='action'>
                    {record.dealStatus=='1'?(<a href="javascript:;"><span onClick={ () => this.detail(record)} >详情</span></a>):
                              (<a href="javascript:;"><span onClick={ () => this.deal(record)} >处理</span></a>)}&nbsp;
                        
                    </div>
                )
            }
        },
        ]
    }


        //添加
        detail=( record)=>{
            this.formRef.detail(record)
        }
    
         //编辑
         deal=(record)=>{
            this.formRef.deal(record)
        }
    componentDidMount(){
        this.props.form.setFieldsValue({'search':[moment(),moment()]})
        this.props.form.resetFields()
        this.list(this.state.pageNumber,this.state.pageSize,'','','','','','',[],[],[],[])
        this.carTypeList()
       
    }
    list = (pageNumber,pageSize,name,uploadStartTime,uploadEndTime,mintime,maxtime,warningInfo,
        warningStatus,cartype,warningLevel,handleStatus) => {
        Axios.post(HttpUrl+'vehicle/historyWarning/find',{
        startPage:pageNumber,
        pageSize:pageSize,
        name:name,
        uploadStartTime:uploadStartTime,
        uploadEndTime:uploadEndTime,
        mintime:mintime,
        maxtime:maxtime,
        warningInfo:warningInfo,
        warningStatus:warningStatus,
        cartype:cartype,
        warningLevel:warningLevel,
        handleStatus:handleStatus,
        }).then(res => {
            console.log(res)
            if(res.data.code === '100000'){
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.total,
                    current:pageNumber,
                    loading:false
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //车型获取
    carTypeList = () => {
        Axios.get(HttpUrl+'vehicle/vehicle/action/findCarModel').then(res => {
            console.log(res)
            if(res.data.code === '100000'){
                this.setState({
                    typeArr2:[]
                })
                let length=res.data.data.length
                let typeArr2=this.state.typeArr2
                for(let i=0;i<length;i++){
                    typeArr2.push(<div className='checks' key={i}  id={res.data.data[i].id}
                                       style={{border:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(e)}>
                        { res.data.data[i].name}
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
   
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
    }
    typeMore = () => {
        this.setState({
            typeMoreNum:!this.state.typeMoreNum
        })
    }
      //告警状态
      statusCheck = (value) => {
        let statusArr=this.state.statusArr
        if(statusArr.indexOf(Number(value))>=0){
            statusArr.splice(statusArr.indexOf(Number(value)),1)
        }else{
            statusArr.push(Number(value))
        }
        this.setState({
            statusArr:statusArr
        })
       this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
       this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
       this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
        this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr)
    }
      //车型
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
        this.carTypeList()
       
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
        this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
        this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
            this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr)
    }
      //告警等级
      levelCheck = (value) => {
        let levelArr=this.state.levelArr
        if(levelArr.indexOf(Number(value))>=0){
            levelArr.splice(levelArr.indexOf(Number(value)),1)
        }else{
            levelArr.push(Number(value))
        }
        this.setState({
            levelArr:levelArr
        })
       
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
        this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
        this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
            this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr)
    }
      //处理状态
      dealCheck = (value) => {
        let dealArr=this.state.dealArr
        if(dealArr.indexOf(Number(value))>=0){
            dealArr.splice(dealArr.indexOf(Number(value)),1)
        }else{
            dealArr.push(Number(value))
        }
        this.setState({
            dealArr:dealArr
        })
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
        this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
        this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
            this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr,)
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
        this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
        this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
            this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr)
    }
    timeChange1 = (dateString) => {
        if(dateString.length==0){
            this.setState({
                startTime:'',
                endTime:''
            })
        }else{
             console.log(dateString)
             this.setState({
            startTime:this.transformDate(dateString[0]),
            endTime:this.transformDate(dateString[1])
        })
        }
       
        
       
       
    }
    onOk = (value) => {
        console.log('onOk: ', value);
    }
    //中国标准时间转化为yy-mm-dd
    transformDate = (date) => {
        console.log(date)
        if(typeof(date)==undefined){
            return('')
        }else{
             const d=new Date(date)
        const year= d.getFullYear()
        const month=( (d.getMonth()+1)>9 ? (d.getMonth()+1) :'0'+(d.getMonth()+1) )
        const day=d.getDate()>9 ? d.getDate():'0'+d.getDate();
        const h=d.getHours()>9 ? d.getHours() : '0' + d.getHours()
        const minus=d.getMinutes()>9 ?d.getMinutes() : '0' +d.getMinutes()
        const second=d.getSeconds()>9 ? d.getSeconds() : '0' +d.getSeconds()
        return (year+'-'+month+'-'+day + ' ' + h + ':' + minus + ':' + second)
        }
       
    }
    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                startTime:'',
                endTime:'',
                typeMoreNum:false,
                modelMoreNum:false,
                typeArr:[],
                levelArr:[],
                dealArr:[],
                statusArr:[],
                time:[]
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.list(this.state.pageNumber,this.state.pageSize)
            this.carTypeList()
        })
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,
        this.state.startTime,this.state.endTime,this.props.form.getFieldValue('mintime') || null,
        this.props.form.getFieldValue('maxtime') || null,this.props.form.getFieldValue('warningInfo') || null,
            this.state.statusArr,this.state.typeArr,this.state.levelArr,this.state.dealArr)
    }
 
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType'>
                        <Col span={24}>
                            <FormItem label="关键字搜索">
                                {getFieldDecorator('name')( 
                                     <Input style={{width:'200px'}} placeholder='车牌号、VIN、终端SN' autoComplete="off"/>)}
                            </FormItem>
                            <FormItem label="上报时间">
                                { getFieldDecorator('searchTime')( <RangePicker
                                    style={{width:'300px'}}
                                    showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                    }}
                                    disabledDate={disabledDate}
                                    onChange={this.timeChange1}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    onOk={this.onOk}
                                />)}
                            </FormItem>
                            </Col>
                            <FormItem label="报警详情" style={{}} >
                                {getFieldDecorator('warningInfo')( 
                                     <Input style={{width:'200px'}} autoComplete="off"/>)}
                            </FormItem>
                            <FormItem style={{width:387,marginLeft:16}} >
                                <span>持续时长（min）：</span>
                                {getFieldDecorator('mintime')( 
                                     <Input autoComplete="off" style={{width:'90px', marginRight:'12px',marginLeft: 31}} />)}
                                     <span  >-</span>
                                     {getFieldDecorator('maxtime')( 
                                     <Input autoComplete="off" style={{marginLeft:'11px',width:'90px'}} />)}
                            </FormItem>

                            <Button type="primary" className='btn' style={{marginLeft:'36px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>

                            
                        </div>
                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={this.state.collapseStatus ?<span>更多</span> : <span>收起</span> } key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >报警状态：</div>
                                    <div className='moreBox' >
                                    <div className='checks' key='81' title='' id='1'
                                            style={{border:this.state.statusArr.indexOf(1)>=0 ? 
                                            '1px solid #3689FF' : '1px solid #E4E4E4',
                                            color:this.state.statusArr.indexOf(1) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.statusCheck('1')}>
                                                  发生
                                           <img src={ this.state.statusArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='21' title='' id='2'
                                            style={{border:this.state.statusArr.indexOf(2)>=0 ? 
                                            '1px solid #3689FF' : '1px solid #E4E4E4',
                                            color:this.state.statusArr.indexOf(2) >=0 ? '#3689FF' : '#999'}}  onClick={ (e) => this.statusCheck('2')}>
                                                  消失
                                           <img src={ this.state.statusArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >报警等级：</div>
                                    <div className='moreBox' >
                                        <div className='checks' key='31' title='' id='1'
                                              style={{border:this.state.levelArr.indexOf(1)>=0 ? 
                                                '1px solid #3689FF' : '1px solid #E4E4E4',
                                                color:this.state.levelArr.indexOf(1) >=0 ? '#3689FF' : '#999'}}     onClick={ (e) => this.levelCheck('1')}>
                                                  一级
                                           <img src={ this.state.levelArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='41' title='' id='2'
                                              style={{border:this.state.levelArr.indexOf(2)>=0 ? 
                                                '1px solid #3689FF' : '1px solid #E4E4E4',
                                                color:this.state.levelArr.indexOf(2) >=0 ? '#3689FF' : '#999'}}     onClick={ (e) => this.levelCheck('2')}>
                                                  二级
                                           <img src={ this.state.levelArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='51' title='' id='3'
                                              style={{border:this.state.levelArr.indexOf(3)>=0 ? 
                                                '1px solid #3689FF' : '1px solid #E4E4E4',
                                                color:this.state.levelArr.indexOf(3) >=0 ? '#3689FF' : '#999'}}    onClick={ (e) => this.levelCheck('3')}>
                                                  三级
                                           <img src={ this.state.levelArr.indexOf(3) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >处理状态：</div>
                                    <div className='moreBox' >
                                    <div className='checks' key='61' title='' id='1'
                                              style={{border:this.state.dealArr.indexOf(1)>=0 ? 
                                                '1px solid #3689FF' : '1px solid #E4E4E4',
                                                color:this.state.dealArr.indexOf(1) >=0 ? '#3689FF' : '#999'}}     onClick={ (e) => this.dealCheck('1')}>
                                                  已处理
                                           <img src={ this.state.dealArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='71' title='' id='2'
                                              style={{border:this.state.dealArr.indexOf(2)>=0 ? 
                                                '1px solid #3689FF' : '1px solid #E4E4E4',
                                                color:this.state.dealArr.indexOf(2) >=0 ? '#3689FF' : '#999'}}     onClick={ (e) => this.dealCheck('2')}>
                                                  待处理
                                           <img src={ this.state.dealArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >车型：</div>
                                    <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px',}}>
                                        <div className='whichListener'>
                                             {
                                                this.state.typeArr2
                                             }
                                        </div>
                                             
                                    </div>
                                    {this.state.typeArr2.length >10 ?
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

                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                `}
                </style>
                <DetailOrDeal wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></DetailOrDeal>

            </div>
        )
    }
}

const historyAlarms = Form.create()(historyAlarm);
export default historyAlarms;
