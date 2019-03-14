/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Switch} from 'antd';
import  Table  from "./../../../component/table/table";
import {HttpUrl} from './../../../util/httpConfig'
import {validatorMobile,validatorUserPhone,validatorName,companyName,validatorNames} from './../../../util/validator'

const Option = Select.Option;
const FormItem = Form.Item;
class addEdit extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        number:{
            value:''
        },
        total:'',
        roleIds:[],
        status:'',
        selectedRowKeys: [],
        startPage:1,
        pageSize:10,
        record:'',
        operation:'',
        addModal:false,
        treeData:[],
        flag:'',
        searchDataSource:[],
        vinArr:'',
        vinId:'',
        columns:[{ 
            title: '序号',
            dataIndex: 'number',
            width:'60px'
        },{ title: '角色名称',
            dataIndex: 'name',
        },{ title: '备注',
            dataIndex: 'description' ,
            render: (text) => <span className="colSql" >{text}</span>,
        },
        ]
    }
    componentDidMount(){
            this.roleList(this.state.startPage,this.state.pageSize)
    }
    roleList=(startPage,pageSize)=>{
        Axios.get(HttpUrl+'sys/system/role/roleList?startPage='+startPage+'&pageSize='+pageSize+'&status=1').then(res => {
            console.log(res)
            if(res.data.code === '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(startPage-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].id;
                }
                console.log(res.data.data.total)
                this.setState({
                   tableData:res.data.data.list,
                   total:res.data.data.total,
                   current:startPage,
                })
            }
        })
    }
    onSelect = (value,node,extra) => {
        console.log(node.props.title.split('  '))
        new Promise(resolve => {
            this.setState({
                treeSelectValue:node.props.title.split('  '),
                parentId:node.props.parentId,
                childrenId:value.split(',')[0]
            })
            this.props.form.resetFields()
            resolve(node.props.parentName)
        }).then(res => {
            this.props.form.setFieldsValue({'eqmTypeName':res})
        })
    }

//添加
    add=()=>{
        this.roleList(this.state.startPage,this.state.pageSize)
        this.setState({
            addModal:true,
            operation:'1',
            flag:'',
        })
    }
