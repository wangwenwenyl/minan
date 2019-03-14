/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Collapse ,Form, Select, Button ,DatePicker,message } from 'antd';
import Common from './../common/common'
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
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {errorCallback} from './../../../util/permission'
import {btnList} from './../../../util/util'
//车辆分布统计 statica
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
        params:'',
        echartsData:[],
        labelLegend:[],
        btnList:[]
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
        var myChart = echarts.init(document.getElementById('echarts'));
        // 绘制图表
        myChart.setOption({
            title: {
                text: '车辆分布统计（辆）',
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
            toolbox: {
                feature: {
                    readOnly:true
                }
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
        return  Axios.post(HttpUrl+'data/address/statistics',{
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

                //判断是省份还是全国
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
    //导出
    export = () => {
        this.form.export('data/address/statistics/export')
    }
    render() {
        return (
        <div className="content">
            <Common wrappedComponentRef={(form) => this.form = form} whatTime='short' orShowTime='true,shike' onRef={this.onRef} btnList={this.state.btnList.includes('distributionList')}></Common>
            <div>
                <div  className='oprateHead'>
                    {
                        this.state.btnList.includes("distributionExport") ? 
                        <Button type="primary" className='btn' onClick={ this.export} ghost>
                            <img src={exports} alt="" />
                            导出
                        </Button>
                        : ''
                    }
                </div>
               <div className='table' style={{border:'1px solid #EBEDF8',padding:'34px 0px',background:"#fff"}}>
                    <div id='echarts' style={{ height: 500,margin:'auto',width:'95%'}}>

                    </div>
               </div>
            </div>
            <style>
                {`
                    
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;