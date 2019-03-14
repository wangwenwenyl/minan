/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import checkedArrow from './../../../img/checkedArrow.png'
import {Modal ,Form,Card,message,Input,AutoComplete,Icon,Upload,Button,Tree,Radio,Steps,Select,DatePicker,Checkbox} from 'antd';
import {HttpUrl,httpConfig} from '../../../util/httpConfig';
import  Table  from "./../../../component/table/table.js";
import upload from './../../../img/upload.png'
import AddFile from './../fileManage/addFile'
import moment from 'moment';
import {randomDay} from './../../../util/permission'
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Step = Steps.Step;
var obj1={};
var obj2={};
class addFile extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:0,
        taskModal:false,
        stepCurent:0,
        typeValue:'1',
        updateModel:'1',
        selectedRowKeys:[],
        time:'',
        searchDataSource:[],
        fileList:[],
        fileDetail:{},
        treeData:[],
        minFromVersion:[],
        checkedVersion:[],
        typeArr:[],
        modalArr:[],
        carModel:[],
        selectedType:[],
        selectedModal:[],
        selectedCarModel:[],
        chooseFlag:['0'],
        columns:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '车型',dataIndex: 'licenseNo' ,className:'clounWidth'},
            { title: '车牌号',dataIndex: 'plateNo' ,className:'clounWidth'},
            { title: 'VIN码',dataIndex: 'vin' ,className:'clounWidth'},
            { title: '设备类型',dataIndex: 'eqmTypeName' ,className:'clounWidth'},
            { title: '设备型号',dataIndex: 'eqmSeriesName' ,className:'clounWidth'},
            { title: '供应商',dataIndex: 'providerFullName' ,className:'clounWidth'},
            { title: '生产批次',dataIndex: 'eqmBatch' ,className:'clounWidth'},
            { title: '版本号',dataIndex: 'versionNow' ,className:'clounWidth'},
            { title: '设备状态',dataIndex: 'onlineStatus' ,className:'clounWidth',
                render:(text,record) => {
                    return (
                        <div>{record.onlineStatus == 0 ? '离线' : record.onlineStatus == 1 ? '在线' : ''}</div>
                    )
                }
            }
        ]
    }
    componentDidMount(){
        obj1={}
        obj2={}
    }
    release = () => {
        this.setState({
            taskModal:true
        })
    }
    //上一步
    prev = () => {
        this.setState({
            stepCurent:this.state.stepCurent -=1,
        })
    }
    //下一步
    next = () => {
        if(this.state.stepCurent === 0){
            this.handleSubmitForm1()
        }else if(this.state.stepCurent === 1){
            this.handleSubmitForm2()
        }
    }
    //第一步
    timeChange = (moment,dateStrings,string) => {
        this.setState({
            time:dateStrings
        })
    }
    //第一步更新类型选择
    updatetypeChange = (e) => {
        this.setState({
            typeValue:e.target.value
        })
    }
    //第一步的保存
    handleSubmitForm1 =  () => {
        let _t=this
        this.props.form.validateFields((err, values) => { 
            if (!err) {
                Object.assign(obj1,{
                    taskName:this.props.form.getFieldValue('taskName'),
                    updateType:this.props.form.getFieldValue('updateType'),
                    updateModel:this.props.form.getFieldValue('updateModel'),
                    sceneFlag:2,
                    setStartTime:this.state.time[0],
                    setEndTime:this.state.time[1]
                })
                this.setState({
                    stepCurent:_t.state.stepCurent += 1,
                })
                //获取第二部中的文件列表
                Axios.post(HttpUrl+'ota-mag/task/taskUpfileList',{
                    'keyword':this.props.form.getFieldValue('keyword')
                }).then(res => {
                    if(res.data.code === "100000"){
                        let length=res.data.data.length
                        let fileList=[]
                        for(let i=0;i<length;i++ ){
                            fileList.push(<Option key={i}  value={res.data.data[i].fileId+','+res.data.data[i].versionCode+','+res.data.data[i].fileName+','+res.data.data[i].minFromVersion.split(',')}>{res.data.data[i].fileName}</Option>)
                        }
                        _t.setState({
                            fileList:fileList
                        })
                    }
                })
            }
        })
    }
    //第二部的保存
    handleSubmitForm2 = () => {
        let _t=this
        this.props.form.validateFields((err, values) => { 
            if(!err){
                Object.assign(obj1,{
                    fileId:this.state.fileDetail.fileId,
                    minFromVersions:this.state.checkedVersion,
                    certificateFlag:this.props.form.getFieldValue('certificateFlag').join(',')
                })
                this.setState({
                    stepCurent:_t.state.stepCurent += 1,
                })
                this.eqmTypesList()
                this.getCarModels(this.state.fileDetail)
                this.eqmSeriesList([])
                this.getOTAEquipmentList(this.state.pageNumber,this.state.pageSize)
            }
        })
    }
    addFile = () => {
        this.form.openModal()
    }
    //第二部中的文件包选择
    fileVersionSelect = (e) => {
        let arr=e.split(',')
        let fileSelected=e.split(',')
        let fileSelected3=arr.splice(3,arr.length)
        //渲染树的数据
        Axios.post(HttpUrl+'ota-mag/file/findFileById',{
            'fileId':fileSelected[0]
        }).then(res => {
            if(res.data.code === '100000'){
                let treeData=[]
                treeData.push(JSON.parse(res.data.data.suitJson))
                this.setState({
                    treeData:treeData,
                    fileDetail:res.data.data
                })
            }else{
                message.warning(res.data.message)
            }
        })
        //最低可升级版本的渲染
        let minFromVersion=[]
        if( fileSelected3 instanceof Object ){
            for(let i=0;i<fileSelected3.length;i++){
                minFromVersion.push(<Checkbox key={fileSelected3[i]} value={fileSelected3[i]}>{fileSelected3[i]}</Checkbox>)
            }
        }else{
            minFromVersion.push(<Checkbox key={fileSelected3} value={fileSelected3}>{fileSelected3}</Checkbox>)
        }
        this.setState({
            minFromVersion:minFromVersion
        })
    }
    //第二部中的版本选择
    versionChange = (e) => {
        this.setState({
            checkedVersion:e
        })
    }
    //第二部的文件上传
    addFile = () => {
        this.setState({
            title:'上传文件'
        })
        this.form.openModal('',2)
    }
    showStep2 = (fileDetail,treeData,minFromVersion) => {
        this.setState({
            fileDetail:fileDetail,
            treeData:treeData
        })
        let version =minFromVersion.split(',')
        let arr=[]
        for(let i=0;i<version.length;i++){
            arr.push(<Checkbox key={version[i]} value={version[i]}>{version[i]}</Checkbox>)
        }
        this.setState({
            minFromVersion:arr
        })
    }
    //第三部的获取设备类型
    eqmTypesList = () => {
        Axios.get(HttpUrl+'ota-mag/file/getEqmTypes').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length
                let typeArr=[]
                for(let i=0;i<length;i++){
                    typeArr.push(<Checkbox key={res.data.data[i].id} value={res.data.data[i].id}>{res.data.data[i].val}</Checkbox>)
                }
                this.setState({
                    typeArr:typeArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //第三部设备型号
    eqmSeriesList = (typeArr) => {
        Axios.post(HttpUrl+'ota-mag/file/getEqmSeriesNames',{
            'eqmTypeIds':typeArr
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length
                let modalArr=[]
                for(let i=0;i<length;i++){
                    modalArr.push(<Checkbox key={res.data.data[i].id} value={res.data.data[i].id}>{res.data.data[i].val}</Checkbox>)
                }
                this.setState({
                    modalArr:modalArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //第三部获取车型
    getCarModels = (data) => {
        Axios.post(HttpUrl+'ota-mag/task/getCarModels',{
            'fileId':Number(data.fileId),
            'minFromVersions':this.state.checkedVersion.join(',')
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length
                let carModel=[]
                for(let i=0;i<length;i++){
                    carModel.push(<Checkbox key={res.data.data[i].id} value={res.data.data[i].id}>{res.data.data[i].val}</Checkbox>)
                }
                this.setState({
                    carModel:carModel
                })
            }else{
                message.warning(res.data.message)
            }
        }).catch(res => {
            message.warning(res)
        })
    }
    //第三部中的车型选择
    carModalChange = (e) => {
        this.setState({
            selectedCarModel:e
        })
    }
    //第三部中的类型选择
    typeChange = (e) => {
        this.setState({
            selectedType:e
        })
        this.eqmSeriesList(e)
    }
    //第三部中的型号选择
    deviceModalChange = (e) => {
        this.setState({
            selectedModal:e
        })
    }
    //第三部获取列表
    getOTAEquipmentList = (pageNumber,pageSize) => {
        Axios.post(HttpUrl+'ota-mag/task/getOTAEquipmentList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'fileId':this.state.fileDetail.fileId,
            'minFromVersions':this.state.checkedVersion,
            'carModelIds':this.state.selectedCarModel,
            'eqmTypeIds':this.state.selectedType,
            'eqmSeriesIds':this.state.selectedModal,
            'keyword':this.props.form.getFieldValue('keyword')
        }).then(res => {
            let length
            if(res.data.data.list === null){
                length=[]
            }else{
                length=res.data.data.list.length
            }
            for(let i=0;i<length;i++){
                res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                res.data.data.list[i].key=res.data.data.list[i].equipmentId;
            }
            if(this.state.chooseFlag.length>0){
                var arr=[]
                for(let i=0;i<length;i++){
                    arr.push(res.data.data.list[i].equipmentId)
                }
                this.setState({
                    selectedRowKeys:arr
                })
            }
            this.setState({
                tableData:res.data.data.list,
                total:res.data.data.total,
                current:pageNumber,
                loading:false,
            })
        })
    }
    cancelSubmit = () => {
        this.setState({
            verifyModal:false
        })

    }
    //完成
    complete = () => {
        this.handleSubmitForm3()
    }
    handleSubmitForm3 = () => {
        this.props.form.validateFields((err,values) => {
            if(!err) {
                this.setState({
                    verifyModal:true
                })
            }
        })
    }
    //第三部中不可选择的日期
    disabledDate = (current) => {
        return current < moment().subtract(1, "days")
    }
    range(start, end) {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
    //第三部中不可选择的时间
    disabledTime = (value,type) => {
        let now = new Date()
        let hours=now.getHours()
        let minutes=now.getMinutes()
            if (type === 'start') {
                if(value){
                    if(moment(value[0])._d.getTime()<=now.getTime()){
                    return {
                        disabledHours: () => this.range(0,24).splice(0,hours),
                        disabledMinutes: () => this.range(0,60).splice(0,minutes),
                        // disabledSeconds: () => this.range(0,60).splice(0,seconds)
                    }
                }
            }
        }
    }
    //第三部中的分页
    onChange = (pageNumber) => {
        this.getOTAEquipmentList(pageNumber,this.state.pageSize)
    }
    //第三部中的全选
    allChange = (e) => {
        this.setState({
            chooseFlag:e
        })
        if(e.length > 0){
            this.getOTAEquipmentList(this.state.pageNumber,this.state.pageSize)
        }else{
            this.setState({
                selectedRowKeys:[]
            })
        }
    }
    //第三步中的查询
    search = () => {
        this.getOTAEquipmentList(this.state.pageNumber,this.state.pageSize)
    }
    //第三步中的清除条件
    clearCondition = () => {
        this.props.form.setFieldsValue({'keyword':''})
    }
    sureSubmit = () => {
        this.verifyPassword()
    }
    verifyPassword = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                Axios.post('sys/system/user/checkPassword',{
                    password:this.props.form.getFieldValue('password')
                },httpConfig).then( res => {
                    if(res.data.code === '100000'){
                        this.setState({
                            verifyModal:false
                        })
                        Axios.post(HttpUrl+'ota-mag/task/save',Object.assign(obj1,{
                            'carModelIds':this.state.selectedCarModel,
                            'eqmTypeIds':this.state.selectedType,
                            'eqmSeriesIds':this.state.selectedModal,
                            'keyword':this.props.form.getFieldValue("keyword"),
                            'chooseFlag':this.state.chooseFlag.length === 0 ? 1 : 0,
                            'eqmIds':this.state.chooseFlag.length === 0 ?  this.state.selectedRowKeys : null
                        })).then( res => {
                            if(res.data.code ==='100000'){
                                obj1={}
                                this.setState({
                                    carCondition:'1',
                                    carConditionValue:'',
                                    stepDetail:'',
                                    taskModal:false
                                })
                                this.props.taskList()
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }else{
                        message.warning(res.data.message)
                    }
                })
            }
        })
    }
    cancel = () => {
        this.setState({
            total:0,
            taskModal:false,
            stepCurent:0,
            typeValue:'1',
            updateModel:'1',
            time:'',
            searchDataSource:[],
            fileList:[],
            fileDetail:{},
            treeData:[],
            minFromVersion:[],
            checkedVersion:[],
            typeArr:[],
            selectedType:[],
            selectedModal:[],
            chooseFlag:[]
        })
        obj1={}
    }
    render() {
        const { getFieldDecorator}=this.props.form
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({ selectedRowKeys});
                if(this.state.total === selectedRowKeys.length){
                    this.props.form.setFieldsValue({'selectAll':["0"]})
                    this.setState({
                        chooseFlag:['0']
                    })
                }
            },
            onSelect:(record, selected, selectedRows, nativeEvent) => {
                if(!selected){
                    this.setState({
                        chooseFlag:[]
                    })
                    this.props.form.setFieldsValue({'selectAll':[]})
                }
            },
            onSelectAll:(selected, selectedRows, changeRows)=>{
                if(!selected){
                    this.setState({
                        chooseFlag:[]
                    })
                    this.props.form.setFieldsValue({'selectAll':[]})
                }
            },
            selectedRowKeys:this.state.selectedRowKeys
        };
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                  <TreeNode key={item.key} title={item.title} name={item.value}>
                    {loop(item.children)}
                  </TreeNode>
                )
              }
              return <TreeNode key={item.key} title={item.title} name={item.value} />;
          });
        return (
            <div>
                <Modal
                    title='任务发布'
                    visible={this.state.taskModal}
                    onCancel={ this.cancel}
                    destroyOnClose={true}  
                    footer={null}
                    className='taskBox'
                >
                    <div>   
                        <div className='stepBox'>
                            <Steps current={this.state.stepCurent}>
                                <Step title="基本属性"/>
                                <Step title="选择升级包" />
                                <Step title="选择设备/车型" />
                            </Steps>
                        </div>
                        <div className='owner inlineBlock'>
                            { this.state.stepCurent ===0 ?
                                <Form layout="inline" style={{marginTop:'60px'}} className='stepForm' onSubmit={this.handleSubmitForm1}>
                                    <FormItem label='任务名称' >
                                        { getFieldDecorator('taskName',{
                                            rules:[{
                                                required:true,
                                                message:'请填写任务名称'
                                            }],
                                            initialValue:obj1.taskName
                                        })( <Input  autoComplete='off' maxLength={50} placeholder='任务名不超过50个字符' style={{width:'240px'}}/>)}
                                    </FormItem>
                                    <br/><br/>
                                    <FormItem label='更新类型'>
                                        { getFieldDecorator('updateType',{
                                            initialValue:obj1.updateType ? obj1.updateType : this.state.typeValue
                                        })( 
                                            <RadioGroup className='stepRadio' onChange={ this.updatetypeChange}>
                                                <Radio value="1">修正</Radio>
                                                <Radio value="2">建议</Radio>
                                                <Radio value="3">新功能</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <FormItem style={{marginLeft:'70px',marginTop:'-10px'}}> 
                                        { this.state.typeValue ==='1' ? <div className='remindText'>升级后，可避免安全风险、软件故障等影响车辆正常使用问题</div> : ''}
                                        { this.state.typeValue ==='2' ? <div className='remindText'>升级后，可对现有性能进行优化，给用户带来更好体验</div> : ''}
                                        { this.state.typeValue ==='3' ? <div className='remindText'>升级后，增加的新功能可以给用户更多样的体验</div> : ''}
                                    </FormItem>
                                    <br/>
                                    <FormItem label='更新模式'>
                                        { getFieldDecorator('updateModel',{
                                            initialValue: obj1.updateModel ? obj1.updateModel : this.state.updateModel
                                        })( 
                                            <RadioGroup  className='stepRadio' onChange={ this.updateChange}>
                                                <Radio value="1">静默升级</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <br/><br/>
                                    <div >
                                        <span className='noLabel'>升级场景：</span>
                                        <span>安装成功，立即重启</span>
                                    </div>
                                    <br/>
                                    <FormItem label='升级时效' className='upgradeTime'>
                                        { getFieldDecorator('time',{
                                            rules:[{
                                                required:true,
                                                message:'请选择时间'
                                            }],
                                            initialValue:obj1.setStartTime ? [moment(obj1.setStartTime),moment(obj1.setEndTime)] : ''
                                        })( 
                                            <RangePicker showTime={{
                                                hideDisabledOptions: true,
                                                defaultValue: moment('00:00:00', 'HH:mm:ss'),
                                            }}
                                            disabledDate={this.disabledDate}
                                            disabledTime={this.disabledTime}
                                            onChange={this.timeChange}
                                            format="YYYY-MM-DD HH:mm:ss" 
                                            />
                                        )}
                                    </FormItem>
                                    <br/><br/>
                                </Form>
                            : ''  }
                        </div>
                        <div className='owner inlineBlock2 '>
                            { this.state.stepCurent ===1 ?
                            <Form layout="inline" style={{marginTop:'60px'}} className='stepForm' onSubmit={this.handleSubmitForm2}>
                                <FormItem label='请选择升级包'>
                                {
                                    getFieldDecorator('packge',{
                                        rules:[{
                                            required:true,
                                            message:'请选择升级包'
                                        }],
                                        initialValue:this.state.fileDetail.fileName
                                    })( 
                                        <Select 
                                            showSearch 
                                            optionFilterProp="children"
                                            onSelect={this.fileVersionSelect}  
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            style={{width:'200px'}}>
                                            { this.state.fileList }
                                        </Select>)
                                }
                                </FormItem>
                                <br/><br/>
                                <Button  className='btn' type="primary" ghost style={{width:'80px',marginLeft:'115px'}} onClick={this.addFile}>
                                    <img src={upload} alt=""/>
                                    上传
                                </Button>
                                <span style={{color:"red",marginLeft:'5px'}}>找不到升级包？请点这里</span>
                                <br/>
                                <br/>
                                <div>
                                    <span className='noLabel'>目标版本号：</span>
                                    <span>
                                        { this.state.fileDetail.showVersion}
                                    </span>
                                </div>
                                <br/>
                                <div style={{marginBottom:'15px'}}>
                                    <span  className='noLabel'>升级设备信息：</span>
                                    <span style={{verticalAlign:'top'}}>更多</span>
                                    <span style={{left:'150px',display:'inline-block',marginTop:'-10px',verticalAlign:'top'}}>
                                        <Tree>
                                            {
                                                loop( this.state.treeData)
                                            }
                                        </Tree>
                                    </span>
                                </div>
                                <div>
                                    <FormItem label='可升级版本号' className='stepVersion' style={{marginBottom:'5px'}}>
                                        {
                                            getFieldDecorator('version',{
                                                rules:[{
                                                    message:'请选择可升级版本号',
                                                    required:true
                                                }],
                                                initialValue:this.state.checkedVersion
                                            })(
                                                <CheckboxGroup onChange={this.versionChange}>
                                                    {
                                                        this.state.minFromVersion
                                                    }
                                                </CheckboxGroup>
                                            )
                                        }
                                    </FormItem>
                                </div>
                                <div>
                                    <FormItem label='选择证书' style={{marginBottom:'15px'}}>
                                        { getFieldDecorator('certificateFlag',{
                                            rules:[
                                                {
                                                    required:true,
                                                    message:'请选择证书',
                                                }
                                            ],
                                            initialValue:['0']
                                        })( 
                                            <CheckboxGroup className='stepRadio' onChange={this.versionChange}>
                                                <Checkbox value="0">默认</Checkbox>
                                            </CheckboxGroup>
                                        )}
                                    </FormItem>   
                                </div>
                                <br/>
                            </Form>
                             : '' }
                        </div>
                        <div className='owner3'>
                            {
                                this.state.stepCurent === 2 ?
                                <div>
                                    {
                                        this.state.verifyModal ?
                                        <Modal
                                            title='登录密码验证'
                                            visible={this.state.verifyModal}
                                            okText="提交"
                                            cancelText="取消"
                                            onOk={ this.sureSubmit }
                                            onCancel={ this.cancelSubmit }
                                            maskClosable={false}
                                            destroyOnClose={true}
                                            className='verifyModal'
                                        > 
                                            <Form layout="inline" onSubmit={this.verifyPassword}>  
                                                <FormItem  >
                                                <div style={{marginBottom:'5px'}}> 请输入当前登录账户的密码</div>
                                                {
                                                    getFieldDecorator('password',{
                                                        rules:[{
                                                            required:true,
                                                            message:'请输入当前登录账户的密码'
                                                        }]
                                                    })(
                                                        <Input type="password"/>
                                                    )
                                                }
                                                </FormItem>
                                            </Form>
                                        </Modal>
                                        : ''
                                    }
                                    <div className="gutter-box car-type">
                                        <Form layout="inline" className='wquery wquery2' onSubmit={this.handleSubmitForm3}>
                                            <FormItem label='车型' >
                                                {
                                                    getFieldDecorator('providerId',{
                                                       
                                                        initialValue: this.state.selectedCarModel
                                                    })(
                                                        <CheckboxGroup className='stepRadio3' onChange={this.carModalChange}>
                                                            { this.state.carModel}
                                                        </CheckboxGroup>
                                                    )
                                                }
                                            </FormItem>
                                            <br/>
                                            <FormItem label='设备类型' >
                                                {
                                                    getFieldDecorator('eqmTypeId',{
                                                        initialValue: this.state.selectedType
                                                    })(
                                                        <CheckboxGroup className='stepRadio3' onChange={this.typeChange}>
                                                            {
                                                                this.state.typeArr
                                                            }
                                                        </CheckboxGroup>
                                                    )
                                                }
                                            </FormItem>
                                            <br/>
                                            <FormItem label='设备型号'>
                                                {
                                                    getFieldDecorator('eqmSeriesId',{
                                                        initialValue: this.state.selectedModal
                                                    })(
                                                        <CheckboxGroup className='stepRadio3' onChange={this.deviceModalChange}>
                                                            {
                                                                this.state.modalArr
                                                            }
                                                        </CheckboxGroup>
                                                    )
                                                }
                                            </FormItem>
                                            <br/>
                                            <FormItem label='关键字搜索'>
                                                {
                                                    getFieldDecorator('keyword',{
                                                        // initialValue: obj2s.showVersions ? obj2s.showVersions : ''
                                                    })(
                                                        <Input placeholder='车牌、VIN码、供应商'/>
                                                    )
                                                }
                                            </FormItem>
                                            <Button type="primary" className='btn' style={{marginLeft:'14px',width:'70px',height:'28px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                                            <Button type="primary" className='btn' ghost onClick={this.clearCondition} style={{height:'28px',marginTop:'5px'}}>清除条件</Button>
                                            <br/>   
                                            <FormItem>
                                                {
                                                    getFieldDecorator('selectAll',{
                                                        initialValue: this.state.chooseFlag
                                                    })(
                                                        <CheckboxGroup className='stepRadio' onChange={this.allChange} style={{marginLeft:'10px'}}>
                                                            <Checkbox value="0">全选所有数据</Checkbox>
                                                        </CheckboxGroup>
                                                    )
                                                }
                                            </FormItem>
                                        </Form>
                                    </div>
                                    <Table 
                                        rowSelection={rowSelection}
                                        scroll={1600}
                                        columns={this.state.columns} 
                                        dataSource={this.state.tableData} 
                                        total={this.state.total} 
                                        current={this.state.current} 
                                        pageSize={this.state.pageSize}
                                        onChange={this.onChange}
                                    />
                                </div>
                            : ''
                            }
                        </div>
                        <Form style={{margin:'auto',textAlign:'center',marginTop:'25px',width:'500px'}}>
                            {this.state.stepCurent ===0 ? <Button  className='btn' style={{width:'70px',height:'30px',marginRight:'60px'}} onClick={this.cancel}>取消</Button> : ''}
                            {this.state.stepCurent!==0 ? <Button  className='btn' style={{width:'70px',height:'30px',marginRight:'60px'}} onClick={this.prev}>上一步</Button> : ''}
                            {this.state.stepCurent!==2 ? <Button  className='btn' type="primary" style={{width:'70px',height:'30px'}} onClick={this.next}>下一步</Button> : ''}
                            {this.state.stepCurent ===2 ? <Button  className='btn' type="primary" style={{width:'70px',height:'30px'}} onClick={this.complete}>
                                完成
                            </Button> : ''}
                        </Form>
                    </div>
                </Modal>
                <AddFile wrappedComponentRef={(form) => this.form = form} showStep2={ (res,success,verson) => this.showStep2(res,success,verson)}></AddFile>
            <style>
                {`
                    .taskBox{width:750px !important;}
                    .stepBox{width:500px;margin:auto;}
                    .owner{width:500px;margin:auto;margin-left:140px;font-size:13px;}
                    .owner3{width:670px;margin:auto;margin-top:40px}
                    .owner3 .ant-form-item-label{width:78px;}
                    .owner .ant-form-item-label{width:115px !important;}
                    .remindText{font-size:10px;color:#999;}
                    .upgradeTime .ant-input{width:300px;}
                    .noLabel{display:inline-block;width:115px;color:#555;text-align:right;vertical-align:top;}
                    .ant-form-inline .ant-form-item-with-help{margin-bottom:0px;}
                    .stepVersion .has-error .ant-form-explain{width:150px !important;margin-top:-10px;}
                    .stepRadio3{  line-height: 30px; width:550px;max-height:120px;overflow:auto;margin-top:2px;}
                    .ant-checkbox-wrapper + .ant-checkbox-wrapper { margin-left:0px;}
                    .inlineBlock2 .ant-form-item-control-wrapper{width:330px;}
                    .stepRadio .ant-checkbox-wrapper{margin-top:8px !iimportant;}
                    .stepVersion .ant-checkbox-wrapper{line-height:30px;}
                `}
            </style>
        </div>
        )
    }
}

const addFiles = Form.create()(addFile);
export default addFiles;