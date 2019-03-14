/*设备管理>车辆信息管理========cq*/
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
import ViewInform from './viewInform'
import AddInform from './addInform'
import  ImportExcel  from "./../../../component/import/importExcel2";
import  ImportExcels  from "./../../../component/import/importExcel2";
import nodata1 from './../../../img/nodata1.png'
import nodata2 from './../../../img/nodata2.png'
import nodata3 from './../../../img/nodata3.png'
import actionimg from './../../../img/actionimg.png'
import shenhe from './shenhe.png';
import daochu from './daochu.png';
import daoru from './daoru.png';
import xinzeng from './xinzeng.png';
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
const Step = Steps.Step;//步骤条
const children = [];
  
class deviceManage extends Component {
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
        columns:[{ 
            title: '序号', 
            width: 100, 
            dataIndex: 'number', 
            fixed: 'left' 
        },{ 
            title: 'VIN',
            dataIndex: 'vin',
            width:240
        },{ 
            title: '车牌号',
            dataIndex: 'plateNo' ,
            width:200,
            render:(text,record,index)=>{
                if(record.plateNo=='null'){
                    return null
                }else{
                    return record.plateNo
                }
                // return (
                    console.log(record.plateNo)
                // )
            }
        },{ 
            title: '车型',
            dataIndex: 'carModelName', 
            key: '2' ,
            width:240
        },{ 
            title: '关联主账号',
            dataIndex: 'mobile' ,
            width:240
        },{ 
            title: '车辆状态',
            dataIndex: 'vehicleStates',
            width:170
        },{ 
            title: '认证状态',
            dataIndex: 'networkStates',
            width:170
        },{
            title: '操作',
            dataIndex:'operation',
            fixed: 'right',
            width:160, 
            className:'caozuo',
            render: (text,record) => {
                const {btnList}=this.state
                return (
                    <div className='action'>
                    {record.operationAuthority==null?'':
                        <span>
                            
                            {!record.operationAuthority[1] && !btnList.includes('viewInform') ?'':<a href="javascript:;" style={{marginRight:15}} onClick={()=>this.viewInform(record)}>详情</a>}
                            {!record.operationAuthority[2] && !btnList.includes('editInform') ?'':<a href="javascript:;" style={{marginRight:15}} onClick={()=>this.editInform(record)}>编辑</a>}
                            {!record.operationAuthority[3]&&!record.operationAuthority[4]&&!record.operationAuthority[5]? 
                            <span style={{display:'inline-block',width:24,height:7}}></span>:
                            record.operationAuthority[3]&&!record.operationAuthority[4]&&!record.operationAuthority[5] && !btnList.includes('onbindInform') ?
                            <a href="javascript:;" onClick={()=>this.onbindInform(record)}>绑定</a>:
                            !record.operationAuthority[3]&&record.operationAuthority[4]&&!record.operationAuthority[5] && !btnList.includes('unbundList') ?
                            <a href="javascript:;" onClick={()=>this.unbundList(record)}>解绑</a>:
                            !record.operationAuthority[3]&&!record.operationAuthority[4]&&record.operationAuthority[5] && !btnList.includes('applicationList') ?
                            <a href="javascript:;" onClick={()=>this.applicationList(record)}>申请服务</a>:
                            <span style={{display:'inline-block',width:24}}>
                                    <Popover placement="bottom"  content={
                                        <span>
                                            {!record.operationAuthority?'':record.operationAuthority[3] && btnList.includes('onbindInform') ?<a href="javascript:;" style={{marginRight:15}} onClick={()=>this.onbindInform(record)}>绑定</a>:''}
                                            {!record.operationAuthority?'':record.operationAuthority[4]  && btnList.includes('unbundList') ?<a href="javascript:;" style={{marginRight:15}} onClick={()=>this.unbundList(record)}>解绑</a> :''}
                                            {!record.operationAuthority?'':record.operationAuthority[5] && btnList.includes('applicationList') ?<a href="javascript:;" onClick={()=>this.applicationList(record)}>申请服务</a>:''}
                                        </span> 
                                } trigger="click" className='popover'>
                                    <img src={actionimg} alt="" />
                                </Popover>
                            </span>
                        }
                      </span>}
                    </div>
                )
            }
            },
        ]
    }
    componentDidMount(){
        this.informList(this.state.pageSize,this.state.defaultCurrent)
        this.pageButton()
    }
    //获取按钮权限
    pageButton=()=>{
        let length=this.props.location.pathname.split('/').length
        let pageId=this.props.location.pathname.split('/')[length-1]
        console.log(length)
        console.log(pageId)
        Axios.get(HttpUrl+'sys/system/resource/pageButton?pageId='+pageId,httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                let length2=res.data.data.length
                let btnList=[]
                for(let i=0;i<length2;i++){
                    btnList.push(res.data.data[i].function)
                }
                this.setState({
                    btnList:btnList
                })
                console.log(btnList)
            }else if(res.data.message){
                message.warning(res.data.message)
            }
        })
    }
    importList = () => {
        this.informList(this.state.pageSize,this.state.defaultCurrent)
    }
    importList2=()=>{
        this.informList(this.state.pageSize,this.state.defaultCurrent)
    }
     //导入出厂信息
    importExcel = () => {
        this.refs.import.sendSword()
    }
      //导入销售信息
      importExcel2 = () => {
        this.refs.import2.sendSword()
    }
    //导出
    exportExcel=()=>{
        let token=sessionStorage.getItem('token')
        const vins=[],
            mobile=[],
            ids=[]
        console.log(this.state.selectedRows)
        console.log(typeof this.state.vehicleStateIds)
        for(let i=0;i<this.state.selectedRows.length;i++){
            this.state.selectedRows[i].vin?vins.push(this.state.selectedRows[i].vin):vins.push(this.state.selectedRows[i].plateNo);
            this.state.selectedRows[i].mobile==null?mobile.push(null):mobile.push(this.state.selectedRows[i].mobile);
          this.state.vehicleStateId.push(this.state.selectedRows[i].vehicleStateId);
          this.state.networkStateId.push(this.state.selectedRows[i].networkStateId);
          ids.push(this.state.selectedRows[i].id)
            console.log(typeof this.state.vehicleStateId)
            console.log(this.state.selectedRows[i].mobile)
        }
        Axios.post(HttpUrl+'vehicle/vehicle/exportVehicle',{
            token:token,
            ids:ids
        },{
            responseType: 'blob'
            }).then(res => {
                if(res.data.size>0){
                    let fileName=decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1].split('.')[0])
                    let url = window.URL.createObjectURL(new Blob([res.data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName +'.xls')
                    document.body.appendChild(link)
                    link.click()
                }else{
                    message.warning('接口出错')
                }
        })
    }
    //分页获取数据
    onChange = (pageNumber) =>{
        this.setState({
            selectedRowKeys:[],
            selectedRows:[]
        })
        this.searchList(this.state.pageSize,pageNumber)
    }
     //每页数量改变
    onShowSizeChange=(current,size)=>{
        this.setState({
            pageSize:size,
            pageNumber:current
        })
        // this.informList(size,current)
        this.searchList(size,current)
    }
    // 获取数据列表（页面列表）
    informList = (pageSize,pageNumber) => {
        this.setState({
            dataStatus:2
        })
        Axios.post(HttpUrl+'vehicle/vehicle/action/list',{
            'startPage':pageNumber,
            'pageSize':pageSize,
        },httpConfig).then(res => {
            // console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                // console.log(res.data.data.list)
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].vin;
                }
                this.setState({
                    data:res.data.data.list,
                    pageNumber:pageNumber,
                    total:res.data.data.total,
                    loading:false,
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                }
                else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }
        })
    }
