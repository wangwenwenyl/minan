/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Switch} from 'antd';
import { resolve } from 'url';
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {validatorUserNames,validatorPort,validatorAddress,validatorReceiver,validatorPasswordForward,validatordesc1} from './../../../util/validator'
const Option = Select.Option;
const FormItem = Form.Item;
class addEdit extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        optionData2:[],
        record:'',
        operation:'',
        addModal:false,
        treeData:[],
        flag:'',
        searchDataSource:[],
        vinArr:'',
        vinId:'',
        status:'',
    }
    componentDidMount(){
       
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
        Axios.get('sys/dictionary/dictionaryList?groupName=车辆管理&type=设备分组', httpConfig).then(res => {
            console.log(res)
            this.setState({
                optionData2:[],
            })
            if (res.data.code === '100000') {
                for (let i = 0; i < res.data.data.list.length; i++) {
                  
                    var name = res.data.data.list[i].dicValue
                    this.state.optionData2.push(<Option value={res.data.data.list[i].id} key={res.data.data.list[i].id}>{name}</Option>)
                }
            }
        })
        this.setState({
            addModal:true,
            operation:'1',
            flag:'',
        })
    }
//编辑
    edit=(record)=>{
        console.log(record)
        Axios.get('sys/dictionary/dictionaryList?groupName=车辆管理&type=设备分组', httpConfig).then(res => {
            console.log(res)
            this.setState({
                optionData2:[],
            })
            let optionData2=[];
            if (res.data.code === '100000' ) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                   
                    var name = res.data.data.list[i].dicValue
                    optionData2.push(<Option value={res.data.data.list[i].id} key={res.data.data.list[i].id}>{name}</Option>)
                }
            }
            console.log(optionData2)
            this.setState({
                optionData2:optionData2,
            })
        })
        
        this.setState({
            
            addModal:true,
            operation:'2',
            flag:'1',
            record: record,
            status:record.status,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(1)
            if (!err) {
                console.log(12)
                console.log(this.state.operation)
                if(this.state.operation=='1'){     //新增
                    console.log(this.props.form.getFieldValue('deviceGroup'))
                    Axios.post(HttpUrl+'sys/transmit/addTransmit',{
                        'id':this.state.record.id,
                        'name':this.props.form.getFieldValue('name') || null,
                        'transIp':this.props.form.getFieldValue('transIp') || null,
                        'transPort':this.props.form.getFieldValue('transPort') || null,
                        'userName':this.props.form.getFieldValue('userName') || null,
                        'password':this.props.form.getFieldValue('password') || null,
                        'deviceGroup':this.props.form.getFieldValue('deviceGroup') || null,
                        'status':Number(this.state.status),
                        'editor':this.state.record.editor,
                        'remark':this.props.form.getFieldValue('remark') || null,
                    }).then(res => {
                        console.log(res)
                        if(res.data.code === '100000'){
                            this.setState({
                                addModal:false,
                            })
                            this.props.list(1,10,'',[])
                        }else{
                            message.warning(res.data.message)
                        }
                    })
                }else{  //编辑
                    console.log(13)
                        Axios.put(HttpUrl+'sys/transmit/editTransmit',{
                            'id':this.state.record.id,
                            'receiverName':this.props.form.getFieldValue('name') || null,
                            'transIp':this.props.form.getFieldValue('transIp') || null,
                            'transPort':this.props.form.getFieldValue('transPort') || null,
                            'userName':this.props.form.getFieldValue('userName') || null,
                            'password':this.props.form.getFieldValue('password') || null,
                            'deviceGroup':this.props.form.getFieldValue('deviceGroup') || null,
                            'status':Number(this.state.status),
                            'editor':this.state.record.editor,
                            'remark':this.props.form.getFieldValue('remark') || null,
                        }).then(res => {
                            console.log(res)
                            if(res.data.code === '100000'){
                                this.setState({
                                    addModal:false,
                                })
                                this.props.list(this.state.pageNumber,this.state.pageSize,'',[])
                            }else{
                                message.warning(res.data.message)
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
            vinArr:'',
            vinId:''
        })
    }
    //状态改变
    changeContent=(checked)=>{
        console.log(checked)
      
        this.setState({
            status:checked==false?'2':'1'
        })
        console.log(this.state.status)
    }
    //选择规约
    changeInfo=(value,label)=>{
        console.log(value ,label.children)
        this.setState({
            deviceGroup:value
        })
    }
    render() {
        const { getFieldDecorator}=this.props.form
        return (
            <div className="content" >
                <Modal
                    title={ this.state.flag ?  '编辑': '新建' }
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
                                <Col span={24}>
                                    <FormItem label="接收方名称" labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('name',{
                                            rules:[{
                                                required:true, validator:validatorReceiver,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.name : ''
                                        })( < Input className="width-info" autoComplete="off" />)}
                                    </FormItem>
                                    <FormItem label="转发地址" labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('transIp',{
                                            rules:[{
                                                required:true,validator:validatorAddress,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.transIp : ''
                                        })( < Input className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="转发端口" labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('transPort',{
                                            rules:[{
                                                required:true,validator:validatorPort,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.transPort : ''
                                        })( < Input className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="用户名" labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('userName',{
                                            rules:[{
                                                required:true,validator:validatorUserNames,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.userName : ''
                                        })( < Input className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="密码" labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('password',{
                                            rules:[{
                                                required:true,validator:validatorPasswordForward
                                            }],
                                            initialValue:this.state.flag ? this.state.record.password : ''
                                        })( < Input  className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="转发规约" labelCol={{span:7}} wrapperCol={{span:17}}>
                                      
                                        {getFieldDecorator('deviceGroup',{
                                             initialValue:this.state.flag ? this.state.record.groupName:''
                                        })(
                                                <Select className="width-info"
                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                             
                                                onChange={this.changeInfo}
                                                >
                                                    
                                                                    {this.state.optionData2}

                                                </Select>
                                                )} 
                                    </FormItem>
                                    <FormItem label="状态" style={{marginLeft:26,}}labelCol={{span:7}} wrapperCol={{span:17}}>
                                           
                                            <Switch checkedChildren="启用" unCheckedChildren="禁用" onChange={this.changeContent} defaultChecked={this.state.record.status=='1'?true:false} />
                                            
                                        </FormItem>
                                    <FormItem label="备注"labelCol={{span:7}} wrapperCol={{span:17}}>
                                        { getFieldDecorator('remark',{
                                            initialValue:this.state.flag ? this.state.record.remark : '',
                                            rules:[{
                                                validator:validatordesc1
                                            }],
                                        })( < Input className="width-info" autoComplete="off" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
                <style>
                    {`
                    .width-info{ width:300px!important;}
                    .treeBox{width:540px !important;height:593px !important;}
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