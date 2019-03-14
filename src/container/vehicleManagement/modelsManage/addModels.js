//车型管理--主列表--添加型号
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
class addModel extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        addVisible:false,
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
    }
    componentDidMount(){
        // this.list()
    }
    addList=(record)=>{
        console.log(record)
        this.list()
        this.setState({
            addVisible:true,
            record:record
        })
       
    }
    list=()=>{
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
        this.setState({
            motorType:record
        })
    }
    addModelsviv=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
            Axios.post(HttpUrl+'vehicle/carModel/saveCarModel',{
                'otaCarModel':{
                    'carTypeId':this.state.record.carTypeId,
                    'carModelName':this.props.form.getFieldValue('carModelName'),
                    'carNoticeBatch':this.props.form.getFieldValue('carNoticeBatch'),
                    'carNoticeModel':this.props.form.getFieldValue('carNoticeModel'),
                },
                'otaCarExtend':{
                    'carDataId':this.state.carDataId,
                    'carDataName':this.state.carDataName,
                    'extensionMileage':this.props.form.getFieldValue('extensionMileage'),
                    'slowChargeTime':this.props.form.getFieldValue('slowChargeTime'),
                    'fastChargeTime':this.props.form.getFieldValue('fastChargeTime'),
                    'fastPercentage':this.props.form.getFieldValue('fastPercentage'),
                    'maxSpeed':this.props.form.getFieldValue('maxSpeed'),
                    'drivingMotorType':this.state.drivingMotorType,
                    'batteryCapacity':this.props.form.getFieldValue('batteryCapacity'),
                    'batteryType':this.state.batteryType,
                    'batteryPackWarranty':this.props.form.getFieldValue('batteryPackWarranty'),
                    'drivingMotorNumber':this.state.drivingMotorNumber,
                    'motorType':this.state.motorType,
                    'totalPower':this.props.form.getFieldValue('totalPower'),
                    'totalTorqueMotor':this.props.form.getFieldValue('totalTorqueMotor'),
                    'oilWear':this.props.form.getFieldValue('oilWear'),
                    'environmentalProtection':this.state.environmentalProtection,
                    'engineType':this.props.form.getFieldValue('engineType'),
                    'displacement':this.props.form.getFieldValue('displacement'),
                    'cylinderNumber':this.props.form.getFieldValue('cylinderNumber'),
                    'maximumPower':this.props.form.getFieldValue('maximumPower'),
                    'maximumTorque':this.props.form.getFieldValue('maximumTorque'),
                    'transmissionCase':this.state.transmissionCase,
                    'drivingMode':this.props.form.getFieldValue('drivingMode'),
                    'vehicleWarranty':this.props.form.getFieldValue('vehicleWarranty'),
                    'dimensions':this.props.form.getFieldValue('dimensions'),
                }
            },httpConfig).then(res=>{
                console.log(res)
                if(res.status == 200 && res.data.code == '100000'){
                    console.log(this.state.record)
                    this.props.childList(this.state.record)
                    this.props.modelsList(this.state.pageSize,this.state.pageNumber)
                    message.success('添加成功')
                    this.setState({
                        addVisible:false,
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
        })
    }
    unAdd=()=>{
        this.props.form.validateFields()
        this.setState({
            addVisible:false,
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
                    title="添加型号"
                    visible={this.state.addVisible} 
                    onOk={this.addModelsviv} 
                    onCancel={this.unAdd}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                    maskClosable={false}
                    className="addModel"
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
                                        { getFieldDecorator('carTypeId')(<span>{record.carTypeName}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="型号名称" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('carModelName',{
                                            rules: [{ required: true ,validator:carTypeNames}],
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告型号" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        {getFieldDecorator('carNoticeModel',{
                                            rules: [{ required: true ,validator:carNoticeModel}]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="公告批次" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('carNoticeBatch',{
                                            rules: [{ required: true,validator:carNoticeBatch }]
                                        })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="能源类型" labelCol={{span:8}} wrapperCol={{span:16}}>
                                        { getFieldDecorator('carDataId',{
                                            rules: [{ required: true ,message:'请选择'}]
                                        })(<Select  onSelect={this.nylxSelect} allowClear={true}>
                                        {this.state.nylx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="车辆分类" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        { getFieldDecorator('operatData')(<span>{record.carSortName}</span>)}
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
                                            rules: [{ validator:extensionMileage }]
                                        })(<span><Input  onKeyDown={this.keycode} autoComplete='off' type="text"  /><span> 公里</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} >
                                    <FormItem  className="form_input" label="慢充时间" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('slowChargeTime',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input  onKeyDown={this.keycode} autoComplete='off' type="text" /><span> 小时</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充时间" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('fastChargeTime',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/><span> 小时</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="快充百分比" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('fastPercentage',{
                                            rules: [{ validator:fastPercentage }]
                                        })(<span><Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/><span> %</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最高车速" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maxSpeed')(<span><Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/><span> 公里/小时</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input input_more" label="驱动电机布置型式/位置" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMotorType')(<Select  onSelect={this.qddjbzSelect} allowClear={true}>
                                        {this.state.qddjbz}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池容量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryCapacity',{
                                            rules: [{ validator:fastPercentage }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> kwh</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('vehicleWarranty',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池类型" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('batteryType')(<Select  onSelect={this.dclxSelect} allowClear={true}>
                                        {this.state.dclx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电池组质保" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('batteryPackWarranty',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动电机数" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('drivingMotorNumber')(<Select  onSelect={this.qdddsSelect} allowClear={true}>
                                        {this.state.qddds}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机类型" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('motorType')(<Select  onSelect={this.djlxSelect} allowClear={true}>
                                        {this.state.djlx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('totalPower',{
                                            rules: [{ validator:fastPercentage }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> kw</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="电机总扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('totalTorqueMotor',{
                                            rules: [{ validator:fastPercentage }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> N*m</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            
                        </div>
                        <div id='tabChangeTwo'  style={{display:'none'}}>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="综合油耗" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('oilWear',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> L/100km</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="环保标准" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('environmentalProtection')(<Select  onSelect={this.hbbzSelect} allowClear={true}>
                                        {this.state.hbbz}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="整车质保" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('vehicleWarranty',{
                                            rules: [{ validator:fastChargeTime }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> 年</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动机型号" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('engineType',{
                                            rules: [{ validator:engineType }]
                                        })(<Input onKeyDown={this.keycode}  autoComplete='off' type="text" />)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="发动排量" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('displacement',{
                                            rules: [{ validator:displacement }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> mL</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="汽缸数" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('cylinderNumber',{
                                            rules: [{ validator:cylinderNumber }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> 个</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大功率" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('maximumPower',{
                                            rules: [{ validator:maximumPower }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> kw</span></span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="最大扭矩" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('maximumTorque',{
                                            rules: [{ validator:fastPercentage }]
                                        })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> N*m</span></span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="变速箱" labelCol={{span:8}} wrapperCol={{span:16}} >
                                        {getFieldDecorator('transmissionCase')(<Select  onSelect={this.bsxSelect} allowClear={true}>
                                        {this.state.bsx}
                                    </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="驱动方式" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('drivingMode')(<Input  onKeyDown={this.keycode} autoComplete='off' type="text"  />)}
                                    </FormItem>
                                </Col>
                            </Row>
                           
                        </div>
                        <Row>
                            <Col span={24}>
                                <FormItem  className="form_input input_long" label="车身尺寸(长*宽*高)" labelCol={{span:6}} wrapperCol={{span:18}}>
                                    {getFieldDecorator('dimensions',{
                                        rules: [{ validator:dimensions }]
                                    })(<span><Input onKeyDown={this.keycode} type="text"  autoComplete='off'/><span> mm</span></span>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                   </Form>
                </Row>
                </Modal>




                <style>
                    {`
                        .addModel{width:622px!important}
                        .addModel .tit-row{padding-left:6px;height:20px;line-height: 20px;font-size: 14px!important;}
                        .addModel .tit-row span{width:2px;height:14px;background: #3689FF; border-radius: 2px;float:left;margin-top:3px}
                        .addModel .tit-row b{font-weight:400;font-size: 14px!important; color: #3689FF; line-height: 14px;padding-left:5px;}
                        .addModel .ant-form-item-label label:after{content:''}
                        .addModel .ant-form-item-control-wrapper .ant-input,.addModel .ant-form-item-control-wrapper .ant-select{width:120px;}
                        .addModel .ant-form-item-label{height:39px;line-height:39px!important}
                        .addModel .input_more .ant-form-item-label{white-space:normal;line-height:1.2!important;text-align:center}
                        .addModel .ant-col-24 .input_long .ant-input{width:370px!important}
                        .addModel .ant-select-selection--single{height:28px;}
                        .ant-row{margin-top:5px;}
                        .addModel .ant-modal-body{height: 475px; overflow-y: scroll;}
                    `}
                </style>
            </div>
        )
    }
}
const addModels = Form.create()(addModel);
export default addModels;