//编辑
    edit=(record)=>{
        
        Axios.get(HttpUrl+'sys/system/user/userDetails?id='+record.id).then(res => {
            console.log(res)
            console.log(1)
            if(res.data.code === '100000'){
               
                this.setState({
                    selectedRowKeys:res.data.data.roleIds
                })
            }
        })
        console.log(record)
        this.setState({
            id:record.id,
            addModal:true,
            operation:'2',
            flag:'1',
            record: record,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                              if(this.state.operation=='1'){        //add
                                    Axios.post(HttpUrl+'sys/system/user/addUser',{
                                        'name':this.props.form.getFieldValue('name') || null,
                                        'account':this.props.form.getFieldValue('account') || null,
                                        'mobile':this.props.form.getFieldValue('mobile') || null,
                                        'organization':this.props.form.getFieldValue('organization') || null,
                                        'status':Number(this.state.status),
                                        'roleIds':this.state.roleIds,
                                    }).then(res => {
                                        console.log(res)
                                        if(res.data.code === '100000'){
                                            this.setState({
                                                addModal:false,
                                                roleIds:[],
                                                selectedRowKeys:[]
                                            })
                                            message.warning(res.data.message)
                                            this.props.list()
                                        }
                                    })
                                }else{
                                        //edit
                                        console.log(this.state.status)
                                        Axios.put(HttpUrl+'sys/system/user/editUser',{
                                            'id':this.state.id,
                                            'name':this.props.form.getFieldValue('name') || null,
                                            'account':this.props.form.getFieldValue('account') || null,
                                            'mobile':this.props.form.getFieldValue('mobile') || null,
                                            'organization':this.props.form.getFieldValue('organization') || null,
                                            'status':this.state.status,
                                            'roleIds':this.state.selectedRowKeys,
                                        }).then(res => {
                                            console.log(res)
                                            if(res.data.code === '100000'){
                                                this.setState({
                                                    addModal:false,
                                                    roleIds:[],
                                                    selectedRowKeys:[]
                                                })
                                                this.props.list()
                                            }
                                        })
                                    }
            }
        })       
   }
            
     
    
    sureAdd = () => {
        this.addSubmit()
    }
    cancelAdd = () => {
        this.setState({
            addModal:false,
            detail:'',
            treeSelectValue:[],
            treeData:[],
            flag:'',
            searchDataSource:[],
            selectedRowKeys:[],
            vinArr:'',
            vinId:''
        })
    }
    changeContent=(checked)=>{
        console.log(checked)
        this.setState({
            status:checked==false?'0':'1'
        })
    }
    onChange = (pageNumber) => {
        this.roleList(pageNumber,this.state.pageSize)
    }
    render() {
        const {selectedRowKeys,number} = this.state;
        const { getFieldDecorator}=this.props.form
        
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows, record) => {
                console.log(record,selectedRowKeys,selectedRows)
                var ids=[];
                for(let i=0;i<selectedRows.length;i++){
                     ids.push(selectedRows[i].id)
                }
                console.log(ids)
                this.setState({
                    selectedRowKeys,
                    roleIds:ids
                });
            }
        };
        return (
            <div className="content" >
                <Modal
                    title={ this.state.flag ?   '编辑':'新增' }
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancelAdd}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    maskClosable={false}
                    className='treeBox addBox'
                >
                    <div style={{height:700,overflow:'auto'}}>
                        <Form  onSubmit={ this.addSubmit}>
                            <Row style={{padding:'0px 16px'}}>
                               
                                <Col span={24}>
                                    <Col span={24}>
                                        <div style={{marginTop:15,position:'relative'}}>
                                            <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                               height: 14,marginRight:5 }}></div>
                                               <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                   <span>账号信息</span>
                                               </div>
                                            
                                        </div>
                                    </Col>
                                    <Col span={12} style={{marginTop:31}}>
                                        <FormItem label="用户账号" style={{marginLeft:26,}}
                                        labelCol={{span:7}} wrapperCol={{span:17}}
                                        validateStatus={number.validateStatus}
                                        help={number.errorMsg}>
                                            { getFieldDecorator('account',{
                                                rules:[{
                                                    required: true ,  validator:validatorName,
                                                    
                                                }],
                                                initialValue:this.state.flag ? this.state.record.account : ''
                                            })( < Input autocomplete="off" className="width-info" autoComplete="off" />)}
                                        </FormItem>
                                        <FormItem label="联系电话" labelCol={{span:7}} wrapperCol={{span:17}}style={{marginLeft:26,}}>
                                            { getFieldDecorator('mobile',{
                                                rules:[{
                                                    required: true ,validator:validatorUserPhone,
                                                   
                                                }],
                                                initialValue:this.state.flag ? this.state.record.mobile : ''
                                            })( < Input autocomplete="off" className="width-info" autoComplete="off"/>)}
                                        </FormItem>
                                        <FormItem label="状态" style={{marginLeft:26,}} labelCol={{span:7}} wrapperCol={{span:17}}>
                                           
                                            <Switch checkedChildren="启用" unCheckedChildren="禁用" onChange={this.changeContent} defaultChecked={this.state.record.status=='1'?true:false} />
                                            
                                        </FormItem>
                                      
                                    </Col>
                                    <Col span={12} style={{marginTop:31}}>
                                        <FormItem label="所在单位" labelCol={{span:7}} wrapperCol={{span:17}}>
                                            { getFieldDecorator('organization',{
                                                rules:[{
                                                    required: true , validator:companyName,
                                                }],
                                                initialValue:this.state.flag ? this.state.record.organization : ''
                                            })( < Input autocomplete="off" className="width-info" autoComplete="off"/>)}
                                        </FormItem>
                                        <FormItem label="用户姓名" labelCol={{span:7}} wrapperCol={{span:17}}>
                                            { getFieldDecorator('name',{
                                                rules:[{
                                                    required: true , validator:validatorNames
                                                }],
                                                initialValue:this.state.flag ? this.state.record.name : ''
                                            })( < Input autocomplete="off" className="width-info" autoComplete="off" />)}
                                        </FormItem>
                                       
                                        
                                    </Col>
                                    <Col span={24}>
                                    <div style={{height:1,width:'440px',margin:'0px auto',borderTop:'1px solid #F1F1F1' }}></div>
                                    </Col>
                                </Col>
                                <Col span={24} style={{marginTop:42}}>
                                    <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                        <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                            height: 14,marginRight:5 }}></div>
                                            <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                <span>分配角色</span>
                                            </div>
                                        
                                    </div>
                                </Col>
                                <Col  span={21} style={{marginLeft:47,marginTop:45}}>   
                                <div className='table tableInfo' id='table'>
                                    <Table
                                            rowSelection={rowSelection}
                                            columns={this.state.columns}
                                            dataSource={this.state.tableData}
                                            loading={this.state.loading}
                                            total={this.state.total}
                                            current={this.state.current}
                                            pageSize={this.state.pageSize}
                                            onChange={this.onChange}
                                            
                                        />
                                </div>      
                                    
                                </Col>
                            </Row>
                        </Form>
                    </div>
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
                  
                    .ant-switch-loading-icon, .ant-switch:after{
                        height:16px;border-radius: 0px;
                    }
                    .ant-switch{height:20px;border-radius: 0px;}
                    .width-info{ width:160px!important;}
                    .treeBox{width:640px !important;height:599px !important;}
                    .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;}
                    .ant-select-tree{height:300px;overflow:scroll;}
                    .addBox .ant-row .ant-form-item{margin-bottom:15px}
                    .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    .inputRead{margin-bottom:15px;}
                    .ant-select-tree{height:200px !important;}
                    .colSql{
                        overflow : hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                       
                        word-break: keep-all;
                        width: 200px;
                        
                    }
                `}
                </style>
            </div>
        )
    }
}
const addEdits = Form.create()(addEdit);
export default addEdits;