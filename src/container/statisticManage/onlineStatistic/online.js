/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Form ,Tabs,Select, Button,DatePicker, Input,message } from 'antd';
import Common from '../common/common'
import moment from 'moment';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/grid';
import exports from './../../../img/exports.png'
import  Table  from "./../../../component/table/table";
import {HttpUrl,httpConfig} from '../../../util/httpConfig'
import {disabledDate} from './../../../util/util'
import {errorCallback,randomDay} from './../../../util/permission'
import {btnList,statisticExport} from './../../../util/util'
import { resolve } from 'path';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
// 车辆在线统计按地区 staticb1
// 车辆在线统计按单车 staticb2
class distribution extends Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:false,
        tabKey:'1',
        startTime:'',
        endTime:'',
        params:'',
        echartsData:[],
        labelLegend:[],
        btnList:[],
        columns:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '车牌号',dataIndex: 'plateNo',className:'clounWidth'},
            { title: 'VIN',dataIndex: 'vin',className:'clounWidth'},
            { title: '车主姓名及电话',dataIndex: 'msg' ,className:'clounWidth'},
            { title: '日平均在线时间长(h)',dataIndex: 'duration',className:'clounWidth'}]
    }
    componentDidMount(){
        window.onresize = () =>{
            this.setEcharts(this.state.params.startTime,this.state.params.endTime)
        }
        btnList(this)
    }
    setEcharts = (startTime,endTime) => {
        var base = +new Date(startTime);
        var base2 = new Date(endTime);
        let length=Math.floor((base2-base)/(24 * 3600 * 1000))
        var oneDay = 24 * 3600 * 1000;
        var date = [];

        for (var i = 0; i <length; i++) {
            var now
            if(i>0){
                now = new Date(base += oneDay);
            }else{
                now = new Date(base);
            }
            date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        }

        let width=document.body.clientWidth
        document.getElementById('echarts').style.width=width-250+'px'
        var div=document.getElementById('echarts')
        var myChart = echarts.init(div);
        // 绘制图表
        myChart.setOption({
            title: {
                text: '车辆在线数量统计（辆）',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                show:true
            },
            legend: {
                data:this.state.labelLegend,
                bottom: 50
            },
            grid: {
                left: '5%',
                right: '7%',
                bottom: '15%',
                containLabel: true
            },
            dataZoom: [{
                show:true, 
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 100,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value'
            },
            series: this.state.echartsData
        },true);
        myChart.resize();
    }
    //tab切换
    tabChange = (e) => {
        new Promise(resolve => {
            this.setState({
                tabKey:e
            })
            resolve(true)
        }).then(res => {
            if(res){
                if( e === '1'){
                    this.setEcharts(this.state.params.startTime,this.state.params.endTime)
                }else if(e === '2'){
                    let date=new Date()
                    let year=date.getFullYear()
                    let month=date.getMonth()+1
                    let day=date.getDate()
    
                    date.setMonth(date.getMonth()-1);
                    let year2=date.getFullYear()
                    let month2=date.getMonth()+1
                    let day2=date.getDate()
                    
                    this.setState({
                        startTime:year2+'-'+month2+'-'+day2,
                        endTime:year+'-'+month+'-'+day
                    })
                    this.props.form.setFieldsValue({'searchTime':[moment(year2+'-'+month2+'-'+day2),moment(year+'-'+month+'-'+day)]})
                    this.list(this.state.pageNumber,this.state.pageSize)
                }
            }
        })
    }
    onRef = (obj) => {
        this.setState({
            params:obj
        })
        this.tongji(obj)
        this.setEcharts(obj.startTime,obj.endTime)
        // new Promise(resolve => {
        //     resolve(this.tongji(obj))
        // }).then( v => {
        //     if(v){
        //         this.setEcharts(obj.startTime,obj.endTime)
        //     }
        // })
    }
    //统计
    tongji = (obj) => {
        return  Axios.post(HttpUrl+'data/login/statistics',{
            'startTime':obj.startTime,
            'endTime':obj.endTime,
            'province':obj.province,
            'city':obj.city,
            'carModelId':obj.carModelId,
            'recordHour':obj.recordHour
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let echartsData=[]
                let labelLegend=[]
                //判断是省份还是地市
                if(res.data.data[0].city){
                    for(let i=0;i<length;i++){
                        echartsData.push({
                            name:res.data.data[i].city,
                            type:'line',
                            data:res.data.data[i].amount
                        })
                        labelLegend.push(res.data.data[i].city)
                    }
                }else{
                    for(let i=0;i<length;i++){
                        echartsData.push({
                            name:res.data.data[i].province,
                            type:'line',
                            data:res.data.data[i].amount
                        })
                        labelLegend.push(res.data.data[i].province)
                    }
                }
                this.setState({
                    echartsData:echartsData,
                    labelLegend:labelLegend
                })
                return true
            }else{
                errorCallback(res.data.code)
            }
            
        })
    }
    //tab中的第二个统计
    search = () => {
        this.list(this.state.pageNumber,this.state.pageSize)
    }
    list = (pageNumber,pageSize) => {
        Axios.post(HttpUrl+'data/login/online',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'startTime':(new Date(this.state.startTime)).getTime(),
            'endTime':(new Date(this.state.endTime)).getTime(),
            'message':this.props.form.getFieldValue('keyWord') || null,
            'duration':this.props.form.getFieldValue('duration') || null
        }).then(res => {
            if(res.data.code === '100000'){
                console.log(res)
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                    res.data.data.list[i].key=i+1+(this.state.pageNumber-1)*this.state.pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.total,
                    current:pageNumber,
                })
                return true
            }else{
                errorCallback(res.data.code)
            }
        })
    }
    //时间选择
    dateChange = (moment,dateStrings,string) => {
        let { startTime,endTime}=randomDay(dateStrings)
        this.setState({
            startTime:startTime,
            endTime:endTime
        })
        // this.list(this.state.pageNumber,this.state.pageSize)
    }
    //导出
    export = () => {
        if(this.state.tabKey === '1'){
            this.form.export('data/login/statistics/export')
        }else{
            if(!this.props.form.getFieldValue('keyWord') || this.props.form.getFieldValue('searchTime').length ==0 ){
                message.warning('请先输入统计条件')
            }else{
                Axios.post(HttpUrl+'data/login/online/export',{
                    'startPage':1,
                    'pageSize':-1,
                    'startTime':(new Date(this.state.startTime)).getTime(),
                    'endTime':(new Date(this.state.endTime)).getTime(),
                    'message':this.props.form.getFieldValue('keyWord') || null,
                    'duration':this.props.form.getFieldValue('duration') || null
                },{
                    responseType: 'blob'
                    }).then(res => {
                        if(res.data.size>0){
                            statisticExport(res)
                        }else{
                            message.warning('数据为空')
                        }
                })
            }   
        }
    }
    clearCondition = () => {
        this.props.form.resetFields()
        this.setState({
            startTime:'',
            endTime:''
        })
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize)
    }
    render() {
        const { getFieldDecorator }=this.props.form
        return (
        <div className="content statistic" >
            <Tabs type="card" onChange={ this.tabChange} >
                <TabPane tab="按地区" key="1">
                <Common wrappedComponentRef={(form) => this.form = form} whatTime='short' orShowTime='true,shiduan' onRef={this.onRef} btnList={this.state.btnList.includes('onlineListA')}></Common>
                </TabPane>
                <TabPane tab="按单车" key="2"> 
                    <div  className='content-title'>
                        <Form layout="inline">  
                            <div className='searchType' style={{width:'100%'}}>
                                <FormItem label="统计时间">
                                    { getFieldDecorator('searchTime')( <RangePicker
                                        getCalendarContainer={triggerNode => triggerNode.parentNode}
                                        style={{width:'240px'}} 
                                        disabledDate={disabledDate}
                                        onChange={this.dateChange}
                                        format="YYYY-MM-DD"
                                    />)}
                                </FormItem>
                                <FormItem label="关键字">
                                    { getFieldDecorator('keyWord')( <Input placeholder='车牌号、VIN、终端SN' autoComplete='off'/>)}
                                </FormItem>
                                <FormItem label="日平均在线时间长小于(h)" className='hours'>
                                    { getFieldDecorator('duration')( <Input  autoComplete='off'/>)}
                                </FormItem>
                                {
                                    this.state.tabKey === '1' ? 
                                    (
                                        this.state.btnList.includes('onlineListA') ? 
                                        <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                                        : ''
                                    )
                                    :(
                                        this.state.btnList.includes('onlineListB') ? 
                                        <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                                        : ''
                                    )
                                }
                                <Button type="primary" className='btn clearBtn'   ghost onClick={this.clearCondition}>清除条件</Button>
                            </div>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
            <div>
                <div  className='oprateHead'>
                    {
                        this.state.tabKey === '1' ? 
                            (
                                this.state.btnList.includes('onlineExportA') ? 
                                <Button type="primary" className='btn' onClick={ this.export} ghost>
                                    <img src={exports} alt="" />
                                    导出
                                </Button>
                                : ''
                            )
                        : (
                            this.state.btnList.includes('onlineExportB') ? 
                                <Button type="primary" className='btn' onClick={ this.export} ghost>
                                    <img src={exports} alt="" />
                                    导出
                                </Button>
                                : ''
                        )


                    }
                </div>
               <div className='table' style={{border:'1px solid #EBEDF8',background:"#fff"}}>
                    <div style={{display:this.state.tabKey === '1' ? 'block' : 'none',padding:'34px 0px'}}>
                        <div id='echarts' style={{ height: 500,margin:'auto'}}>

                        </div>
                    </div>
                    <div style={{display:this.state.tabKey === '2' ? 'block' : 'none'}}>
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading}
                            total={this.state.total}
                            current={this.state.current}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />
                    </div>
               </div>
            </div>
            <style>
                {`
                    .statistic .ant-tabs-bar{margin:0px !important;}
                    .statistic .content-title {border-top:none;}
                    .ant-tabs{overflow:inherit}
                    .hours .ant-form-item-label{width:160px;}
                    .hours .ant-input{width:90px;}
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;