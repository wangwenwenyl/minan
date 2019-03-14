/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete} from 'antd';
import { resolve } from 'url';
import {HttpUrl} from './../../../util/httpConfig'
import {validatordesc,validatorParameterUnit,validatorParameter} from './../../../util/validator'
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
class addEdit extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        key1:'',
        record:'',
        operation:'',
        addModal:false,
        treeData:[],
        flag:'',
        searchDataSource:[],
        vinArr:'',
        vinId:''
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
        this.setState({
            addModal:true,
            operation:'1',
            flag:'',
        })
    }
//编辑
    edit=(record)=>{
        this.setState({
            key1:record.key,
            addModal:true,
            operation:'2',
            flag:'1',
            record: record,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.operation=='1'){     //新增
                    
                    Axios.post(HttpUrl+'sys/system/param/addParam',{
                        'key':this.props.form.getFieldValue('parameterName') || null,
                        'value':this.props.form.getFieldValue('parameterValue') || null,
                        'desc':this.props.form.getFieldValue('remark') || null,
                        
                        'organization':this.props.form.getFieldValue('organization') || null,
                    }).then(res => {
                        console.log(res)
                        if(res.data.code === '100000'){
                            this.setState({
                                addModal:false,
                            })
                            this.props.list()
                        }else{
                            message.warning(res.data.message)
                        }
                    })
                }
                else{  //编辑
                        Axios.put(HttpUrl+'sys/system/param/editParam',{
                            'id':this.state.record.id,
                            'key':this.props.form.getFieldValue('parameterName') || null,
                            'value':this.props.form.getFieldValue('parameterValue') || null,
                            'organization':this.props.form.getFieldValue('organization') || null,
                            'desc':this.props.form.getFieldValue('remark') || null,
                        }).then(res => {
                            console.log(res)
                            if(res.data.code === '100000'){
                                this.setState({
                                    addModal:false,
                                })
                                this.props.list()
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
                    className='treeBox addBox'
                    width="540px"
                    maskClosable={false}
                >
                    <div>
                        <Form  onSubmit={ this.addSubmit}>
                            <Row style={{padding:'0px 16px'}}>
                                <Col span={24}>
                                    <FormItem label="参数名称" labelCol={{span:6}} wrapperCol={{span:18}}>
                                        { getFieldDecorator('parameterName',{
                                            rules:[{
                                                required:true, 
                                                validator:validatorParameter,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.key1 : ''
                                        })( < Input className="width-info" autoComplete="off" maxLength={30} />)}
                                    </FormItem>
                                    <FormItem label="参数值" labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('parameterValue',{
                                            rules:[{
                                                required:true,
                                                message:'参数值不能为空'
                                            }],
                                            initialValue:this.state.flag ? this.state.record.value : ''
                                        })( < Input className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="单位" labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('organization',{
                                            rules:[{
                                                
                                                validator:validatorParameterUnit,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.organization : ''
                                        })( < Input className="width-info"  autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="备注" labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('remark',{
                                            rules:[{
                                                
                                                validator:validatordesc,
                                            }],
                                            initialValue:this.state.flag ? this.state.record.desc : ''
                                        })( <TextArea className="width-info" className="remarkInfo" autoComplete="off"></TextArea>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
                <style>
                    {`
                    .remarkInfo{height:80px!important}
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