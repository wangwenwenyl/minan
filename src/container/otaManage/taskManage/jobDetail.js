/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {message,Radio,Tabs, Form, Input, Icon, Select, Row, Col, Button,Breadcrumb, Popover,DatePicker,Progress} from 'antd';
import { httpConfig, HttpUrl } from './../../../util/httpConfig';
import  Table  from "./../../../component/table/table";
import LogModal from "./logModal"
import Timer from "./timer"
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入饼图
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
// import 'echarts/lib/component/scroll';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import {btnList} from './../../../util/util'
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
var leftname='';
var rightname='';

const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
class upgradeFiles extends Component {
    constructor(props, context) {
        super(props, context); 
    }
    componentDidMount() {
        btnList(this)
        new Promise(resolve => {
            this.setState({
                taskId:this.props.location.state.query.record,
                taskStatusStr:this.props.location.state.query.taskStatusStr
            })
            resolve(this.props.location.state.query.record)
        }).then( v => {
            this.taskDown(v)
            return v
        }).then(v => {
            this.taskRadio(v)
            return v
        }).then(v => {
            this.taskList(this.state.pageNumber,this.state.pageSize,v)
            return v
        }).then(v => {
            this.taskProgress(v)
            return v
        }).then(v => {
            this.taskDetail(v)
        }) 
        window.onresize = () =>{
            this.setEcharts()
            this.leftEcharts()
            this.rightEcharts()
        }
        this.setEcharts()
        this.leftEcharts()
        this.rightEcharts()
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:0,    //总共数据数量
        taskId:'',
        tabkey:'1',
        progressUndownload:[],
        progressSuccess:[],
        progressFail:[],
        progressDownloading:[],
        progressInstalling:[],
        progressNoData:[],
        progressTotalData:'',
        updateData:[],
        downloadData:[],
        leftColor:[],
        rightColor:[],
        btnList:'',
        eqmTypeName:'',
        minFromVersion:'',
        targetVersion:'',
        updateType:'',
        updateModel:'',
        fileName:'',
        upgradeValidTime:'',
        certificateFlag:'',
        sceneFlag:'',
        year:'',
        month:'',
        date:'',
        hours:'',
        minus:'',
        seconds:'',
        setEndTime:'',
        columns:[{
            title:'序号',
            dataIndex:'number'
        },{
            title:'VIN',
            dataIndex:'vin'
        },{
            title:'供应商',
            dataIndex:'providerFullName'
        },{
            title:'型号',
            dataIndex:'eqmSeriesName'
        },{
            title:'生产批次',
            dataIndex:'eqmBatch'
        },{
            title:'设备SN',
            dataIndex:'tboxSn'
        },{
            title:'版本号',
            dataIndex:'targetVersion'
        },{
            title:'状态',
            dataIndex:'status',
            render:(text,record) => {
                return (
                    record.statusStr 
                )
            }
        },{
            title:'说明',
            dataIndex:'instructions'
        },{
            title:'操作',
            className:'caozuo',
            render:(text,record) => {
                return(
                    (
                        <div className='action'>
                            {
                                this.state.btnList.includes('taskChildDetailA') ? 
                                <span onClick={ () => this.viewDetail(record,'查看详情')} className='popoverItem'>
                                    查看详情
                                    &nbsp;&nbsp;
                                </span>
                                : ''
                            }
                            {
                                this.state.btnList.includes('taskChildDetailB') ? 
                                <span onClick={ () => this.viewHistory(record,'历史日志')} className='popoverItem'>
                                    历史日志
                                    &nbsp;&nbsp;
                                </span>
                                : ''
                            }
                            {
                                this.state.taskStatusStr == '任务已结束' ? 
                                ''
                                : ( record.status == 3 || record.status == 4 ?
                                    ''  
                                     : <span onClick={ () => this.stop(record)} className='popoverItem'>
                                     终止
                                     </span>)
                            }
                        </div>  
                    )
                )
            }
        }],
        data:[]
    }
    setEcharts = () => {
        let width=document.body.clientWidth
        document.getElementById('progress').style.width=width-250+'px'
        var myChart = echarts.init(document.getElementById('progress'));
        let totalData=this.state.progressTotalData
        // 绘制图表
        let option = {
            title: {
                text: 'OTA升级进度统计',
                left:'left',
                textStyle:{
                    color:'#333',
                    fontSize:'17',
                    fontWeight:'normal'
                }
            },
            legend: {
                left:'right',
                selectedMode:false,
                data: ['成功','失败','正在安装','正在下载','未下载']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'value',
                show:false
            },
            yAxis: {
                type: 'category',
                data: [''],
                show:false
            },    
            tooltip: {
                trigger: 'item',
                formatter:function(params){
                    if(!totalData){
                        return '暂无数据'
                    }else{
                        return params.seriesName + ' : ' +(params.value*100/totalData).toFixed(2)+'%'
                    }
                }
            },
            series: [{
                name: '成功',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                            return (params.value*100/totalData).toFixed(2)+'%'
                        },
                        show: totalData ? true :false,
                        position: 'bottom',
                        color:'#000',
                    }
                },
                itemStyle:{
                    color:'#4EC185'
                },
                data: this.state.progressSuccess
            },{
                name: '失败',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                            return (params.value*100/totalData).toFixed(2)+'%'
                        },
                        show: totalData ? true :false,
                        position: 'bottom',
                        color:'#000',
                    }
                },
                itemStyle:{
                    color:'#F1615B'
                },
                data: this.state.progressFail
            },{
                name: '正在安装',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                            return (params.value*100/totalData).toFixed(2)+'%'
                        },
                        show: totalData ? true :false,
                        position: 'bottom',
                        color:'#000',
                    }
                },
                itemStyle:{
                    color:'#FEB622'
                },
                data: this.state.progressInstalling
            },{
                name: '正在下载',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                          
                            return (params.value*100/totalData).toFixed(2)+'%'
                        },
                        show: totalData ? true :false,
                        position: 'bottom',
                        color:'#000'
                    }
                },
                itemStyle:{
                    color:'#4D91F1'
                },
                data: this.state.progressDownloading
            },{
                name: '未下载',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                            return (params.value*100/totalData).toFixed(2)+'%'
                        },
                        show: totalData ? true :false,
                        position: 'bottom',
                        color:'#000'
                    }
                },
                itemStyle:{
                    color:'#d8d8d8'
                },
                data: this.state.progressUndownload
            },{
                name: '暂无数据',
                type: 'bar',
                stack:'总量',
                label: {
                    normal: {
                        formatter:function(params){
                            return '暂无数据'
                        },
                        show: true,
                        position: 'bottom',
                        color:'#000'
                    }
                },
                itemStyle:{
                    color:'#d8d8d8'
                },
                data: this.state.progressNoData
            }]
        };
        myChart.setOption(option);
        myChart.resize();
    }
    leftEcharts = () => {
        let _t=this;
        let width=document.body.clientWidth
        document.getElementById('leftEcharts').style.width=(width-250)/2 -100+'px'
        var leftEcharts = echarts.init(document.getElementById('leftEcharts'));
        // 绘制图表
        let option = {
            title: {
                text: '升级成功率统计',
                left:'left',
                textStyle:{
                    color:'#333',
                    fontSize:'17',
                    fontWeight:'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {d}%"
            },
            color:this.state.leftColor,
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                selectedMode:false,
                data:['升级成功','升级失败','升级中']
            },
            series: [
                {
                    name:'升级成功率统计',
                    type:'pie',
                    radius: ['50%', '70%'],
                    label: {
                        normal:{
                            formatter: '{b}: {c} ( {d}% )',
                            color:"#000"
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:this.state.updateData
                }
            ]
        };
        leftEcharts.setOption(option);
        leftEcharts.resize();
        leftEcharts.on('click',function(params){
            _t.setState({
                tabkey: '2',
                data:[],
                total:0,
                current:1
            })
            if( params.name === '升级成功' ){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),11)
            }else if(params.name === '升级失败'){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),12)
            }else if(params.name === '升级中'){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),-2)
            }
        })
    }
    rightEcharts = () => {
        let _t=this;
        let width=document.body.clientWidth
        document.getElementById('rightEcharts').style.width=(width-350)/2 - 100 +'px'
        var rightEcharts = echarts.init(document.getElementById('rightEcharts'));
        // 绘制图表
        let option = {
            title: {
                text: '下载成功率统计',
                left:'left',
                textStyle:{
                    color:'#333',
                    fontSize:'17',
                    fontWeight:'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {d}%"
            },
            color:this.state.rightColor,
            legend: {
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                selectedMode:false,
                data:['未下载','下载成功','下载失败','下载中']
            },
            series: [
                {
                    name:'下载成功率统计',
                    type:'pie',
                    radius: ['50%', '70%'],
                    label: {
                        normal:{
                            formatter: '{b}: {c} ( {d}% )',
                            color:"#000"
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data:this.state.downloadData
                }
            ]
        };
        rightEcharts.setOption(option);
        rightEcharts.resize();
        rightEcharts.on('click',function(params){
            _t.setState({
                tabkey: '2',
                data:[],
                total:0,
                current:1
            })
            if( params.name === '下载成功' ){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),6)
            }else if(params.name === '下载失败'){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),7)
            }else if(params.name === '下载中'){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),5)
            }else if(params.name === '未下载'){
                _t.taskList(_t.state.pageNumber,_t.state.pageSize,_t.state.taskId,_t.props.form.getFieldValue('vin'),-3)
            }
        })
    }
    taskDetail = (taskId) => {
        Axios.post(HttpUrl+'ota-mag/task/getTaskById',{
            'taskId':taskId
        }).then( res => {
            if(res.data.code === '100000'){
                this.setState({
                    taskName:res.data.data.taskName,
                    upgradeSum:res.data.data.upgradeSum,
                    eqmTypeName:res.data.data.eqmTypeName,
                    minFromVersion:res.data.data.minFromVersion,
                    targetVersion:res.data.data.targetVersion,
                    updateType:res.data.data.updateType=='1' ? '修正' :
                               res.data.data.updateType=='2' ? '建议' :
                               res.data.data.updateType=='3' ? '新功能' : '',
                    updateModel:res.data.data.updateModel=='1' ? '静默升级' : 
                                res.data.data.updateModel=='2' ? '提示升级' : '',
                    fileName:res.data.data.fileName,
                    certificateFlag:res.data.data.certificateFlag=='0' ? '默认证书':
                                    res.data.data.certificateFlag=='1' ? '新证书' :
                                    res.data.data.certificateFlag=='2' ? '不加密' : '',
                    sceneFlag:res.data.data.sceneFlag=='0' ? '出厂前升级' :
                              res.data.data.sceneFlag=='1' ? '安装成功' :
                              res.data.data.sceneFlag=='2' ? '安装成功，立即重启' : 
                              res.data.data.sceneFlag=='3' ? '3分钟后重启' : '',
                    upgradeAging:res.data.data.upgradeAging,
                    setEndTime:res.data.data.setEndTime,
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    taskList = (pageNumber,pageSize,taskId,vin,status) => {
        Axios.post(HttpUrl+'ota-mag/task/getSubTaskList',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'taskId':taskId,
            'vin':vin,
            'status':status
        }).then( res => {
            if(res.data.code ==='100000'){
                if( res.data.data){
                    for(let i=0;i<res.data.data.list.length;i++){
                        res.data.data.list[i].number=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                        res.data.data.list[i].key=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                    }
                    this.setState({
                        data:res.data.data.list,
                        total:res.data.data.total,
                        current:pageNumber,
                        loading:false
                    })
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    taskProgress = (taskId) => {
        Axios.post(HttpUrl+'ota-mag/task/progress',{
            'taskId':taskId
        }).then( res => {
            if(res.data.code ==='100000'){
                let undownload=[]
                let success=[]
                let fail=[]
                let installing=[]
                let downloading=[]
                let progressTotalData=0
                let nodata=0
                for(let i=0;i<Object.values(res.data.data).length;i++){
                    nodata+=Object.values(res.data.data)[i]
                }
                if(!nodata == 0 ){
                    undownload.push(res.data.data.undownload)
                    success.push(res.data.data.success)
                    fail.push(res.data.data.fail)
                    installing.push(res.data.data.installing)
                    downloading.push(res.data.data.downloading)
                    for(let i=0;i<Object.keys(res.data.data).length; i++){
                        progressTotalData+=Number(res.data.data[Object.keys(res.data.data)[i]])
                    }
                    this.setState({
                        progressUndownload:undownload,
                        progressSuccess:success,
                        progressFail:fail,
                        progressDownloading:downloading,
                        progressInstalling:installing,
                        progressTotalData:progressTotalData
                    })
                    this.setEcharts()
                }else{
                    this.setState({
                        progressUndownload:[0],
                        progressSuccess:[0],
                        progressFail:[0],
                        progressDownloading:[0],
                        progressInstalling:[0],
                        progressNoData:[100],
                        progressTotalData:0
                    })
                    this.setEcharts()
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    taskRadio = (taskId) => {
        Axios.post(HttpUrl+'ota-mag/task/getUpdateSuccessRatio',{
            'taskId':taskId
        }).then( res => {
            if(res.data.code ==='100000'){
                let updateData=[]
                let length=res.data.data.length
                for(let i=0;i<length;i++){
                    updateData.push({name:res.data.data[i][0],value:res.data.data[i][1]})
                }
                if(updateData.length === 0){
                    this.setState({
                        updateData:[{name:'暂无数据',value:0}],
                        leftColor:["#d8d8d8"]
                    })
                }else {
                    if(updateData[0].value === updateData[1].value === updateData[2].value === 0){
                        this.setState({
                            updateData:[{name:'暂无数据',value:0}],
                            leftColor:["#d8d8d8"]
                        })
                    }else{
                        this.setState({
                            updateData:updateData,
                            leftColor:['#4EC185',  '#F1615B', '#4D91F1']
                        })
                    }
                }
                this.leftEcharts()
            }else{
                message.warning(res.data.message)
            }
        })
    }
    taskDown = (taskId) => {
        Axios.post(HttpUrl+'ota-mag/task/getFileDownloadSuccessRatio',{
            'taskId':taskId
        }).then( res => {
            if(res.data.code ==='100000'){
                let downloadData=[]
                let length=res.data.data.length
                for(let i=0;i<length;i++){
                    downloadData.push({name:res.data.data[i][0],value:res.data.data[i][1]})
                }
                if(downloadData.length === 0){
                    this.setState({
                        downloadData:[{name:'暂无数据',value:0}],
                        rightColor:["#d8d8d8"]
                    })
                }else{
                    if(downloadData[0].value == downloadData[1].value == downloadData[2].value == downloadData[3].value === 0){
                        this.setState({
                            downloadData:[{name:'暂无数据',value:0}],
                            rightColor:["#d8d8d8"]
                        })
                    }else{
                        this.setState({
                            downloadData:downloadData,
                            rightColor:['#d8d8d8','#4EC185',  '#F1615B', '#4D91F1']
                        })
                    }
                }
                this.rightEcharts()
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //查询
    query = () => {
        this.taskList(this.state.pageNumber,this.state.pageSize,this.state.taskId,this.props.form.getFieldValue('vin'))
    }
    clearCondition = () => {
        this.props.form.resetFields()
        this.taskList(this.state.pageNumber,this.state.pageSize,this.state.taskId)
    }
    //分页
    onChange = (pageNumber) => {
        this.taskList(pageNumber,this.state.pageSize,this.state.taskId,this.props.form.getFieldValue('vin'))
    }
    //查看详情
    viewDetail = (record,check) => {
        this.form.logs(record,check)
    }
    viewHistory = (record,check) => {
        this.form.logs(record,check)
    }
    tabchange = (activeKey) => {
        this.setState({
            tabkey: activeKey
        })
        //此次的数据会覆盖掉点击饼图所产生的数据
        if(activeKey === '2'){
            this.taskList(this.state.pageNumber,this.state.pageSize,this.state.taskId)
        }else{
            this.setEcharts()
            this.leftEcharts()
            this.rightEcharts()
        }
    }
    //刷新
    reload = () => {
        this.setState({
            data:[],
            eqmTypeName:'',
            minFromVersion:'',
            targetVersion:'',
            updateType:'',
            updateModel:'',
            fileName:'',
            upgradeValidTime:'',
            certificateFlag:'',
            sceneFlag:''
        })
        this.taskRadio(this.props.location.state.query.record)
        this.taskDown(this.props.location.state.query.record)
        this.taskProgress(this.props.location.state.query.record)
        this.taskDetail(this.props.location.state.query.record)
        this.taskList(this.state.pageNumber,this.state.pageSize,this.props.location.state.query.record)
    }
    //中国标准时间转化为yy-mm-dd
    transformDate = (date) => {
        const d=new Date(date)
        const year= d.getFullYear()
        const month=( (d.getMonth()+1)>9 ? (d.getMonth()+1) :'0'+(d.getMonth()+1))
        const day=d.getDate()>9 ? d.getDate():'0'+d.getDate();
        const h=d.getHours()>9 ? d.getHours() : '0' + d.getHours()
        const minus=d.getMinutes()>9 ?d.getMinutes() : '0' +d.getMinutes()
        const second=d.getSeconds()>9 ? d.getSeconds() : '0' +d.getSeconds()
        return (year+'-'+month+'-'+day + ' ' + h + ':' + minus + ':' + second)
    }
    //终止子任务
    stop = (record) => {
        Axios.post(HttpUrl+'ota-mag/task/stopSub',{
            'taskId':this.state.taskId,
            'subTaskId':record.taskId
        }).then(res => {
            if(res.data.code === '100000'){

            }else{
                message.warning(res.data.message)
            }
        })
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const menuid=this.props.match.params.menuid
        return (
        <div  className="content">
            <div className='content-title'>
                <div style={{position:'relative',display:'inline-block',background:'#3689FF',fontSize:'13px', borderRadius:'0 20px 20px 0px',color:"#fff",padding:'5px 10px',left:'-32px',top:'-10px'}}>
                    {
                        this.state.taskName
                    }
                    <span>任务</span>
                </div>
                <div>
                    <div className='taskLabel'>设备类型：</div>
                    <div className='taskValue'>{this.state.eqmTypeName}</div>
                    <div className='taskLabel'>可升级版本：</div>
                    <div className='taskValue ' title={this.state.minFromVersion} >{this.state.minFromVersion}</div>
                    <div className='taskLabel'>目标版本号：</div>
                    <div className='taskValue'>{this.state.targetVersion}</div>
                    <div className='taskLabel'>文件名：</div>
                    <div className='taskValue' style={{width:'210px'}}>{this.state.fileName}</div>
                    <div className='taskLabel'>证书：</div>
                    <div className='taskValue'>{this.state.certificateFlag}</div>
                </div>
                <div>   
                    <div className='taskLabel'>更新类型：</div>
                    <div className='taskValue'>{this.state.updateType}</div>
                    <div className='taskLabel'>更新模式：</div>
                    <div className='taskValue'>{this.state.updateModel}</div>
                    <div className='taskLabel'>升级场景：</div>
                    <div className='taskValue'>{this.state.sceneFlag}</div>
                    <div className='taskLabel'>升级时效：</div>
                    <div className='taskValue' style={{width:'210px'}}>{this.state.upgradeAging}</div>
                </div>
                <style>
                    {` 
                        .box-div{float:left;margin-top: 30px;}
                        Button{margin-left:12px;}
                        .ant-table-tbody > tr > td{padding:10px 15px !important;}
                        .ant-table-thead > tr > th{padding:10px 15px !important;}
                        .ant-form-item{margin-top:10px;}
                        .ownerdetail .ant-input{border:none !important;}
                        .gutter-box .ant-form label{font-size:14px !important;}
                        .retimeBg{background:#666;border-radius:2px;color:#fff;display:inline-block;width:16px;height:22px;text-align:center;line-height:22px;margin-right:3px;margin-left:3px;}
                        .taskLabel{width:85px;text-align:left;display:inline-block;font-size:14px;margin-bottom:0px;line-height:40px;}
                        .taskValue{width:110px;text-align:left;display:inline-block;font-size:14px;margin-bottom:-2px;white-space:nowrap;text-overflow: ellipsis;overflow:hidden;line-height:12px;}
                    `}
                </style>
            </div>
            <div className='table' style={{marginTop:'10px'}}>
                        <Tabs activeKey={ this.state.tabkey } onChange={ this.tabchange} type="card"> 
                            <TabPane tab="升级概览"  key="1" style={{padding:'10px'}}>
                                <br/>
                                <div className='upgradeTitle'>
                                    <div style={{width:'4px',height:'18px',background:'#3689FF',position:'relative',left:'-20px',top:'39px'}}></div>
                                    <Form layout='inline' style={{textAlign:'right'}}>
                                        <FormItem label="升级车辆数" style={{float:'left'}}>
                                            <span style={{marginRight:'5px',color:"#409EFF",fontSize:'17px'}}>
                                                {
                                                    this.state.upgradeSum
                                                }
                                                <span>台</span>
                                            </span>
                                        </FormItem>
                                            &nbsp;&nbsp;
                                        {   
                                            this.state.taskStatusStr == '任务已结束' ? '' : 
                                            <Timer wrappedComponentRef={(form) => this.form = form}  time={this.state.setEndTime}></Timer>
                                        }
                                        &nbsp;&nbsp;
                                        <FormItem>
                                            <Icon type="reload" theme="outlined" style={{color:"#409EFF"}} onClick={ this.reload} />
                                        </FormItem>
                                    </Form>
                                </div>
                            
                                <div style={{margin:'48px 0px'}}>
                                    <div className='leftColumn'></div>
                                    <div id='progress' style={{ height: 130,margin:'auto'}}>

                                    </div>
                                </div>
                                <div className='leftColumn'></div>
                                <div style={{display:'inline-block'}}>
                                    <div id='leftEcharts' style={{height: 300}}>

                                    </div>
                                </div>
                                <div style={{display:'inline-block',float:'right',marginRight:'3%'}}>
                                    <div id='rightEcharts' style={{height: 300}}>

                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="升级详情" key="2" style={{padding:'10px'}} >
                                <Form layout="inline">
                                    <FormItem label="VIN">
                                        { getFieldDecorator('vin')( <Input   autoComplete='off'/>)} 
                                    </FormItem>
                                    <FormItem>
                                        <Button className='btn'  type="primary" onClick={this.query} >查询</Button>
                                        <Button className='btn'  type="primary" onClick={this.clearCondition} ghost>清除条件</Button>
                                    </FormItem>
                                </Form>
                                <br/>
                                <Table  
                                    columns={this.state.columns} 
                                    dataSource={this.state.data} 
                                    loading={this.state.loading} 
                                    total={this.state.total} 
                                    current={this.state.current} 
                                    pageSize={this.state.pageSize}
                                    onChange={this.onChange}
                                    >
                                </Table>
                            </TabPane>
                        </Tabs>
                    
                    <style>
                        {`
                            .upgradeTitle{margin-left:10px;}
                            .upgradeTitle label{font-size:17px !important}
                            .leftColumn{width:4px;height:18px;background:#3689FF;position:relative;left:-10px;top:21px;}
                        `}
                    </style>
                </div>
                <LogModal wrappedComponentRef={(form) => this.form = form}></LogModal>
        </div>
        )
    }
}
const upgradeFile = Form.create()(upgradeFiles);
export default upgradeFile;