import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,Steps,Upload} from 'antd';
import {informSn,informTbox,validatorMobile,invoice,purchaserName,idcard,totalValorem} from '../../../util/validator'
import  Table  from "./../../../component/table/table";
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
class editInform extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state={
        pageSize:10,
        pageNumber:1,
        defaultCurrent:1,
        current:1,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeTargetValue:'',
        typeArr:[],
        modelArr:[],
        // editVisible:false,
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
        ids:[],//规约ID
        provinceChild:[],
        cityChild:[],
        countyChild:[],
        defaultProvince:'',
        defaultCity:'',
        defaultCounty:'',
        findDistributor:[],//销货单位名称
        distributorAddRess:'',//销货单位地址
        plateNoss:'',//编辑车牌号后面的号码
        distributorOutStockTime:'',//出库时间
        distributorInStockTime:'', //入库时间
        imgUrl:'',
        distributorId:'',
        batchNumber:'',
        openTicketData:'',//开票日期
        plateTime:'',//上牌日期
        editDataOne:[],
        editDataTwo:[],
        plateNoId:'',
        editDataThree:[]
    }
    componentDidMount(){
    }
    //编辑
    editList=(record)=>{
        //  销货单位名称
        Axios.get(HttpUrl+"vehicle/vehicle/findDistributor",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.length;i++){
                    this.state.findDistributor.push(<Option value={res.data.data[i].address} key={res.data.data[i].id}>{res.data.data[i].name}</Option>)
                }
            }
        })
        //  规约
         Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"设备分组",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.dictionaryModel.push(<Option value={res.data.data.list[i].id} key={res.data.data.list[i].id}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
        //外观颜色
        Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"颜色",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.colorModel.push(<Option value={res.data.data.list[i].dicValue} key={res.data.data.list[i].id}>{res.data.data.list[i].dicValue}</Option>)
                }
                this.setState({
                    colorModel:this.state.colorModel
                })
            }
        })
        //查询配置型号
        Axios.get(HttpUrl+"vehicle/vehicle/action/findCarModel",httpConfig).then( res => {
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.length;i++){
                    this.state.findCarModel.push(<Option value={res.data.data[i].id} key={res.data.data[i].id}>{res.data.data[i].name}</Option>)
                }
            }
        })
        //终端SN
        Axios.get(HttpUrl+"vehicle/vehicle/findSn?id="+record.vehicleId,httpConfig).then( res => {
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.length;i++){
                    this.state.findSnModel.push(<Option value={res.data.data[i].id} key={res.data.data[i].id}>{res.data.data[i].sn}</Option>)
                }
                this.setState({
                    findSnModel:this.state.findSnModel
                })
            }
        })
        //编辑信息回调
        Axios.get(HttpUrl+'vehicle/vehicle/editEcho?id='+record.vehicleId,httpConfig).then(res => {
            // console.log(res.data.data.ids.map(Number))
            if(res.status == 200 && res.data.code === '100000'){
                this.setState({
                    editData:res.data.data,
                    distributorAddRess:res.data.data.distributorAddRess,
                    distributorId:res.data.data.distributorId,
                    providerName:res.data.data.providerName,
                    eqmSeriesName:res.data.data.eqmSeriesName,
                    versionNow:res.data.data.versionNow,
                    ids:res.data.data.ids?res.data.data.ids.map(Number):[],
                    outFactoryTime:res.data.data.outFactoryTime,
                    operatData:res.data.data.operatData,
                    distributorInStockTime:res.data.data.distributorInStockTime,
                    distributorOutStockTime:res.data.data.distributorOutStockTime,
                    plateTime:res.data.data.plateTime,
                    plateNoss:res.data.data.plateNo,
                    plateNoId:res.data.data.plateNoId

                })
                this.getProvince(this.state.editData)//获取省市县
                this.plateNo(this.state.editData)//获取车牌号
            }
        })
        this.setState({
            editVisible:true,
            record:record,
        })
    }
    edithideModal=()=>{
        this.setState({
            editVisible:false,
            stepCurent:0,
            dictionaryModel:[],
            colorModel:[],
            findCarModel:[],
            findSnModel:[],
            findDistributor:[],
            provinceChild:[],
            cityChild:[],
            countyChild:[],
            defaultProvince:'',
            defaultCity:'',
            defaultCounty:'',
            openTicketData:'',//开票日期
            plateTime:'',//上牌日期
            distributorOutStockTime:'',//出库时间
            distributorInStockTime:'', //入库时间
            downlineDate:'',//下线日期
            outFactoryTime:'',//出厂日期
            operatData:'',//运营日期
            imgUrl:''
        })
    }
    //编辑中的步骤条
    //下一步
    next=()=> {
        this.props.form.validateFields((err, values) => {
            if(!err){
                if(this.state.stepCurent==0){
                    this.handleSubmitForm1()
                    console.log(this.state.editData)
                }else if(this.state.stepCurent==1){
                    this.handleSubmitForm2()
                    console.log(this.state.editData)
                }
            }
        })
        
    }
    //上一步
    prev=()=> {
        const stepCurent = this.state.stepCurent - 1;
        if(this.state.stepCurent==2){
            this.handleSubmitForm3()
            this.setState({
                stepCurent,
            })
        }else if(this.state.stepCurent==1){
            this.setState({
                stepCurent,
            })
        }
    }
    //完成
    completeFinsh=()=>{
        this.handleSubmitForm3()
        console.log(objs1)
        this.props.form.validateFields((err, values) => {
             if (!err) {
                Axios.post(HttpUrl+'vehicle/vehicle/action/edit',
                    this.state.editData
                ,httpConfig).then(res => {
                    if(res.status == 200 && res.data.code === '100000'){
                        message.success('编辑成功')
                        this.setState({
                            editVisible:false,
                            stepCurent:0,
                            dictionaryModel:[],
                            colorModel:[],
                            findCarModel:[],
                            findSnModel:[],
                            findDistributor:[],
                            provinceChild:[],
                            cityChild:[],
                            countyChild:[],
                            defaultProvince:'',
                            defaultCity:'',
                            defaultCounty:'',
                            openTicketData:'',//开票日期
                            plateTime:'',//上牌日期
                            distributorOutStockTime:'',//出库时间
                            distributorInStockTime:'', //入库时间
                            downlineDate:'',//下线日期
                            outFactoryTime:'',//出厂日期
                            operatData:'',//运营日期
                            editDataOne:[],
                            editDataTwo:[],
                            editDataThree:[],
                            ids:[]
                        })
                        this.props.informList()
                    }else if(res.data.code =='220012'){
                        message.warning('设备SN已存在，请重新选择')
                    }else if(res.data.code =='220013'){
                        message.warning('VIN已存在，请重新输入')
                    }else if(res.data.code =='220016'){
                        message.warning('发票号已存在，请重新输入')
                    }else{
                        if(res.data.message){
                            message.warning(res.data.message)
                        }
                    }
                })
            }
        });
        
    }
    //第一步
    handleSubmitForm1 =  () => {
        console.log(this.state.ids)
        console.log(this.props.form.getFieldValue('engine'))
        this.props.form.validateFields((err, values) => { 
            // if (!err) {
                this.state.editDataOne={
                    id:this.state.record.vehicleId,
                    vin:this.state.record.vin,
                    carModelId:this.props.form.getFieldValue('carModelId'),
                    outColor:this.props.form.getFieldValue('outColor'),
                    downlineDate:this.state.downlineDate?this.state.downlineDate:this.state.editData.downlineDate,
                    // this.props.form.getFieldValue('downlineDate'),
                    outFactoryTime:this.state.outFactoryTime,
                    operatData:this.state.operatData,
                    batchNumber:this.props.form.getFieldValue('batchNumber'),
                    engine:this.props.form.getFieldValue('engine'),
                    batteryNoMes:this.props.form.getFieldValue('batteryNoMes'),
                    electronicControlNumber:this.props.form.getFieldValue('electronicControlNumber'),
                    snNoId:this.state.findSnId!=''?this.state.findSnId:this.state.editData.snNoId,
                    ids:this.state.ids,
                    remark:this.props.form.getFieldValue('remark')
                }
                this.setState({
                    stepCurent:this.state.stepCurent+=1,
                })
                
                Object.assign(this.state.editData,this.state.editDataOne)
                console.log(this.state.editDataOne)
                console.log(this.state.editData)
            // }
        })
    }
    //第二步
    handleSubmitForm2 =  () => {
        this.props.form.validateFields((err, values) => { 
            if (!err) {
                this.state.editDataTwo={
                    invoice:this.props.form.getFieldValue('invoice'),
                    openTicketData:this.state.openTicketData?this.state.openTicketData:this.state.editData.openTicketData,
                    purchaserName:this.props.form.getFieldValue('purchaserName'),
                    idcard:this.props.form.getFieldValue('idcard'),
                    totalValorem:this.props.form.getFieldValue('totalValorem'),
                    distributorId:this.state.editData.distributorId?this.state.editData.distributorId:this.state.distributorId,
                    uploadInvoice:this.state.imgUrl?this.state.imgUrl:this.state.editData.uploadInvoice,
                    isInsurance:this.props.form.getFieldValue('isInsurance'),
                    distributorInStockTime:this.state.distributorInStockTime,
                    distributorOutStockTime:this.state.distributorOutStockTime
                    
                }
                this.setState({
                    stepCurent:this.state.stepCurent+=1
                })
                Object.assign(this.state.editData,this.state.editDataTwo)
                console.log(this.state.editData)
                console.log(this.state.editDataTwo)
            }
        })
    }
     //第三步
     handleSubmitForm3 =  () => {
        this.props.form.validateFields((err, values) => { 
            if (!err) {
                this.state.editDataThree={
                    provinces:this.props.form.getFieldValue('provinces'),
                    city:this.props.form.getFieldValue('city'),
                    county:this.props.form.getFieldValue('county'),
                    detailedAddress:this.props.form.getFieldValue('detailedAddress'),
                    distributorId:this.state.distributorId,
                    distributorAddRess:this.state.distributorAddRess,
                    plateNoId:this.state.plateNoId,
                    plateNo:this.state.plateNoss,
                    plateTime:this.state.plateTime
                }
                Object.assign(this.state.editData,this.state.editDataThree)
                console.log(this.state.editData)
                console.log(this.state.editDataThree)
            }
        })
    }
    //下线日期
    downlineDateOnChange=(value, dateString)=> {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.setState({
            downlineDate:dateString
        })
    }
    // 出厂日期
    outFactoryTimeOnChange=(value, dateString)=> {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        
        this.setState({
            outFactoryTime:dateString
        })
        console.log(this.state.outFactoryTime)
        console.log(this.state.editData.outFactoryTime)
    }
    // 入库时间
    InStockTimeOnChange=(value, dateString)=> {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        this.setState({
            distributorInStockTime:dateString
        })
    }
    //出库时间
    OutStockTimeOnChange=(value, dateString)=> {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        this.setState({
            distributorOutStockTime:dateString
        })
    }
    // 开票日期
    openTicketDataOnChange=(value, dateString)=> {
        // console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.setState({
            openTicketData:dateString
        })
    }
    // 上牌日期
    plateTimeOnChange=(value, dateString)=> {
        // console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.setState({
            plateTime:dateString
        })
    }
      
    onOk=(value)=> {
        console.log('onOk: ', value);
    }
     //选择配置型号
     findCarSelect = (value) => {
       this.setState({
           carModelId:value
       })
   }
   //选择销货单位后带出的地址
   sellCompanyName=(value,key)=>{
        this.setState({
            distributorAddRess:value,
            distributorId:key.key
        })
   }
   //终端SN选择后所带出数据
   findSn=(value)=>{
       console.log(value)
       this.setState({
           findSnId:value,
           eqmSeriesName:'',
           versionNow:'',
           provideviderName:''
       })
       Axios.get(HttpUrl+"vehicle/vehicle/findTboxBySn?id="+value,httpConfig).then( res => {
           if(res.status == 200 && res.data.code === '100000'){
              this.setState({
               providerName: res.data.data.providerName,
               eqmSeriesName:res.data.data.eqmSeriesName,
               versionNow:res.data.data.versionNow
              })
           }
       })
   }
   //数据字典查询颜色
   colorSelect=(record)=>{
      console.log(record)
   }
   //规约
   dictionarySelect=(record)=>{
       this.setState({
        ids:record,
       })
       console.log(record)
   }
