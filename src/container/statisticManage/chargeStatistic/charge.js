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
import {errorCallback,randomDay,completeMonth} from './../../../util/permission'
import {btnList,statisticExport,disabledDate} from './../../../util/util'
import {HttpUrl,httpConfig} from '../../../util/httpConfig'
import { resolve } from 'path';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
// 行驶里程按地区 staticd1
// 行驶里程按单车 staticd2
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
        params:'',
        startTime:'',
        endTime:'',
        echartsData1:[],
        echartsData2:[],
        labelLegend1:[],
        btnList:"",
        totalSum:'',
        totalSum2:''
    }
    componentDidMount(){
        window.onresize = () =>{
            if( this.state.tabKey === '1'){
                this.setEcharts(this.state.params.startTime,this.state.params.endTime)
            }else if(this.state.tabKey === '2'){
                this.setEcharts2(this.state.startTime,this.state.endTime)
            }
        }
        btnList(this)
    }
    setEcharts2 = (startTime,endTime) => {
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
        var div=document.getElementById('echarts2')
        document.getElementById('echarts2').style.width=width-250+'px'
        var myChart = echarts.init(div);
        // 绘制图表
        myChart.setOption({
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'left',
                text: '充电时长(h)',
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
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
            series: [
                {
                    // name:'充电时长',
                    type:'line',
                    smooth:true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        }, {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }])
                    },
                    data: this.state.echartsData2
                }
            ]
        },true);
        myChart.resize();
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
                text: '车辆充电总时长统计（h）',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                show:true
            },
            legend: {
                data:this.state.labelLegend1,
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
            series:  this.state.echartsData1
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
                    new Promise(resolve => {
                        let {startTime,endTime}=completeMonth(1)
                        this.setEcharts2(startTime,endTime)
                        this.setState({
                            startTime:startTime,
                            endTime:endTime
                        })
                        resolve(true)
                    }).then(v => {
                        if(v){
                            let date=new Date(new Date(this.state.endTime).getTime()-24*3600*1000)
                            let year=date.getFullYear()
                            let month=date.getMonth()+1
                            let day=date.getDate()
                            let hours=date.getHours()
                            let minutes=date.getMinutes()
                            let seconds=date.getSeconds()
                            let endTime2=year+'-'+month+'-'+(day) +' '+ hours +':'+ minutes+ ':'+seconds
                            this.props.form.setFieldsValue({'searchTime':[moment(this.state.startTime),moment(endTime2)]})
                        }
                    })
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
        return  Axios.post(HttpUrl+'data/recharge/statistics',{
            'startTime':obj.startTime,
            'endTime':obj.endTime,
            'province':obj.province,
            'city':obj.city,
            'carModelId':obj.carModelId
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.list.length;
                let echartsData=[]
                let labelLegend=[]
                //判断是省份还是全国
                if(res.data.data.list[0].city){
                    for(let i=0;i<length;i++){
                        echartsData.push({
                            name:res.data.data.list[i].city,
                            type:'line',
                            data:res.data.data.list[i].sumKm
                        })
                        labelLegend.push(res.data.data.list[i].city)
                    }
                }else{
                    for(let i=0;i<length;i++){
                        echartsData.push({
                            name:res.data.data.list[i].province,
                            type:'line',
                            data:res.data.data.list[i].amount
                        })
                        labelLegend.push(res.data.data.list[i].province)
                    }
                }
                this.setState({
                    echartsData1:echartsData,
                    labelLegend1:labelLegend
                })
                return true
            }else{
                errorCallback(res.data.code)
            }
            
        })
    }
    //tab中的第二个统计
    search = () => {
        new Promise(resolve => {
            resolve(Axios.post(HttpUrl+'data/recharge/select',{
                'startTime':(new Date(this.state.startTime)).getTime(),
                'endTime':(new Date(this.state.endTime)).getTime(),
                'message':this.props.form.getFieldValue('keyWord')
            }).then(res => {
                if(res.data.code === '100000'){
                    this.setState({
                        echartsData2:res.data.data.amount,
                        totalSum2:res.data.data.sum
                    })
                    return true
                }else{
                    errorCallback(res.data.code)
                }
            }))
        }).then(v => {
            if(v){
                this.setEcharts2(this.state.startTime,this.state.endTime)
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
    }
    clearCondition = () => {
        this.setState({
            startTime:'',
            endTime:'',
        })
        this.props.form.resetFields()
    }
    //导出
    export = () => {
        if(this.state.tabKey === '1'){
            this.form.export('data/recharge/statistics/export')
        }else{
            if(!this.props.form.getFieldValue('keyWord') || this.props.form.getFieldValue('searchTime').length ==0){
                message.warning('请先输入统计条件')
            }else{
                Axios.post(HttpUrl+'data/recharge/select/export',{
                    'startTime':(new Date(this.state.startTime)).getTime(),
                    'endTime':(new Date(this.state.endTime)).getTime(),
                    'message':this.props.form.getFieldValue('keyWord')
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
    render() {
        const { getFieldDecorator }=this.props.form
        return (
        <div className="content statistic" >
            <Tabs type="card" onChange={ this.tabChange} >
                <TabPane tab="按地区" key="1">
                <Common wrappedComponentRef={(form) => this.form = form} whatTime='short' orShowTime='false,false' onRef={this.onRef} btnList={this.state.btnList.includes('chargeListA')}></Common>
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
                                {
                                    this.state.btnList.includes('chargeListB') ? 
                                    <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                                    : ''
                                }
                                <Button type="primary" className='btn clearBtn'  ghost onClick={this.clearCondition}>清除条件</Button>
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
                            this.state.btnList.includes('chargeExportA') ?
                            <Button type="primary" className='btn' onClick={ this.export} ghost>
                                <img src={exports} alt="" />
                                导出
                            </Button>
                            : ''
                        )
                        :(
                            this.state.btnList.includes('chargeExportB') ?
                            <Button type="primary" className='btn' onClick={ this.export} ghost>
                                <img src={exports} alt="" />
                                导出
                            </Button>
                            : ''
                        )
                    }
                </div>
               <div className='table' style={{border:'1px solid #EBEDF8',padding:'34px 0px',background:"#fff"}}>
                    <div style={{display:this.state.tabKey === '1' ? 'block' : 'none'}}>
                        <div id='echarts' style={{ height: 500,margin:'auto'}}>

                        </div>
                    </div>
                    <div style={{display:this.state.tabKey === '2' ? 'block' : 'none'}}>
                        <div id='echarts2' style={{ height: 500,margin:'auto'}}>

                        </div>
                        <div style={{width:'95%',textAlign:'right',marginTop:'20px'}}>总里程：{this.state.totalSum2}km</div>
                    </div>
               </div>
            </div>
            <style>
                {`
                    .statistic .ant-tabs-bar{margin:0px !important;}
                    .statistic .content-title {border-top:none;}
                    .ant-tabs{overflow:inherit}
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;