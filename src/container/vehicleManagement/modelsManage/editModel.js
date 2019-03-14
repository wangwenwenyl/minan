//车型管理--子列表--编辑
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,TreeSelect ,Table,AutoComplete} from 'antd';
// import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import { httpConfig,HttpUrl } from '../../../util/httpConfig';
import {carTypeNames,carNoticeModel,extensionMileage,carNoticeBatch,fastChargeTime,fastPercentage,dimensions,displacement,cylinderNumber,maximumPower,engineType} from '../../../util/validator';
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
        carTypeName:'',
        carSortNames:'',
        otaCarModel:[],
        otaCarExtend:[]
    }
    componentDidMount(){
        // this.list()
    }
    editList=(record,carTypeName,carSortNames)=>{
        console.log(record)
        this.list(record)
        this.setState({
            editVisible:true,
            record:record,
            carTypeName:carTypeName,
            carSortNames:carSortNames
        })
        
    }
    list=(record)=>{
        
        //能源类型
        Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=nylx',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.nylx.push(<Option value={res.data.data.list[i].dicKey} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
        //电池类型
        Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=dclx',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.dclx.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
        //环保标准
        Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=hbbz',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.hbbz.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
         //变速箱
         Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=bsx',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.bsx.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
         //驱动电机布置 型式/位置
         Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=qddjbz',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.qddjbz.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
         //驱动电机数
         Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=qddds',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.qddds.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
         //电机类型
         Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=djlx',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.djlx.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].dicKey}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
        console.log(record)
        Axios.get(HttpUrl+'vehicle/carModel/findCarModelById/'+record.carModelId,httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                if(res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-1'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-2'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-3'){
                    document.getElementById('tabChangeOne').style.display='block';
                    document.getElementById('tabChangeTwo').style.display='none';
                }else if(res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-4'||res.data.data.otaCarExtend.carDataId=='ct_manager-nylx-5'){
                    document.getElementById('tabChangeTwo').style.display='block';
                    document.getElementById('tabChangeOne').style.display='none';
                }
                this.setState({
                    otaCarExtend:res.data.data.otaCarExtend,
                    otaCarModel:res.data.data.otaCarModel,
                    carDataId:res.data.data.otaCarExtend.carDataId
                })
            }
        })
    }
    //能源类型
    nylxSelect=(record,value)=>{
        console.log(value.props.children)
        console.log(record)
        this.setState({
            carDataId:record,
            carDataName:value.props.children
        })
        if(record=='ct_manager-nylx-1'||record=='ct_manager-nylx-2'||record=='ct_manager-nylx-3'){
            document.getElementById('tabChangeOne').style.display='block';
            document.getElementById('tabChangeTwo').style.display='none';
        }else if(record=='ct_manager-nylx-4'||record=='ct_manager-nylx-5'){
            document.getElementById('tabChangeTwo').style.display='block';
            document.getElementById('tabChangeOne').style.display='none';
        }
    }
    //驱动电机布置 型式/位置
    qddjbzSelect=(record)=>{
        console.log(record)
        this.setState({
            drivingMotorType:record,
            
        })
    }
    //电池类型
    dclxSelect=(record)=>{
        console.log(record)
        this.setState({
            batteryType:record
        })
    }
    //环保标准
    hbbzSelect=(record)=>{
        console.log(record)
        this.setState({
            environmentalProtection:record
        })
    }
    //变速箱
    bsxSelect=(record)=>{
        console.log(record)
        this.setState({
            transmissionCase:record
        })
    }
     //驱动电机数
     qdddsSelect=(record)=>{
        console.log(record)
        this.setState({
            drivingMotorNumber:record
        })
    }

     //电机类型
     djlxSelect=(record)=>{
        console.log(record)
        this.setState({
            motorType:record
        })
    }
    editModelsviv=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(!err)
            console.log(this.props.form.getFieldValue('carNoticeModel'))
            if(!err){
                if(this.state.carDataId=='ct_manager-nylx-1'||this.state.carDataId=='ct_manager-nylx-2'||this.state.carDataId=='ct_manager-nylx-3'){
                    Axios.post(HttpUrl+'vehicle/carModel/updateCarModel',{
                        'otaCarModel':{
                            'carModelId':this.state.record.carModelId,
                            'carModelName':this.props.form.getFieldValue('carModelName'),
                            'carNoticeBatch':this.props.form.getFieldValue('carNoticeBatch'),
                            'carNoticeModel':this.props.form.getFieldValue('carNoticeModel'),
                            'carExtendId':this.state.otaCarModel.carExtendId,
                            'carTypeId':this.state.record.carTypeId
                        },
                        'otaCarExtend':{
                            'carDataId':this.state.carDataId,
                            'carDataName':this.state.carDataName?this.state.carDataName:this.state.otaCarModel.carDataName,
                            'carExtendId':this.state.otaCarModel.carExtendId,
                            'extensionMileage':this.props.form.getFieldValue('extensionMileage'),
                            'slowChargeTime':this.props.form.getFieldValue('slowChargeTime'),
                            'fastChargeTime':this.props.form.getFieldValue('fastChargeTime'),
                            'fastPercentage':this.props.form.getFieldValue('fastPercentage'),
                            'maxSpeed':this.props.form.getFieldValue('maxSpeed'),
                            'drivingMotorType':this.state.drivingMotorType?this.state.drivingMotorType:this.state.otaCarExtend.drivingMotorType,
                            'batteryCapacity':this.props.form.getFieldValue('batteryCapacity'),
                            'batteryType':this.state.batteryType?this.state.batteryType:this.state.otaCarExtend.batteryType,
                            'batteryPackWarranty':this.props.form.getFieldValue('batteryPackWarranty'),
                            'drivingMotorNumber':this.state.drivingMotorNumber?this.state.drivingMotorNumber:this.state.otaCarExtend.drivingMotorNumber,
                            'motorType':this.state.motorType?this.state.motorType:this.state.otaCarExtend.motorType,
                            'totalPower':this.props.form.getFieldValue('totalPower'),
                            'totalTorqueMotor':this.props.form.getFieldValue('totalTorqueMotor'),
                            'vehicleWarranty':this.props.form.getFieldValue('vehicleWarranty'),
                            'dimensions':this.props.form.getFieldValue('dimensions'),

                            'oilWear':'',
                            'environmentalProtection':'',
                            'engineType':'',
                            'displacement':'',
                            'cylinderNumber':'',
                            'maximumPower':'',
                            'maximumTorque':'',
                            'transmissionCase':'',
                            'drivingMode':'',
                        }
                    },httpConfig).then(res=>{
                        console.log(res)
                        if(res.status == 200 && res.data.code == '100000'){
                            message.success('编辑成功')
                            this.props.childList(this.state.record)
                            this.props.modelsList(this.state.pageSize,this.state.pageNumber)
                            this.setState({
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
                                carTypeName:'',
                                carSortNames:'',
                                otaCarModel:[],
                                otaCarExtend:[]
                            })
                        // }else if(res.data.code == '220006'){
                        //     message.warning('该型号在该车型下已创建,请重新输入')
                        // }else if(res.data.code == '220007'){
                        //     message.warning('该公告型号在该车型下已创建,请重新输入')
                        }else if(res.data.message){
                            message.warning(res.data.message)
                        }
                        
                    })
                }else  if(this.state.carDataId=='ct_manager-nylx-5'||this.state.carDataId=='ct_manager-nylx-4'){
                    Axios.post(HttpUrl+'vehicle/carModel/updateCarModel',{
                        'otaCarModel':{
                            'carModelId':this.state.record.carModelId,
                            'carModelName':this.props.form.getFieldValue('carModelName'),
                            'carNoticeBatch':this.props.form.getFieldValue('carNoticeBatch'),
                            'carNoticeModel':this.props.form.getFieldValue('carNoticeModel'),
                            'carExtendId':this.state.otaCarModel.carExtendId,
                            'carTypeId':this.state.record.carTypeId
                        },
                        'otaCarExtend':{
                            'carDataId':this.state.carDataId,
                            'carDataName':this.state.carDataName?this.state.carDataName:this.state.otaCarModel.carDataName,
                            'carExtendId':this.state.otaCarModel.carExtendId,
                            'oilWear':this.props.form.getFieldValue('oilWear'),
                            'environmentalProtection':this.state.environmentalProtection?this.state.environmentalProtection:this.state.otaCarExtend.environmentalProtection,
                            'engineType':this.props.form.getFieldValue('engineType'),
                            'displacement':this.props.form.getFieldValue('displacement'),
                            'cylinderNumber':this.props.form.getFieldValue('cylinderNumber'),
                            'maximumPower':this.props.form.getFieldValue('maximumPower'),
                            'maximumTorque':this.props.form.getFieldValue('maximumTorque'),
                            'transmissionCase':this.state.transmissionCase?this.state.transmissionCase:this.state.otaCarExtend.transmissionCase,
                            'drivingMode':this.props.form.getFieldValue('drivingMode'),
                            'vehicleWarranty':this.props.form.getFieldValue('vehicleWarranty'),
                            'dimensions':this.props.form.getFieldValue('dimensions'),

                            'extensionMileage':null,
                            'slowChargeTime':'',
                            'fastChargeTime':'',
                            'fastPercentage':'',
                            'maxSpeed':'',
                            'drivingMotorType':'',
                            'batteryCapacity':'',
                            'batteryType':'',
                            'batteryPackWarranty':'',
                            'drivingMotorNumber':'',
                            'motorType':'',
                            'totalPower':'',
                            'totalTorqueMotor':'',
                        }
                    },httpConfig).then(res=>{
                        console.log(res)
                        if(res.status == 200 && res.data.code == '100000'){
                            message.success('编辑成功')
                            this.props.childList(this.state.record)
                            this.props.modelsList(this.state.pageSize,this.state.pageNumber)
                            this.setState({
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
                                carTypeName:'',
                                carSortNames:'',
                                otaCarModel:[],
                                otaCarExtend:[]
                            })
                        // }else if(res.data.code == '220006'){
                        //     message.warning('该型号在该车型下已创建,请重新输入')
                        // }else if(res.data.code == '220007'){
                        //     message.warning('该公告型号在该车型下已创建,请重新输入')
                        }else if(res.data.message){
                            message.warning(res.data.message)
                        }
                    })
                }
            }
        })
    }
    unAdd=()=>{
        this.props.form.resetFields()
        this.setState({
            editVisible:false,
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
        })
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
                    onOk={this.editModelsviv} 
                    onCancel={this.unAdd}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                    maskClosable={false}
                    className="editModel"
                    destroyOnClose={true}
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
                                        {getFieldDecorator('carModelName',{
                                            initialValue:this.state.otaCarModel.carModelName,
                                            rules: [{ required: true ,validator:carTypeNames}],
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告型号" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        {getFieldDecorator('carNoticeModel',{
                                            initialValue:this.state.otaCarModel.carNoticeModel,
                                            rules: [{ required: true ,validator:carNoticeModel}]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告批次" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('carNoticeBatch',{
                                            initialValue:this.state.otaCarModel.carNoticeBatch,
                                            rules: [{ required: true,validator:carNoticeBatch }]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="能源类型" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('carDataId',{
                                            initialValue:this.state.otaCarModel.carDataId,
                                            rules: [{ required: true ,message:'请选择'}]
                                        })(<Select  onSelect={this.nylxSelect} allowClear={true}>
                                        {this.state.nylx}
                                    </Select>)}
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
                                        { getFieldDecorator('extensionMileage',{
                                            initialValue:this.state.otaCarExtend.extensionMileage,
                                            rules: [{ validator:extensionMileage }]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                        <span> 公里</span>
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem  className="form_input" label="慢充时间" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('slowChargeTime',{
                                            initialValue:this.state.otaCarExtend.slowChargeTime,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text" />)}
                                        <span> 小时</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充时间" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('fastChargeTime',{
                                            initialValue:this.state.otaCarExtend.fastChargeTime,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 小时</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充百分比" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('fastPercentage',{
                                            initialValue:this.state.otaCarExtend.fastPercentage,
                                            rules: [{ validator:fastPercentage }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> %</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最高车速" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maxSpeed',{
                                            initialValue:this.state.otaCarExtend.maxSpeed,
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 公里/小时</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input input_more" label="驱动电机布置型式/位置" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMotorType',{
                                            initialValue:this.state.otaCarExtend.drivingMotorType,
                                        })(<Select  onSelect={this.qddjbzSelect} allowClear={true}>
                                        {this.state.qddjbz}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池容量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryCapacity',{
                                            initialValue:this.state.otaCarExtend.batteryCapacity,
                                            rules: [{ validator:fastPercentage }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> kwh</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('vehicleWarranty',{
                                            initialValue:this.state.otaCarExtend.vehicleWarranty,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 年</span>
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池类型" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryType',{
                                            initialValue:this.state.otaCarExtend.batteryType,
                                        })(<Select  onSelect={this.dclxSelect} allowClear={true}>
                                        {this.state.dclx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池组质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('batteryPackWarranty',{
                                            initialValue:this.state.otaCarExtend.batteryPackWarranty,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 年</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动电机数" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('drivingMotorNumber',{
                                            initialValue:this.state.otaCarExtend.drivingMotorNumber,
                                        })(<Select  onSelect={this.qdddsSelect} allowClear={true}>
                                        {this.state.qddds}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机类型" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('motorType',{
                                            initialValue:this.state.otaCarExtend.motorType,
                                        })(<Select  onSelect={this.djlxSelect} allowClear={true}>
                                        {this.state.djlx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('totalPower',{
                                            initialValue:this.state.otaCarExtend.totalPower,
                                            rules: [{ validator:fastPercentage }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> kw</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('totalTorqueMotor',{
                                            initialValue:this.state.otaCarExtend.totalTorqueMotor,
                                            rules: [{ validator:fastPercentage }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> N*m</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            
                        </div>
                        <div id='tabChangeTwo'  style={{display:'none'}}>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="综合油耗" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('oilWear',{
                                            initialValue:this.state.otaCarExtend.oilWear,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> L/100km</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="环保标准" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('environmentalProtection',{
                                            initialValue:this.state.otaCarExtend.environmentalProtection,
                                        })(<Select  onSelect={this.hbbzSelect} allowClear={true}>
                                        {this.state.hbbz}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('vehicleWarranty',{
                                            initialValue:this.state.otaCarExtend.vehicleWarranty,
                                            rules: [{ validator:fastChargeTime }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 年</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动机型号" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('engineType',{
                                            initialValue:this.state.otaCarExtend.engineType,
                                            rules: [{ validator:engineType }]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动排量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('displacement',{
                                            initialValue:this.state.otaCarExtend.displacement,
                                            rules: [{ validator:displacement }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> mL</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="汽缸数" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('cylinderNumber',{
                                            initialValue:this.state.otaCarExtend.cylinderNumber,
                                            rules: [{ validator:cylinderNumber }]
                                        })(<Input  onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> 个</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maximumPower',{
                                            initialValue:this.state.otaCarExtend.maximumPower,
                                            rules: [{ validator:maximumPower }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> kw</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('maximumTorque',{
                                            initialValue:this.state.otaCarExtend.maximumTorque,
                                            rules: [{ validator:fastPercentage }]
                                        })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> N*m</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="变速箱" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('transmissionCase',{
                                            initialValue:this.state.otaCarExtend.transmissionCase,
                                        })(<Select  onSelect={this.bsxSelect} allowClear={true}>
                                        {this.state.bsx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动方式" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMode',{
                                            initialValue:this.state.otaCarExtend.drivingMode,
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                           
                        </div>
                        <Row>
                            <Col span={24}>
                                <FormItem  className="form_input input_long" label="车身尺寸(长*宽*高)" labelCol={{span:6}} wrapperCol={{span:18}}>
                                    {getFieldDecorator('dimensions',{
                                        initialValue:this.state.otaCarExtend.dimensions,
                                        rules: [{ validator:dimensions }]
                                    })(<Input onKeyDown={this.keycode} type="text"  autoComplete='off'/>)}<span> mm</span>
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                   </Form>
                </Row>
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
                        .ant-row{margin-top:5px;}
                        .editModel .ant-modal-body{height:415px;overflow-y: scroll;}
                    `}
                </style>
            </div>
        )
    }
}
const editModels = Form.create()(editModel);
export default editModels;