//获取省份
getProvince = (record) => {
    new Promise((resolve,reject) => {
        Axios.get(HttpUrl+'vehicle/open/v1/area',httpConfig).then( res => {
            const provinceList=[];
            for(let i=0;i<res.data.data.length;i++){
                provinceList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
            }
            if(record){
                this.setState({
                    provinceChild:provinceList,
                })
                resolve(record.provinces)
                
            }else{
                this.setState({
                    provinceChild:provinceList,
                    defaultProvince:res.data.data[0].id
                })
                resolve(res.data.data[0].id)
            }
        })
    }).then( v => {
        new Promise((resolve,reject)=>{
            Axios.get(HttpUrl+'vehicle/open/v1/area/'+v+'/subset',httpConfig).then( res => {
                const cityList=[];
                for(let i=0;i<res.data.data.length;i++){
                    cityList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
                }
                if(record){
                    this.setState({
                        cityChild:cityList,
                    })
                    resolve(record.city)
                }else{
                    this.setState({
                        cityChild:cityList,
                        defaultCity:res.data.data[0].id
                    })
                    resolve(res.data.data[0].id)
                }
            })
        }).then( v => {
            new Promise((resolve,reject) => {
                Axios.get(HttpUrl+'vehicle/open/v1/area/'+v+'/subset',httpConfig).then( res => {
                    const countyList=[];
                        for(let i=0;i<res.data.data.length;i++){
                            countyList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
                        }
                        if(record){
                            this.setState({
                                countyChild:countyList,
                            })
                        }else{
                            this.setState({
                                countyChild:countyList,
                                defaultCounty:res.data.data[0].id
                            })
                        }
                    })
                })
            }) 
        })
    }
