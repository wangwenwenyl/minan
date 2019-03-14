/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Tree} from 'antd';
import { resolve } from 'url';
import {HttpUrl} from './../../../util/httpConfig'
import {deviceText2,informSn,versionCheck} from './../../../util/validator'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode
class newResource extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pid:'',
        treeDataSelect:[],
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
        Axios.get(HttpUrl+'sys/system/resource/resourceList').then(res=>{
            console.log(res)
            if (res.status == 200 && res.data.code === '100000') {
                let a=[];
                let b=[];
                a=this.queryList(res.data.data,b)
               this.setState({
                   treeDataSelect:a
               }) 
             console.log(a)
            }
          
        })
    }

 queryList=(json,arr)=> {
    for (let i = 0; i < json.length; i++) {
        let sonList = json[i].children;
        if (sonList === null) {
            arr.push({value:json[i].key,key:json[i].id,title:json[i].name,id:json[i].parentKey});
        } else {
            arr.push({value:json[i].key,key:json[i].id,title:json[i].name,id:json[i].parentKey,children:this.queryList(sonList, [])});
         
        }
    }
    return arr;

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
        console.log(record)
        this.setState({
            addModal:true,
            operation:'2',
            pid:record.pid,
            fatherNode:record.parentKey,
            flag:'1',
            record: record,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.operation=='1'){
                   if(this.props.form.getFieldValue('resourceType')==='1'){   //模块添加
                    Axios.post(HttpUrl+'sys/system/resource/addMenu',{
                        'name':this.props.form.getFieldValue('name') || null,
                        'pid':this.state.pid,
                        'parentKey':this.state.parentKey,
                        'url':this.props.form.getFieldValue('url') || null,
                        'icon':this.props.form.getFieldValue('icon') || null,
                        'sort':this.props.form.getFieldValue('sort') || null,
                        'openType':this.props.form.getFieldValue('openType') || null,
                        'status':this.props.form.getFieldValue('status') || null,
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
                }else{         //功能添加
                    Axios.post(HttpUrl+'sys/system/resource/addButton',{
                        'name':this.props.form.getFieldValue('name') || null,
                        'pid':this.state.pid,
                        'parentKey':this.state.parentKey,
                        'url':this.props.form.getFieldValue('url') || null,
                        'icon':this.props.form.getFieldValue('icon') || null,
                        'sort':this.props.form.getFieldValue('sort') || null,
                        'openType':this.props.form.getFieldValue('openType') || null,
                        'status':this.props.form.getFieldValue('status') || null,
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
                }else{
                    console.log(this.props.form.getFieldValue('resourceType'))
                    if(this.props.form.getFieldValue('resourceType')==='模块'){   //模块添加
                        Axios.put(HttpUrl+'sys/system/resource/editMenu',{
                            'id':this.state.record.id,
                            'name':this.props.form.getFieldValue('name') || null,
                            'pid':this.state.pid,
                            'parentKey':this.state.parentKey,
                            'url':this.props.form.getFieldValue('url') || null,
                            'icon':this.props.form.getFieldValue('icon') || null,
                            
                            'sort':this.props.form.getFieldValue('sort') || null,
                            'openType':this.props.form.getFieldValue('openType')=='无'?this.props.form.getFieldValue('openType')=='面板'?
                                       0:1:2,
                            'status':this.props.form.getFieldValue('status')? this.props.form.getFieldValue('status')=='启用'?1:2: null,
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
                    else{         //功能添加
                        Axios.put(HttpUrl+'sys/system/resource/editButton',{
                            'id':this.state.record.id,
                            'name':this.props.form.getFieldValue('name') || null,
                            'pid':this.state.pid,
                            'parentKey':this.state.parentKey,
                            'url':this.props.form.getFieldValue('url') || null,
                            'icon':this.props.form.getFieldValue('icon') || null,
                            'sort':this.props.form.getFieldValue('sort') || null,
                            'openType':this.props.form.getFieldValue('openType')=='无'?'0':this.props.form.getFieldValue('openType')=='0'?'0':this.props.form.getFieldValue('openType')=='内容面板'?'1':this.props.form.getFieldValue('openType')=='1'?'1':'2'|| null,
                            'status':this.props.form.getFieldValue('status')=='启用'?'1':this.props.form.getFieldValue('status')=='1'?'1':'2' || null,
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
            }
        });
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
    onChangeOrgSearch = (value,id,key,label) => {
        console.log(id);
        console.log(value);
        console.log(key);
        console.log(key.triggerNode.props.eventKey);
        this.setState({ 
            fatherNode:key.triggerNode.props.value,
            pid:key.triggerNode.props.eventKey
         });
    }
    render() {
        const { getFieldDecorator}=this.props.form
        return (
            <div className="content" >
                <Modal
                    title={ this.state.flag ?  '编辑':'新建'  }
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancelAdd}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    maskClosable={false}
                    centered={true}
                    className='treeBox addBox'
                    width="540px"
                >
                    <div>
                        <Form  onSubmit={ this.addSubmit}>
                            <Row style={{padding:'0px 16px'}}>
                                <Col span={24}>
                                    <FormItem label="父节点"labelCol={{span:6}} wrapperCol={{span:16}}>
                                    <TreeSelect
                                        value={this.state.fatherNode}
                                        dropdownStyle={{ maxHeight: 350, overflow: 'auto' }}
                                        treeData={this.state.treeDataSelect}
                                        placeholder="请选择父节点"
                                        style={{width:300}}
                                        onChange={this.onChangeOrgSearch}
                                    />
                                    </FormItem>
                                    <FormItem label="名称"labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('name',{
                                            rules:[{
                                                required:true,
                                                message:'输入内容不能为空',
                                            }],
                                            initialValue:this.state.flag ? this.state.record.name : ''
                                        })( < Input className="width-info" autoComplete="off" />)}
                                    </FormItem>
                                    <FormItem label="URL"labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('url',{
                                            rules:[{
                                                required:true,
                                                message:'输入内容不能为空',
                                            }],
                                            initialValue:this.state.flag ? this.state.record.url : ''
                                        })( < Input className="width-info" autoComplete="off"/>)}
                                    </FormItem>
                                    <FormItem label="图标"labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('icon',{
                                            initialValue:this.state.flag ? this.state.record.icon : ''
                                        })( < Input className="width-info"  autoComplete="off"/>)}
                                    </FormItem>

                                    <FormItem label="排序"labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('sort',{
                                            initialValue:this.state.flag ? this.state.record.sort : ''
                                        })( < Input className="width-info" autoComplete="off" />)}
                                    </FormItem>
                                    <FormItem label="打开方式"labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('openType',{

                                            initialValue:this.state.flag ? this.state.record.openType?this.state.record.openType=='1'?'窗口':'内容面板':'无' : ''
                                        })( ( < Select className="width-info"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}>
                                            <Option value='0'>无</Option>
                                            <Option value='1'>窗口</Option>
                                            <Option value='2'>内容面板</Option>
                                        </ Select>))}
                                    </FormItem>
                                    <FormItem label="状态" labelCol={{span:6}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('status',{
                                            initialValue:this.state.flag ? this.state.record.status=='1'?'启用':'禁用' : ''
                                        })(( < Select className="width-info"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}>

                                            <Option value='1'>启用</Option>
                                            <Option value='2'>禁用</Option>
                                        </ Select>))}
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
const newResources = Form.create()(newResource);
export default newResources;