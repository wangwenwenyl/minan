/*设备管理>车型管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,TreeSelect ,Table,AutoComplete} from 'antd';
// import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import { httpConfig,HttpUrl } from '../../../util/httpConfig';
import {carTypeNames} from '../../../util/validator';
import AddModels from './addModels'
import ViewModel from './viewModel'
import EditModels from './editModels'
import EditModel from './editModel'
import CarsortModel from './carsortModel'
import  ImportExcel  from "./../../../component/import/importExcel3";
import daoru from './daoru.png'
import tianjia from './tianjia.png'
import nodata1 from './../../../img/nodata1.png'
import nodata2 from './../../../img/nodata2.png'
import nodata3 from './../../../img/nodata3.png'
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
class deviceManage extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        loading:true,
        value: undefined,
        total:"",
        pageSize:10,
        pageNumber:1,
        defaultCurrent:1,
        current:1,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        addVisible:false,
        typeTargetValue:'',
        typeArr:[],
        modelArr:[],
        totalData:[],
        tableData:[],
        tableData2:[],
        expandedKeys:[],
        expanded:false,//点击+/-展开列表合并列表
        carSortName:[],
        dataSource:[],//搜索自动补全
        keywordType:'',//匹配字段标识
        keyword:'',
        deleteViews:false,
        deleteView:false,
        carTypeName:'',//给子列表用的车型名称
        carSortNames:'',//给子列表用的车辆分类
        dataStatus:1,
        nylxs:[],//能源类型
        btnList:[],//按钮权限
        columns:[{
            title:'序号',
            dataIndex:'number',
            width:100
        },{
            title:'车型',
            dataIndex:'carTypeName'
        },{
            title:'型号数量',
            dataIndex:'carModelCount',
            render:(text,record,index)=>{
                console.log(index)
                console.log(record)
                
                var arr=document.getElementsByClassName('ant-table-row-expand-icon-cell')
                console.log(arr)
                console.log(arr[index])
                if(!arr[index]){
                    return record.carModelCount 
                }
                // for(var i=0;i<arr.length;i++){
                    arr[index].style.visibility = ''
                    if(record.carModelCount==0){
                        console.log(arr[index])
                        arr[index].style.visibility='hidden'
                    }else{
                        arr[index].style.visibility='visibile'
                    }
                    return record.carModelCount 
                // }
            }
        },{
            title:'车辆分类',
            dataIndex:'carSortName'
        },{
            title:'关联车辆',
            dataIndex:'relevantCarCount'
        },{
            title:'操作',
            className:'caozuo',
            width:200,
            render: (text,record) => {
                const {btnList}=this.state
            return (
            <span>
                 {  btnList.includes('addModels') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.addModels(record)}>添加型号</a>
                :''}
                 {  btnList.includes('editModels') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.editModels(record)}>编辑</a>
                :''}
                 {  btnList.includes('deleteModels') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.deleteModels(record)}>删除</a>
                :''}
            </span>
            )}
        }],
        columns2:[{
            title:'序号',
            dataIndex:'number',
            width:100
        },{
            title:'型号',
            dataIndex:'carModelName'
        },{
            title:'公告型号',
            dataIndex:'carNoticeModel'
        },{
            title:'公告批次',
            dataIndex:'carNoticeBatch'
        },{
            title:'关联车辆',
            dataIndex:'mvcount'
        },{
            title:'能源类型',
            dataIndex:'carDataName'
        },{
            title:'操作',
            className:'caozuo',
            width:200,
            render: (text,record) => {
                const {btnList}=this.state
                return (
            <span>
                {  btnList.includes('viewModel') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.viewModel(record,this.state.carTypeName,this.state.carSortNames)}>查看</a>
                :''}
                {  btnList.includes('editModel') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.editModel(record,this.state.carTypeName,this.state.carSortNames)}>编辑</a>
                :''}
                {  btnList.includes('deleteModel') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.deleteModel(record)}>删除</a>
                :''}
            </span>
                )}
        }],
    }
    componentDidMount(){
        this.modelsList(this.state.pageSize,this.state.defaultCurrent)
        this.checkNylx(this.state.typeArr)
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
            }else{
                message.warning(res.data.message)
            }
        })
    }
    checkNylx=(typeArr)=>{
        //能源类型
        Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=ct_manager&type=nylx',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    nylxs:[]
                })
                for(let i=0;i<res.data.data.list.length;i++){
                    this.state.nylxs.push(<div className='checks' key={res.data.data.list[i].dicKey}  id={res.data.data.list[i].dicKey}
                        style={{border:typeArr.indexOf(res.data.data.list[i].dicKey) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:typeArr.indexOf(res.data.data.list[i].dicKey) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck(e)}> 
                    { res.data.data.list[i].dicValue} 
                    <img src={ typeArr.indexOf(res.data.data.list[i].dicKey) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                    console.log(typeArr.indexOf(res.data.data.list[i].dicKey))
                }
                this.setState({
                    typeArr:typeArr
                })
                console.log(this.state.nylxs)
            }
        })
    }
     //能源类型选择
     typeCheck = (e) => {
         this.setState({
            typeArr:[],
            expandedKeys:[]
         })
        console.log(e.target.id)
        let typeArr=this.state.typeArr
        if(typeArr.indexOf(e.target.id)>=0){
            typeArr.splice(typeArr.indexOf(e.target.id),1)
        }else{
            this.state.typeArr.push(e.target.id)
        }
        console.log(typeArr)
        this.setState({
            typeArr:typeArr
        })
        this.checkNylx(typeArr)
        this.searchList(this.state.pageSize,this.state.defaultCurrent)
    }
    //分页获取数据
    onChange = (pageNumber) =>{
        this.searchList(this.state.pageSize,pageNumber)
    }
    //主列表
    modelsList = (pageSize,pageNumber) => {
        this.setState({
            dataStatus:2
        })
        document.getElementsByClassName('ant-table-wrapper')[0].style.minHeight='515px'
        Axios.post(HttpUrl+'vehicle/carType/getCarTypeList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'keywordType':-1,
        },httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].carTypeId;
                    res.data.data.list[i].currentrow=i+1;
                }
                this.setState({
                    tableData:res.data.data.list,
                    current:pageNumber,
                    total:res.data.data.total,
                    loading:false
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                    document.getElementsByClassName('ant-table-wrapper')[0].style.minHeight='515px'
                }else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }else if(res.data.code === '999999'){
                message.warning('系统内部错误')
            }
            
        })
    }
    //子列表渲染
    childList=(record)=>{
        console.log(this.state.typeArr)
        if(this.state.typeArr.length==0){
            //显示全部子列表
            console.log(record)
            Axios.post(HttpUrl+'vehicle/carModel/getModelList',{
                carDataIds:this.state.typeArr,
                carTypeId:record.carTypeId
            },httpConfig).then( res => {
                if(res.status == 200 && res.data.code === '100000'){
                    console.log(res)
                    console.log(record)
                    let length=res.data.data.length
                    for(let i=0;i<length;i++){
                        res.data.data[i].number=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                        res.data.data[i].key=res.data.data[i].carModelId;
                    }
                    console.log(record.key)
                    this.state.expandedKeys.push(record.key)
                    console.log(this.state.expandedKeys)
                    this.setState({
                        tableData2:res.data.data
                    })
                }else if(res.data.code === '999999'){
                    message.warning('系统内部错误')
                }else if(res.data.code=='110002'){
                    message.warning('缺少参数')
                }
            })
            
        }else if(this.state.typeArr.length>=0){
            //只显示能源类型选中项的子列表
            Axios.post(HttpUrl+'vehicle/carModel/getModelList',{
                carTypeId:record.carTypeId,
                carDataIds:this.state.typeArr
            },httpConfig).then(res=>{
                console.log(res)
                if(res.status == 200 && res.data.code === '100000'){
                    // console.log(res)
                    // console.log(record)
                    let length=res.data.data.length
                    for(let i=0;i<length;i++){
                        res.data.data[i].number=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                        res.data.data[i].key=res.data.data[i].carModelId;
                    }
                    // console.log(record.key)
                    this.state.expandedKeys.push(record.key)
                    // console.log(this.state.expandedKeys)
                    this.setState({
                        tableData2:res.data.data
                    })
                }else if(res.data.code === '999999'){
                    message.warning('系统内部错误')
                }
            })
        }
    }
    //子列表
    expandedRowRender = () => {
        return (
            <Table 
                defaultExpandAllRows={false}
                className="childTable"
                style={{background: '#F1F2F4',zIndex:999,boxShadow: '2px 3px 10px 0px rgba(196,194,194,0.40)'}}
                columns={this.state.columns2}
                dataSource={this.state.tableData2}
                pagination={false}
            />
        )
    }
    //渲染子列表
    onExpands = (expanded, record) => {
        console.log(expanded)
        if (expanded === false) {
            console.log("合并！");
          } else {
            console.log("展开！");
          }
        this.setState({
            expanded:expanded
        })
        console.log(record)
        if(this.state.expandedKeys[0] === record.key){
            this.setState({
                expandedKeys:[],
                carTypeName:record.carTypeName,
                carSortNames:record.carSortName
            })
        }else{
            this.setState({
                expandedKeys:[],
                typerecord:record,
                carTypeName:record.carTypeName,
                carSortNames:record.carSortName
            })
            this.childList(record)
        }
    }
    
    //查询
    search=()=>{
        this.searchList(this.state.pageSize,this.state.defaultCurrent)
    }
    searchList = (pageSize,pageNumber) => {
        console.log(this.state.typeArr)
        console.log(this.props.form.getFieldValue('search'))
        var keywordType =String(this.state.keywordType)
        Axios.post(HttpUrl+'vehicle/carType/getCarTypeList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'keyword':this.props.form.getFieldValue('search')!=[]?this.props.form.getFieldValue('search'):'',
            'keywordType':keywordType?keywordType:'-1',
            'carDataId':this.state.typeArr
        }).then(res => {
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].carTypeId;
                    res.data.data.list[i].currentrow=i+1;
                }
                this.setState({
                    tableData:res.data.data.list,
                    // tableData2:res.data.data.list[0].modelList,
                    current:pageNumber,
                    total:res.data.data.total,
                    loading:false
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                    document.getElementsByClassName('ant-table-wrapper')[0].style.minHeight='515px'
                }else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }else if(res.data.code === '999999'){
                message.warning('系统内部错误')
            }
        })
    }
     //自动补全
     handleSearch = (value) => {
        Axios.post(HttpUrl+'vehicle/carType/autoComplete',{
            'keyword':value || null
        },httpConfig).then(res => {
            console.log(res)
            if( res.status == 200 && res.data.code === '100000'){
                this.setState({
                    dataSource:res.data.data.options,
                    keywordType:res.data.data.keywordType
                })
            }
        })
    }
    searSelect=(value)=>{
        this.setState({
            keyword:value,
            keywordType:this.state.keywordType
        })
        console.log('onSelect', value);
        console.log(this.state.keywordType)
    }
    
    // 分类管理弹窗
    classifiedModel=(record)=>{
        this.form5.carsortList(record,this.state.btnList)
    }
    //添加车型
    addModel=()=>{
        this.setState({
            addVisible:true
        })
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
    //添加车型--树
    renderTreeNodes = (data) => {
        if(data!=null){
            return data.map((item) => {
                console.log(item)
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
        this.setState({ value });
    }
    //添加车型-确认
    addEquip=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
            Axios.post(HttpUrl+'vehicle/carType/saveCarType',{
                carTypeName:this.props.form.getFieldValue('addVehicle'),
                carSortId:this.state.value
            },httpConfig).then(res=>{
                console.log(res)
                if(res.status == 200 && res.data.code === '100000'){
                    message.success('添加车型成功')
                    this.setState({
                        addVisible:false,
                        value:undefined
                    })
                    this.modelsList(this.state.pageSize,this.state.defaultCurrent)
                }else if(res.data.code === '220010'){
                    message.warning('该车型已创建，请重新输入')
                }
            })
        }
        })
    }
    //添加车型-取消
    addCancel=()=>{
        this.setState({
            addVisible:false,
            value:undefined
        })
    }
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
   //添加型号
    addModels=(record)=>{
        console.log(record)
        this.form.addList(record)
    }
   //主列表-编辑
    editModels=(record)=>{
        this.form2.editList(record)
    }
   //子列表-查看
    viewModel=(record,carTypeName,carSortNames)=>{
        this.form3.viewList(record,carTypeName,carSortNames)
    }
    //子列表-编辑
    editModel=(record,carTypeName,carSortNames)=>{
        this.form4.editList(record,carTypeName,carSortNames)
    }
    //清除条件
    unSearch=()=>{
        new Promise(resolve => {
            this.setState({
                typeArr:[],
                loading:true,
            })
            resolve(true)
        }).then(v => {
            
            this.props.form.resetFields()
            console.log(this.state.typeArr)
            this.checkNylx(this.state.typeArr)
            this.modelsList(this.state.pageSize,this.state.defaultCurrent)
        })
    }
    //主列表-删除
    deleteModels=(record)=>{
        console.log(record)
        if(record.relevantCarCount==0){
            this.setState({
                deleteViews:true,
                record:record
            })
        }else if(record.relevantCarCount!=0){
            message.warning('该车型已关联车辆，无法删除')
        }
        
    }
    //主列表-确认删除
    deledtsList=()=>{
        console.log(this.state.record.carTypeId)
        Axios.delete(HttpUrl+'vehicle/carType/deleteCarType/'+this.state.record.carTypeId,httpConfig).then(res=>{
           console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    deleteViews:false
                })
                message.success('已删除')
                this.searchList(this.state.pageSize,this.state.defaultCurrent)
            }else if(res.data.code=='220014'){
                message.warning('该车型已关联车辆，无法删除')
            }
        })
    }
    //取消删除
    unDelete=()=>{
        this.setState({
            deleteViews:false
        })
    }
    //子列表-删除
    deleteModel=(record)=>{
        console.log(record)
        if(record.mvcount==0){
            this.setState({
                record:record,
                deleteView:true
            })
        }else if(record.mvcount!=0){
            message.warning('该型号已关联车辆，无法删除')
        }
    }
    //子列表-删除-确认
    deledtList=()=>{
        console.log(this.state.record)
        Axios.delete(HttpUrl+'vehicle/carModel/deleteCarModel/'+this.state.record.carModelId,httpConfig).then(res=>{
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    deleteView:false
                })
                message.success('已删除')
                this.childList(this.state.record)
                this.modelsList(this.state.pageSize,this.state.defaultCurrent)
            }else if(res.data.code=='220015'){
                message.warning('该型号已关联车辆，无法删除')
            }else if(res.data.code=='999999'){
                message.warning('服务器内部错误')
            }
        })
    }
     //子列表-取消删除
     unDeletes=()=>{
        this.setState({
            deleteView:false
        })
        this.props.form.resetFields()
    }
     //导入
     importExcel = () => {
        this.refs.import.sendSword(this.state.btnList)
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr,btnList}=this.state
        return (
        <div className="content" >
            <div className='content-title'>   
                <Form layout="inline">
                    <div className='searchType'>
                        <FormItem label="关键字搜索">
                        { getFieldDecorator('search')( <AutoComplete 
                            // getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'200px'}}
                            dataSource={ this.state.dataSource}
                            onSelect={this.searSelect}
                            onSearch={this.handleSearch} placeholder='车型/型号/公告型号' autoComplete='off'/>)}
                        </FormItem>
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'11px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.unSearch}>清除条件</Button>
                    </div>
                    <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                            <div className='searchType'>
                                <div className='typeTitle' >能源类型：</div>
                                <div className='moreBox' style={{height:this.state.typeMoreNum ? 'auto' : '50px'}}>{this.state.nylxs}
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </Form>
            </div>
            <div>
                <div  className='oprateHead'>
                {  btnList.includes('addModel') ? 
                    <Button type="primary" className='btn' ghost  onClick={this.classifiedModel}><img src={tianjia}/>分类管理</Button>
                    :'' }
                {  btnList.includes('addModel') ? 
                    <Button type="primary" className='btn' ghost onClick={this.addModel}><img src={tianjia}/>添加车型</Button>
                    :'' }
                {  btnList.includes('importExcel') ? 
                    <Button type="primary" className='btn daoru' ghost onClick={this.importExcel}><img src={daoru}/>导入</Button>
                    :'' }
                </div>
                <div  className='tablesHeight table'>
                    <Table
                        className='tableParent'
                        onExpand={this.onExpands}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        loading={this.state.loading}
                        expandedRowKeys={this.state.expandedKeys}
                        expandedRowRender={this.expandedRowRender}
                        defaultExpandAllRows={false}
                        pagination={{
                            showQuickJumper:true,
                            current:this.state.current,
                            total:this.state.total,
                            pageSize:this.state.pageSize,
                            onChange:this.onChange,
                            showTotal:(total,range) => `第${this.state.current}/${Math.ceil(total/this.state.pageSize)}页  共${total}条`,
                        }}
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
            {/* 添加车型 */}
            <Modal
                title="添加车型"
                visible={this.state.addVisible} 
                onOk={this.addEquip} 
                onCancel={this.addCancel}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                className="findCarSort"
                >
                <Form layout="inline" style={{marginBottom:20}}>
                    <FormItem className="form_input" label="车型名称：">
                        { getFieldDecorator('addVehicle',{
                            rules: [
                                { required: true ,validator:carTypeNames}
                        ],
                        })(<Input onKeyDown={this.keycode}  type="text" onKeyUp={this.replaceSpace} autoComplete='off' style={{width:180}}/>)}
                    </FormItem>
                    <FormItem className="form_input" label="车辆分类：">
                        { getFieldDecorator('addClassification',{
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
            {/* 主列表-删除 */}
            <Modal
                title="删除"
                visible={this.state.deleteViews} 
                onOk={this.deledtsList} 
                onCancel={this.unDelete}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}>
                确认删除该车型吗？
            </Modal>
            {/* 子列表-删除 */}
            <Modal
                title="删除"
                visible={this.state.deleteView} 
                onOk={this.deledtList} 
                onCancel={this.unDeletes}
                okText="确认"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}>
                确认删除该型号吗？
            </Modal>
            {/* 分类管理 */}
            <CarsortModel wrappedComponentRef={(form) => this.form5 = form} modelsList={()=>this.modelsList(this.state.pageSize,this.state.defaultCurrent)}></CarsortModel>
            {/* 添加型号 */}
            <AddModels wrappedComponentRef={(form) => this.form = form} modelsList={()=>this.modelsList(this.state.pageSize,this.state.defaultCurrent)} childList={(record)=>this.childList(record)}></AddModels>
            
            {/* 主列表-编辑 */}
            <EditModels wrappedComponentRef={(form) => this.form2 = form} modelsList={()=>this.modelsList(this.state.pageSize,this.state.defaultCurrent)}></EditModels>
            
            {/* 子列表-查看 */}
            <ViewModel wrappedComponentRef={(form) => this.form3 = form} modelsList={()=>this.modelsList(this.state.pageSize,this.state.defaultCurrent)}></ViewModel>
            {/* 子列表-编辑 */}
            <EditModel wrappedComponentRef={(form) => this.form4 = form} modelsList={()=>this.modelsList(this.state.pageSize,this.state.defaultCurrent)}  childList={(record)=>this.childList(record)}></EditModel>
            {/* 导入 */}
            <ImportExcel ref='import' title='导入' templateUrl='api/vehicle/carModel/exportExcel'  importUrl='vehicle/carModel/importExcel' type='equip' modelsList={()=> this.modelsList(this.state.pageSize,this.state.defaultCurrent)} childList={(record)=>this.childList(record)}></ImportExcel>
            <style>
                {`
                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .checks{max-width:108px}
                    tr.ant-table-expanded-row .ant-table-wrapper{margin:0!important}
                    .ant-spin-nested-loading{background:#ffffff}
                    .childTable{box-shadow:none!important}
                    .childTable tr td,.childTable tr th{background: #F1F2F4!important;border-bottom:1px solid #ffffff}
                    .form_input{display:line-block;}
                    .findCarSort.ant-modal{width:610px!important;}
                    .ant-form-explain{font-size:12px;}
                    tr.ant-table-expanded-row td > .ant-table-wrapper{margin:0!important}
                    // .ant-table-expanded-row-level-1{box-shadow:rgba(196, 194, 194, 0.4) 2px 3px 10px 0px}
                    .ant-table-expanded-row-level-1>:first-child{background:#F1F2F4;}
                    .tablesHeight{position:relative}
                    .dataStatus{width:200px;text-align:center;position:absolute;left:45%;top:45%;}
                    .ant-table-row-collapsed:after{padding-left:1px}
                    .ant-table-row-expanded:after{padding-left:1px}
                    .checks{padding:0 10px;max-width:auto}
                    .ant-pagination-total-text{position:absolute;left:10px;}
                    .tableParent{background:#ffffff;box-shadow:0 2px 4px 0 rgba(216,216,216,0.50)}
                    .ant-pagination{padding-right:10px}
                    .typeTitle{line-height:35px;font-size:13px}
                    .ant-collapse-content{margin-top:10px}
                    .ant-modal-footer .ant-btn{margin:0 20px;width:80px}
                    .tableParent .ant-table{min-height:429px}
                    .childTable .ant-table{min-height:auto!important}
                    .content-title{padding:30px 31px 20px 31px}
                    .moreBox{margin-top:-46px;margin-left:79px}
                    .table .ant-table-body{min-height:auto!important}
                    .ant-table-thead th.caozuo{text-align:left!important;padding-left:30px!important}
                `}
            </style>
        </div>
        )
    }
}

const deviceManages = Form.create()(deviceManage);
export default deviceManages;