//select省份选择
provinceSelect = (value) => {
    new Promise((resolve,reject)=>{
        Axios.get(HttpUrl+'vehicle/open/v1/area/'+value+'/subset',httpConfig).then( res => {
            const cityList=[];
            for(let i=0;i<res.data.data.length;i++){
                cityList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
            }
            this.setState({
                cityChild:cityList,
            })
            this.props.form.setFieldsValue({
                city:res.data.data[0].id
            })
            resolve(res.data.data[0].id)
        })
    }).then( v => {
        new Promise((resolve,reject) => {
            Axios.get(HttpUrl+'vehicle/open/v1/area/'+v+'/subset',httpConfig).then( res => {
                const countyList=[];
                for(let i=0;i<res.data.data.length;i++){
                    countyList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
                }
                this.setState({
                    countyChild:countyList,
                })
                this.props.form.setFieldsValue({
                    county:res.data.data[0].id
                })
            })
        })
    }) 
}
//city城市
citySelect = (value) => {
    new Promise((resolve,reject) => {
        Axios.get(HttpUrl+'vehicle/open/v1/area/'+value+'/subset',httpConfig).then( res => {
            const countyList=[];
            for(let i=0;i<res.data.data.length;i++){
                countyList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
            }
            this.setState({
                countyChild:countyList
            })
        })
    })
}
//车牌号
plateNo=(record)=>{
    Axios.get(HttpUrl+'vehicle/open/v1/plate-numbers',httpConfig)
    .then(res => {
        if(res.status == 200 && res.data.code === '100000'){
            let arr = []
            arr.push(<Option value='0' key='0'>请选择</Option>)
            for(let i=0;i<res.data.data.length;i++){
                arr.push(<Option value={res.data.data[i].id} key={res.data.data[i].id}>{res.data.data[i].value}</Option>)
            }
            if(this.state.plateNoId!=undefined){
                this.setState({
                    ownerName: (<Select defaultValue={{key:this.state.plateNoId}} labelInValue onSelect={this.handleSelectCar} style={{width:'85px'}}>
                    {arr}
                </Select>)
                })
            }else{
                this.setState({
                ownerName: (<Select defaultValue={{key:this.state.editData.plateNoId?this.state.editData.plateNoId:'0'}} labelInValue onSelect={this.handleSelectCar} style={{width:'85px'}}>
                {arr}
                </Select>),
                plateNoId:'0',
                plateNoId:this.state.plateNoId
                })
            }
            
        }
    })
}
//车牌号前面区号
handleSelectCar=(value)=>{
    this.setState({
        plateNoId:value.key
    },()=>{
        if(this.props.form.getFieldValue('plateNo')){
            this.props.form.validateFields(['plateNo'],{ force: true })
        }
    })
}
//车牌号校验
plateNovalidator=(rules,value,callback)=>{
    console.log(this.state.plateNoId)
    let plateNovalidator = /^[A-Z]{1}[A-Z_0-9]{5,6}$/
    if(this.props.form.getFieldValue('plateNo')==''&&this.state.plateNoId!=null){
        callback('车牌号格式错误')
    }
    if(value){
        if(!plateNovalidator.test(value) || this.state.plateNoId=='0'){
            callback('车牌号格式错误')
        }else{
            this.setState({
                plateNoss:value
            })
        }
    }
    callback()
}
handleChange=(info)=>{
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
}
viewImg=()=>{
    if(this.state.imgUrl=='' && this.state.editData.uploadInvoice==''){
        message.warning('还未上传发票')
    }
}
onChange1=(date, dateString)=>{
    console.log( dateString);
    this.setState({
        operatData:dateString
    })
}
keycode = (event) => {
    if(event.keyCode=='32'){
        event.preventDefault();
        return false;
    }
}
    render() {
        const { previewVisible,previewVisible1, previewImage,previewImage1, fileList,fileLists } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus-circle" />
          </div>
        );

        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state;
        const { selectedRowKeys } = this.state;
        const { steps } = this.state;
        const { stepCurent } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange :(selectedRowKeys,selectedRows) => {
                this.setState({ 
                    selectedRowKeys
                });
            }
        };
        const props = {
            onChange: this.handleChange,
            name: 'file',
            beforeUpload: (file) => {
                let index1=file.name.lastIndexOf(".")
                let files=file.name.substring(index1)
                if(file.size>(5120)*1024){
                    message.warning('大小不得超过5M')
                }else{
                    let index1=file.name.lastIndexOf(".")
                    let files=file.name.substring(index1)
                    if(files == '.jpeg' || files == '.gif' || files == '.png' ||files == '.jpg' ){
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append('type',1);
                            Axios.post(HttpUrl+'vehicle/vehicle/action/upload',formData,{ 
                                headers: { 'Content-Type': 'multipart/form-data'}
                            }).then(res => {
                                if(res.status == 200 && res.data.code === '100000'){
                                    this.setState({
                                        imgUrl:res.data.data
                                    })
                                    message.success('上传成功')
                                }
                            })
                    }else{
                        message.warning('上传文件必须为JPG/JPEG/GIF/PNG')
                    }
                    return false
                }
            },
            onRemove: () => { 
                this.setState({
                    fileList:[]
                })
            },
        };
        let record=this.state.record;
        let editData=this.state.editData;
        let _t = this
        return (
        <div className="content" >
        <Modal
                title="编辑"
                visible={this.state.editVisible} 
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                footer={null}
                onCancel={this.edithideModal}
                centered={true}
                className=" editModel"
                >
                <div>
                    <div className='stepBox'>
                        <Steps current={this.state.stepCurent}>
                            <Step title="出厂信息"/>
                            <Step title="销售信息" />
                            <Step title="车牌信息" />
                        </Steps>
                    </div>
                    <div className='editStep' >
                        { this.state.stepCurent==0 ?
                        
                            <Form style={{height:430,overflowY:'scroll'}}><Row>
                            <Col span={24}>
                                <Row className="tit-row">
                                    <span></span><b>车辆信息</b>
                                </Row>
                                
                                <Row style={{marginTop:'20px'}}>
                                    <Col span={12}> 
                                        <FormItem className="form_input" label="VIN：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            { getFieldDecorator('vin',{
                                                initialValue:editData.vin
                                            })(<span>{record.vin}</span>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="配置型号：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            {getFieldDecorator('carModelId',{
                                                initialValue:editData.carModelId,
                                                rules: [ { required: true ,message:'请选择'}],
                                            })(<Select  onSelect={this.findCarSelect} allowClear={true}>
                                                {this.state.findCarModel}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="外观颜色：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('outColor',{
                                                initialValue:editData.outColor,
                                                rules: [ { required: true ,message:'请选择'}],
                                            })(<Select  onSelect={this.colorSelect} allowClear={true}>
                                                {this.state.colorModel}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="下线日期：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('downlineDate',{
                                                initialValue:editData.downlineDate?moment(editData.downlineDate):null,
                                                rules: [ { required: true ,message:'请选择'}],
                                            })(<DatePicker format={format} onChange={this.downlineDateOnChange}/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="出厂日期：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            {getFieldDecorator('outFactoryTime',{
                                                initialValue:editData.outFactoryTime?moment(editData.outFactoryTime):null,
                                            })(<DatePicker format={format}  onChange={this.outFactoryTimeOnChange}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="运营日期：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            {getFieldDecorator('operatData',{
                                                initialValue:editData.operatData?moment(editData.operatData):null,
                                            })(<DatePicker format={format} onChange={this.onChange1}/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="批次号：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            {getFieldDecorator('batchNumber',{
                                                initialValue:editData.batchNumber,
                                            })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row className="tit-row">
                                    <span></span><b>设备信息</b>
                                </Row>
                                <Row style={{marginTop:'20px'}}>
                                    <Col span={12}> 
                                        <FormItem className="form_input" label="电机编号：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            { getFieldDecorator('engine',{
                                                
                                                rules: [ { required: true ,validator:informTbox} ],
                                                initialValue:editData.engine?editData.engine:null,
                                            })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="电池编号(MES)：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                            {getFieldDecorator('batteryNoMes',{
                                                initialValue:editData.batteryNoMes,
                                                rules: [ { required: true,validator:informTbox } ],
                                            })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="电控编号：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('electronicControlNumber',{
                                                initialValue:editData.electronicControlNumber,
                                                rules: [ { required: true,validator:informTbox } ],
                                            })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="终端SN：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('snNoId',{
                                                initialValue:editData.snNoId?String(editData.snNoId):null,
                                                rules: [ { required: true ,message:'请选择'} ],
                                            })(<Select  showSearch
                                                optionFilterProp="children"
                                                onSelect={this.findSn}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                {this.state.findSnModel}
                                            </Select>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="T-BOX型号：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('batteryNoMES')(<span>{this.state.eqmSeriesName}</span>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="T-BOX版本号：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('batteryNoMES')(<span>{this.state.versionNow}</span>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem  className="form_input" label="T-BOX供应商名称：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                            {getFieldDecorator('batteryNoMES')(<span>{this.state.providerName}</span>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{paddingBottom:85}}>
                                <Row className="tit-row">
                                    <span></span><b>其他信息</b>
                                </Row>
                                    <Row style={{marginTop:'20px'}}>
                                        <Col span={24}>
                                            <FormItem  className="form_input guiyuess" label="规约：" labelCol={{span:6}} wrapperCol={{span:18}}   style={{paddingRight:'15px'}}>
                                                {getFieldDecorator('statuteId',{
                                                    initialValue:this.state.ids,
                                                })(<Select  mode="multiple" onChange={this.dictionarySelect} allowClear={true}>
                                                    {this.state.dictionaryModel}
                                                </Select>)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop:'20px',marginBottom:20,height:150}}>
                                        <Col span={24}>
                                            <FormItem  className="form_input beizhus" label="备注：" labelCol={{span:6}} wrapperCol={{span:18}}  style={{paddingRight:'15px'}}>
                                                {getFieldDecorator('remark',{
                                                    initialValue:editData.remark,
                                                })(<TextArea placeholder="请在此处写备注（最多可输入300个中文/英文/数字/特殊符号）" maxLength={300} style={{minWidth:300,minHeight:140}} />)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                
                            </Col>
                            
                        </Row></Form>
                        :'' }
                    </div>
                    <div className='editStep twoeditStep'>
                        { this.state.stepCurent==1 ?
                            <Form style={{marginTop:80,paddingBottom:85,height:350,overflowY:'scroll'}}>
                                <FormItem className="form_input" label="发票号码：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    { getFieldDecorator('invoice',{
                                        initialValue:editData.invoice,
                                        rules: [
                                            { required: true ,validator:invoice }
                                    ],
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                </FormItem>
                                <FormItem  className="form_input" label="开票日期：" labelCol={{span:10}} wrapperCol={{span:14}} >
                                    {getFieldDecorator('openTicketData',{
                                        initialValue:editData.openTicketData?moment(editData.openTicketData):null,
                                        rules: [ { required: true,message:'请选择' }],
                                    })(<DatePicker format={format} onChange={this.openTicketDataOnChange}/>)}
                                </FormItem>
                                <FormItem  className="form_input" label="购买方名称：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('purchaserName',{
                                        initialValue:editData.purchaserName,
                                        rules: [
                                            { required: true ,validator:purchaserName,}
                                    ],
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                </FormItem>
                                
                                
                                <FormItem  className="form_input" label="身份证号或统一社会信用代码：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('idcard',{
                                        initialValue:editData.idcard,
                                        rules: [
                                            { required: true ,validator:idcard}
                                    ],
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                </FormItem>
                                <FormItem  className="form_input" label="价税合计(小写)：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('totalValorem',{
                                        initialValue:editData.totalValorem,
                                        rules: [
                                            {validator:totalValorem}
                                    ]
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode}/>)}
                                </FormItem>
                                <FormItem  className="form_input" label="销货单位名称：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('sellCompanyName',{
                                         initialValue:editData.distributorName,
                                        rules: [
                                            { required: true,message:'请选择' }
                                    ],
                                    })(<Select onSelect={this.sellCompanyName}  allowClear={true}>
                                        {this.state.findDistributor}
                                    </Select>)}
                                </FormItem>
                                <FormItem  className="form_input" label="销货单位地址：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('distributorAddRess')(<span>{this.state.distributorAddRess}</span>)}
                                </FormItem>
                                <FormItem  className="form_input" label="发票：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('uploadInvoice')(<span><Upload {...props}>
                                        <Button style={{border:'1px solid #1890ff',color:'#1890ff'}}>
                                          <Icon type="upload" style={{color:'#1890ff'}}/>上传
                                        </Button>
                                      </Upload>
                                      <a style={{paddingLeft:10,display:'inline-block'}} href={this.state.imgUrl?this.state.imgUrl:editData.uploadInvoice?editData.uploadInvoice:'javascript:;'} onClick={this.viewImg} target='view_blank'>查看发票</a>
                                      </span>)}
                                </FormItem>
                                <FormItem  className="form_input" label="是否三包" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('isInsurance',{
                                        initialValue:editData.isInsurance
                                    })(<RadioGroup  className='stepRadio'>
                                    <Radio value="1">是</Radio>
                                    <Radio value="0">否</Radio>
                                </RadioGroup>)}
                                </FormItem>
                                <FormItem  className="form_input" label="入库时间：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('distributorInStockTime',{
                                        initialValue:editData.distributorInStockTime?moment(editData.distributorInStockTime):null,
                                    })(<DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        onChange={this.InStockTimeOnChange}
                                        onOk={this.onOk}
                                        />)}
                                </FormItem>
                                <FormItem  className="form_input" label="出库时间：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('distributorOutStockTime',{
                                        initialValue:editData.distributorOutStockTime?moment(editData.distributorOutStockTime):null,
                                    })(<DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        onChange={this.OutStockTimeOnChange}
                                        onOk={this.onOk}
                                        />)}
                                </FormItem>
                            </Form>
                            :''
                        }
                    </div>
                    <div className='editStep'>
                        { this.state.stepCurent==2 ?
                            <Form style={{marginTop:80,paddingBottom:85,height:350,overflowY:'scroll'}}>
                                <FormItem className="form_input" label='注册省份：' labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {
                                        getFieldDecorator('provinces',{
                                            initialValue:editData.provinces
                                        })(
                                            <Select  className='opt' onSelect={this.provinceSelect}>
                                                {this.state.provinceChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem  className="form_input" label='注册地市：' labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {
                                        getFieldDecorator('city',{
                                            initialValue: editData.city
                                        })(
                                            <Select onSelect={this.citySelect}>
                                                {this.state.cityChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem  className="form_input" label='注册区县：' labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {
                                        getFieldDecorator('county',{
                                            initialValue:editData.county 
                                        })(
                                            <Select onSelect={this.countySelect} id={3}>
                                                {this.state.countyChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                                <FormItem className="form_input" label="注册详细地址：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    { getFieldDecorator('detailedAddress',{
                                        initialValue:editData.detailedAddress
                                    })(<Input type="text"  autoComplete='off' onKeyDown={this.keycode} maxLength={100}/>)}
                                </FormItem>
                                <FormItem  className="form_input plateNo" label="车牌号：" labelCol={{span:10}} wrapperCol={{span:14}}>
                                    {getFieldDecorator('plateNo',{
                                        rules: [{validator:this.plateNovalidator}],
                                        initialValue:editData.plateNo?editData.plateNo:''
                                    })(<Input autoComplete='off' addonBefore={this.state.ownerName} type="text"  onKeyDown={this.keycode}/>)}
                                </FormItem>
                                <FormItem  className="form_input" label="上牌日期" labelCol={{span:10}} wrapperCol={{span:14}} >
                                    {getFieldDecorator('plateTime',{
                                         initialValue:editData.plateTime?moment(editData.plateTime):null,
                                    })(<DatePicker format={format} onChange={this.plateTimeOnChange}/>)}
                                </FormItem>
                            </Form>
                            :''
                        }
                    </div>
                    <Form  className="stepFoot" style={{background:'#ffffff',zIndex:9999,width:'95%'}}>
                        {this.state.stepCurent==0 ? <Button  className='btn cielStep' type="primary"   onClick={this.edithideModal} style={{width:75}}>取消</Button> : ''}
                        {this.state.stepCurent!==0 ? <Button  style={{width:75}} className='btn' onClick={this.prev}>上一步</Button> : ''}
                        {this.state.stepCurent!==2 ? <Button  style={{width:75}} className='btn' type="primary"   onClick={this.next}>下一步</Button> : ''}
                        {this.state.stepCurent==2 ? <Button  style={{width:75}} className='btn' type="primary"   onClick={this.completeFinsh}>完成</Button> : ''}
                    </Form>
                </div>
            </Modal>
            <style>{`
                    .ant-col-12{height:55px}
                    .ant-select-selection{height:28px;border-radius:2px;}
                    .ant-select{width:100%}
                    .editModel .ant-calendar-picker{width:180px!important}
                    .editModel{width:700px!important;}
                    .editModel .ant-steps{width:90%!important;padding-left:5%}
                    .editModel .tit-row{padding-left:10px;}
                    .editModel .tit-row span{left:0}
                    .editModel .tit-row{margin-top:30px}
                    .editStep .ant-input{width:180px;}
                    .editModel .ant-select-selection{width:180px;}
                    .editModel  .ant-btn-primary:hover,.editModel   .ant-btn-primary:focus{background:#ffffff!important;border:1px solid #40a9ff!important;color:#40a9ff!important}
                    .editModel .guiyuess .ant-select-selection{height:auto!important}
                    .editModel .guiyuess .ant-form-item-label,.beizhus .ant-form-item-label{width:123px}
                    .editModel .guiyuess .ant-form-item-control-wrapper{width:300px;}
                    .editModel .guiyuess .ant-select-selection{width:300px}
                    .editModel .guiyuess form .ant-select{width:300px!important}
                    .editModel .tit-row{font-size:14px;color:#3689FF;position: relative;margin-left:15px;}
                    .editModel .tit-row span{width:2px;height:14px;background:#3689FF;position: absolute;left:-8px;top:4px;}
                    .cielStep{background:#ffffff!important;border-color:#cccccc!important}
                `}</style>
        </div>
        )
    }
}
const editInforms = Form.create()(editInform);
export default editInforms;