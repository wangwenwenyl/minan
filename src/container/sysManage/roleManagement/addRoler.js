/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Table,Switch} from 'antd';
import Role_authority from '../../../component/role_authority/role_authority'
import {validatordesc1,validatorRoleName,validatorParameter} from './../../../util/validator'
import {HttpUrl} from './../../../util/httpConfig'
const { TextArea } = Input;
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
        menus:[],
        roleData:[],
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
    }
    componentDidMount(){
        Axios.get(HttpUrl+'sys/system/resource/resourceList?status=1'
        ).then(res => {
            console.log(res)
             if(res.data.code === '100000'){
               
                 this.setState({
                    roleData:res.data.data,
                     loading:false
                 })
             }else{
                 message.warning(res.data.message)
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
        this.setState({
            menus:[],
            addModal:true,
            operation:'1',
            flag:'',
        })
    }
//编辑
    edit=(record)=>{
        Axios.get(HttpUrl+'sys/system/role/roleDetails?id='+record.id,
        ).then(res => {
            console.log(res)
             if(res.data.code === '100000'){
                
                 this.setState({
                    menus:res.data.data.keys,
                     loading:false
                 })
             }else{
                 message.warning(res.data.message)
             }
         })
        console.log(record)
        this.setState({
            addModal:true,
            operation:'2',
            flag:'1',
            record: record,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.operation=='1'){  
                        //add
                    if(this.state.menus.length==0){
                        message.warning('角色不能为空')
                    }
                    else{ 
                        Axios.post(HttpUrl+'sys/system/role/addRole',{
                            'name':this.props.form.getFieldValue('name') || null,
                            'description':this.props.form.getFieldValue('description') || null,
                            'keys':this.state.menus,
                            'status':Number(this.state.status),
                            
                        }).then(res => {
                            console.log(res)
                            if(res.data.code === '100000'){
                                this.setState({
                                    addModal:false,
                                    menus:[],
                                })
                                this.props.form.resetFields()
                                this.props.list()
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }
                    
                }else{
                        //edit
                    if(this.state.menus.length==0){
                        message.warning('权限配置不能为空')
                    }
                    else{ 
                        Axios.put(HttpUrl+'sys/system/role/editRole',{
                            'name':this.props.form.getFieldValue('name') || null,
                            'description':this.props.form.getFieldValue('description') || null,
                            'keys':this.state.menus,
                            'status':Number(this.state.status),
                            'id':this.state.record.id,
                        }).then(res => {
                            console.log(res)
                            if(res.data.code === '100000'){
                                this.setState({
                                    addModal:false,
                                    menus:[],
                                })
                                this.props.list()
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }
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
            vinArr:'',
            vinId:''
        })
    }
    changeContent=(checked)=>{
        console.log(checked)
      
        this.setState({
            status:checked==false?'0':'1'
        })
        console.log(this.state.status)
    }


    
      //权限选中
      onCheck=(checkedKeys, info)=>{
        console.log(info);
        console.log(checkedKeys);
        
        this.setState({
            menus:checkedKeys,
        })
        // if(checkedKeys){
        //     for(var i=0;i<checkedKeys.length;i++){
        //         newChecked=newChecked+checkedKeys[i]+","
        //     }
        // }
       
        console.log(this.state.menus)
    }
    changeValue=(event)=>{
        
            if(event.keyCode=='32'){
                event.preventDefault();
                return false;
            }
        
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
                    menus:ids
                });
            }
        };
        return (
            <div className="content" >
                <Modal
                    title={ this.state.flag ?'编辑':'新增'}
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancelAdd}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    maskClosable={false}
                    className='treeBox addBox'
                >
                    <div>
                        <Form  onSubmit={ this.addSubmit}>
                            <Row style={{padding:'0px 16px'}}>
                               
                                <Col span={12}>
                                    <Col span={24}>
                                        <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                            <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                               height: 14,marginRight:5 }}></div>
                                               <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                   <span>账号信息</span>
                                               </div>
                                            
                                        </div>
                                    </Col>
                                    <Col span={24} style={{marginTop:31}}>
                                    <Col span={24}>
                                        <FormItem label="角色名称" style={{marginLeft:26,}}
                                        validateStatus={number.validateStatus}
                                        labelCol={{span:7}} wrapperCol={{span:17}}
                                        help={number.errorMsg}>
                                            { getFieldDecorator('name',{
                                                rules:[{
                                                    required:true,
                                                    validator:validatorRoleName
                                                }],
                                                initialValue:this.state.flag ? this.state.record.name : ''
                                            })( < Input autoComplete="off" onKeyDown={this.changeValue}className="width-info"  />)}
                                        </FormItem>
                                        </Col>
                                        <Col span={24}>
                                        <FormItem label="备注" style={{marginLeft:26,}}labelCol={{span:7}} wrapperCol={{span:17}}>
                                            { getFieldDecorator('description',{
                                                 rules:[{
                                                
                                                    validator:validatordesc1,
                                                }],
                                                initialValue:this.state.flag ? this.state.record.description : ''
                                            })( <TextArea className="width-info" autosize={{ minRows: 10 }}  autoComplete="off"></TextArea>)}
                                        </FormItem>
                                        </Col>
                                        <Col span={24}>
                                        <FormItem label="状态" style={{marginLeft:26,}}labelCol={{span:7}} wrapperCol={{span:17}}>
                                           
                                            <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={this.changeContent} defaultChecked={this.state.record.status=='1'?true:false} />
                                            
                                        </FormItem>
                                      </Col>
                                    </Col>
                                    
                                </Col>
                                <Col span={12}>
                                <div  style={{width:490}}>
                                    
                                    <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                        <div style={{width:2,border:'1px solid #3689FF',float:'left',height: 14,marginRight:5 }}></div>
                                            <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                <span>权限配置</span>
                                            </div>
                                    </div>
                                </div>
                                <div style={{border:'1px solid #E4E4E4',height:360,marginTop:66,marginLeft:30,borderRadius: 2,overflow: 'auto'}}> 
                                     <Role_authority treeData={this.state.roleData}
                                                onSelect={this.onSelect} userable={false}
                                                checkedKeys={this.state.menus}
                                                onCheck={this.onCheck.bind(this)}></Role_authority>
                                </div>
                                </Col>
                            </Row>
                        </Form>
                        
                    </div>
                </Modal>
                <style>
                    {`
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
                `}
                </style>
            </div>
        )
    }
}
const addEdits = Form.create()(addEdit);
export default addEdits;