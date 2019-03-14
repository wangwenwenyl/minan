/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
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
import exports from './../../../img/exports.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {errorCallback,completeMonth} from './../../../util/permission'
import {randomDay} from '../../../util/permission'
import {disabledDate,btnList,statisticExport} from './../../../util/util'
import moment from 'moment';
import { resolve, resolveObject } from 'url';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
// 行驶里程按单车 statice
class distribution extends Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        loading:false,
        provinceArr:[],
        selectedProvince:'',
        cityArr:[],
        selectedCity:'',
        carArr:[],
        selectedCar:'',
        labelLegend:'',
        echartsData:'',
        selected:'',
        startTime:'',
        endTime:'',
        btnList:'',
        color:''
    }
    componentDidMount(){
        new Promise(resolve => {
            let {startTime,endTime}=completeMonth(1)
            this.setEcharts(startTime,endTime)
            this.setState({
                startTime:startTime,
                endTime:endTime
            })
            resolve(true)
        }).then(v => {
            if(v){
                this.alarmList()
                let date=new Date(new Date(this.state.endTime).getTime()-24*3600*1000)
                let year=date.getFullYear()
                let month=date.getMonth()+1
                let day=date.getDate()
                let endTime2=year+'-'+month+'-'+day 
                this.props.form.setFieldsValue({'searchTime':[moment(this.state.startTime),moment(endTime2)]})
            }
        })
        window.onresize = () =>{
            this.setEcharts()
        }
        this.getProvince()
        this.carList()
        btnList(this)
    }
    setEcharts = () => {
        let width=document.body.clientWidth
        document.getElementById('echarts').style.width=width-250+'px'
        var myChart = echarts.init(document.getElementById('echarts'));
        // 绘制图表
        let option = {
            title: {
                text: '统计时间段内的报警次数及占比',
                x: 'center'
            },
            color:this.state.color,
            tooltip:{
                trigger: 'item',
                formatter: this.state.color.length === 1 ? '' : "{b}:{c} ({d}%)"
            },
            legend: {
                type:'scroll',
                orient: 'vertical',
                left: 24,
                top: 20,
                bottom: 20,
                data:this.state.labelLegend,
                selected:this.state.selected
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    center: ['53%', '60%'],
                    radius: ['40%', '70%'],
                    label: {
                        emphasis: {
                            textStyle: {
                                fontSize: '14'
                            }
                        }
                    },
                    data:this.state.echartsData
                }
            ]
        };
        myChart.setOption(option,true);
        myChart.resize();
    }
    clearCondition = () => {
        this.setState({
            startTime:'',
            endTime:'',
            cityArr:[]
        })
        this.props.form.resetFields()
    }
    //获取省份
    getProvince = () => {
        Axios.get(HttpUrl+'vehicle/open/v1/area').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let provinceArr=[];
                for(let i=0;i<length;i++){
                    provinceArr.push(<Option key={res.data.data[i].id} value={ res.data.data[i].id+','+res.data.data[i].value }>{ res.data.data[i].value }</Option>)
                }
                this.setState({
                    provinceArr:provinceArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //省份选择
    selectProvince = (e) => {
        this.setState({
            selectedProvince:e.split(',')[1]
        })
        this.getCity(e.split(',')[0])
        this.props.form.setFieldsValue({'city':''})
    }
    //获取地市
    getCity = (id) => {
        Axios.get(HttpUrl+'vehicle/open/v1/area/'+id+'/subset').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let cityArr=[];
                for(let i=0;i<length;i++){
                    cityArr.push(<Option key={res.data.data[i].id} value={ res.data.data[i].id+','+res.data.data[i].value }>{ res.data.data[i].value }</Option>)
                }
                this.setState({
                    cityArr:cityArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //地市选择
    selectCity = (e) => {
        this.setState({
            selectedCity:e.split(',')[1]
        })
    }
    //车型选择
    selectCar = (e) => {
        this.setState({
            selectedCar:e
        })
    }
    //车型列表
    carList = () => {
        Axios.get(HttpUrl+'data/carModel/selectAll').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let carArr=[];
                for(let i=0;i<length;i++){
                    carArr.push(<Option key={res.data.data[i].carModelId} value={ res.data.data[i].carModelId }>{ res.data.data[i].carModelName }</Option>)
                }
                this.setState({
                    carArr:carArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //报警列表
    alarmList = () => {
        Axios.post(HttpUrl+'data/warn/common',{
            'startTime':new Date(this.state.startTime).getTime(),
            'endTime':new Date(this.state.endTime).getTime(),
            'province':this.state.selectedProvince || null,
            'city':this.state.selectedCity || null,
            'carModelId':this.props.form.getFieldValue('carModal') || null
        }).then(res => {
            if(res.data.code === '100000'){
                let echartsData=[]
                let labelLegend=[]
                let selected={}
                let length=res.data.data.length
                let totalAmount=0
                for(let i=0;i<length;i++){
                    labelLegend.push(res.data.data[i].name)
                    echartsData.push({
                        name:res.data.data[i].name,
                        value:res.data.data[i].amount
                    })
                    if(i<5){
                        selected[res.data.data[i].name]=true
                    }else{
                        selected[res.data.data[i].name]=false
                    }
                    totalAmount+=res.data.data[i].amount
                }
                if(totalAmount === 0){
                    echartsData=[]
                    echartsData.push({
                        name:'暂无数据',
                        value:'0'
                    })
                    this.setState({
                        color:['#ddd']
                    })
                }else{
                    this.setState({
                        color:['#36C3FB',  '#F9E03C', '#81BA51','#5077F2', '#EC6552', '#D14794','#C8B379','#27A49B','#724796','#B47029','#00A1E2','#D6833A','#A5A62E','#F47719','#E5B33B','#2D68C5','#9D3A8D','#359CC2','#DA3723']
                    })
                }
                new Promise(resolve => {
                    this.setState({
                        echartsData:echartsData,
                        labelLegend:labelLegend,
                        selected:selected
                    })
                    resolve(true)
                }).then(v => {
                    if(v){
                        this.setEcharts()
                    }
                })
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
    }
    //统计
    search = () => {
        this.alarmList()
    }
    //导出
    export = () => {
        Axios.post(HttpUrl+'data/warn/common/export',{
            'startTime':new Date(this.state.startTime).getTime(),
            'endTime':new Date(this.state.endTime).getTime(),
            'province':this.state.selectedProvince || null,
            'city':this.state.selectedCity || null,
            'carModelId':this.props.form.getFieldValue('carModal') || null
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
    render() {
        const { getFieldDecorator }=this.props.form
        return (
        <div className="content" >
            <div className='content-title'>   
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
                        <FormItem label="省" className='smallLable' >
                        { getFieldDecorator('province')(<Select 
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'160px'}} onSelect={ this.selectProvince}>
                            {
                                this.state.provinceArr
                            }
                        </Select>)}
                        </FormItem>
                        <FormItem label="地市" className='smallLable' >
                        { getFieldDecorator('city')(<Select 
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'160px'}} onSelect={ this.selectCity}>
                            {
                                this.state.cityArr
                            }
                        </Select>)}
                        </FormItem>
                        <FormItem label="车型" className='smallLable'>
                        { getFieldDecorator('carModal')(<Select 
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'160px',marginBottom:'10px'}} onSelect={ this.selectCar}>
                            {this.state.carArr}
                        </Select>)}
                        </FormItem>
                        <div style={{display:'inline-block'}}>
                            {
                                this.state.btnList.includes('alarmList') ?
                                <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                                : ''
                            }
                            <Button type="primary" className='btn clearBtn'  ghost onClick={this.clearCondition} >清除条件</Button>
                        </div>
                    </div>
                </Form>
            </div>
            <div>
                <div  className='oprateHead'>
                {
                    this.state.btnList.includes('alarmExport') ? 
                    <Button type="primary" className='btn' onClick={ this.export} ghost>
                        <img src={exports} alt="" />
                        导出
                    </Button>
                    : ''
                }
                </div>
               <div className='table' style={{border:'1px solid #EBEDF8',padding:'34px 0px',background:"#fff"}}>
                    <div id='echarts' style={{ height: 500,margin:'auto'}}>

                    </div>
               </div>
            </div>
            <style>
                {`
                    .smallLable .ant-form-item-label{width:35px;}
                    .searchType{
                        clear:both;
                        display:table;
                        content:''
                    }
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;