/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Collapse ,Form, Select, Button ,DatePicker ,Input,message} from 'antd';
import Common from '../common/common'
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
import {HttpUrl,httpConfig} from '../../../util/httpConfig'
import {btnList,statisticExport} from './../../../util/util'
import moment from 'moment';
import nodata1 from './../../../img/nodata1.png'
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class distribution extends Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        startTime:'',
        endTime:'',
        btnList:''
    }

    componentDidMount(){
        let _that=this
        this.props.form.setFieldsValue({'searchTime':[moment(),moment()]})
        setTimeout(() => {
            _that.props.form.resetFields()
        },10)
        window.onresize = () =>{
            this.setEcharts(this.state.startTime,this.state.endTime)
        }
        btnList(this)
    }
    list = (startTime,endTime) => {
        let startTime1=new Date(startTime)
        let endTime1=new Date(endTime)

        startTime1.setDate(1)
        startTime1.setHours(0)
        startTime1.setMinutes(0)
        startTime1.setMinutes(0)

        endTime1.setMonth(endTime1.getMonth() +1)
        endTime1.setDate(1)
        endTime1.setHours(0)
        endTime1.setMinutes(0)
        endTime1.setMinutes(0)

        Axios.post(HttpUrl+'data/mileage/select',{
            'startTime': startTime ? new Date(startTime1).getTime() : null,
            'endTime':endTime ? new Date(endTime1).getTime() :  null,
            'message':this.props.form.getFieldValue('keyword')
        }).then(res => {
            if(res.data.code === '100000'){
                let echartsData=[]
                echartsData.push({
                    name:'',
                    type:'line',
                    data:res.data.data.amount
                })
                this.setState({
                    echartsData:echartsData,
                    amount:res.data.data.amount
                })
                this.setEcharts(startTime,endTime)
            }else{
                message.warning(res.data.message)
            }
        })
    }
    setEcharts = (startTime,endTime,echartsData) => {
        var base = new Date(startTime);
        var base2 = new Date(endTime);

        let length=(base2.getFullYear()-base.getFullYear())*12 + (base2.getMonth()-base.getMonth())
        var date = [];
        for (var i = 0; i <=length; i++) {
            var now
            now = new Date(base);
            now.setMonth(now.getMonth() +i);
            date.push([now.getFullYear(), now.getMonth() + 1].join('/'));
        }
        let width=document.body.clientWidth
        document.getElementById('echarts').style.width=width-250+'px'
        var myChart = echarts.init(document.getElementById('echarts'));
        // 绘制图表
        myChart.setOption({
            title: {
                text: '单车续航里程变化分析',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                show:true
            },
            legend: {
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
            series:this.state.echartsData
        },true);
        myChart.resize();
    }
    //时间选择
    handlePanelChange = (value,mode) => {
        this.setState({
            startTime:(new Date(value[0])).getTime(),
            endTime:(new Date(value[1])).getTime()
        })
        this.props.form.setFieldsValue({'searchTime':[moment((new Date(value[0])).getTime()),moment((new Date(value[1])).getTime())]})
    }
    search = () => {
        this.list(this.state.startTime,this.state.endTime)
    }
    //导出
    export = () => {
        let startTime1=new Date(this.state.startTime)
        let endTime1=new Date(this.state.endTime)
        startTime1.setDate(1)
        startTime1.setHours(0)
        startTime1.setMinutes(0)
        startTime1.setSeconds(0)
        
        endTime1.setMonth(endTime1.getMonth() +1)
        endTime1.setDate(1)
        endTime1.setHours(0)
        endTime1.setMinutes(0)
        endTime1.setSeconds(0)
        if(!this.props.form.getFieldValue('keyword') || this.props.form.getFieldValue('searchTime').length === 0 ){
            message.warning('请先输入统计条件')
        }else{
            Axios.post(HttpUrl+'data/mileage/select/export',{
                'startTime':new Date(startTime1).getTime(),
                'endTime':new Date(endTime1).getTime(),
                'message':this.props.form.getFieldValue('keyword') || null
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
    clearCondition = () => {
        this.props.form.resetFields()
        this.setState({
            startTime:'',
            endTime:''
        })
    }
    render() {
        const { mode ,value } = this.state;
        const { getFieldDecorator }=this.props.form
        return (
        <div className="content" >
            <div className='content-title'>
                <Form layout="inline">  
                    <div className='searchType' style={{width:'100%'}}>
                        <FormItem label="统计时间">
                            { getFieldDecorator('searchTime',{
                                initialValue:this.state.startTime ? [moment(this.state.startTime),moment(this.state.endTime)] : ''
                            })( <RangePicker
                                placeholder={['起始时间', '结束时间']}
                                format="YYYY-MM"
                                getCalendarContainer={triggerNode => triggerNode.parentNode}
                                style={{width:'300px'}} 
                                mode={['month','month']}
                                onPanelChange={this.handlePanelChange}
                                //   onChange={this.dateChange}
                            />)}
                        </FormItem>
                        <FormItem label="关键字">
                            { getFieldDecorator('keyword')( <Input placeholder='车牌号、VIN、终端SN' autoComplete='off'/>)}
                        </FormItem>
                        {
                            this.state.btnList.includes('enduranceList') ? 
                            <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                            : ''
                        }
                        <Button type="primary" className='btn clearBtn'   ghost onClick={this.clearCondition}>清除条件</Button>
                    </div>
                </Form>
            </div>   
            <div>
                <div  className='oprateHead'>
                {
                    this.state.btnList.includes('enduranceExport') ?
                    <Button type="primary" className='btn' onClick={ this.export} ghost>
                        <img src={exports} alt="" />
                        导出
                    </Button>
                    : ''
                }
                </div>
               <div className='table' style={{border:'1px solid #EBEDF8',padding:'34px 0px',background:"#fff"}}>
                    {
                        this.state.echartsData ? 
                            <span style={{position:'relative',top:'70px',left:'3%'}}>km</span>
                        : ''
                    }
                    <div>
                        <div id='echarts' style={{ height: 500,margin:'auto'}}>

                        </div>
                    </div>
                    {
                        this.state.echartsData ?
                            ''
                        : 
                        <div className='dataStatus' >
                            <img src={nodata1} alt=""/>
                            <div >温馨提示：请输入查询条件进行查询</div>
                        </div>
                    }
               </div>
            </div>
            <style>
                {`
                    .dataStatus{width:260px;text-align:center;position:absolute;left:45%;top:45%;}
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;