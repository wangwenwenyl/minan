//车型管理--主列表--编辑
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,TreeSelect ,Table,AutoComplete} from 'antd';
// import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import { httpConfig,HttpUrl } from '../../../util/httpConfig';
import {carTypeNames,carNoticeModel,extensionMileage,carNoticeBatch,fastChargeTime,fastPercentage,dimensions,displacement,cylinderNumber,maximumPower} from '../../../util/validator';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class editModel extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        editVisible:false,
        record:[],
        nylx:[],//能源类型
        carDataId:'',//选择的能源类型ID
        drivingMotorType:'',//驱动电机布置 型式/位置
        batteryType:'',//电池类型
        environmentalProtection:'',//环保标准
        transmissionCase:'',//变速箱
        drivingMotorNumber:'',//驱动电机数
        motorType:'',//电机类型
        dclx:[],//电池类型
        hbbz:[],//环保标准
        bsx:[],//变速箱
        qddjbz:[],//驱动电机布置 型式/位置
        qddds:[],//驱动电机数
        djlx:[],//电机类型
        carDataName:'',//提交-能源类型名称
        value:undefined,
        carSortName:[],
        data:[],
    }
    componentDidMount(){
        // this.list()
    }
    editList=(record)=>{
        console.log(record)
        this.setState({
            editVisible:true,
            record:record
        })
        this.treesData()
        Axios.get(HttpUrl+'vehicle/carType/findCarTypeById/'+record.carTypeId,httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                new Promise((resolve,reject) => {
                    this.setState({
                        data:res.data.data
                    })
                })
            }
        })
    }
    //车辆分类树
    treesData=()=>{
        Axios.post(HttpUrl+'vehicle/carSort/findCarSortList',{
            startPage:-1
        },httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.length;i++){
                    res.data.data[i].key=res.data.data[i].carSortId;
                    this.setState({
                        carSortName:res.data.data,
                    })
                }
            }

        })
    }
    //编辑车型-确认
    editEquip=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(!err)
            if(!err){
            
            Axios.post(HttpUrl+'vehicle/carType/updateCarType',{
                oldTypeName:this.state.record.carTypeName,
                carTypeId:this.state.data.carTypeId,
                carTypeName:this.props.form.getFieldValue('editVehicle'),
                carSortId:this.state.value
            },httpConfig).then(res=>{
                console.log(res)
                if(res.status == 200 && res.data.code === '100000'){
                    message.success('编辑车型成功')
                    this.setState({
                        editVisible:false
                    })
                    this.props.modelsList(this.state.pageSize,this.state.pageNumber)
                }else if(res.data.code === '220010'){
                    message.warning('该车型已创建,请重新输入')
                }
            })
                
        }
        })
    }
    //编辑车型-取消
    addCancel=()=>{
        this.setState({
            editVisible:false
        })
    }
    //编辑车型--树
    renderTreeNodes = (data) => {
        // console.log(data)
        if(data!=null){
            return data.map((item) => {
                // console.log(item)
                if (item.children) {
                    return (
                        <TreeNode title={item.carSortName} key={item.carSortId} value={item.carSortId}>

                            {this.renderTreeNodes(item.children,item.carSortId)}
                        </TreeNode>
                    );
                }
                return <TreeNode {...item} dataRef={item} title={item.carSortName} key={item.carSortId}  value={item.carSortId}/>;
            });
        }
    }
    //选择车辆分类树
    treeOnchange=(value)=>{
        console.log(value);
        this.setState({ value});
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr,record}=this.state
        return (
            <div className="content" >
                <Modal
                title="编辑"
                visible={this.state.editVisible} 
                onOk={this.editEquip} 
                onCancel={this.addCancel}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="findCarSort"
                >
                    <Form layout="inline" style={{marginBottom:20}}>
                        <FormItem className="form_input" label="车型名称：">
                            { getFieldDecorator('editVehicle',{
                                initialValue:this.state.data.carTypeName,
                                rules: [
                                    { required: true ,validator:carTypeNames}
                            ],
                            })(<Input type="text"  onKeyDown={this.keycode} onKeyUp={this.replaceSpace} autoComplete='off' style={{width:180}}/>)}
                        </FormItem>
                        <FormItem className="form_input" label="车辆分类：">
                            { getFieldDecorator('addClassification',{
                                initialValue:this.state.data.carSortId,
                                rules: [
                                    { required: true ,message:'该项为必填项，请重新输入'}
                            ],
                            })(<TreeSelect
                                style={{ width: 180 }}
                                value={this.state.value}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.treeOnchange}
                            >
                            {this.renderTreeNodes(this.state.carSortName)}
                            </TreeSelect>)}
                        </FormItem>
                    </Form>
                </Modal>

                <style>
                    {`
                        .editModel{width:622px!important}
                        .editModel .tit-row{padding-left:6px;height:20px;line-height: 20px;font-size: 14px!important;}
                        .editModel .tit-row span{width:2px;height:14px;background: #3689FF; border-radius: 2px;float:left;margin-top:3px}
                        .editModel .tit-row b{font-weight:400;font-size: 14px!important; color: #3689FF; line-height: 14px;padding-left:5px;}
                        .editModel .ant-form-item-label label:after{content:''}
                        .editModel .ant-form-item-control-wrapper .ant-input,.editModel .ant-form-item-control-wrapper .ant-select{width:120px;}
                        .editModel .ant-form-item-label{height:39px;line-height:39px!important}
                        .editModel .input_more .ant-form-item-label{white-space:normal;line-height:1.2!important;text-align:center}
                        .editModel .ant-col-24 .input_long .ant-input{width:370px!important}
                        .editModel .ant-select-selection--single{height:28px;}
                        .findCarSort .ant-row{margin-top:5px;}
                    `}
                </style>
            </div>
        )
    }
}
const editModels = Form.create()(editModel);
export default editModels;