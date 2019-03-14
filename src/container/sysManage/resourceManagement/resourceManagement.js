/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>资源管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import add from './../../../img/add.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {transformDate} from './../../../util/util'
import NewResource from './newResource'
import { resolve } from 'url';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
class resourceManagement extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:200,
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
            { title: '名称',
               width:260,
                dataIndex: 'name',
                fixed: 'left'
            },{ title: 'URL',
                dataIndex: 'url',

            },{ title: '图标',
                dataIndex: 'icon',

            },
            { title: '资源类型',
                dataIndex: 'resourceType',render:(text,record)=>{
                    if(Number(text) === 1){
                        return(
                            <div>模块</div>
                        )
                    }else {
                        return(
                            <div>功能</div>
                        )
                    }
                }

            },{ title: '排序',
                dataIndex: 'sort' ,

            },{ title: '打开方式',
                dataIndex: 'openType',

            },{ title: '状态',
                dataIndex: 'status',render:(text,record)=>{
                    if(Number(text) === 1){
                        return(
                            <div>启用</div>
                        )
                    }else {
                        return(
                            <div>禁用</div>
                        )
                    }
                }
            },{title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',
                render: (text,record) => {
                    return (
                        <div className='action'>
                            <a href="javascript:;"><span onClick={ () => this.deviceEdit(record)}>编辑</span></a> &nbsp;
                        </div>
                    )
                }
            },
        ],
        
    }
    componentDidMount(){
        this.list('','','')
        // this.eqmTypesList()
    }
    editData=(data)=>{

        if(data){
                data.map((item)=>{
                    if(item){
                
                        item.key=item.key+String(item.pid)
                        this.editData(item.children)
                    }
                    
                })
            }
        return(data)
    }
    list = (id,groupName,groupKey) => {
        Axios.get(HttpUrl+'sys/system/resource/resourceList'
       ,httpConfig).then(res => {
           console.log(res)
            if(res.data.code === '100000'){
                // var insertData=this.editData(res.data.data)
                // console.log(insertData)
                this.setState({
                    tableData:res.data.data,
                    loading:false
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
    modelMore = () => {
        this.setState({
            modelMoreNum:!this.state.modelMoreNum
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
        this.setState({
            typeArr:typeArr
        })
        // this.eqmTypesList()
        // this.eqmSeriesList(this.state.typeArr)
        this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr)
    }
   
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
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


    //删除设备
    delete = (record,action) => {
        this.form4.deleteSubmit(record,action)
    }
    //添加
    resourceAdd=()=>{
        this.formRef.add()
    }
    //编辑
    deviceEdit=(record)=>{
        this.formRef.edit(record)
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
                            <FormItem label="名称">
                                { getFieldDecorator('keyword')( <AutoComplete
                                    style={{width:'200px'}}
                                    dataSource={ this.state.searchDataSource}
                                    onSearch={this.handleSearch} />)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                        </div>
                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={this.state.collapseStatus ? <span>收起</span>: <span>更多</span>} key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >资源类型：</div>
                                    <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>
                                        <div className='checks' key='1' title='' id='1'
                                            style={{border: '1px solid #3689FF',color:'#3689FF'}}   onClick={ (e) => this.typeCheck(1)}>
                                                  模块
                                           <img src={ this.state.typeArr.indexOf(1) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='2' title='' id='2'
                                            style={{border: '1px solid #3689FF',color:'#3689FF'}}   onClick={ (e) => this.typeCheck(2)}>
                                                  功能
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
                        <Button type="primary" className='btn' ghost onClick={ this.resourceAdd}>
                            <img src={add} alt=""/>
                            添加</Button>
                    </div>
                    <div className='table tableInfo'>
                        <Table
                            scroll={1400}
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
                <NewResource wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr) }></NewResource>

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

const resourceManagements = Form.create()(resourceManagement);
export default resourceManagements;

