/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import Qs from 'qs'
import { Link } from 'react-router-dom';
import {Table,message,Input, AutoComplete ,Form, Button,Pagination,Modal,Row,Col,Select} from 'antd';
import imports from './../../../img/imports.png'
import exports from './../../../img/exports.png'
import add from './../../../img/add.png'
import {HttpUrl, httpConfig} from './../../../util/httpConfig'
import {transformDate} from './../../../util/util'
import {deviceText,deviceText2} from './../../../util/validator'
import  ImportExcel  from "./../../../component/import/importExcel";
import { resolve } from 'url';
import moment from 'moment';
let timer=null
const Option = Select.Option;
const FormItem = Form.Item;
class deviceClassify extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        classifyModal:false,
        typeModal:false,
        seriesModal:false,
        loading:false,
        deleteModal:false,
        searchDataSource:[],
        tableData:[],
        tableData2:[],
        totalData:[],
        expandedKeys:[],
        dictionaryOption:[],
        typeFlag:'',
        typerecord:'',
        seriesrecord:'',
        btnList:[],
        columns:[
            { title: '序号', width: 60, dataIndex: 'number'},
            { title: '设备类型',dataIndex: 'eqmTypeName'},
            { title: '创建时间',dataIndex: 'createTime',render:(text,record) => {
                return (
                    <div> {transformDate(text)}</div>
                )
            } },
            {
                title: '设备扩展信息类型',dataIndex: 'extendInfoType'
            },
            {
                title: '关联设备',dataIndex: 'relevanceEqmNum'
            },
            {title: '操作',dataIndex:'operation',className:'action',
              render: (text,record) => {
                  let _t=this
                  return (
                    <div>
                        {
                            this.state.btnList.includes('addSeries') ? 
                            <span onClick={ () => _t.addSeries(record,'添加') } >添加型号 &nbsp;</span>
                            : ''
                        }
                        {
                            this.state.btnList.includes('editType') ? 
                            <span onClick={ () => _t.editType(record,'编辑')}>编辑 &nbsp;</span> 
                            : ''
                        }
                        {
                            this.state.btnList.includes('deleteType') ?
                            <span onClick={ () => _t.deleteType(record)}>删除</span> 
                            : ''
                        }
                    </div>
                  )
              }
            },
        ],
        columns2:[
            { title: '序号', width: 60, dataIndex: 'number' },
            { title: '设备型号',dataIndex: 'eqmSeriesName'},
            { title: '供应商',dataIndex: 'providerFullName' },
            { title: '生产批次',dataIndex: 'eqmBatch'},
            { title: '创建时间',dataIndex: 'createTime',render:(text,record) => {
                return (
                    <div> {transformDate(text) }</div>
                )
            }},
            { title: '关联设备',dataIndex: 'relevanceEqmNum'},
            {title: '操作',dataIndex:'operation',width: 100,className:'action',
              render: (text,record) => {
                let _t=this
                  return (
                    <div>
                        {
                            this.state.btnList.includes('editSeries') ? 
                            <span onClick= { () => _t.editSeries(record,'编辑')}>编辑 &nbsp;</span>
                            : ''
                        }
                        
                        {this.state.btnList.includes('deleteSeries') ? 
                        <span onClick={ () => _t.deleteSeries(record)} >删除</span> 
                        : ''
                        }
                         
                    </div>
                  )
              }
            },
        ]
    }
    list = (pageNumber,pageSize) => {
        Axios.post(HttpUrl+'equip/eqmType/getEqmTypeList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'params':this.props.form.getFieldValue('keyword') || null
        }).then(res=>{
            if(res.data.code === '100000'){
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].eqmTypeId;
                }
                if(this.state.btnList.includes('listb')){
                    this.setState({
                        tableData:res.data.data.list,
                        current:pageNumber,
                        total:res.data.data.total,
                        loading:false
                    })
                }
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //自动补全+函数防抖
    handleSearch = () => {
        let that=this
        return () => {
            clearTimeout(timer)
            timer=setTimeout(() => {
                that.setState({
                    searchDataSource:[]
                })
                Axios.post(HttpUrl+'equip/eqmType/getRealTimeParams',{
                    params:this.props.form.getFieldValue('keyword') || null
                }).then(res => {
                    if( res.data.code === '100000'){
                        that.setState({
                            searchDataSource:res.data.data
                        })
                    }
                })
            }, 300);
        }
    }
    //搜索
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    addType = (flag) => {
        this.setState({
            typeModal:true,
            typeFlag:flag
        })
        this.dictionaryList()
    }
    addSeries = (record,flag) => {
        this.setState({
            seriesModal:true,
            typerecord:record,
            flag:flag
        })
    }
    clearCondition = () => {
        this.setState({
            typeMoreNum:false,
            modelMoreNum:false,
            typeArr:[],
            modelArr:[],
        })
        this.props.form.resetFields()
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    classifyEvent = (btnList) => {
        this.setState({
            classifyModal:true,
            btnList:btnList
        })
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    expandedRowRender = () => {
        return (
            <div className='childTable'>
                <Table 
                    columns={this.state.columns2}
                    className='innerTable'
                    dataSource={this.state.tableData2}
                    total={this.state.total}
                    pagination={{
                    simple:true,                        
                    }}
                />
            </div>
        )
    }
    onExpands = (expanded, record) => {
        if(this.state.expandedKeys[0] === record.key){
            this.setState({
                expandedKeys:[]
            })
        }else{
            this.setState({
                expandedKeys:[],
                typerecord:record
            })
            this.getEqmSeriesList(record)
        }
    }
    //获取设备型号
    getEqmSeriesList = (record) => {
        Axios.post(HttpUrl+'equip/eqmSeries/getEqmSeriesList',{
            'eqmTypeId':record.eqmTypeId
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length
                for(let i=0;i<length;i++){
                    res.data.data[i].number=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                    res.data.data[i].key=res.data.data[i].eqmSeriesId;
                }
                this.state.expandedKeys.push(record.key)
                this.setState({
                    tableData2:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //添加类型
    addTypeSubmit = (e) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.typeFlag === '添加'){
                    Axios.post(HttpUrl+'equip/eqmType/addEqmType',{
                        'eqmTypeName':this.props.form.getFieldValue('eqmTypeName'),
                        'dictionaryId':this.props.form.getFieldValue('dictionaryId')
                    }).then(res => {
                        if(res.data.code === '100000' ){
                            this.setState({
                                typeModal:false,
                                typeFlag:'',
                                typerecord:'',
                                seriesrecord:'',
                                dictionaryOption:[]
                            })
                            this.list(this.state.pageNumber,this.state.pageSize)
                        }else if(res.data.code !== '120002'){
                            message.warning(res.data.message)
                        }
                    })
                }else{
                    Axios.post(HttpUrl+'equip/eqmType/editEqmType',{
                        'eqmTypeId':this.state.typerecord.eqmTypeId,
                        'eqmTypeName':this.props.form.getFieldValue('eqmTypeName'),
                        'dictionaryId':this.props.form.getFieldValue('dictionaryId')
                    }).then(res => {
                        if(res.data.code === '100000' ){
                            this.setState({
                                typeModal:false,
                                typeFlag:'',
                                typerecord:'',
                                seriesrecord:'',
                                dictionaryOption:[]
                            })
                            this.list(this.state.pageNumber,this.state.pageSize)
                        }else if(res.data.code !== '120002'){
                            message.warning(res.data.message)
                        }
                    })
                }
            }
        });
    }
    //型号验证
    addSeriesSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.flag === '添加'){
                    this.addEqmSeries()
                }else{
                    this.sureEditSeries()
                }
            }
        });
    }
    //添加型号
    addEqmSeries = () => {
        Axios.post(HttpUrl+'equip/eqmSeries/addEqmSeries',{
            'eqmTypeId':this.state.typerecord.eqmTypeId,
            'providerFullName':this.props.form.getFieldValue('providerFullName') || null,
            'eqmSeriesName':this.props.form.getFieldValue('eqmSeriesName') || null,
            'eqmBatch':this.props.form.getFieldValue('eqmBatch') || null
        }).then(res => {
            if(res.data.code === '100000' ){
                this.setState({
                    seriesModal:false
                })
                this.getEqmSeriesList(this.state.typerecord)
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    editSeries = (record,flag) => {
        new Promise(resolve => {
            this.setState({
                seriesrecord:record,
                flag:flag
            })
            resolve(true)
        }).then(res => {
            this.setState({
                seriesModal:true
            })
        })
    }
    editType = (record,flag) => {
        new Promise(resolve => {
            this.dictionaryList()
            resolve(true)
        }).then(res => {
            if(res){
                this.setState({
                    typerecord:record,
                    typeFlag:flag,
                    typeModal:true
                })
            }
        })
    }
    //确认编辑型号
    sureEditSeries = () => {
        Axios.post(HttpUrl+'equip/eqmSeries/editEqmSeries',{
            'eqmSeriesId':this.state.seriesrecord.eqmSeriesId,
            'providerFullName':this.props.form.getFieldValue('providerFullName') || null ,
            'eqmSeriesName':this.props.form.getFieldValue('eqmSeriesName') || null,
            'eqmBatch':this.props.form.getFieldValue('eqmBatch') || null
        }).then(res => {
            if(res.data.code === '100000' ){
                this.setState({
                    seriesModal:false
                })
                this.getEqmSeriesList(this.state.seriesrecord)
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //获取设备扩展信息
    dictionaryList = () => {
        Axios.get(HttpUrl+'sys/dictionary/dictionaryList?groupKey=equip_manager&type=sbkzxx').then(res => {
            if(res.data.code === '100000' ){
                let length=res.data.data.list.length
                for(let i=0;i<length;i++){
                    this.state.dictionaryOption.push(<Option key={i} value={Number(res.data.data.list[i].id)}>{res.data.data.list[i].dicValue}</Option>)
                }
                this.setState({
                    dictionaryOption:this.state.dictionaryOption
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    deleteType = (record) => {
        if(record.relevanceEqmNum>0){
            message.warning('该类型已关联设备，无法删除')
        }else{
            this.setState({
                deleteModal:true,
                typerecord:record
            })
        }
    }
    deleteSeries = (record) => {
        this.setState({
            deleteModal:true,
            seriesrecord:record
        })
        
    }
    //导出设备类型列表
    export = () => {
        let token=sessionStorage.getItem('token')
        window.location=HttpUrl+'equip/eqmType/eqmTypeDataExport?params='+(this.props.form.getFieldValue('keyword') || '')+'&token='+token
    }
    //删除设备类型或型号
    sureDelete = () => {
        if(this.state.seriesrecord){
            Axios.post(HttpUrl+'equip/eqmSeries/deleteEqmSeries',{
                eqmSeriesId:this.state.seriesrecord.eqmSeriesId,
            }).then(res => {
                if(res.data.code === '100000' ){
                    this.setState({
                        deleteModal:false,
                        seriesrecord:''
                    })
                    this.getEqmSeriesList(this.state.typerecord)
                }else if(res.data.code !== '120002'){
                    message.warning(res.data.message)
                }
            })
        }else{
            Axios.post(HttpUrl+'equip/eqmType/deleteEqmById',{
                eqmTypeId:this.state.typerecord.eqmTypeId
            }).then(res => {
                if(res.data.code === '100000' ){
                    this.setState({
                        deleteModal:false,
                        typerecord:'',
                    })
                    this.list(this.state.pageNumber,this.state.pageSize)
                }else if(res.data.code !== '120002'){
                    message.warning(res.data.message)
                }
            })
        }
    }
    cancelDelete = () => {
        this.setState({
            deleteModal:false,
            typerecord:'',
            seriesrecord:'',
        })
    }
    sureAdd = () => {
        this.addTypeSubmit()
    }
    sureAddSeries = () => {
        this.addSeriesSubmit()
    }
    //取消
    cancel = () => {
        this.setState({
            pageNumber:1,
            pageSize:10,
            total:"",
            classifyModal:false,
            typeModal:false,
            loading:false,
            tableData:[],
            tableData2:[],
            totalData:[],
            expandedKeys:[],
        })
        this.props.eqmTypesList()
        this.props.eqmSeriesList()
    }
    //取消添加
    cancelAdd = () => {
        this.setState({
            typeModal:false,
            typeFlag:'',
            // typerecord:'',
            seriesrecord:'',
            dictionaryOption:[]
        })
    }
    //取消添加型号
    cancelAddSeries = () => {
        this.setState({
            seriesModal:false,
            seriesrecord:'',
        })
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize)
    }
    //导入
    importExcel = () => {
        this.refs.import.sendSword()
    }
    importList = () => {
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {btnList}=this.state
        return (
        <div className="content" >
            <Modal
                title='设备分类'
                visible={this.state.classifyModal}
                cancelText="取消"
                onCancel={ this.cancel}
                destroyOnClose={true}
                footer={null}
                className='treeBox1'
            >
                <Form layout="inline">
                    <div className='searchType'>
                        <FormItem label="关键字搜索">
                        { getFieldDecorator('keyword')( <AutoComplete  dataSource={ this.state.searchDataSource}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            onSelect={this.onSelect}
                            onSearch={this.handleSearch()} placeholder='设备分类、供应商、生产批次' className='collectInput'/>)}
                        </FormItem>
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                    </div>
                </Form>
                <div>
                <div  className='oprateHead' >
                    {
                        btnList.includes('addType') ? 
                        <Button type="primary" className='btn' style={{marginLeft:'535px'}}  onClick={ () => this.addType('添加') } ghost>
                        <img src={add} alt="" />
                        添加类型</Button>
                        : ''
                    }
                    {
                        btnList.includes('importb') ? 
                        <Button type="primary" className='btn' onClick={ this.importExcel}  ghost>
                        <img src={imports} alt="" />
                        导入</Button>
                        : ''
                    }
                    {
                        btnList.includes('export') ? 
                        <Button type="primary" className='btn' onClick={ this.export} ghost>
                        <img src={exports} alt=""  />
                        导出</Button>
                        : ''
                    }
                </div>
                <div className='tableParent table'>
                    <Table
                        scroll={{x:830}}
                        style={{height:'490px'}}
                        onExpand={this.onExpands}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        loading={this.state.loading}
                        pagination={{
                            showQuickJumper:true,
                            pageSizeOptions:this.state.pageSizeOptions,
                            current:this.state.current,
                            total:this.state.total,
                            pageSize:this.state.pageSize,
                            showTotal:(total,range) => `第${this.state.current}/${Math.ceil(total/this.state.pageSize)}页  共${total}条`,
                            onChange:this.onChange
                        }}
                        expandedRowKeys={this.state.expandedKeys}
                        expandedRowRender={ this.expandedRowRender}
                    />
                </div>
            </div>
            </Modal>
            {
                this.state.typeModal ? 
                <Modal
                    title={ this.state.typeFlag === '编辑' ? '编辑类型' : '新建类型' }
                    visible={this.state.typeModal}
                    okText='确定'
                    cancelText="取消"
                    onOk={  this.sureAdd  }
                    onCancel={ this.cancelAdd}
                    destroyOnClose={true}
                    className='addType kuozhan'
                >
                <div style={{marginTop:'20px'}}>
                    <Form layout='inline' style={{textAlign:'center'}} onSubmit={this.addTypeSubmit}>
                        <FormItem label="设备类型" style={{marginBottom:'20px'}}>
                        { getFieldDecorator('eqmTypeName',{
                            rules:[{
                                required:true,
                                validator:deviceText
                            }],
                            initialValue:this.state.typeFlag === '添加' ?  '' : this.state.typerecord.eqmTypeName
                        })( <Input className='collectInput' placeholder='12位、区分大小写' autoComplete='off'/>)}
                        </FormItem>
                        <FormItem label="设备扩展信息">
                        { getFieldDecorator('dictionaryId',{
                            rules:[{
                                required:true,
                                message:'请选择设备扩展信息类型',
                            }],
                            initialValue:this.state.typeFlag === '添加' ?  '' : Number(this.state.typerecord.dictionaryId)
                        })( <Select className='collectInput' placeholder='请选择设备扩展信息类型' getPopupContainer={triggerNode => triggerNode.parentNode} disabled={ this.state.typerecord.relevanceEqmNum > 0 ? true :false}>
                                { this.state.dictionaryOption }
                            </Select>)}
                            {/* 关联设备大于0时，设备扩展信息不可修改 */}
                        </FormItem>
                    </Form>
                </div>
                </Modal>
                : ''
            }
            {
                this.state.seriesModal ? 
                <Modal
                    title={ this.state.flag === '添加' ?  '新建设备型号' : '编辑'}
                    visible={this.state.seriesModal}
                    okText='提交'
                    cancelText="取消"
                    onOk={ this.state.flag === '添加' ?  this.sureAddSeries  : this.sureEditSeries }
                    onCancel={ this.cancelAddSeries}
                    destroyOnClose={true}
                    className='addType series'
                >
                <Row>
                <Form layout='inline' style={{textAlign:'center'}} onSubmit={this.addSeriesSubmit}>
                    <Col span={12}>
                        <FormItem label="设备类型">
                        { getFieldDecorator('eqmTypeName',{
                            initialValue: this.state.typerecord.eqmTypeName 
                        })( <Input  readOnly autoComplete='off'/>)}
                        </FormItem>
                        <FormItem label="型号" >
                        { getFieldDecorator('eqmSeriesName',{
                            rules:[{
                                required:true,
                                validator:deviceText
                            }],
                            initialValue: this.state.flag === '编辑' ? this.state.seriesrecord.eqmSeriesName : ''
                        })( <Input  placeholder='不超过12位、区分大小写' autoComplete='off'/>)}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="供应商">
                        { getFieldDecorator('providerFullName',{
                            rules:[{
                                required:true,
                                validator:deviceText2
                            }],
                            initialValue: this.state.flag === '编辑' ? this.state.seriesrecord.providerFullName : ''
                        })( <Input placeholder='不超过24位、区分大小写' autoComplete='off'/>)}
                        </FormItem>
                        <FormItem label="生产批次">
                        { getFieldDecorator('eqmBatch',{
                            rules:[{
                                required:true,
                                validator:deviceText2
                            }],
                            initialValue: this.state.flag === '编辑' ? this.state.seriesrecord.eqmBatch : ''
                        })( <Input placeholder='不超过24位、区分大小写' autoComplete='off'/>)}
                        </FormItem>
                    </Col>
                </Form>
                </Row>
                </Modal>
                : ''
            }
            <Modal
                visible={this.state.deleteModal}
                destroyOnClose={true}
                onCancel={ this.cancelDelete}
                className='addType'
                footer={<div>
                    <Button  onClick={this.cancelDelete}>取消</Button>
                    <Button style={{background:'#FF3636',color:'#fff',border:'none'}} onClick={this.sureDelete}>删除</Button>
                </div>}
            > 
            {
                this.state.seriesrecord ?
                <div className='deleteText'>确定删除设备型号吗？</div>
                : 
                <div className='deleteText'>
                    <div >确定删除设备类型吗？</div>
                    <div>
                        删除的设备类型下的所有子类型与设备型号也将一并删除
                    </div>
                </div>
            }
            </Modal>
            <ImportExcel ref='import' title='导入设备' templateUrl='equip/equipment/downloadExcelTemplate' importUrl='zuul/equip/eqmType/eqmTypeDataImport' type='equipType' importList={ this.importList}></ImportExcel>
            <style>
                {`
                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:150px;}
                    .treeBox1{width:900px !important;height:635px !important;}
                    .ant-modal-close-x{width:40px;height:40px;line-height:40px;}
                    .oprateHead:after{clear:both;content:''}
                    .oprateHead .btn{padding:0 10px;}
                    .tableParent .ant-table-body{height:430px;border: 1px solid #EBEDF8;}
                    .childTable .ant-table-body{height:auto;}
                    .addType .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    .collectInput{width:200px !important;}
                    .series{width:600px !important;}
                    .series .ant-row .ant-form-item{margin-bottom:20px}
                    .deleteText{text-align:center;line-height:30px;}
                    tr.ant-table-expanded-row .ant-table-wrapper{margin:0;}
                    .ant-form-explain{text-align:left;}
                    .ant-form-inline .ant-form-item-with-help{margin:0px;}
                    .ant-form-inline .ant-form-item{margin-right:0px;}
                    .kuozhan .ant-form-item-label{width:108px;}
                    .ant-table-row-collapsed:after{content:9650 25B2;}
                    .ant-form-item-label{width:78px}
                    .innerTable{background:#F1F2F4;}
                    .innerTable table tr td{background:#F1F2F4 !important;}
                    .innerTable table tr td{border-bottom:2px solid #fff !important;}
                    .innerTable table tr th{border-bottom:2px solid #fff !important;}
                    .innerTable .ant-table-body{border:none;}
                    .ant-table-expanded-row td{background:#F1F2F4 !important;}
                    .ant-table-thead > tr > th{border:none;}
                `}
            </style>
        </div>
        )
    }
}
const deviceClassifys = Form.create()(deviceClassify);
export default deviceClassifys;