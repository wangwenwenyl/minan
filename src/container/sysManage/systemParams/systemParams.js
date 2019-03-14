/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>系统参数*/
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
class systemParamss extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
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
            },{ title: '参数名称',
                dataIndex: 'key1',
                
            },{ title: '参数值',
                dataIndex: 'value' ,
               
            },{ title: '单位',
                dataIndex: 'organization',
               
            },{ title: '编辑人',
                dataIndex: 'editor' ,
                
            },{ title: '编辑时间',
                dataIndex: 'modifyTime',
                
            },{ title: '备注',
                dataIndex: 'desc',
                
            },{title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',
                render: (text,record) => {
                    return (
                        <div className='action'>
                            <a href="javascript:;"><span onClick={ () => this.edit(record)}>编辑</span></a> &nbsp;
                        </div>
                    )
                }
            },
        ]
    }
    componentDidMount(){
        this.list(this.state.pageNumber,this.state.pageSize,'')
    }
    list = (pageNumber,pageSize,parameterName) => {
        Axios.get(HttpUrl+'sys/system/param/paramList?startPage='
        +pageNumber+'&pageSize='+pageSize+'&key='+parameterName,  
        httpConfig).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key1=res.data.data.list[i].key;
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

    
 

    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('parameterName') || '',)
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
            this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
            this.eqmTypesList()
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
    //删除设备
    delete = (record,action) => {
        this.form4.deleteSubmit(record,action)
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
    }
 
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType'>
                            <FormItem label="参数名称">
                                { getFieldDecorator('parameterName')( <Input autoComplete="off"/>)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        </div>
                    </Form>
                </div>
                <div>
                    <div className='oprateHead'>
                        <Button type="primary" className='btn' ghost onClick={ this.add}>
                            <img src={add} alt=""/>
                            新增</Button>
                    </div>
                    <div className='table tableInfo'>
                        <Table
                            scroll={1300}
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
                    <AddEdit wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.current,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></AddEdit>

                </div>
                <style>
                    {`
                    .tableInfo table td{ 
                        max-width:260px; 
                        word-wrap:break-word; 
                        text-overflow:ellipsis; 
                        white-space:nowrap; 
                        overflow:hidden; 
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

const systemParams = Form.create()(systemParamss);
export default systemParams;
