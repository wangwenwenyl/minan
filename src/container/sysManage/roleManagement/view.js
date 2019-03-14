/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Table,Switch} from 'antd';
import Role_authority from '../../../component/role_authority/role_authority'
import {HttpUrl} from './../../../util/httpConfig'
const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
class view extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        number:{
            value:''
        },
        record:'',
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
        Axios.get(HttpUrl+'sys/system/resource/resourceList'
        ).then(res => {
            console.log(res)
             if(res.data.code === '100000'){
                 // var insertData=this.editData(res.data.data)
                 // console.log(insertData)
                 this.setState({
                    roleData:res.data.data,
                     loading:false
                 })
             }else{
                 message.warning(res.data.message)
             }
         })
    }
   
    cancel=()=>{
        this.setState({
            addModal:false,
        })
    }

//查看
    view=(record)=>{
        Axios.get(HttpUrl+'sys/system/role/roleDetails?id='+record.id,
        ).then(res => {
            console.log(res)
             if(res.data.code === '100000'){
                 // var insertData=this.editData(res.data.data)
                 // console.log(insertData)
                 this.setState({
                    defaultChecked:res.data.data.keys,
                     loading:false
                 })
             }else{
                 message.warning(res.data.message)
             }
         })
        this.setState({
            addModal:true,
            record:record,
        })
    }
    render() {
        const {number} = this.state;
        const { getFieldDecorator}=this.props.form
        
       
        return (
            <div className="content" >
                <Modal
                    title='查看'
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancel}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    footer={false}
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
                                        <FormItem label="角色名称" style={{marginLeft:26,}}
                                        labelCol={{span:7}} wrapperCol={{span:17}}>
                                            <span className="width-info">{this.state.record.name}</span>
                                        </FormItem>
                                        <FormItem label="备注" style={{marginLeft:26,}}
                                        labelCol={{span:7}} wrapperCol={{span:17}}>
                                            <span className="width-info">{this.state.record.description}</span>
                                        </FormItem>
                                        <FormItem label="状态" style={{marginLeft:26,}}
                                        labelCol={{span:7}} wrapperCol={{span:17}}>
                                        <span className="width-info">{this.state.record.status=='1'?'开启':'关闭'}</span>
                                        </FormItem>
                                    </Col>
                                </Col>
                                <Col span={12}>
                                <div className='table' style={{width:490}}>
                                    
                                            <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                                <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                                    height: 14,marginRight:5 }}></div>
                                                    <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                        <span>分配角色</span>
                                                    </div>
                                                
                                            </div>
                                        
                                    
                                </div>
                                <div style={{border:'1px solid #E4E4E4',height:360,marginTop:66,marginLeft:30,    borderRadius: 2, overflow: 'auto'}}> 
                                     <Role_authority treeData={this.state.roleData} userable={true}
                                                checkedKeys={this.state.defaultChecked}
                                               ></Role_authority>
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
const views = Form.create()(view);
export default views;