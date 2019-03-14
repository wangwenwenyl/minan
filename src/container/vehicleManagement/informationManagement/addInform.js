import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,Steps,Upload} from 'antd';
import {informSn,informTbox,validatorMobile,invoice,purchaserName,idcard,totalValorem} from '../../../util/validator'
import  Table  from "../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png';
import {httpConfig, HttpUrl} from '../../../util/httpConfig'
import { stringify } from 'querystring';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const format = 'YYYY-MM-DD';
const formats='YYYY-MM-DD HH:mm:ss'
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Step = Steps.Step;//步骤条
var obj1={}
var obj2={}
var obj3={}
var objs1={}//总融合
class addInform extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        ownerName:'',//车牌号
        previewVisible: false,
        previewVisible1: false,
        previewImage: '',
        previewImage1: '',
        pageSize:10,
        pageNumber:1,
        defaultCurrent:1,
        current:1,
        applicationData:[],
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeTargetValue:'',
        typeArr:[],
        modelArr:[],
        addVisible:false,
        viewVisible:false,
        editVisible:false,
        unbundVisible:false,
        onbundVisible:false,
        applicationVisible:false,
        auditVisible:false,
        selectedRowKeys:[],
        findCarModel:[],//查询配置型号
        findSnModel:[],//查询SN
        versionNow:'',//T-box版本号
        providerName:'',//T-box供应商名称
        eqmSeriesName:'',//T-box型号
        carModelId:'',
        findSnId:'',
        record:'',
        downlineDate:'',
        outFactoryTime:'',
        operatData:'',
        stepCurent: 0,//步骤条
        editData:[],
        colorModel:[],//数据字典颜色
        dictionaryModel:[],//规约
        deviceGroup:[],//规约ID

        provinceChild:[],
        cityChild:[],
        countyChild:[],
        defaultProvince:'',
        defaultCity:'',
        defaultCounty:'',
        detailData:[],
        vehicleStateIds:[],//查询车辆状态
        networkStateIds:[],//查询认证状态
        vins:[],//审核选中的VINS集合
        handIdcardContraryPath:'',//身份证反面
        handIdcardFrontPath:'',//身份证正面
        loading:true,
        dataStatus:1,
        selectedRows:[],
        len:0,
        networkStateId:[],//导出的
        vehicleStateId:[],//导出的
        data : [],
        btnList:[],
    }
    componentDidMount(){
    }
