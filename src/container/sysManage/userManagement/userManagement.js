/**
 * Created by ts on 2018/11/24.
 */
/**
 * Created by ts on 2018/11/24.
 */
/*系统管理>用户管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import AddEdit from './addEdit'
import add from './../../../img/add.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
class userManagement extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        record:'',
        reSetVisible:false,
        reStartVisible:false,
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
               
            },{ title: '用户账号',
                dataIndex: 'account',
                className:'clounWidth'
            },{ title: '所在单位',
                dataIndex: 'organization' ,
                className:'clounWidth'
            },{ title: '用户姓名',
                dataIndex: 'name',
                className:'clounWidth'
            },{ title: '联系电话',
                dataIndex: 'mobile' ,
                className:'clounWidth'
            },{ title: '状态',
                dataIndex: 'status',
                className:'clounWidth',
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
            },{title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',
                render: (text,record) => {
                    return (
                        <div className='action'>
                            <a href="javascript:;"><span onClick={ () => this.userEdit(record)}>编辑</span></a> &nbsp;
                            {record.status=='0'?(<a href="javascript:;"><span onClick={ () => this.reStart(record)} >启用</span></a>):
                              (<a href="javascript:;"><span onClick={ () => this.reStart(record)} >禁用</span></a>)}&nbsp;
                            <a href="javascript:;"><span onClick={ () => this.reSet(record)} >重置密码</span></a>&nbsp;

                        </div>
                    )
                }
            },
        ]
    }
    componentDidMount(){
        this.list(this.state.pageNumber,this.state.pageSize,'','','')
    
    }
    list = (pageNumber,pageSize,account,organization,name) => {
        Axios.get(HttpUrl+'sys/system/user/userList?startPage='+pageNumber+
            '&pageSize='+pageSize+
            '&account='+account+
            '&organization='+organization+
            '&name='+name,
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
            }
        })
    }
   
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',
        this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'')
    }
    //启动
    reStart=(record)=>{
        this.setState({
        reStartVisible:true,
        record:record,
        })
    }
    //确认启动或者禁用
        sureReStart=()=>{
            Axios.put(HttpUrl+'sys/system/user/userStatus',
            {id:this.state.record.id,
                status:this.state.record.status,},
           httpConfig).then(res => {
                    console.log(res)
                    if(res.data.code === '100000'){
                    
                        this.setState({
                            reStartVisible:false,
                        })
                        this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',
                        this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') 
                    }
                })
        }
    //重置
    reSet=(record)=>{
        this.setState({
            reSetVisible:true,
            record:record,
        })
    }
    //确认重置
    sureReSet=()=>{
        Axios.put(HttpUrl+'sys/system/user/resetPassword',
                 {
                     id:this.state.record.id,
                     status:this.state.record.status,
                 }
            ).then(res => {
                console.log(res)
                if(res.data.code === '100000'){
                
                    this.setState({
                        reSetVisible:false,
                        
                    })
                }
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
            this.list(this.state.pageNumber,this.state.pageSize,'','','')
          
        })
    }
    cancel=()=>{
        this.setState({
            reSetVisible:false,
        reStartVisible:false,
        })
    }
    //添加
    userAdd=()=>{
        this.formRef.add()
    }

     //编辑
     userEdit=(record)=>{
        this.formRef.edit(record)
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',
        this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'')
    }

    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className='searchType'style={{width:'100%'}}>
                            <FormItem label="用户账号">
                                { getFieldDecorator('account'
                                
                                )( <Input autoComplete="off" style={{width:'160px'}}
                                   />)}
                            </FormItem>
                            <FormItem label="所在单位">
                                {getFieldDecorator('organization')( 
                                     <Input style={{width:'160px'}}/>)}
                            </FormItem>
                            <FormItem label="用户姓名">
                                { getFieldDecorator('name')( <Input autoComplete="off"
                                    style={{width:'160px'}}
                                   />)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                        </div>
                    </Form>
                </div>
                <div>
                    <div  className='oprateHead'>
                        <Button type="primary" className='btn' ghost onClick={ this.userAdd}>
                            <img src={add} alt=""/>
                            新增</Button>
                    </div>
                    <div className='table tableInfo'>
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
                <AddEdit wrappedComponentRef={(form) => this.formRef = form} list={ () => this.list(this.state.current,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></AddEdit>
                <Modal
                    title="启用/禁用"
                    visible={this.state.reStartVisible}
                    okText="确定"
                    cancelText="取消"
                    onOk={ this.sureReStart}
                    onCancel={ this.cancel}
                    maskClosable={false}
                    
                >
                    <p style={{textAlign: 'center'}}>确定{this.state.record.status=='0'?'启用':'禁用'}此用户吗？</p>
                </Modal>
                <Modal
                    title="重置"
                    visible={this.state.reSetVisible}
                    okText="确定"
                    cancelText="取消"
                    onOk={ this.sureReSet}
                    onCancel={ this.cancel}
                    maskClosable={false}
                >
                    <p style={{textAlign: 'center'}}>确定重置此用户密码吗？</p>
                </Modal>
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

const userManagements = Form.create()(userManagement);
export default userManagements;
