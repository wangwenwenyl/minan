/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {LocaleProvider,Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import  ImportExcel  from "./../../../component/import/importExcel";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import imports from './../../../img/imports.png'
import exports from './../../../img/exports.png'
import actionimg from './../../../img/actionimg.png'
import add from './../../../img/add.png'
import classify from './../../../img/classify.png'
import DeviceClassify from './deviceClassify'
import DeviceViewModal from './deviceView'
import DeviceAdd from './deviceAdd'
import DeviceDelete from './deviceDelete'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {transformDate,disabledDate} from './../../../util/util'
import moment from 'moment';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
class deviceManage extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:true,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeArr:[],
        typeArr2:[],
        modelArr:[],
        modelArr2:[],
        startTime:'',
        endTime:'',
        searchDataSource:[],
        tableData:[],
        typeBoxWidth:'',
        typeInnerBoxWidth:"",
        modelBoxWidth:'',
        modelInnerBoxWidth:"",
        btnList:[],
        columns:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '设备SN',dataIndex: 'eqmCode',className:'clounWidth',fixed: 'left'},
            { title: '车辆',dataIndex: 'licenseNo' ,className:'clounWidth'},
            { title: 'VIN',dataIndex: 'vin',className:'clounWidth'},
            { title: '设备类型/型号',dataIndex: 'eqmTypeName' ,className:'clounWidth',render:(text,record) => {
                return (
                    <div title={record.eqmTypeName} className='overflows'>{record.eqmTypeName}/{record.eqmSeriesName}</div>
                )
            }},
            { title: '供应商',dataIndex: 'providerSimpleName',className:'clounWidth',
                render:(text,record) => {
                    return (
                        <div title={record.providerSimpleName} className='overflows'>{record.providerSimpleName}</div>
                    )
                }
            },
            { title: '当前版本号',dataIndex: 'versionNow',className:'clounWidth'},
            { title: '最后升级时间',dataIndex: 'lastUpdTime',className:'clounWidth',render:(text,record) => {
                return (
                    <div >{transformDate(text)}</div>
                )
            }},
            { title: '在线状态',dataIndex: 'onlineStatus' ,className:'clounWidth'},
            { title: '注册状态',dataIndex: 'isRegister' ,className:'clounWidth',render:(text,record)=>{
                if(Number(text) === 0){
                    return(
                        <div>已注册</div>
                    )
                }else if( Number(text) === 1){
                    return(
                        <div>未注册</div>
                    )
                }else{
                    return(
                        <div>待审核</div>
                    )
                }
            }},
            {title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',className:'operation',
              render: (text,record) => {
                  return (
                      <div className='action'>
                        {
                            this.state.btnList.includes('view') ?
                            <span onClick={ () => this.view(record)} >查看 &nbsp;&nbsp;</span>
                            : ''
                        }
                        {
                            record.onlineStatus === '已报废' ||  record.onlineStatus.includes('升级中') ? '' :
                            <span>
                                { this.state.btnList.includes('deviceEdita') ? 
                                    <span onClick={ () => this.deviceEdit(record,'编辑')}>编辑 &nbsp;&nbsp;</span> 
                                    : ''
                                }
                                {
                                    Number(record.isBind) === 1 && Number(record.isRegister) === 0 ? "" :
                                    <Popover placement="bottom"   zIndex={999}  content={
                                        Number(record.isRegister) === 0 ? (Number(record.isBind) === 1  ? '' : ( this.state.btnList.includes('deletea') ? <span onClick={ () => this.delete(record,'报废')}>报废 &nbsp;</span> : '')) : 
                                        Number(record.isRegister) === 1 ? (Number(record.isBind) === 1 ? (this.state.btnList.includes('deviceEditb') ? <span onClick={ () => this.deviceEdit(record,'审核通过')}>审核通过</span> : '')  : (<span>{ this.state.btnList.includes('deleteb') ? <span onClick={ () => this.delete(record,'删除')}>删除</span> : ''} <br/> {this.state.btnList.includes('deviceEditb') ? <span onClick={ () => this.deviceEdit(record,'审核通过')}>审核通过</span> : ''}</span> ) ) : 
                                        Number(record.isRegister) === 2 ? (Number(record.isBind) === 1 ? (this.state.btnList.includes('deviceEditb') ? <span onClick={ () => this.deviceEdit(record,'审核通过')}>审核通过</span> : '') : (<span>{ this.state.btnList.includes('deleteb') ? <span  onClick={ () => this.delete(record,'删除')}>删除</span> : ''} <br/> {this.state.btnList.includes('deviceEditb') ? <span onClick={ () => this.deviceEdit(record,'审核通过')}>审核通过</span> : ''}</span>)) : ''
                                        } trigger="click" className='popover'>
                                        <img src={actionimg} alt="" />
                                    </Popover>
                                }
                            </span>
                        }
                      </div>
                  )
              }
            },
        ]
    }
    componentDidMount(){
        // this.props.form.setFieldsValue({'searchTime':[moment(),moment()]})
        // this.props.form.resetFields()
        this.list(this.state.pageNumber,this.state.pageSize)
        this.eqmTypesList()
        this.eqmSeriesList(this.state.typeArr)
        this.btnList()
    }
    importList = () => {
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    list = (pageNumber,pageSize,typeArr,modelArr) => {
        console.log(this.state.startTime)
        Axios.post(HttpUrl+'equip/equipment/getEqmList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'keyword':this.props.form.getFieldValue('keyword') || null,
            'eqmTypeId':typeArr,
            'eqmSeriesId':modelArr,
            'startTime':this.state.startTime || null,
            'endTime':this.state.endTime || null,
        },httpConfig).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.total,
                    current:pageNumber,
                    loading:false
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //获取权限按钮
    btnList = () => {
        let length=this.props.location.pathname.split('/').length
        let pageId=this.props.location.pathname.split('/')[length-1]
        Axios.get(HttpUrl+ 'sys/system/resource/pageButton?pageId='+pageId).then(res => {
            if(res.data.code === '100000'){
                let length2=res.data.data.length
                let btnList=[]
                for(let i=0;i<length2;i++){
                    btnList.push(res.data.data[i].function)
                }
                this.setState({
                    btnList:btnList
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //设备类型
    eqmTypesList = () => {
        Axios.get(HttpUrl+'equip/eqmType/getEqmTypes').then(res => {
           if(res.data.code === '100000'){
               this.setState({
                    typeArr2:[]
               })
                let length=res.data.data.length
                let typeArr2=this.state.typeArr2
                for(let i=0;i<length;i++){
                    typeArr2.push(<div className='checks' key={res.data.data[i].id} title={res.data.data[i].val.length>6 ? res.data.data[i].val : ''} id={res.data.data[i].id}
                     style={{border:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(e)}> 
                    { res.data.data[i].val} 
                    <img src={ this.state.typeArr.indexOf(res.data.data[i].id) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    typeArr2:typeArr2
                })
           }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //设备型号
    eqmSeriesList = (typeArr) => {
        Axios.post(HttpUrl+'equip/eqmType/getEqmSeriesNames',{
            'eqmTypeIds':typeArr
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    modelArr2:[]
               })
                let length=res.data.data.length
                let modelArr2=this.state.modelArr2
                for(let i=0;i<length;i++){
                    modelArr2.push(<div className='checks' key={res.data.data[i].id} title={res.data.data[i].val.length>6 ? res.data.data[i].val : ''} id={res.data.data[i].id}
                     style={{border:this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.modelCheck(e)}> 
                    { res.data.data[i].val} 
                    <img src={ this.state.modelArr.indexOf(res.data.data[i].id) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    modelArr2:modelArr2
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
        if(!this.state.collapseStatus){
            setTimeout(() => {
                this.setState({
                    typeBoxWidth:document.getElementById("typeBox").offsetWidth,
                    modelBoxWidth:document.getElementById("modelBox").offsetWidth,
                    typeInnerBoxWidth:document.getElementById("typeInnerBox").offsetWidth,
                    modelInnerBoxWidth:document.getElementById("modelInnerBox").offsetWidth
                })
            }, 0);
        }
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
    //类型
    typeCheck = (e) => {
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(Number(e.target.id))>=0){
            typeArr.splice(typeArr.indexOf(Number(e.target.id)),1)
        }else{
            typeArr.push(Number(e.target.id))
        }
        this.setState({
            typeArr:typeArr
        })
        this.eqmTypesList()
        this.eqmSeriesList(this.state.typeArr)
        this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr)
    }
    //型号
    modelCheck = (e) => {
        let modelArr=this.state.modelArr
        if(modelArr.indexOf(Number(e.target.id))>=0){
            modelArr.splice(modelArr.indexOf(Number(e.target.id)),1)
        }else{
            modelArr.push(Number(e.target.id))
        }
        this.setState({
            modelArr:modelArr
        })
        this.eqmSeriesList(this.state.typeArr)
        this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,modelArr)
    }
    //自动补全
    handleSearch = (value) => {
        Axios.post(HttpUrl+'equip/equipment/autoComplete',{
            'keyword':value || null
        }).then(res => {
            if( res.data.code === '100000'){
                this.setState({
                    searchDataSource:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
    }
    //日期选择
    dateChange = (moment,dateStrings,string) => {
        this.setState({
            startTime:dateStrings[0],
            endTime:dateStrings[1]
        })
    }
    //导出
    deviceExport = () => {
        let typeLength=this.state.typeArr.length;
        let seriesLength=this.state.modelArr.length;
        let token=sessionStorage.getItem('token')
        let typeId=''
        let seriesId=''
        for(let i=0;i<typeLength;i++){
            if(i === typeLength-1){
                typeId +=this.state.typeArr[i]
            }else{
                typeId += this.state.typeArr[i]+'&typeId='
            }
        }
        for(let i=0;i<seriesLength;i++){
            if(i === seriesLength-1){
                seriesId += this.state.modelArr[i]
            }else{
                seriesId += this.state.modelArr[i]+'&seriesId='
            }
        }
        window.location = HttpUrl+'equip/equipment/exportEqmExcel?keyword='
                                                                +(this.props.form.getFieldValue('keyword') || '') +
                                                                '&startTime='+(this.state.startTime || '')+
                                                                '&endTime='+(this.state.endTime || '')+
                                                                '&typeId='+typeId+
                                                                '&seriesId='+seriesId+
                                                                '&token='+token
    }
    //清除条件
    clearCondition = () => {
        new Promise(resolve => {
            this.setState({
                typeMoreNum:false,
                modelMoreNum:false,
                typeArr:[],
                typeArr2:[],
                modelArr:[],
                modelArr2:[],
                startTime:null,
                endTime:null
            })
            this.props.form.resetFields()
            resolve(true)
        }).then(res => {
            this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
            this.eqmTypesList()
            this.eqmSeriesList(this.state.typeArr)
        })
    }
    //设备分类
    deviceClassify = () => {
        this.form1.classifyEvent(this.state.btnList)
    }
    //查看
    view = (record) => {
        this.form2.view(record)
    }
    //添加设备
    deviceAdd = () => {
        this.form3.deviceAdd()
    }
    //编辑设备
    deviceEdit = (record,flag) => {
        this.form3.deviceEdit(record,flag)
    }   
    //删除设备
    delete = (record,action) => {
        this.form4.deleteSubmit(record,action)
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr)
    }
    //导入
    importExcel = () => {
        this.refs.import.sendSword()
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr,btnList}=this.state
        return (
        <div className="content">
            <div className='content-title'>
                <Form layout="inline">
                    <div className='searchType'>
                        <FormItem label="关键字搜索">
                        { getFieldDecorator('keyword')( <AutoComplete 
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'200px'}}
                            dataSource={ this.state.searchDataSource}
                            onSearch={this.handleSearch} placeholder='设备SN、VIN、车牌号' autoComplete='off'/>)}
                        </FormItem>
                        <FormItem label="升级时间">
                            { getFieldDecorator('searchTime')(<RangePicker
                                getCalendarContainer={triggerNode => triggerNode.parentNode}
                                style={{width:'340px'}} 
                                disabledDate={disabledDate}
                                onChange={this.dateChange}
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                            />  
                            )}
                        </FormItem>
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                    </div>
                    <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel forceRender={true} header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                            <div className='searchType'>
                                <div className='typeTitle' >设备类型：</div>
                                <div className='moreBox'  id='typeBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px',maxHeight:this.state.typeArr2.length>40 ? '200px' : '',overflow:this.state.typeMoreNum ? 'scroll' : 'hidden'}}>
                                    <span id='typeInnerBox' style={{display:'inline-block'}}>
                                        {
                                            this.state.typeArr2
                                        }
                                    </span>
                                </div>
                                <div>
                                    { 
                                        this.state.typeInnerBoxWidth+50 >this.state.typeBoxWidth ?
                                        <div className='checks typemore'  onClick={this.typeMore}>
                                            {
                                                this.state.typeMoreNum ? '收起' : '更多'
                                            }
                                            <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.typeMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                        </div>
                                        : ''
                                    }
                                </div>
                            </div>
                            <div className='searchType'>
                                <div className='typeTitle' >设备型号：</div>
                                <div className='moreBox' id='modelBox' style={{height:this.state.modelMoreNum ? 'auto' : '50px',maxHeight:this.state.modelArr2.length>40 ? '200px' : '',overflow:this.state.modelMoreNum ? 'scroll' : 'hidden'}}>
                                    <span id='modelInnerBox' style={{display:'inline-block'}}>
                                        {   
                                            this.state.modelArr2
                                        }
                                    </span>
                                </div>
                                <div>
                                    {
                                        this.state.modelInnerBoxWidth+50 >this.state.modelBoxWidth ?
                                        <div className='checks typemore'  onClick={this.modelMore}>
                                            {
                                                this.state.modelMoreNum ? '收起' : '更多'
                                            }
                                            <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.modelMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                        </div>
                                        : ''
                                    }
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </Form>
            </div>
            <div>
                <div  className='oprateHead'>
                    <Button type="primary" className='btn' ghost onClick={ this.deviceClassify}>
                    <img src={classify} alt=""/>
                    设备分类</Button>
                    {
                        btnList.includes('deviceAdd') ? 
                        <Button type="primary" className='btn' onClick={this.deviceAdd} ghost>
                        <img src={add} alt=""/>
                        添加设备</Button>
                        : ''
                    }
                    {
                        btnList.includes('importa') ? 
                        <Button type="primary" className='btn' onClick={ this.importExcel}  ghost>
                        <img src={imports} alt=""/>
                        导入</Button>
                        : ''
                    }
                    {
                        btnList.includes('deviceExport') ?
                        <Button type="primary" className='btn' onClick={ this.deviceExport} ghost>
                        <img src={exports} alt="" />
                        导出</Button>
                        : ''
                    }
                </div>
                <div className='table' id='table'>
                    <Table
                        scroll={1650}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        loading={this.state.loading}
                        total={this.state.total}
                        current={this.state.current}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}
                    />
                </div>
            </div>
            <DeviceClassify wrappedComponentRef={(form) => this.form1 = form} eqmTypesList={ this.eqmTypesList } eqmSeriesList = { () => this.eqmSeriesList(this.state.typeArr)}></DeviceClassify>
            <DeviceViewModal wrappedComponentRef={(form) => this.form2 = form} ></DeviceViewModal>
            <DeviceAdd wrappedComponentRef={(form) => this.form3 = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr) }></DeviceAdd>
            <DeviceDelete wrappedComponentRef={(form) => this.form4 = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr) }></DeviceDelete>
            <ImportExcel ref='import' title='导入设备' templateUrl='equip/equipment/downloadExcelTemplate' download={ btnList.includes('downTemplate') ? true :false}  importUrl='zuul/equip/equipment/importEqmExcel' type='equip' importList={ this.importList}></ImportExcel>
            <style>
                {`

                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                    .action span{color:#3689FF;}
                    .action{text-align:left;padding-left:20px;}
                    .popoverBox div,img:hover{cursor: pointer;}
                    .searchType .ant-form-item-label{width:78px;}
                    .overflows{width:170px;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;height:38px;line-height:38px;}
                `}
            </style>
        </div>
        )
    }
}

const deviceManages = Form.create()(deviceManage);
export default deviceManages;