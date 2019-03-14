/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>转发管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import add from './../../../img/add.png'
import AddEdit from './addEdit'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {transformDate} from './../../../util/util'
import moment from 'moment';
import { resolve } from 'url';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
class forwardManagement extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        modalVisible:false,
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:false,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeArr:[],
        typeArr2:[],
        modelArr:[],
        modelArr2:[],
        time:[],
        searchDataSource:[],
        tableData:[],
        columns:[
            { title: '序号',
                width: 60,
                dataIndex: 'number',
                fixed: 'left'
            },{ title: '接受方名称',
                dataIndex: 'name',
                className:'clounWidth'
            },{ title: '转发地址',
                dataIndex: 'transIp' ,
                className:'clounWidth'
            },{ title: '端口',
                dataIndex: 'transPort',
                className:'clounWidth'
            },{ title: '状态',
                dataIndex: 'status' ,
                render:  function (text, record){
                   console.log(record.status)
                        if (record.status == 1) {
                            return (<div>启用</div>)
                        } else if(record.status == 2)  {
                            return (<div>禁用</div>)
                        } else{
                            return(<div></div>)
                        }
                    
                },
                className:'clounWidth'
            },{ title: '编辑时间',
                dataIndex: 'createTime',
                className:'clounWidth'
            },{title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',
                render: (text,record) => {
                    return (
                        <div className='action'>
                            <a href="javascript:;"><span onClick={ () => this.edit(record)}>编辑</span></a> &nbsp;
                            <a href="javascript:;"><span onClick={ () => this.delete(record)} >删除</span></a>&nbsp;
                        </div>
                    )
                }
            },
        ]
    }
    componentDidMount(){
        this.list(this.state.pageNumber,this.state.pageSize,'',null)
    }
    // //权限控制
    // authority = (pageNumber,pageSize,receiverName,status) => {
    //     console.log(status)
    //     Axios.post(HttpUrl+'sys/system/resource/pageButton',{
    //         startPage:pageNumber,
    //         pageSize:pageSize,
    //         receiverName:receiverName,
    //         status:status},httpConfig).then(res => {
    //         if(res.data.code === '100000'){
    //             let length=res.data.data.list.length;
    //             for(let i=0;i<length;i++){
    //                 res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
    //                 res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;

    //             }
    //             this.setState({
    //                 tableData:res.data.data.list,
    //                 total:res.data.data.total,
    //                 current:pageNumber,
    //                 loading:false
    //             })
    //         }else{
    //             message.warning(res.data.message)
    //         }
    //     })
    // }
    list = (pageNumber,pageSize,receiverName,status) => {
        console.log(status)
        Axios.post(HttpUrl+'sys/transmit/transmitList',{
            startPage:pageNumber,
            pageSize:pageSize,
            name:receiverName,
            status:status},httpConfig).then(res => {
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
    //添加
    add=()=>{
        this.formRef.add()
    }
    //编辑
    edit=(record)=>{
        this.formRef.edit(record)
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name') || null,this.state.typeArr)
    }
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
    }

    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                typeMoreNum:false,
                modelMoreNum:false,
                typeArr:[],
                modelArr:[],
                time:[]
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.list(this.state.pageNumber,this.state.pageSize)
            
        })
    }
    //类型
    typeCheck = (value) => {
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(Number(value))>=0){
            typeArr.splice(typeArr.indexOf(Number(value)),1)
        }else{
            typeArr.push(Number(value))
        }
        console.log(typeArr)
        this.setState({
            typeArr:typeArr
        })
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('receiverName') || null,this.state.typeArr)
    }

    //删除设备
    delete = (record) => {
        
        this.setState({
            modalVisible:true,
            record:record,
        })
    }
    //确定删除
    sureDelete=()=>{
        console.log(this.props.form.getFieldValue('name'))
        Axios.delete(HttpUrl+'sys/transmit/deleteTransmit?id='+this.state.record.id).then(res=>{
            console.log(res.data)
            if( res.data.code === '100000') {
                this.setState({
                    modalVisible:false,
                })
                this.list(this.state.pageNumber,this.state.pageSize,'',this.state.typeArr)
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.props.form.getFieldValue('receiverName') || null,this.state.typeArr)
    }

     //清除条件
     clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                typeMoreNum:false,
                modelMoreNum:false,
                typeArr:[],
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.list(this.state.pageNumber,this.state.pageSize)
            
        })
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType'>
                            <FormItem label="接收方名称">
                                { getFieldDecorator('name')(<Input autoComplete="off"/>)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>

                        </div>
                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={this.state.collapseStatus ? <span>收起</span>: <span>更多</span>} key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >状态：</div>
                                    <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>
                                    <div className='checks' key='1' title='' id='1'
                                           style={{border:this.state.typeArr.indexOf(1)>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf(1) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(1)}>
                                                  启用
                                           <img src={ this.state.typeArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='2' title='' id='2'
                                           style={{border:this.state.typeArr.indexOf(2)>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf(2) >=0 ? '#3689FF' : '#999'}} onClick={ (e) => this.typeCheck(2)}>
                                                  禁用
                                           <img src={ this.state.typeArr.indexOf(2) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                   
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
                </div>
                <div>
                    <div  className='oprateHead'>
                        <Button type="primary" className='btn' ghost onClick={ this.add}>
                            <img src={add} alt=""/>
                            新增</Button>

                    </div>
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
                    <AddEdit wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.current,this.state.pageSize,this.props.form.getFieldValue('name')||'',this.state.typeArr) }></AddEdit>
<Modal
                    title="删除"
                    wrapClassName="vertical-center-modal"
                    visible={this.state.modalVisible}
                    okText="确定"
                    cancelText="取消"
                    onOk={ this.sureDelete}
                    onCancel={ this.cancel}
                    maskClosable={false}
                >
                    <p>确定要删除该转发吗？</p>
                </Modal>
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
            </div>
        )
    }
}

const forwardManagements = Form.create()(forwardManagement);
export default forwardManagements;
