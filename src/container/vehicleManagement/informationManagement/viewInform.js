// 详情
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,Steps,Upload} from 'antd';
import {informSn,informTbox,validatorMobile} from '../../../util/validator'
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png';
import {httpConfig, HttpUrl} from '../../../util/httpConfig';
import OnbindInform from './onbindInform'
import EditInform from './editInform'
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const format = 'YYYY-MM-DD';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class viewInform extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        ownerName:'',//车牌号
        previewVisible: false,
        previewVisible1: false,
        previewImage: '',
        previewImage1: '',
        fileList: [{
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
        fileLists: [{
            uid: '-2',
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
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
        addVisible:false,
        viewVisible:false,
        editVisible:false,
        unbundVisible:false,
        onbundVisible:false,
        applicationVisible:false,
        auditVisible:false,
        selectedRowKeys:[],
        selectedRows:[],
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
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeTargetValue:'',
        typeArr:[],
        modelArr:[],
        findDistributor:[],//销货单位名称
        sellCompany:'',//销货单位地址
        distributorAddRess:'',//销货单位地址
        openTicketData:'',//截取正确格式开票日期
        serviceAuthenticationInfo:[],//服务认证信息
        columns:[{ 
            title: '手机号',
            dataIndex: 'mobile',
            width:170
        },{ 
            title: '车主姓名',
            dataIndex: 'name' ,
            width:170
        },{ 
            title: '车主身份证号',
            dataIndex: 'idcard', 
            width:170
        },{ 
            title: '操作人',
            dataIndex: 'operator' ,
            width:170
        },{ 
            title: '操作时间',
            dataIndex: 'operationTime',
            width:170
        },{ 
            title: '状态',
            dataIndex: 'state',
            width:170
            },
        ],
        
        data : []
    }
    viewList=(record)=>{
        
        console.log(record)
        //  销货单位名称
        Axios.get(HttpUrl+"vehicle/vehicle/findDistributor",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                console.log(res)
                for(let i=0;i<res.data.data.length;i++){
                    this.state.findDistributor.push(<Option value={res.data.data[i].address} key={res.data.data[i].id}>{res.data.data[i].name}</Option>)
                }
            }
        })
        //  规约
         Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"设备分组",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                console.log(res.data.data)
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.dictionaryModel.push(<Option value={res.data.data.list[i].id} key={res.data.data.list[i].id}>{res.data.data.list[i].dicValue}</Option>)
                }
            }
        })
        //外观颜色
        Axios.get(HttpUrl+"sys/dictionary/dictionaryList?gid="+10+"&&type="+"颜色",httpConfig).then( res => {
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.colorModel.push(<Option value={res.data.data.list[i].value} key={res.data.data.list[i].id}>{res.data.data.list[i].dicValue}</Option>)
                }
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
        //服务认证
        Axios.get(HttpUrl+'vehicle/vehicle/serviceAuthenticationInfo?id='+record.vehicleId,httpConfig).then( res => {
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                this.setState({
                    serviceAuthenticationInfo:res.data.data
                })
            }
        })
        //绑定记录
        this.bindRecord(this.state.pageNumber,this.state.pageSize,record.vehicleId)
        //编辑信息回调
        Axios.get(HttpUrl+'vehicle/vehicle/editEcho?id='+record.vehicleId,httpConfig).then(res => {
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                this.setState({
                    editData:res.data.data,
                    distributorAddRess:res.data.data.distributorAddRess,
                    distributorId:res.data.data.distributorId,
                    providerName:res.data.data.providerName,
                    eqmSeriesName:res.data.data.eqmSeriesName,
                    versionNow:res.data.data.versionNow
                })
                this.getProvince(this.state.editData)//获取省市县
                this.openTicketData(this.state.editData)
                console.log(this.state.editData)
            }
        })
        
        this.setState({
            viewVisible:true,
            record:record
        })
        
        console.log(record)
       
    }
    cancelEdit=()=>{
        this.setState({
            viewVisible:false
        })
    }
    //开票日期
    openTicketData=(editData)=>{
        console.log(editData.openTicketData)
        var openTicketData=editData.openTicketData
        var arr=openTicketData?openTicketData.split("T")[0]:null;
        console.log(arr)
        this.setState({
            openTicketData:arr
        })
    }
     //选择销货单位后带出的地址
   sellCompanyName=(value,key)=>{
        console.log(value)
        console.log(key.key)
        this.setState({
            distributorAddRess:value,
            distributorId:key.key
        })
    }
     //分页获取数据
     onChange = (pageNumber) =>{
        this.setState({
            selectedRowKeys:[],
            selectedRows:[]
        })
        this.bindRecord(pageNumber,this.state.pageSize,this.state.record.vehicleId)
    }
    //绑定记录
    bindRecord=(pageNumber,pageSize,vehicleId)=>{
        Axios.post(HttpUrl+'vehicle/vehicle/bindingRecord',{'id':vehicleId,'startPage':pageNumber,
        'pageSize':pageSize},httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                // console.log(res.data.data.list)
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].vehicleId;
                    (res.data.data.list[i].status==1) ? (res.data.data.list[i].status="绑定"):(res.data.data.list[i].status="解绑");
                }
                this.setState({
                    data:res.data.data.list,
                    pageNumber:pageNumber,
                    total:res.data.data.total,
                    loading:false
                })
            }
        })
    }
    viewImg=()=>{
        console.log(this.state.serviceAuthenticationInfo.handIdcardFrontPath)
        if(this.state.serviceAuthenticationInfo.handIdcardFrontPath==null){
            message.warning('还未上传照片')
        }
    }
    viewImg2=()=>{
        if(this.state.serviceAuthenticationInfo.handIdcardContraryPath==null){
            message.warning('还未上传照片')
        }
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
            console.log(record)
        })
    }).then( v => {
        console.log(v)
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
            console.log(v)
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
    console.log('省份,'+value)
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
    console.log('地方,'+value)
    new Promise((resolve,reject) => {
        Axios.get(HttpUrl+'vehicle/open/v1/area/'+value+'/subset',httpConfig).then( res => {
            const countyList=[];
            for(let i=0;i<res.data.data.length;i++){
                countyList.push(<Option key={i} value={res.data.data[i].id}>{res.data.data[i].value}</Option>)
            }
            this.setState({
                countyChild:countyList
            })
            // this.props.form.setFieldsValue({
            //     county:res.data.data[0].value
            // })
        })
    })
}
imgInvoice=()=>{
    if(!this.state.editData.uploadInvoice){
        message.warning('还未上传发票')
    }
}
    render() {
        const detailData=this.state.detailData
        const { previewVisible,previewVisible1, previewImage,previewImage1, fileList,fileLists } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus-circle" />
          </div>
        );

        const { getFieldDecorator }=this.props.form;
        const { typeArr,selectedRowKeys,serviceAuthenticationInfo ,steps,stepCurent} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange :(selectedRowKeys,selectedRows) => {
                this.setState({ 
                    selectedRowKeys,
                    selectedRows
                });
                // console.log(selectedRowKeys)
            }
    
    
        };
        const props = {
            name: 'file',
            action: '//jsonplaceholder.typicode.com/posts/',
            headers: {
              authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                //   console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }
            }
        let record=this.state.record;
        let editData=this.state.editData;
        let _t = this
        return (
        <div className="content" >
            <Modal 
                title="详情" 
                visible={this.state.viewVisible} 
                onCancel={this.cancelEdit}
                footer={null}
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="addModel viewModel"
                destroyOnClose={true}
                centered={true}
                >
                <Row>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 '}}>
                        <Row className="tit-row">
                            <span></span><b>基本信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}> 
                                <FormItem className="form_input" label="VIN：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}><span  autoComplete='off'  >{editData.vin}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="配置型号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('carModelId',{
                                        initialValue:editData.carModelId,
                                        rules: [ { required: true ,message:'请选择'}],
                                    })(<Select  onSelect={this.findCarSelect} allowClear={true} disabled>
                                        {this.state.findCarModel}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            
                            <Col span={12}>
                                <FormItem  className="form_input" label="外观颜色：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.outColor}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="下线日期：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{editData.downlineDate}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="出厂日期：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.outFactoryTime}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="运营日期：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{editData.operatData}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="批次号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.batchNumber}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row">
                            <span></span><b>设备信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}>
                                <FormItem className="form_input" label="电机编号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.engine}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="电池编号(MES)：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('vehicleType')(<span  autoComplete='off' >{editData.batteryNoMes}</span>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="电控编号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.electronicControlNumber}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                            <FormItem  className="form_input" label="终端SN：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}} >
                                            {getFieldDecorator('snNoId',{
                                                initialValue:editData.snNoId?String(editData.snNoId):null,
                                                rules: [ { required: true ,message:'请选择'} ],
                                            })(<Select  showSearch disabled
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
                                <FormItem  className="form_input" label="T-BOX型号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{this.state.eqmSeriesName}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="T-BOX版本号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{this.state.versionNow}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input gongying" label="T-BOX供应商名称：" labelCol={{span:6}} wrapperCol={{span:18}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{this.state.providerName}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row">
                            <span></span><b>其他信息</b>
                        </Row>
                        <Row style={{marginTop:'20px',height:55}}>
                            <Col span={24}>
                                <FormItem  className="form_input guiyues" label="规约：" labelCol={{span:6}} wrapperCol={{span:18}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('statuteId',{
                                        initialValue:editData.list,
                                    })(<Select  mode="multiple" allowClear={true} disabled>
                                        {this.state.dictionaryModel}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{height:55}}>
                            <Col span={24}>
                                <FormItem  className="form_input beizhu" label="备注：" labelCol={{span:6}} wrapperCol={{span:18}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.remark}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row">
                            <span></span><b>销售信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}>
                                <FormItem className="form_input" label="发票号码：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.invoice}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="开票日期：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>{getFieldDecorator('openTicketData',{
                                        // initialValue:editData.openTicketData?moment(editData.openTicketData):null,
                                    })(<span>{this.state.openTicketData}</span>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="购买方名称：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.purchaserName}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="价税合计(小写)：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{editData.totalValorem}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input input-mores" label="销货单位名称：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span>
                                        {editData.distributorName}
                                    </span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input sellCompanyAddresss" label="销货单位地址：" labelCol={{span:5}} wrapperCol={{span:19}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{this.state.distributorAddRess}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="发票：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><a  href={editData.uploadInvoice?editData.uploadInvoice:'javascript:;'} onClick={this.imgInvoice} target='view_blank'>查看发票</a>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="是否三包" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('isInsurance',{
                                        initialValue:editData.isInsurance
                                    })(<RadioGroup  className='stepRadio' disabled>
                                    <Radio value="1">是</Radio>
                                    <Radio value="0">否</Radio>
                                    </RadioGroup>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="入库时间：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.distributorInStockTime}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="出库时间：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{editData.distributorOutStockTime}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input" label="身份证号或统一社会信用代码：" labelCol={{span:8}} wrapperCol={{span:16}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.idcard}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row">
                            <span></span><b>注册及车牌信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px'}}>
                            <Col span={12}>
                                <FormItem className="form_input" label="注册省份：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    {
                                        getFieldDecorator('provinces',{
                                            initialValue:editData.provinces
                                        })(
                                            <Select  className='opt' onSelect={this.provinceSelect} disabled>
                                                {this.state.provinceChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label='注册地方：' labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                    {
                                        getFieldDecorator('city',{
                                            initialValue: editData.city
                                        })(
                                            <Select onSelect={this.citySelect} disabled>
                                                {this.state.cityChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label='注册区县：' labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                    {
                                        getFieldDecorator('county',{
                                            initialValue:editData.county 
                                        })(
                                            <Select onSelect={this.countySelect} id={3} disabled>
                                                {this.state.countyChild}
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input sellCompanyAddresss" label="注册详细地址：" labelCol={{span:5}} wrapperCol={{span:19}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.detailedAddress}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem  className="form_input" label="上牌日期：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}><span  autoComplete='off' >{editData.plateTime}</span>
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem  className="form_input" label="车牌号：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}><span  autoComplete='off' >{editData.plateNoName+editData.plateNo}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        </Form>
                    </Col>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row" style={{marginBottom:20}}>
                            <span></span><b>绑定记录</b>
                        </Row>
                        <Table
                        scroll={ 800 }
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        loading={this.state.loading}
                        total={this.state.total}
                        current={this.state.pageNumber}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}
                        onShowSizeChange={this.onShowSizeChange}
                        size='small'
                        
                        />
                    </Col>
                    <Col span={24} style={{marginTop:10}}>
                        <Row className="tit-row">
                            <span></span><b>服务认证信息</b>
                        </Row>
                        <Form>
                        
                        <Row style={{marginTop:'20px'}}>
                            
                            <Col span={12} style={{height:55}}>
                                <FormItem  className="form_input" label="手持正面身份证照片：" labelCol={{span:14}} wrapperCol={{span:10}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('handIdcardFrontPath')(<a  autoComplete='off' href={!serviceAuthenticationInfo?null:serviceAuthenticationInfo.handIdcardFrontPath?serviceAuthenticationInfo.handIdcardFrontPath:'javascript:;'} onClick={this.viewImg} target='view_blank'>查看</a>)}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{height:55}}>
                                <FormItem  className="form_input" label="手持反面身份证照片：" labelCol={{span:14}} wrapperCol={{span:10}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('handIdcardContraryPath')(<a  autoComplete='off' href={!serviceAuthenticationInfo?null:serviceAuthenticationInfo.handIdcardContraryPath?serviceAuthenticationInfo.handIdcardContraryPath:'javascript:;'} onClick={this.viewImg2} target='view_blank'>查看</a>)}
                                </FormItem>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col span={12} style={{height:55}}>
                                <FormItem  className="form_input" label="审核人：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingRight:'15px'}}>
                                    {getFieldDecorator('batteryNoMES')(<span  autoComplete='off' >{!serviceAuthenticationInfo?null:serviceAuthenticationInfo.auditor}</span>)}
                                </FormItem>
                            </Col>
                            <Col span={12} style={{height:55}}>
                                <FormItem  className="form_input" label="审核时间：" labelCol={{span:10}} wrapperCol={{span:14}}  style={{paddingLeft:'15px'}}>
                                    {getFieldDecorator('batteryNoMES')(<span  autoComplete='off' >{!serviceAuthenticationInfo?null:serviceAuthenticationInfo.modifyTime}</span>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem className="form_input zhuangtai" label="状态：" labelCol={{span:6}} wrapperCol={{span:18}}>
                                    { getFieldDecorator('vin')(<span  autoComplete='off' >
                                    {!serviceAuthenticationInfo?null:serviceAuthenticationInfo.networkStatus=='0'?'未申请':serviceAuthenticationInfo.networkStatus=='1'?'审核中':serviceAuthenticationInfo.networkStatus=='2'?'审核不通过':serviceAuthenticationInfo.networkStatus=='3'?'审核通过':null}</span>)}
                                </FormItem>
                            </Col>
                            </Row>
                            <Row>
                            <Col span={24} style={{height:55}}>
                                <FormItem  className="form_input yijian" label="审核意见：" labelCol={{span:6}} wrapperCol={{span:18}}>
                                    {getFieldDecorator('vehicleType')(<span  autoComplete='off' >{!serviceAuthenticationInfo?null:serviceAuthenticationInfo.auditOpinion}</span>)}
                                </FormItem>
                            </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Modal>
            <style>
                {`
                    .sellCompanyAddresss .ant-form-item-label{width:130px}
                    .input-mores .ant-form-item-label{width:130px}
                    .viewModel .ant-modal-body{height:440px;overflow-y:scroll}
                    .guiyues .ant-select-selection{height:auto!important}
                    .guiyues .ant-form-item-label,.beizhu .ant-form-item-label,.gongying .ant-form-item-label,.zhuangtai .ant-form-item-label,.yijian .ant-form-item-label{width:130px!important}
                    .guiyues .ant-form-item-control-wrapper{width:300px;}
                    .yijian .ant-form-item-control{line-height:25px!important;padding-top:5px}
                    .viewModel .ant-form-item-label{line-height:35px!important}
                `}
            </style>
        </div>
        )
    }
}
const viewInforms = Form.create()(viewInform);
export default viewInforms;