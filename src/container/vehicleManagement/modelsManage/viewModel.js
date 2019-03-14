//车型管理--子列表--查看
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,TreeSelect ,Table,AutoComplete} from 'antd';
// import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import { httpConfig,HttpUrl } from '../../../util/httpConfig';

const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class viewList extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        viewVisible:false,
        record:[],
        otaCarModel:[],
        otaCarExtend:[],
        nylx:[],//能源类型
        dclx:[],//电池类型
        hbbz:[],//环保标准
        bsx:[],//变速箱
        qddjbz:[],//驱动电机布置 型式/位置
        qddds:[],//驱动电机数
        djlx:[],//电机类型
        carTypeName:'',
        carSortNames:'',
    }
    viewList=(record,carTypeName,carSortNames)=>{
        console.log(record)
        console.log(carTypeName)
        console.log(carSortNames)
        this.setState({
            viewVisible:true,
            carTypeName:carTypeName,
            carSortNames:carSortNames
        })
        this.findCarModelById(record)
    }
    findCarModelById=(record)=>{
        //信息返回
        Axios.get(HttpUrl+'vehicle/carModel/findCarModelById/'+record.carModelId,httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    otaCarExtend:res.data.data.otaCarExtend,
                    otaCarModel:res.data.data.otaCarModel
                })
                console.log(res.data.data.otaCarExtend.carDataId)
                if(res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-1'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-2'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-3'){
                    document.getElementById('tabChangeOne').style.display='block';
                    document.getElementById('tabChangeTwo').style.display='none';
                }else if(res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-4'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-5'){
                    document.getElementById('tabChangeTwo').style.display='block';
                    document.getElementById('tabChangeOne').style.display='none';
                }
            }else{
                message.warning('后台接口请求失败')
            }
        })
    }
    unview=()=>{
        this.props.form.validateFields()
        this.setState({
            viewVisible:false
        })
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state
        return (
            <div className="content" >
                <Modal
                    title="查看"
                    visible={this.state.viewVisible} 
                    onOk={this.unbundEquip} 
                    onCancel={this.unview}
                    destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                    maskClosable={false}
                    className="viewList"
                    destroyOnClose={true}
                    footer={false}
                    >
                    <Row>
                    <Form>
                    <Col span={24} style={{borderBottom:'1px solid #f1f1f1'}}>
                        <Row className="tit-row">
                            <span></span><b>基本信息</b>
                        </Row>
                        
                            <Row style={{marginTop:'20px'}}>
                                <Col span={12}> 
                                    <FormItem className="form_input" label="车型" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('carTypeId')(<span>{this.state.carTypeName}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="型号名称" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('carModelName')(<span>{this.state.otaCarModel.carModelName}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告型号" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        {getFieldDecorator('carNoticeModel')(<span>{this.state.otaCarModel.carNoticeModel}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告批次" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('carNoticeBatch')(<span>{this.state.otaCarModel.carNoticeBatch}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="能源类型" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('carDataId')(<span>{this.state.otaCarModel.carDataName}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="车辆分类" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        { getFieldDecorator('operatData')(<span>{this.state.carSortNames}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                    </Col>
                    <Col span={24} style={{marginTop:20}}>
                        <Row className="tit-row">
                            <span></span><b>高要参数</b>
                        </Row>
                        <div id='tabChangeOne' style={{display:'block'}}>
                            <Row style={{marginTop:'20px'}}>
                                <Col span={12}>
                                    <FormItem className="form_input" label="续航里程" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('extensionMileage')(<span><span>{this.state.otaCarExtend.extensionMileage}</span><span> 公里</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem  className="form_input" label="慢充时间" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('slowChargeTime')(<span>{this.state.otaCarExtend.slowChargeTime}<span> 小时</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充时间" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('fastChargeTime')(<span>{this.state.otaCarExtend.fastChargeTime}<span> 小时</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充百分比" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('fastPercentage')(<span>{this.state.otaCarExtend.fastPercentage}<span> %</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最高车速" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maxSpeed')(<span>{this.state.otaCarExtend.maxSpeed}<span> 公里/小时</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input input_more" label="驱动电机布置型式/位置" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMotorType')(<span>{this.state.otaCarExtend.drivingMotorType}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池容量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryCapacity')(<span>{this.state.otaCarExtend.batteryCapacity}<span> kWh</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('vehicleWarranty')(<span>{this.state.otaCarExtend.vehicleWarranty}<span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池类型" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryType')(<span>{this.state.otaCarExtend.batteryType}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池组质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('batteryPackWarranty')(<span>{this.state.otaCarExtend.batteryPackWarranty}<span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动电机数" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('drivingMotorNumber')(<span>{this.state.otaCarExtend.drivingMotorNumber}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机类型" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('motorType')(<span>{this.state.otaCarExtend.motorType}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('totalPower')(<span>{this.state.otaCarExtend.totalPower}<span> kW</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('totalTorqueMotor')(<span>{this.state.otaCarExtend.totalTorqueMotor}<span> N.m</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            
                        </div>
                        <div id='tabChangeTwo'  style={{display:'none'}}>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="综合油耗" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('oilWear')(<span>{this.state.otaCarExtend.oilWear}<span> L/100km</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="环保标准" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('environmentalProtection')(<span>{this.state.otaCarExtend.environmentalProtection}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('vehicleWarranty')(<span>{this.state.otaCarExtend.vehicleWarranty}<span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动机型号" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('engineType')(<span>{this.state.otaCarExtend.engineType}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动排量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('displacement')(<span>{this.state.otaCarExtend.displacement}<span> mL</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="汽缸数" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('cylinderNumber')(<span>{this.state.otaCarExtend.cylinderNumber}<span> 个</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maximumPower')(<span>{this.state.otaCarExtend.maximumPower}<span> kW</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('maximumTorque')(<span>{this.state.otaCarExtend.maximumTorque}<span> N*m</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="变速箱" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('transmissionCase')(<span>{this.state.otaCarExtend.transmissionCase}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动方式" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMode')(<span>{this.state.otaCarExtend.drivingMode}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                           
                        </div>
                        <Row>
                            <Col span={24}>
                                <FormItem  className="form_input input_long" label="车身尺寸(长*宽*高)" labelCol={{span:6}} wrapperCol={{span:18}}>
                                    {getFieldDecorator('dimensions')(<span>{this.state.otaCarExtend.dimensions}<span> mm</span></span>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                   </Form>
                </Row>
                </Modal>
                <style>{`
                    .viewList .ant-modal-body{height:415px;overflow-y: scroll;}
                    .viewList{width:622px!important}
                    .viewList .tit-row{padding-left:6px;height:20px;line-height: 20px;font-size: 14px!important;}
                    .viewList .tit-row span{width:2px;height:14px;background: #3689FF; border-radius: 2px;float:left;margin-top:3px}
                    .viewList .tit-row b{font-weight:400;font-size: 14px!important; color: #3689FF; line-height: 14px;padding-left:5px;}
                    .viewList .ant-form-item-label label:after{content:''}
                    .viewList .ant-form-item-control-wrapper .ant-input,.viewList .ant-form-item-control-wrapper .ant-select{width:120px;}
                    .viewList .ant-form-item-label{height:39px;line-height:39px!important}
                    .viewList .input_more .ant-form-item-label{white-space:normal;line-height:1.2!important;text-align:center}
                    .viewList .ant-col-24 .input_long .ant-input{width:370px!important}
                    .viewList .ant-select-selection--single{height:28px;}
                    .viewList .ant-form-item{margin-bottom:20px}
                    .viewList .ant-row{margin-top:0!important}
                    .viewList .ant-form-item-control-wrapper .ant-form-item-children{text-decoration:underline;padding-left:20px;}
                `}</style>
            </div>
        )
    }
}
const viewLists = Form.create()(viewList);
export default viewLists;