addList=(record)=>{
    //规约
    Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"设备分组",httpConfig).then( res => {
        if(res.status == 200 && res.data.code == '100000'){
            // console.log(res)
            for(let i=0;i<res.data.data.list.length;i++){
                this.state.dictionaryModel.push(<Option value={res.data.data.list[i].id} key={i}>{res.data.data.list[i].dicValue}</Option>)
            }
        }
    })
    //外观颜色
    Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"颜色",httpConfig).then( res => {
        if(res.status == 200 && res.data.code == '100000'){
            // console.log(res)
            for(let i=0;i<res.data.data.list.length;i++){
                this.state.colorModel.push(<Option value={res.data.data.list[i].dicValue} key={i}>{res.data.data.list[i].dicValue}</Option>)
            }
        }
    })
    //查询配置型号
    Axios.get(HttpUrl+"vehicle/vehicle/action/findCarModel",httpConfig).then( res => {
        if(res.status == 200 && res.data.code === '100000'){
            for(let i=0;i<res.data.data.length;i++){
                this.state.findCarModel.push(<Option value={res.data.data[i].id} key={i+','+res.data.data[i].name}>{res.data.data[i].name}</Option>)
            }
        }
    })
    //终端SN
    Axios.get(HttpUrl+"vehicle/vehicle/findSn",httpConfig).then( res => {
        if(res.status == 200 && res.data.code === '100000'){
            for(let i=0;i<res.data.data.length;i++){
                this.state.findSnModel.push(<Option value={res.data.data[i].id} key={i}>{res.data.data[i].sn}</Option>)
            }
        }
    })
    this.setState({
        addVisible:true,
        record:record
    })
}
//终端SN选择后所带出数据
findSn=(value)=>{
    // console.log(value)
    this.setState({
        findSnId:value
    })
    //
    Axios.get(HttpUrl+"vehicle/vehicle/findTboxBySn?id="+value,httpConfig).then( res => {
        // console.log(res)
        if(res.status == 200 && res.data.code === '100000'){
           this.setState({
            providerName: res.data.data.providerName,
            eqmSeriesName:res.data.data.eqmSeriesName,
            versionNow:res.data.data.versionNow
           })
        }
    })
}
 //新增提交
 addShure=()=>{
    this.props.form.validateFields((err, values) => {
        console.log(!err)
         if (!err) {
            Axios.post(HttpUrl+'vehicle/vehicle/action/add',{
                vin:values.vins,
                carModelId:this.state.carModelId,
                outColor:values.outColor,
                downlineDate:this.state.downlineDate,
                engine:values.engine,
                batteryNoMes:values.batteryNoMes,
                electronicControlNumber:values.electronicControlNumber,
                snNoId:values.snNoId,
                outFactoryTime:this.state.outFactoryTime,
                operatData:this.state.operatData,
                batchNumber:values.batchNumber,
                deviceGroup:this.state.deviceGroup,
                remark:values.remark,
                handIdcardFrontPath :'',
                handIdcardContraryPath :''
            },httpConfig).then(res => {
                // console.log(res)
                if(res.status == 200 && res.data.code === '100000'){
                    
                    this.props.informList(this.state.pageSize,this.state.defaultCurrent)
                    message.success('新建成功');
                    this.setState({
                        addVisible:false,
                        dictionaryModel:[],
                        colorModel:[],
                        findCarModel:[],
                        findSnModel:[]
                    })
                }else if(res.data.code =='220012'){
                    message.warning('设备SN已存在，请重新选择')
                }else if(res.data.code =='220013'){
                    message.warning('VIN已存在，请重新输入')
                }else if(res.data.code == '999999'){
                    message.warning(res.data.message)
                }
            })
        }
    });
}
addhideModal=()=>{
    this.setState({
        addVisible:false,
        dictionaryModel:[],
        colorModel:[],
        findCarModel:[],
        findSnModel:[]

    })

}
 //选择配置型号
 findCarSelect = (value) => {
    //  console.log(value)
    this.setState({
        carModelId:value
    })
}
transformDate = (date) => {
    const d=new Date(date)
    const year= d.getFullYear()
    const month=( (d.getMonth()+1)>9 ? (d.getMonth()+1) :'0'+(d.getMonth()+1) )
    const day=d.getDate()>9 ? d.getDate():'0'+d.getDate();
    const h=d.getHours()>9 ? d.getHours() : '0' + d.getHours()
    const minus=d.getMinutes()>9 ?d.getMinutes() : '0' +d.getMinutes()
    const second=d.getSeconds()>9 ? d.getSeconds() : '0' +d.getSeconds()
    return (year+'-'+month+'-'+day + ' ' + h + ':' + minus + ':' + second)
}
downlineDateChange = (date, dateString) => {
    // console.log(date)
    // console.log(dateString)
    this.setState({
        downlineDate:dateString,
    })
  }
  outFactoryTimeChange = (date, dateString) => {
    // console.log(date)
    // console.log(dateString)
    this.setState({
        outFactoryTime:dateString,
    })
  }
  operatDataChange = (date, dateString) => {
    // console.log(date)
    // console.log(dateString)
    this.setState({
        operatData:dateString,
    })
  }
   //规约
   dictionarySelect=(value)=>{
    // console.log(record)
    this.setState({
        deviceGroup:value
    })
    console.log(`selected ${value}`);
    // console.log(this.state.dictionaryModel)
    // this.state.deviceGroup.push(value)
    console.log(this.state.deviceGroup)
}
keycode = (event) => {
    if(event.keyCode=='32'){
        event.preventDefault();
        return false;
    }
}
    render() {
        let record=this.state.record;
        const { getFieldDecorator }=this.props.form
        let _t = this
        return (
        <div className="content" >
        <Modal
                title="新增"
                visible={this.state.addVisible} 
                onOk={this.addShure} 
                onCancel={this.addhideModal}
                okText="保存"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="addModel"
                destroyOnClose={true}
                centered={true}
                >
                <Row>
                    <Col span={24} style={{borderBottom:'1px solid #eff0f8'}}>
                        <Row className="tit-row">
                            <span></span><b>基本信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}> 
                                <FormItem className="form_input" label="VIN：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    { getFieldDecorator('vins',{
                                        rules: [
                                            { required: true,validator:informSn },
                                        ],
                                    })(<Input placeholder='17位数字英文/英文' maxLength={17} autoComplete='off' type="text" id='vinss'  onKeyDown={this.keycode} />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="配置型号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('carModelId',{
                                        rules: [
                                            { required: true , message: '请选择'}
                                    ],
                                    })(<Select  onSelect={this.findCarSelect} allowClear={true}>
                                        {this.state.findCarModel}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="下线日期：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('downlineDate',{
                                        rules: [{ required: true ,message:'请选择'}]
                                    })(<DatePicker  format="YYYY-MM-DD" onChange={this.downlineDateChange} setFieldsValue={this.state.downlineDate}/>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="外观颜色：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('outColor',{
                                        rules: [{ required: true ,message:'请选择'}]
                                    })(<Select  onSelect={this.colorSelect} allowClear={true}>
                                        {this.state.colorModel}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="出厂日期：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    { getFieldDecorator('outFactoryTime')( <DatePicker  format="YYYY-MM-DD"  onChange={this.outFactoryTimeChange} setFieldsValue={this.state.outFactoryTime}/>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="运营日期：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    { getFieldDecorator('operatData')(<DatePicker  format="YYYY-MM-DD" onChange={this.operatDataChange} setFieldsValue={this.state.operatData}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="批次号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('batchNumber')(<Input type="text"  onKeyDown={this.keycode} autoComplete='off'/>)}
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #eff0f8',marginTop:15}}>
                        <Row className="tit-row">
                            <span></span><b>设备信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}>
                                <FormItem className="form_input" label="电机编号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    { getFieldDecorator('engine',{
                                        rules: [
                                            { required: true ,validator:informTbox}
                                        ],
                                    })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text" maxLength={17} style={{textTransform:'uppercase'}} />)}
                                </FormItem>
                            </Col>
                            <Col span={12} >
                                <FormItem  className="form_input" label="电池编号(MES)：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('batteryNoMes',{
                                        rules: [{ required: true ,validator:informTbox}],
                                    })(<Input  onKeyDown={this.keycode} autoComplete='off' type="text" maxLength={17} style={{textTransform:'uppercase'}} />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="电控编号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('electronicControlNumber',{
                                        rules: [{ required: true ,validator:informTbox}],
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="终端SN" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('snNoId',{
                                        rules: [{ required: true ,message:'请选择'}],
                                    })(<Select  showSearch
                                        optionFilterProp="children"
                                        onChange={this.findSn}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                        {this.state.findSnModel}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="T-BOX型号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('tbone')(<span>{this.state.eqmSeriesName}</span>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="T-BOX版本号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('tbtwo')(<span>{this.state.versionNow}</span>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="T-BOX供应商：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('tbthree')(<span>{this.state.providerName}</span>)}
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{marginTop:15}}>
                        <Row className="tit-row">
                            <span></span><b>其他信息</b>
                        </Row>
                        <Form>
                            <Row style={{marginTop:'20px'}}>
                                <Col span={24}>
                                    <FormItem  className="form_input guiyues" label="规约：" labelCol={{span:6}} wrapperCol={{span:18}} >
                                        {getFieldDecorator('batteryNo')(<Select mode="multiple" onChange={this.dictionarySelect} allowClear={true} showSearch={false}>
                                        {this.state.dictionaryModel }
                                        </Select>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{marginTop:'20px',marginBottom:20,height:150}}>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="备注：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                        {getFieldDecorator('remark')(<TextArea placeholder="请在此处写备注（最多可输入300个中文/英文/特殊符号）" maxLength={300} style={{minWidth:300,minHeight:140}} />)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal>
            
        </div>
        )
    }
}
const addInforms = Form.create()(addInform);
export default addInforms;