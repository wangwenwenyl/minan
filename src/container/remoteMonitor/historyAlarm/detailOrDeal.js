/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Table,Switch} from 'antd';
import {HttpUrl} from './../../../util/httpConfig'
import {validatordesc,} from '../../../util/validator'

const { TextArea } = Input;
const Option = Select.Option;
const FormItem = Form.Item;
class detailOrDeal extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        number:{
            value:''
        },
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

//详情
detail=(record)=>{
    Axios.get(HttpUrl+'vehicle/historyWarning/findDetails?id='+record.id
    ).then(res => {
        console.log(res)
         if(res.data.code === '100000'){
             this.setState({
                record:res.data.data,
             })
         }else{
             message.warning(res.data.message)
         }
     })
        this.setState({
            addModal:true,
            operation:'1',
            flag:'',
        })
    }
//处理
deal=(record)=>{
    console.log(record)
    Axios.get(HttpUrl+'vehicle/historyWarning/findDetails?id='+record.id
    ).then(res => {
        console.log(res)
         if(res.data.code === '100000'){
             this.setState({
                record:res.data.data,
             })
         }else{
             message.warning(res.data.message)
         }
     })
        this.setState({
            addModal:true,
            operation:'2',
            flag:'1',
            record:record,
        })
    }
    addSubmit = () => {
            //处理

            this.props.form.validateFields((err, values) => {
               
                if (!err) {
        Axios.post(HttpUrl+'vehicle/historyWarning/action/update',{
            'id':this.state.record.id,
            'dealDetail':this.props.form.getFieldValue('dealDetail') || null,
           
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
    }})           
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
            status:checked=='false'?'0':'1'
        })
    }
      //权限选中
      onCheck=(checkedKeys, info)=>{
        console.log(checkedKeys);
        var newChecked='';
        this.setState({
            menus:'',
        })
        if(checkedKeys){
            for(var i=0;i<checkedKeys.length;i++){
                newChecked=newChecked+checkedKeys[i]+","
            }
        }
        this.setState({
            menus:newChecked
        })
        console.log(this.state.menus)
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
                    title={ this.state.flag ?   '处理':'详情' }
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancelAdd}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    className='treeBox addBox'
                    footer={!this.state.flag ?null:undefined}
                >
                    <div>
                        <Form  onSubmit={ this.addSubmit}>
                            <Row style={{padding:'0px 16px'}}>
                                <Col span={24}>
                                    <Col span={24}>
                                        <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                            <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                               height: 14,marginRight:5 }}></div>
                                               <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                   <span>车辆信息</span>
                                               </div>
                                        </div>
                                    </Col>
                                   <div style={{paddingLeft:20}}>
                                       <Col span={13} style={{marginTop:20,}}>
                                    
                                            <FormItem label="VIN" labelCol={{span:8}} wrapperCol={{span:16}} >
                                                <span>{this.state.record.vin}</span>
                                            </FormItem>
                                    
                                        
                                            <FormItem label="车主"  labelCol={{span:8}} wrapperCol={{span:16}}>
                                                 <span>{this.state.record.mobile}</span>
                                            </FormItem>
                                   
                                        </Col>
                                        <Col span={11} style={{marginTop:20}}>
                                            <FormItem label="车牌号"  labelCol={{span:8}} wrapperCol={{span:16}}>
                                            <span>{this.state.record.plateNo}</span>
                                            </FormItem>
                                        </Col>
                                      
                                       </div>
                                       <Col span={24}>
                                    <div style={{height:1,width:'440px',margin:'0px auto',borderTop:'1px solid #F1F1F1' }}></div>
                                    </Col>
                                </Col>  
                                <Col span={24}>
                                    <Col span={24}>
                                        <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                            <div style={{width:2,border:'1px solid #3689FF',float:'left',
                                               height: 14,marginRight:5 }}></div>
                                               <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                   <span>报警信息</span>
                                               </div>
                                            
                                        </div>
                                    </Col>
                                    <div style={{paddingLeft:20}}>
                                        <Col span={13} style={{marginTop:20}}>
                                            
                                                <FormItem label="上报时间" labelCol={{span:8}} wrapperCol={{span:16}}>
                                                <span>{this.state.record.uploadStartTime}</span>
                                                </FormItem>
                                                <FormItem label="报警等级"  labelCol={{span:8}} wrapperCol={{span:16}}>
                                                <span>{this.state.record.level}级</span>    
                                                </FormItem>
                                           
                                                <FormItem label="报警状态" labelCol={{span:8}} wrapperCol={{span:16}}>
                                                <span>{this.state.record.alarmStatus=='1'?'发生':'消失'}</span>
                                                </FormItem>
                                            
                                        
                                        </Col>
                                        <Col span={11} style={{marginTop:20}}>
                                           
                                            <FormItem label="消失时间" labelCol={{span:8}} wrapperCol={{span:16}}>
                                            <span>{this.state.record.uploadEndTime}</span>
                                            </FormItem>

                                            <FormItem label="报警详情" labelCol={{span:8}} wrapperCol={{span:16}}>
                                            <span>{this.state.record.warningInfo}</span>
                                            </FormItem>

                                        </Col>
                                        
                                    </div>   
                                    <Col span={24}>
                                    <div style={{height:1,width:'440px',margin:'0px auto',borderTop:'1px solid #F1F1F1' }}></div>
                                    </Col>
                                </Col> 
                                <Col span={24}>
                                    <div className='table' style={{width:490}}>
                                        
                                        <div style={{marginLeft:16,marginTop:15,position:'relative'}}>
                                            <div style={{width:2,border:'1px solid #3689FF',float:'left',height: 14,marginRight:5 }}></div>
                                            <div style={{height:18,color:'#3689FF',float:'left',marginTop: -4}}>
                                                <span>处理信息</span>
                                            </div>
                                            
                                        </div>
                                        <div style={{paddingLeft:20}} className="dealInfo">
                                            <Col span={24} style={{marginTop:20,}}>
                                                <FormItem label="处理状态" labelCol={{span:3}} wrapperCol={{span:21}} style={{marginLeft:15}}>
                                                    <span>{this.state.record.dealStatus=='1'?'已处理':'待处理'}</span>
                                                </FormItem>
                                                {this.state.flag=='1'?
                                                    <FormItem label="处理详情" labelCol={{span:4}} wrapperCol={{span:20}} style={{marginLeft:3}}>
                                                       { getFieldDecorator('dealDetail',
                                                       {
                                                        rules: [{ required: true, validator:validatordesc },],
                                                       })(

                                                       <TextArea className="dealCss" autoComplete="off" style={{width:340,height:'100px !important',}} />
                                                       )}
                                                    </FormItem>:
                                                    <FormItem label="处理详情" labelCol={{span:3}} wrapperCol={{span:21}} style={{marginLeft:15}}>
                                                         <span>{this.state.record.dealDetail}</span>
                                                    </FormItem>
                                                }
                                            </Col>
                                        </div>   
                                    </div> 
                                </Col>
                            </Row>
                        </Form>
                        
                    </div>
                </Modal>
                <style>
                    {`
                    .dealInfo .ant-form-item-control{
                        margin-left:6px;
                    }
                    .dealCss{

                        display:inline-block
                        width:361;
                        height:100px !important;
                    }
                    
                    .ant-switch-loading-icon, .ant-switch:after{
                        height:16px;border-radius: 0px;
                    }
                    .ant-switch{height:20px;border-radius: 0px;}
                    .width-info{ width:160px!important;}
                    .treeBox{width:540px !important;height:599px !important;}
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
const detailOrDeals = Form.create()(detailOrDeal);
export default detailOrDeals;