//查询的单选的
    radioOnChange=(e)=> {
        console.log(`radio checked:${e.target.value}`);
    }
    //查询部分点击选中后的效果
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
    }
    typeMore = () => {  
        this.setState({
            typeMoreNum:!this.state.typeMoreNum
        })
    }
    modelMore = () => {
        this.setState({
            modelMoreNum:!this.state.modelMoreNum
        })
    }
   
    //查询
    search = () => {
        // console.log(this.state.typeArr)
        this.searchList(this.state.pageSize,this.state.defaultCurrent)
    }
    searchList=(pageSize,pageNumber)=>{
        Axios.post(HttpUrl+'vehicle/vehicle/action/list',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'name':this.props.form.getFieldValue('searchName'),
            'mobile':this.props.form.getFieldValue('numName'),
            'vehicleStateIds':this.state.typeArr,
            'networkStateIds':this.state.networkStateIds
        },httpConfig).then(res => {
            // console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                // console.log(res.data.data.list)
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    // res.data.data.list[i].key=res.data.data.list[i].vehicleId;
                }
                this.setState({
                    data:res.data.data.list,
                    pageNumber:pageNumber,
                    total:res.data.data.total,
                    loading:false
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                }else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }
        })
    }
    //车辆状态
    vehicleStateIds=(e)=>{
        this.setState({
            selectedRowKeys:[],
            selectedRows:[]
        })
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(e.target.id)>=0){
            typeArr.splice(typeArr.indexOf(e.target.id),1)
            this.searchList(this.state.pageSize,this.state.defaultCurrent)
        }else{
            this.state.typeArr.push(e.target.id)
            this.searchList(this.state.pageSize,this.state.defaultCurrent)
        }
        console.log(typeArr)
        this.setState({
            typeArr:typeArr
        })
        console.log(typeArr.indexOf(0))
    }
    //认证状态
    networkStateIds=(e)=>{
        this.setState({
            selectedRowKeys:[],
            selectedRows:[]
        })
        let networkStateIds=this.state.networkStateIds
        if(networkStateIds.indexOf(e.target.id)>=0){
            networkStateIds.splice(networkStateIds.indexOf(e.target.id),1)
            console.log(networkStateIds)
        }else{
            this.state.networkStateIds.push(e.target.id)
            console.log(networkStateIds)
        }
        this.setState({
            networkStateIds:networkStateIds
        })
        this.searchList(this.state.pageSize,this.state.defaultCurrent)
        console.log(networkStateIds.indexOf(0))
    }
    //清除条件
    chearSearch=()=>{
        this.setState({
            typeArr:[],
            networkStateIds:[],
            loading:true,
            selectedRowKeys:[],
            selectedRows:[]
        })
        this.props.form.resetFields()
        this.informList(this.state.pageSize,this.state.defaultCurrent)
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
    // 打开新增
    addModel=(record)=>{
        this.form4.addList(record)
        
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
   
    // 详情
    viewInform = (record) => {
        // console.log(record)
        // this.setState({
        //     viewVisible:true,
        //     record:record
        // })
        this.form3.viewList(record)
        // console.log(record)
    }
    
    //编辑
    editInform=(record)=>{
        this.form2.editList(record)
        console.log(record)
    }
    // 绑定
    onbindInform = (record) => {
        this.form.onbundList(this.state.data,record.vin,record.idCard)
        // console.log(record)
    }
    //解绑
    unbundList=(record)=>{
        console.log(record)
        this.setState({
            unbundVisible:true,
            record:record
        })
        console.log(typeof record.vin)
    }
    //确定解绑
    unbundEquip=()=>{
        Axios.get(HttpUrl+"vehicle/vehicle/action/untieUser?vin="+this.state.record.vin,httpConfig).then( res => {
            // console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                message.success('解绑成功');
                this.searchList(this.state.pageSize,this.state.defaultCurrent)
                this.setState({
                    unbundVisible:false
                })
            }
        })
    }
    //取消解绑
    unbund=()=>{
        this.setState({
            unbundVisible:false
        })
    }
    
    //申请服务
    applicationList=(record)=>{
        // console.log(record)
        this.setState({
            applicationVisible:true,
            applicationData:record,
            handIdcardContraryPath:'',
            handIdcardFrontPath:''
        })
    }
    //申请服务
    applicationEquip=()=>{
        // console.log(this.state.handIdcardContraryPath)
        // console.log(this.state.handIdcardFrontPath)
        Axios.post(HttpUrl+'vehicle/vehicle/action/applicationService',{
            handIdcardContraryPath:this.state.handIdcardContraryPath,
            handIdcardFrontPath:this.state.handIdcardFrontPath,
            vin:this.state.applicationData.vin
        },httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
            // console.log(res)
            message.success('提交成功')
            this.setState({
                applicationVisible:false
            })
            this.searchList(this.state.pageSize,this.state.defaultCurrent)
            }else{
                message.warning('请上传身份证正反面照片')
            }
        })
    }
    //取消申请服务
    application=()=>{
        this.setState({
            applicationVisible:false
        })
    }
    // 审核
    auditModel=(record)=>{
        console.log(this.state.selectedRows.networkStates)
        console.log(this.state.record)
            if(this.state.selectedRows.length > 0){
                for(var i=0;i<this.state.selectedRows.length;i++){
                    console.log(this.state.selectedRows[i])
                    if(this.state.selectedRows[i].vehicleStates!='车辆已绑定' && this.state.selectedRows[i].networkStates=='未申请服务'){
                        message.warning('请先绑定车辆')
                    }else if(this.state.selectedRows[i].vehicleStates!='车辆已绑定' && this.state.selectedRows[i].networkStates==''){
                        message.warning('请先绑定车辆')
                    }else if(this.state.selectedRows[i].vehicleStates=='车辆已绑定' && this.state.selectedRows[i].networkStates=='未申请服务'){
                        message.warning('请先申请服务')
                    }else if(this.state.selectedRows[i].vehicleStates=='车辆已绑定' && this.state.selectedRows[i].networkStates==''){
                        message.warning('请先申请服务')
                    }else{
                        this.setState({
                            auditVisible:true,
                            // vins:this.state.selectedRowKeys
                        });
                        this.state.vins.push(this.state.selectedRows[i].vin)
                    }
                    
                }
                console.log(this.state.vins)
                
            }else{
                message.warning('请至少选中一个')
            }
        
    }
    //审核通过
    auditOk=(record)=>{
        // console.log(typeof this.state.vins)
        Axios.post(HttpUrl+'vehicle/vehicle/action/review',{
            vins:this.state.vins,
            flag:'3',
            opinion:this.props.form.getFieldValue('opinion')
        },httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
                message.success('审核已通过')
                this.searchList(this.state.pageSize,this.state.defaultCurrent)
            }else{
                message.warning(res.data.message)
            }
        })
        this.setState({
            auditVisible:false
        })
    }
    auditNo=()=>{
        this.setState({
            auditVisible:false
        })
    }
    //审核不通过
    auditCancel=()=>{
        Axios.post(HttpUrl+'vehicle//vehicle/action/review',{
            vins:this.state.vins,
            flag:'2',
            opinion:this.props.form.getFieldValue('opinion')
        },httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
                message.success('审核不通过')
                this.searchList(this.state.pageSize,this.state.defaultCurrent)
            }else{
                message.warning(res.data.message)
            }
        })
        this.setState({
            auditVisible:false
        })
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
    addVin=(event)=>{
        
        var val=this.props.form.getFieldValue('vins')
        console.log(val)
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]·！#￥（——）：；“”‘、，|《。》？、【】/im,
            regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
        var index=val.length-1
        var s=val.charAt(index)
        console.log(typeof s)
        if(regEn.test(val) || regCn.test(val)) {
            
            s=val.substring(0,index);
            val=s
        }
    }
    checkWord=()=>{
        console.log(this.props.form.getFieldValue('opinion').length)
        var str=this.props.form.getFieldValue('opinion')
        var maxLength = 150;
        this.setState({
            len:str.length
        })
    }
    render() {
        const detailData=this.state.detailData
        const { previewVisible,previewVisible1, previewImage,previewImage1 } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus-circle" />
          </div>
        );

        const { getFieldDecorator }=this.props.form
        const { selectedRowKeys,typeArr,networkStateIds } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange :(selectedRowKeys,selectedRows) => {
                this.setState({ 
                    selectedRowKeys,
                    selectedRows
                });
                console.log(selectedRows)
            }
    
    
        };
        //上传反面
        const props = {
            onChange: this.handleChange,
            name: 'file',
            beforeUpload: (file) => {
                let index1=file.name.lastIndexOf(".")
                let files=file.name.substring(index1)
                // console.log(file.size)
                if(file.size>(5120)*1024){
                    message.warning('大小不得超过5M')
                }else{
                    let index1=file.name.lastIndexOf(".")
                    let files=file.name.substring(index1)
                    if(files == '.jpeg' || files == '.gif' || files == '.png' ||files == '.jpg' ){
                    //    console.log(typeof file)
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append('type',2);
                            Axios.post(HttpUrl+'vehicle/vehicle/action/upload',formData,{ 
                                headers: { 'Content-Type': 'multipart/form-data'}
                            }).then(res => {
                                if(res.status == 200 && res.data.code === '100000'){
                                    this.setState({
                                        handIdcardContraryPath:res.data.data
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
        //上传正面
        const props2 = {
            onChange: this.handleChange,
            name: 'file',
            beforeUpload: (file) => {
                let index1=file.name.lastIndexOf(".")
                let files=file.name.substring(index1)
                // console.log(file.size)
                if(file.size>(5120)*1024){
                    message.warning('大小不得超过5M')
                }else{
                    let index1=file.name.lastIndexOf(".")
                    let files=file.name.substring(index1)
                    if(files == '.jpeg' || files == '.gif' || files == '.png' ||files == '.jpg' ){
                    //    console.log(typeof file)
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append('type',3);
                            Axios.post(HttpUrl+'vehicle/vehicle/action/upload',formData,{ 
                                headers: { 'Content-Type': 'multipart/form-data'}
                            }).then(res => {
                                if(res.status == 200 && res.data.code === '100000'){
                                    this.setState({
                                        handIdcardFrontPath:res.data.data
                                    })
                                    message.success('上传成功')
                                }
                                console.log(res)
                                
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
        //反面照回显
        const pictureImg={
            border:'1px solid #f2f2f2',
            backgroundImage: 'url(' + this.state.handIdcardContraryPath + ')',
            width:'180px',
            height:'100px',
            backgroundSize:'100% 100%'
        };
        //正面照回显
        const pictureImg2={
            border:'1px solid #f2f2f2',
            backgroundImage: 'url(' + this.state.handIdcardFrontPath + ')',
            width:'180px',
            height:'100px',
            backgroundSize:'100% 100%'
        }
        let record=this.state.record;
        let editData=this.state.editData;
        let _t = this
        const {btnList}=this.state
        return (
        <div className="content" >
            <div className='content-title'>   
                <Form layout="inline">
                    <div className='searchType' style={{width:'100%'}}>
                        <FormItem label="关键字搜索：">
                        { getFieldDecorator('searchName')( <Input  onKeyDown={this.keycode} autoComplete='off' placeholder='设备SN、VIN、车牌号'/>)}
                        </FormItem>
                        <FormItem label="关联账号：">
                        { getFieldDecorator('numName')( <Input  onKeyDown={this.keycode} autoComplete='off'/>)}
                        </FormItem>
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.chearSearch}>清除条件</Button>
                    </div>
                    <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                        <div className='searchType'>
                            <div className='typeTitle' >车辆状态：</div>
                            <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>
                                <div className='checks' id='0' style={{border:typeArr.indexOf('0') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:typeArr.indexOf('0') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.vehicleStateIds(e)}>
                                        创建
                                    <img src={ typeArr.indexOf('0') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='1' style={{border:typeArr.indexOf('1') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:typeArr.indexOf('1') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.vehicleStateIds(e)}>
                                        已销售
                                    <img src={ typeArr.indexOf('1') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='2' style={{border:typeArr.indexOf('2') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:typeArr.indexOf('2') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.vehicleStateIds(e)}>
                                        已绑定
                                    <img src={ typeArr.indexOf('2') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='3' style={{border:typeArr.indexOf('3') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:typeArr.indexOf('3') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.vehicleStateIds(e)}>
                                        已解绑
                                    <img src={ typeArr.indexOf('3') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                            </div>
                        </div>
                        <div className='searchType'>
                            <div className='typeTitle' >认证状态：</div>
                            <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>
                                <div className='checks' id='0' style={{border:networkStateIds.indexOf('0') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:networkStateIds.indexOf('0') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.networkStateIds(e)}>
                                        未申请
                                    <img src={ networkStateIds.indexOf('0') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='1' style={{border:networkStateIds.indexOf('1') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:networkStateIds.indexOf('1') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.networkStateIds(e)}>
                                        审核中
                                    <img src={ networkStateIds.indexOf('1') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='2' style={{border:networkStateIds.indexOf('2') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:networkStateIds.indexOf('2') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.networkStateIds(e)}>
                                        审核不通过
                                    <img src={ networkStateIds.indexOf('2') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks' id='3' style={{border:networkStateIds.indexOf('3') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:networkStateIds.indexOf('3') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.networkStateIds(e)}>
                                        审核通过
                                    <img src={ networkStateIds.indexOf('3') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                            </div>
                        </div>
                        </Panel>
                    </Collapse>
                </Form>
            </div>
            <div>
                <div  className='oprateHead'>
                {  btnList.includes('addModel') ? 
                    <Button type="primary" className='btn' ghost  onClick={this.addModel}><img src={xinzeng}/>新增</Button>
                :''}
                {  btnList.includes('importExcel') ? 
                    <Button type="primary" className='btn daoru' ghost onClick={this.importExcel}><img src={daoru}/>导入出厂信息</Button>
                    :''}
                {  btnList.includes('importExcel2') ? 
                    <Button type="primary" className='btn daoru' ghost  onClick={this.importExcel2}><img src={daoru}/>导入销售信息</Button>
                    :''}
                {  btnList.includes('exportExcel') ? 
                    <Button type="primary" className='btn' ghost onClick={this.exportExcel}><img src={daochu}/>导出</Button>
                    :''}
                {  btnList.includes('auditModel') ? 
                    <Button type="primary" className='btn' ghost onClick={()=>_t.auditModel(record)}><img src={shenhe}/>审核</Button>
                    :''}
                </div>
                <div className='tablesHeight table'>
                <Table
                    scroll={1690}
                    rowSelection={rowSelection}
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    loading={this.state.loading}
                    total={this.state.total}
                    current={this.state.pageNumber}
                    pageSize={this.state.pageSize}
                    onChange={this.onChange}
                    onShowSizeChange={this.onShowSizeChange}
                />
                {
                    this.state.dataStatus === 1 ?
                    <div className='dataStatus' >
                            <img src={nodata1} alt=""/>
                            <div >温馨提示：请输入条件进行查询</div>
                    </div>
                    : this.state.dataStatus === 2 ? 
                    <div className='dataStatus' >
                            <img src={nodata2} alt=""/>
                            <div >查询中，请稍后...</div>
                    </div>
                    : this.state.dataStatus === 3 ? 
                    <div className='dataStatus' >
                            <img src={nodata3} alt=""/>
                            <div>哎呀，没有找到符合条件的数据</div>
                    </div>
                    : ''
                    
                }
                </div>
            </div>
            
            <Modal
                title="审核"
                visible={this.state.auditVisible} 
                // onOk={this.auditOk} 
                onCancel={this.auditNo}
                // okText="确认"
                // cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="auditModel"
                destroyOnClose={true}
                footer={null}
                centered={true}
                >
                <Form>
                    <FormItem className='textareas'>
                        { getFieldDecorator('opinion')(<TextArea placeholder="请在此处写审核意见（最多可输入150个中文/英文/特殊符号）" maxLength={150} style={{minWidth:300,minHeight:140}} onKeyUp={this.checkWord} id='checkWord'/>)}
                        <span className='textarea-span'>{this.state.len}/150</span>
                    </FormItem>
                    <div style={{textAlign:'center'}}>
                        <FormItem style={{display:'inline-block',marginRight:15}}>
                            { getFieldDecorator('auditCancel')(<Button onClick={this.auditCancel} style={{border:'1px solid #3689ff',color:'#3689ff'}}>不通过</Button>)}
                        </FormItem>
                        <FormItem style={{display:'inline-block',marginRight:15}}>
                            { getFieldDecorator('auditOk')(<Button onClick={this.auditOk} className='ant-btn-primary'>通过</Button>)}
                        </FormItem>
                    </div>
                    
                </Form>
                
            </Modal>
            {/* 新增 */}
            <AddInform wrappedComponentRef={(form) => this.form4 = form} informList={()=>this.informList(this.state.pageSize,this.state.defaultCurrent)}></AddInform>
            {/* 编辑 */}
            <EditInform wrappedComponentRef={(form) => this.form2 = form} informList={()=>this.informList(this.state.pageSize,this.state.defaultCurrent)}></EditInform>
            {/* 详情 */}
            <ViewInform wrappedComponentRef={(form) => this.form3 = form} informList={()=>this.informList(this.state.pageSize,this.state.defaultCurrent)}></ViewInform>
            <Modal
                title="解绑"
                visible={this.state.unbundVisible} 
                onOk={this.unbundEquip} 
                onCancel={this.unbund}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className=" unbindModel"
                destroyOnClose={true}
                centered={true}
                >确定解除车辆与账号的绑定关系吗？
            </Modal>
            {/* 绑定 */}
            <OnbindInform wrappedComponentRef={(form) => this.form = form} informList={()=>this.informList(this.state.pageSize,this.state.defaultCurrent)}></OnbindInform>
            <Modal
                title="申请车联网服务"
                visible={this.state.applicationVisible} 
                onOk={this.applicationEquip} 
                onCancel={this.application}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="applicationModel"
                destroyOnClose={true}
                centered={true}
                >
                <Row>
                    <Form>
                        <Col span={24} style={{paddingBottom:20}}>
                            <Row className="tit-row">
                                <span></span><b>车辆及车主信息</b>
                            </Row>
                        
                            <Row style={{marginTop:'20px'}}>
                                <Col span={12}> 
                                    <FormItem className="form_input" label="VIN：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                        { getFieldDecorator('vin')(<span  autoComplete='off'  >{this.state.applicationData.vin}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="车牌号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('vehicleType')(<span  autoComplete='off' >{this.state.applicationData.plateNo}</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{marginTop:'20px'}}>
                                <Col span={12}> 
                                    <FormItem className="form_input" label="手机号：" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingRight:'15px'}}>
                                        { getFieldDecorator('vin')(<span  autoComplete='off'  >{this.state.applicationData.mobile}</span>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem  className="form_input" label="账号认证状态" labelCol={{span:10}} wrapperCol={{span:14}} style={{paddingLeft:'15px'}}>
                                        {getFieldDecorator('vehicleType')(<span  autoComplete='off' style={{color:'#FF3636'}} >已实名</span>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24} style={{borderTop:'1px solid #F1F1F1',paddingTop:20,height:250}}>
                            <Row className="tit-row">
                                <span></span><b>申请车联网服务</b>
                            </Row>
                            
                            <Row style={{marginTop:'20px',marginBottom:20}}>
                                <Col span={12} style={{paddingLeft:35}}> 
                                    <FormItem className="form_input">
                                        { getFieldDecorator('handIdcardFrontPath',{
                                                rules: [
                                                    { required: true ,message:'请上传身份证照片'}
                                                ],
                                            })(
                                        <div>
                                            <div className='picture' style={pictureImg2}></div>
                                                <Upload {...props2} className="uploads" fileList={ false} disabled={this.state.viewNum}>
                                                    <Button style={{width:120,marginLeft:'30px',marginTop:'15px',border:'1px solid #1890ff',color:'#1890ff'}} ><img style={{marginRight:5}} src={daochu}/>上传图片</Button>
                                                </Upload>
                                            <div><span style={{color:'#FF3636'}}>* </span> 请上传手持正面身份证照片</div>
                                        </div>)}
                                    </FormItem>
                                </Col>
                                <Col span={12} style={{paddingLeft:35}}> 
                                    <FormItem className="form_input">
                                        { getFieldDecorator('handIdcardContraryPath',{
                                                rules: [
                                                    { required: true ,message:'请上传身份证照片'}
                                                ],
                                            })(
                                        <div>
                                            <div className="clearfix">
                                            <div className='picture' style={pictureImg}></div>
                                                <Upload {...props} className="uploads" fileList={false} disabled={this.state.viewNum}>
                                                    <Button style={{width:120,marginLeft:'30px',marginTop:'15px',border:'1px solid #1890ff',color:'#1890ff'}}><img style={{marginRight:5}} src={daochu}/>上传图片</Button>
                                                </Upload>
                                            </div>
                                            <div><span style={{color:'#FF3636'}}>* </span> 请上传手持反面身份证照片</div>
                                        </div>)}
                                    </FormItem>
                                </Col>
                                
                            </Row>
                        </Col>
                    </Form>
                </Row>
            </Modal>
            <ImportExcel ref='import' title='导入出厂信息' templateUrl='vehicle/template/车辆出厂信息导入模板20190103.xlsx'  importUrl='vehicle/vehicle/importVehicleFactoryExcel' type='equip' importList={ this.importList}></ImportExcel>
            <ImportExcels ref='import2' title='导入销售信息' templateUrl='vehicle/template/车辆销售信息导入模板20190103.xlsx'  importUrl='vehicle/vehicle/importVehicleSaleExcel' type='equip' importList={ this.importList2}></ImportExcels>
            <style>
                {`  
                    .ant-form-explain{font-size:12px;}
                    .ant-input,.ant-select-selection-selected-value{font-size:13px!important}
                    .ant-form-item{font-size:13px}
                    .ant-form-item-control{line-height: 35px!important}
                    .ant-layout-footer{ padding:0px !important; color:#fff !important; }
                    .addModel{width:690px!important;font-size:13px;}
                    .addModel .tit-row{font-size:14px;color:#3689FF;position: relative;margin-left:15px;}
                    .addModel .tit-row span{width:2px;height:14px;background:#3689FF;position: absolute;left:-8px;top:4px;}
                    .ant-form-item-label{text-align:right;line-height:35px!important}
                    
                    .ant-radio-button-wrapper{border-radius:1px!important;border-left:1px solid #E4E4E4}
                    .ant-radio-button-wrapper-checked{box-shadow:none;border:1px solid #3689FF}
                    .ant-radio-button-wrapper-checked:hover{box-shadow:none}
                    .ant-radio-button-wrapper{height: 28px;line-height: 28px;margin-top:17px;padding: 0px 10px;margin-right:15px;color:#999;min-width: 66px;max-width:103px;overflow: hidden;text-overflow: ellipsis;position: relative;}
                    .viewModel{width:710px!important}
                    .viewModel .ant-form-item{margin:0}
                    .viewModel .ant-table-body th{height:40!important}
                    
                    .cielStep{background:#ffffff;color:#999999;border:1px solid #CCCCCC;}
                    .btn{margin-left:10px;margin-right:10px;}
                    .stepFoot{text-align:center;border-top:1px solid #f1f1f1;padding-top:30px;margin-top:15px;    position: absolute;bottom:20px;width:90%;}
                    .editStep .ant-form-item{margin-bottom:20px;}
                    .unbindModel{width:350px!important;}
                    .unbindModel .ant-btn{margin:0 15px!important}
                    .unbindModel .ant-modal-body{padding:50px;text-align:center;}
                    .onbundModel{width:900px!important;}
                    .addModel .ant-modal-footer .ant-btn{margin-left:15px;margin-right:15px;width:70px;height:28px;}
                    .applicationModel{width:570px!important;height:522px!important;}
                    .applicationModel .ant-upload-list{display:none}
                    .applicationModel .ant-form-item{margin-bottom:0;}
                    .addModel .ant-modal-footer{width:90%;margin-left:5%}
                    .ant-upload-list-picture-card .ant-upload-list-item{width:180px!important;height:100px!important;}
                    .ant-upload .ant-upload-select-picture-card{width:180px!important;height:100px!important;}
                    .ant-modal-footer{height:88px;line-height:88px;padding:0}
                    .applicationModel .anticon-plus-circle{font-size:35px;color: #E4E4E4;}
                    .auditModel{width:350px!important;}
                    .auditModel .ant-modal-footer{border-top:transparent;height:60px;line-height:60px}
                    .auditModel .ant-modal-body{padding-bottom:0}
                    .plateNo .ant-select-arrow{left:-51px}
                    #plateNo{width:104px;}
                    .plateNo .ant-select-selection-selected-value{font-size:13px;}
                    .plateNo .ant-select-enabled{width:75px!important}
                    
                    .dataStatus{width:200px;text-align:center;position:absolute;left:45%;top:45%;}
                    .tablesHeight{position:relative}
                    .tablesHeight .ant-table-body{min-height:427px;}
                    .tablesHeight .ant-table-wrapper{min-height:515px;background:#ffffff;box-shadow:0 2px 4px 0 rgba(216,216,216,0.50)}
                    .oprateHead .btn{margin-right:15px;margin-left:0;}
                    .ant-popover{z-index:999!important}
                    .textareas{position:relative}
                    .textarea-span{position:absolute;right:10px;bottom:0;color:#999999;}
                    .checks{padding:0 10px}
                    .addModel .guiyues .ant-select-selection{height:auto!important}
                    .addModel .guiyues .ant-form-item-label{width:117px}
                    .addModel .guiyues .ant-form-item-control-wrapper{width:300px;}
                    .addModel .ant-modal-body{height:475px;overflow-y:scroll}
                    .addModel b{font-weight:normal}
                    .content-title{padding:30px 31px 20px 31px}
                    .typeTitle{font-size:13px}
                    .daoru .ant-upload-list{display:inline-block}
                    .oprateHead img{margin-right:5px;}
                    .ant-btn-background-ghost.ant-btn-primary{color:#3689ff;border-color:#3689ff}
                    .ant-btn-primary{background:#3689ff;border-color:#3689ff}
                    a{color:#3689ff}
                    .ant-pagination-item-active{background:#3689ff;border-color:#3689ff}
                    .moreBox{margin-left:79px;}
                    .btn img{float:left;padding-top:3px;}
                    img.popover{padding:5px}
                    .ant-popover-inner-content{padding:12px 11px!important}
                    .ant-table-thead th.caozuo{text-align:left!important;padding-left:28px!important}
                `}
            </style>
        </div>
        )
    }
}

const deviceManages = Form.create()(deviceManage);
export default deviceManages;