/**
 * Created by ts on 2018/11/24.
 */

/*系统管理>角色管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import add from './../../../img/add.png'
import AddRoler from './addRoler'
import View from './view'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
const FormItem = Form.Item;
class roleManagement extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        modalVisible:false,
        loading:false,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        selectedRowKeys:[],
        deleteRowIdSingle:'',
        deleteRowId: [],
        ids:[],
        typeArr:[],
        typeArr2:[],
        modelArr:[],
        modelArr2:[],
        time:[],
        searchDataSource:[],
        tableData:[],
        columns:[
            { title: '序号',
               
                dataIndex: 'number',
                
            },{ title: '角色名称',
                dataIndex: 'name',
                
            },{ title: '备注',
                dataIndex: 'description' ,
                
            },{ title: '状态',
                dataIndex: 'status',
                render:(text,record)=>{
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
                
            },{title: '操作',width:'180px',
                render: (text,record) => {
                    return (
                        <div className='action'>
                            <a href="javascript:;"><span onClick={ () => this.view(record)} >查看</span></a>&nbsp;
                            <a href="javascript:;"><span onClick={ () => this.rolerEdit(record)}>编辑</span></a> &nbsp;
                            <a href="javascript:;"><span onClick={ () => this.showModal(record)} >删除</span></a>&nbsp;
                        </div>
                    )
                }
            },
        ]
    }
    //删除弹框
    showModal = (record) => {
console.log(record.id)
        if(record.id){
            
            this.setState({
                modalVisible:true,
                deleteRowIdSingle:record.id
            });
        }else{
            console.log(this.state.deleteRowId)
            if(this.state.deleteRowId.length == 0){
                message.warning('请至少选中一个角色')
            }else{
                this.setState({
                    modalVisible:true,
                    deleteRowIdSingle:'',
                });
            }
        }
    }
    sureDelete = () => {
        console.log(this.state.deleteRowIdSingle)
        console.log(typeof(this.state.deleteRowIdSingle))
        //删除接口
        if(this.state.deleteRowIdSingle){
            this.deleteRole(this.state.deleteRowIdSingle)
            this.setState({ selectedRowKeys:[]});
        }else{
            
            this.deleteRole1(this.state.deleteRowId)
            this.setState({ selectedRowKeys:[]});
        }
        this.setState({
            modalVisible:false,
        });
    }
    //删除一个
    deleteRole = (id) => {
        console.log(this.props.form.getFieldValue('name'))
        Axios.delete(HttpUrl+'sys/system/role/deleteRole?id='+id,).then(res=>{
            console.log(res.data)
            if( res.data.code === '100000') {

                this.list(this.state.pageNumber,this.state.pageSize,'')
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //删除多个
    deleteRole1 = (ids) => {
        console.log(ids)
        Axios.put(HttpUrl+'sys/system/role/deleteRoles',{ids:ids},httpConfig).then(res=>{
            console.log(res.data)
            if( res.data.code === '100000'){
                console.log(123)
                
                   
                    this.setState({ 
                        selectedRowKeys:[],
                        deleteRowId:[],
                    });
                
                this.list(this.state.pageNumber,this.state.pageSize,'')
            }else{
                message.warning(res.data.message)
            }
        })
    }
    componentDidMount(){
        this.list(this.state.pageNumber,this.state.pageSize,'')
        
       
    }
    list = (pageNumber,pageSize,name) => {
        Axios.get(HttpUrl+'sys/system/role/roleList?startPage='+pageNumber+'&pageSize='+pageSize+'&name='+name
            
        ).then(res => {
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
 

    //新增
    rolerAdd=()=>{
        this.formRef.add()
    }
    //编辑
    rolerEdit=(record)=>{
        this.formRef.edit(record)
    }
    //查看
    view=(record)=>{
        this.formRef1.view(record)
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('name')||'')
    }


    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
               
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.list(this.state.pageNumber,this.state.pageSize,'')
            
        })
    }
    cancel= () => {
        this.setState({
            modalVisible:false,
            
        })
    }

    //删除
    delete = (record,action) => {
        this.form4.deleteSubmit(record,action)
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
    }
    changeValue=(event)=>{
        
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    
}
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onChange :(selectedRowKeys) => {
                this.setState({ selectedRowKeys });
            }
        };
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType'>
                            <FormItem label="角色名称">
                                { getFieldDecorator('name')
                                ( <Input  style={{width:200}} onKeyDown={this.changeValue} autoComplete="off"/>)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>

                        </div>
                    </Form>
                </div>
                <div>
                    <div  className='oprateHead'>
                        <Button type="primary" className='btn' ghost onClick={ this.rolerAdd}>
                            <img src={add} alt=""/>
                            新增</Button>
                        <Button type="primary" className='btn' onClick={this.showModal} ghost>
                            <img src={add} alt=""/>
                            删除</Button>

                    </div>
                    <div className='table tableInfo  '>
                        <Table
                            scroll={1100}
                            rowSelection={rowSelection}
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
                    <AddRoler wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.current,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></AddRoler>
                    <View wrappedComponentRef={(form) => this.formRef1 = form} list={ () => this.list(this.state.current,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></View>

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
                    <p>确定要删除该角色吗？</p>
                </Modal>
            </div>
        )
    }
}

const roleManagements = Form.create()(roleManagement);
export default roleManagements;
