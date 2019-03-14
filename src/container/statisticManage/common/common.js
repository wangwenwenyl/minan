/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import Province from './province'
import City from './city'
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
import ArrowDown from './../../../img/arrow.png'
import close from './../../../img/close.png'
import checkedArrow from './../../../img/checkedArrow.png'
import exports from './../../../img/exports.png'
import {HttpUrl,httpConfig} from '../../../util/httpConfig'
import {randomDay} from '../../../util/permission'
import {disabledDate,statisticExport} from './../../../util/util'
import moment from 'moment';
import { resolveObject, parse } from 'url';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

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
        collapseStatus:false,
        timeMoreNum:false,
        modelMoreNum:false,
        timeSource:[],
        timeArr:[],
        timeArr2:[],
        timeLongArr:['7day'],
        provinceArr:[],
        provinceArr2:[],
        weiduArr:['province'],
        provinceSelected:[<div className='checks' key={'quanguo'}  style={{border: '1px solid #E4E4E4',color:'#999'}}   > 
        全国
        <img src={  close } alt="" className='remove-img' style={{width:'10px'}} id='1' onClick={ (e) => this.deleteProvince(e)}/>
        </div>],
        province:['全国'],//默认弹窗全国选中
        city:[],
        citySelected:[],
        carArr:[],
        carArr2:[],
        weiduFlag:'省份',
        startTime:'',
        endTime:'',
        timeBoxWidth:'',
        timeInnerBoxWidth:'',
        clearFlag:false//此条件判断是否点击清除,
    }
    componentDidMount(){
        this.timeList(true)
        this.carList(true)
        new Promise(resolve => {
            if(this.props.whatTime === 'short'){
                this.timeConnect(7)
            }else{
                this.timeConnect(15)
            }
            resolve(true)
        }).then(v => {
            if(v){
                this.props.onRef({
                    'startTime':(new Date(this.state.startTime)).getTime(),
                    'endTime':(new Date(this.state.endTime)).getTime(),
                    'province':this.state.province.length>0  ? this.state.province : [] ,
                    'city':this.state.city.length>0 ?this.state.city : [],
                    'carModelId':this.state.carArr2.length>0 ? this.state.carArr2 : [],
                    'recordHour':this.props.orShowTime.split(',')[1] === 'shike' ? 
                                                                        this.state.timeArr2.length>0  ? Number(this.state.timeArr2[0].split(':')[0])  : -1 
                                                                        : this.state.timeArr2.length>0 ? Number(this.state.timeArr2[0].split('-')[1].split(':')[0]) : -1
                });
            }
        })
        //默认时间段的选择
        if(this.props.whatTime === 'long'){
            this.setState({
                timeLongArr:['15day']
            })
        }
    }
    clearCondition = () => {
        this.setState({
            clearFlag:true
        })
        this.props.form.setFieldsValue({'searchTime':''})
        new Promise(resolve => {
            this.setState({
                timeSource:[],
                timeArr:[],
                timeArr2:[],
                timeLongArr:[],
                provinceArr:[],
                provinceArr2:[],
                weiduArr:['province'],
                provinceSelected:[],
                province:['全国'],//默认弹窗全国选中
                city:[],
                citySelected:[],
                carArr:[],
                carArr2:[],
                weiduFlag:'省份',
                startTime:'',
                endTime:''
            })
            resolve(true)
        }).then(v => {
            if(v){
                this.timeList(false)
                this.carList(false)
            }
        })
    }
    timeList = (a) => {
        new Promise(resolve => {
            if(this.props.orShowTime.split(',')[1] === 'shike'){
                this.setState({
                    timeSource:['0:00','2:00','4:00','6:00','8:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'],
                })
            }else if(this.props.orShowTime.split(',')[1] === 'shiduan'){
                this.setState({
                    timeSource:['0:00-2:00','2:00-4:00','4:00-6:00','6:00-8:00','8:00-10:00','10:00-12:00','12:00-14:00','14:00-16:00','16:00-18:00','18:00-20:00','20:00-22:00','22:00-24:00'],
                })
            }
            resolve(true)
        }).then(v => {
            if(v) {
                new Promise(resolve => {
                    if(!this.state.clearFlag){
                        console.log(this.props.orShowTime.split(',')[1])
                        console.log(this.props.orShowTime.split(',')[0])
                        if(this.props.orShowTime.split(',')[1] === 'shike' && this.props.orShowTime.split(',')[0] === 'true'){
                            let nowHours=new Date().getHours()
                            this.state.timeSource.map(item => {
                                if(  item.split(':')[0] -nowHours > -2 && item.split(':')[0] -nowHours <= 0 ){
                                    let arr=[]
                                    arr.push(item)
                                    this.setState({
                                        timeArr2:arr
                                    })
                                }
                            })
                        }else{
                            let nowHours=new Date().getHours()
                            this.state.timeSource.map(item => {
                                if(  nowHours-item.split('-')[1].split(':')[0] >= 0 && nowHours- item.split('-')[1].split(':')[0]  < 2 ){
                                    let arr=[]
                                    arr.push(item)
                                    this.setState({
                                        timeArr2:arr
                                    })
                                }
                            })
                        }
                    }
                    resolve(true)
                }).then(v => {
                    let timeArr=[]
                    for(let i=0;i<12;i++){
                            timeArr.push(<div className='checks' key={this.state.timeSource[i]}  id={ this.state.timeSource[i]}
                            style={{border:this.state.timeArr2.indexOf(this.state.timeSource[i]) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.timeArr2.indexOf(this.state.timeSource[i]) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.timeCheck(e)}> 
                            { this.state.timeSource[i] }
                            <img src={ this.state.timeArr2.indexOf(this.state.timeSource[i]) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                    }
                   
                    this.setState({
                        timeArr:timeArr
                    })
                    if(a){
                        //筛选完就查询
                        this.search()
                    }
                })
            }
        })
    }
    //时间联动
    timeConnect = (num,numMonth) => {
        new Promise(resolve => {
            //大于等于一个月时的计算方法
            if(numMonth){
                //结束时间
                let date=new Date()
                let dateTotal=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000+24*3600*1000)

                let dateTotal2=new Date(dateTotal.getTime()-24*3600*1000)
                let year=dateTotal2.getFullYear()
                let month=dateTotal2.getMonth()+1
                let day=dateTotal2.getDate()

                
                //开始时间
                date.setMonth(dateTotal.getMonth()-numMonth)
                let dates=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000)
                let year2=dates.getFullYear()
                let month2=dates.getMonth()+1
                let day2=dates.getDate()


                this.setState({
                    startTime:year2+'-'+month2+'-'+day2,
                    endTime:dateTotal.getFullYear()+'-'+(dateTotal.getMonth()+1)+'-'+ dateTotal.getDate()
                })
                resolve(year+'-'+month+'-'+day)
            }else{
                let date=new Date()
                let dateTotal=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000+24*3600*1000)

                let dateTotal2=new Date(dateTotal.getTime()-24*3600*1000)
                let year=dateTotal2.getFullYear()
                let month=dateTotal2.getMonth()+1
                let day=dateTotal2.getDate()


                let dates=dateTotal.getTime()-num*24*3600*1000
                let date2=new Date(dates)
                let year2=date2.getFullYear()
                let month2=date2.getMonth()+1
                let day2=date2.getDate()
                this.setState({
                    startTime:year2+'-'+month2+'-'+day2,
                    endTime:dateTotal.getFullYear()+'-'+(dateTotal.getMonth()+1)+'-'+ dateTotal.getDate()
                })
                resolve(year+'-'+month+'-'+day )
            }
        }).then(v => {
            if(v){
                this.props.form.setFieldsValue({'searchTime':[moment(this.state.startTime),moment(v)]})
            }
        })
    }
    //时间获取更多
    timeMore = () => {
        this.setState({
            timeMoreNum:!this.state.timeMoreNum
        })
    }
    //时间段与input输入框关联
    timeLong = (e) => {
        let timeLongArr=this.state.timeLongArr
        if(timeLongArr.indexOf(e.target.id)>=0){
            timeLongArr.splice(timeLongArr.indexOf(e.target.id),1)
            //清空统计时间
            this.props.form.setFieldsValue({'searchTime':''})
        }else{
            if(timeLongArr.length>0){
                timeLongArr.splice(0,1)
            }
            timeLongArr.push(e.target.id)
            if(e.target.id === '7day'){
                this.timeConnect(7,0)
            }else if(e.target.id === '15day'){
                this.timeConnect(15,0)
            }else if(e.target.id === '30day'){
                this.timeConnect(30,1)
            }else if(e.target.id === '180day'){
                this.timeConnect(180,6)
            }else if(e.target.id === '365day'){
                this.timeConnect(365,12)
            }
        }
        this.setState({
            timeLongArr:timeLongArr
        })
    }
    //时刻的选择
    timeCheck = (e) => {
        new Promise(resolve => {
            let timeArr2=this.state.timeArr2
            if(timeArr2.indexOf(e.target.id)>=0){
                timeArr2.splice(timeArr2.indexOf(e.target.id),1)
            }else{
                if(timeArr2.length>0){
                    timeArr2.splice(0,1)
                }
                timeArr2.push(e.target.id)
            }
            this.setState({
                timeArr2:timeArr2,
                clearFlag:true
            })
            resolve(true)
        }).then(res => {
            if(res){
                this.timeList(true)
            }
        })
    }
    //统计时间选择
    dateChange = (moment,dateStrings,string) => {
        let { startTime,endTime}=randomDay(dateStrings)
        this.setState({
            timeLongArr:[],
            startTime:startTime,
            endTime:endTime
        })
    }
    //维度选择
    weiduCheck = (e,flag) => {
        this.setState({
            weiduFlag:flag
        })
        let weiduArr=this.state.weiduArr
        //判断'全国'选项是否出现start
        if(flag === '地市'){
            this.setState({
                provinceSelected:[],
                province:[],//默认弹窗全国选中
            })
        }else{
            this.setState({
                provinceSelected:[<div className='checks' key='1'   style={{border: '1px solid #E4E4E4',color:'#999'}} > 
                全国
                <img src={  close } alt="" className='remove-img' style={{width:'10px'}} id='1' onClick={ (e) => this.deleteProvince(e)}/>
                </div>],
                province:['全国'],//默认弹窗全国选中
            })
        }
        //判断全国选项的出现end
        if(weiduArr.indexOf(e.target.id)>=0){
            weiduArr.splice(weiduArr.indexOf(e.target.id),1)
        }else{
            if(weiduArr.length>0){
                weiduArr.splice(0,1)
            }
            weiduArr.push(e.target.id)
        }
        this.setState({
            weiduArr:weiduArr
        })
    }
    //省份弹窗
    provinceCheck = () => {
        this.form.provinceEvent(this.state.province,this.state.weiduFlag)
    }
    //删除省份
    deleteProvince = (e) => {
        let province=this.state.province
        province.splice(province.indexOf(e.target.id),1)
        this.setState({
            province:this.state.province
        })
        this.setProvince(province)
    }
    //删除地市
    deleteCity = (e) => {
        let city=this.state.city
        city.splice(city.indexOf(e.target.id),1)
        this.setState({
            city:this.state.city
        })
        this.setCity(city)
    }
    //地市弹窗
    cityCheck = () => {
        if(this.state.provinceSelected.length === 0){
            message.warning('请选择省份')
        }else{
            this.form2.cityEvent(this.state.province,this.state.city)
        }
    }
    //回显选中的省份
    setProvince = (res) => {
        new Promise(resolve => {
            this.setState({
                province:Array.from(new Set(this.state.province.concat(res)))
            })
            resolve(Array.from(new Set(this.state.province.concat(res))))
        }).then(res => {
            let provinceSelected=[]
            for(let i=0;i<res.length;i++){
                provinceSelected.push(<div className='checks' key={res[i]}  style={{border: '1px solid #E4E4E4',color:'#999'}}   > 
                { res[i] }
                <img src={  close } alt="" className='remove-img' style={{width:'10px'}} id={ res[i]} onClick={ (e) => this.deleteProvince(e)}/>
                </div>)
            }
            this.setState({
                provinceSelected:provinceSelected
            })
            if(this.state.citySelected.length !== 0){
                //筛选完就查询
                this.search()
            }
        })
    }
    //回显选中的地市
    setCity = (res) => {
        new Promise(resolve => {
            this.setState({
                city:Array.from(new Set(this.state.city.concat(res)))
            })
            resolve(Array.from(new Set(this.state.city.concat(res))))
        }).then(res => {
            let citySelected=[]
            for(let i=0;i<res.length;i++){
                citySelected.push(<div className='checks' key={res[i]}  style={{border: '1px solid #E4E4E4',color:'#999'}}   > 
                { res[i] }
                <img src={  close } alt="" className='remove-img' style={{width:'10px'}} id={ res[i]} onClick={ (e) => this.deleteCity(e)}/>
                </div>)
            }
            this.setState({
                citySelected:citySelected
            })
            //筛选完就查询
            this.search()
        })
    }
    //车型列表
    carList = (b) => {
        Axios.get(HttpUrl+'data/carModel/selectAll').then(res => {
            if(res.status == 200 && res.data.code === '100000'){
                let length=res.data.data.length;
                let carArr=[];
                for(let i=0;i<length;i++){
                    carArr.push(<div className='checks' key={res.data.data[i].carModelId}  id={ res.data.data[i].carModelId}
                    style={{border:this.state.carArr2.indexOf(String(res.data.data[i].carModelId)) >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.carArr2.indexOf(String(res.data.data[i].carModelId)) >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.carCheck(e)}> 
                    { res.data.data[i].carModelName }
                    <img src={ this.state.carArr2.indexOf(String(res.data.data[i].carModelId)) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                    </div>)
                }
                this.setState({
                    carArr:carArr
                })
                if(b){
                    //筛选完就查询
                    this.search()
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //车型选择
    carCheck = (e) => {
        new Promise(resolve => {
            let carArr2=this.state.carArr2
            if(carArr2.indexOf(e.target.id)>=0){
                carArr2.splice(carArr2.indexOf(e.target.id),1)
            }else{
                carArr2.push(e.target.id)
            }
            this.setState({
                carArr2:carArr2,
            })
            resolve(true)
        }).then(v => {
            if(v){
                this.carList(true)
            }
        })
    }
    //统计
    search = () => {
        if(this.state.weiduFlag === '地市'){
            if(this.state.citySelected.length  === 0){
                message.warning('请选择地市')
            }else{
                this.onRef()
            }
        }else{
            this.onRef()
        }
    }
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
        if(!this.state.collapseStatus){
            setTimeout(() => {
                if(document.getElementById("timeBox")){
                    this.setState({
                        timeBoxWidth:document.getElementById("timeBox").offsetWidth,
                        timeInnerBoxWidth:document.getElementById("timeInnerBox").offsetWidth,
                    })
                }
            }, 0);
        }
    }
    onRef = () => {
        this.props.onRef({
            'startTime':(new Date(this.state.startTime)).getTime(),
            'endTime':(new Date(this.state.endTime)).getTime(),
            'province':this.state.province.length>0  ? this.state.province : [] ,
            'city':this.state.city.length>0 ? this.state.city : [],
            'carModelId':this.state.carArr2.length>0 ? this.state.carArr2 : [],
            'recordHour':this.props.orShowTime.split(',')[1] === 'shike' ? 
                                                                        this.state.timeArr2.length>0  ? Number(this.state.timeArr2[0].split(':')[0])  : -1 
                                                                        : this.state.timeArr2.length>0 ? Number(this.state.timeArr2[0].split('-')[1].split(':')[0]) : -1
        });
    }
    //导出
    export = (url) => {
        if(!this.state.startTime){
            message.warning('请先输入统计条件')
        }else{
            Axios.post(HttpUrl+url,{
                'startTime':(new Date(this.state.startTime)).getTime(),
                'endTime':(new Date(this.state.endTime)).getTime(),
                'province':this.state.province.length>0  ? this.state.province : [] ,
                'city':this.state.city.length>0 ? this.state.city : [],
                'carModelId':this.state.carArr2.length>0 ? this.state.carArr2 : [],
                'recordHour':this.props.orShowTime.split(',')[1] === 'shike' ? 
                                                                            this.state.timeArr2.length>0  ? Number(this.state.timeArr2[0].split(':')[0])  : -1 
                                                                            : this.state.timeArr2.length>0 ? Number(this.state.timeArr2[0].split('-')[1].split(':')[0]) : -1
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
    
    render() {
        const { getFieldDecorator }=this.props.form
        const {weiduArr,timeLongArr}=this.state
        return (
        <div  className='content-title'>
                <Form layout="inline">
                    <div className='searchType' style={{width:'100%'}}>
                        <FormItem label="统计时间">
                        { getFieldDecorator('searchTime',{
                            initialValue:[moment(this.state.startTime),moment(this.state.endTime)]
                        })( <RangePicker
                            getCalendarContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'240px'}} 
                            disabledDate={disabledDate}
                            onChange={this.dateChange}
                            format="YYYY-MM-DD"
                        />)}
                        </FormItem>
                        {
                            this.props.whatTime === 'short' ?
                            <div style={{display:'inline-block'}}>
                                <div className='checks'   id='7day'
                                style={{border:timeLongArr.indexOf('7day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('7day') >=0 ? '#3689FF' :'#999',marginTop:'5px',marginLeft:'40px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近七天
                                    <img src={ timeLongArr.indexOf('7day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks'   id='15day'
                                style={{border:timeLongArr.indexOf('15day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('15day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近半个月
                                    <img src={ timeLongArr.indexOf('15day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks'   id='30day'
                                style={{border:timeLongArr.indexOf('30day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('30day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近一个月
                                    <img src={ timeLongArr.indexOf('30day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                            </div>
                            :
                            <div style={{display:'inline-block'}}>
                                <div className='checks'   id='15day'
                                style={{border:timeLongArr.indexOf('15day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('15day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近半个月
                                    <img src={ timeLongArr.indexOf('15day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks'   id='30day'
                                style={{border:timeLongArr.indexOf('30day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('30day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近一个月
                                    <img src={ timeLongArr.indexOf('30day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks'   id='180day'
                                style={{border:timeLongArr.indexOf('180day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('180day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近半年
                                    <img src={ timeLongArr.indexOf('180day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                                <div className='checks'   id='365day'
                                style={{border:timeLongArr.indexOf('365day') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:timeLongArr.indexOf('365day') >=0 ? '#3689FF' :'#999',marginTop:'5px'}}   onClick={ (e) => this.timeLong(e)}> 
                                    近一年
                                    <img src={ timeLongArr.indexOf('365day') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                </div>
                            </div>
                        }
                       {
                        this.props.btnList ?
                        <Button type="primary" className='btn searchBtn'  onClick={this.search}>统计</Button>
                        : ''
                       }
                        <Button type="primary" className='btn clearBtn'   ghost onClick={this.clearCondition}>清除条件</Button>
                    </div>
                    <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                            {
                                this.props.orShowTime.split(',')[0] === 'true' ?
                                <div className='searchType'>
                                    <div className='typeTitle' >统计时刻：</div>
                                    <div className='moreBox' id='timeBox' style={{height:this.state.timeMoreNum ? 'auto' : '50px'}}>
                                        <span id='timeInnerBox' style={{display:'inline-block'}}>
                                            { this.state.timeArr}
                                        </span>
                                    </div>
                                    <div>
                                        {
                                            this.state.timeInnerBoxWidth+50 >this.state.timeBoxWidth ?
                                            <div className='checks typemore'  onClick={this.timeMore}>
                                                {
                                                    this.state.timeMoreNum ? '收起' : '更多'
                                                }
                                                <img src={ArrowDown} alt="" className='typearrow' style={{transform: this.state.timeMoreNum ?  'rotate(180deg)':  'rotate(0deg)'}}/>
                                            </div>
                                            : ''
                                        }
                                    </div>
                                </div>
                                : ''
                            }
                            <div  className='searchType'>
                                <div className='typeTitle' >统计维度：</div>
                                <div className='moreBox' style={{height:'50px'}}>
                                    <div className='checks'   id='province'
                                    style={{border:weiduArr.indexOf('province') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:weiduArr.indexOf('province') >=0 ? '#3689FF' :'#999'}}   onClick={ (e) => this.weiduCheck(e,'省份')}> 
                                        按省份
                                        <img src={ weiduArr.indexOf('province') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                    </div>
                                    <div className='checks'   id='city'
                                    style={{border:weiduArr.indexOf('city') >=0 ? '1px solid #3689FF' : '1px solid #E4E4E4',color:weiduArr.indexOf('city') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.weiduCheck(e,'地市')}> 
                                        按地市
                                        <img src={ weiduArr.indexOf('city') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                    </div>
                                </div>
                            </div>
                            {
                                weiduArr[0] === 'province' ||  weiduArr[0] === 'city' ?
                                <div  className='searchType'>
                                    <div className='typeTitle' >省份：</div>
                                    <div className='moreBox' style={{height:'50px'}}>
                                        <div className='checks' style={{background:'#3689FF',border:'1px solid #3689FF',color:'#fff'}}   onClick={ () => this.provinceCheck()}> 
                                            请选择
                                        </div>
                                        { this.state.provinceSelected}
                                    </div>
                                </div>
                                : ''
                            }
                            {
                                weiduArr[0] === 'city' ?
                                <div  className='searchType'>
                                    <div className='typeTitle' >地市：</div>
                                    <div className='moreBox' style={{height:'50px'}}>
                                        <div className='checks' style={{background:'#3689FF',border:'1px solid #3689FF',color:'#fff'}}   onClick={ () => this.cityCheck()}> 
                                            请选择
                                        </div>
                                        { this.state.citySelected}
                                    </div>
                                </div>
                                : ''
                            }
                            {
                                weiduArr[0] === 'province' ||  weiduArr[0] === 'city' ?
                                <div style={{color:'#FF5656',marginLeft:'78px',fontSize:'12px'}}>温馨提示:最多同时选择5个省份</div>
                                : ''
                            }
                            <div className='searchType'>
                                <div className='typeTitle' >车型：</div>
                                <div className='moreBox' style={{height:this.state.modelMoreNum ? 'auto' : '50px',}}>
                                    { this.state.carArr }
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </Form>
            <Province wrappedComponentRef={(form) => this.form = form} setProvince={(e) =>this.setProvince(e)}></Province>
            <City wrappedComponentRef={(form) => this.form2 = form} setCity={(e) =>this.setCity(e)}></City>
            <style>
                {`
                    .searchType .ant-form-item-label{width:78px;}
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;