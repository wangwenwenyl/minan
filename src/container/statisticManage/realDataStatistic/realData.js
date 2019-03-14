/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message,Collapse ,Form, Input, Icon, Select, Button ,DatePicker } from 'antd';
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
import {btnList,statisticExport} from './../../../util/util'
import moment from 'moment';
import  Table  from "../../../component/table/table";
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;
class distribution extends Component {
    constructor(props, context) {
        super(props, context)
    }
    state = {
        startPage:1,
        pageSize:10,
        loading:false,
        provinceArr:[],
        selectedProvince:'',
        cityArr:[],
        selectedCity:'',
        selectedCarModal:'',
        carArr:[],
        areaData:[],
        color:'',
        rightData:[],
        btnList:[],
        tabKey:'1',
        columns:[
            { title: '序号', width: 60, dataIndex: 'num', fixed: 'left' },
            { title: '车牌号',dataIndex: 'plateNo',className:'clounWidth'},
            { title: 'VIN',dataIndex: 'vin',className:'clounWidth'},
            { title: '车型',dataIndex: 'carModel' ,className:'clounWidth'},
            { title: '车主姓名',dataIndex: 'name' ,className:'clounWidth'},
            { title: '车主电话',dataIndex: 'number' ,className:'clounWidth'}
        ]
    }
    componentDidMount(){
        window.onresize = () =>{
            this.setEcharts()
        }
        this.getProvince()
        this.carList()
        this.list()
        btnList(this)
    }
    setEcharts = () => {
        let width=document.body.clientWidth
        document.getElementById('echarts').style.width=width-250+'px'
        var myChart = echarts.init(document.getElementById('echarts'));
        // 绘制图表
        let option = {
            title: {
                text: '实时数据流传输正常、异常占比',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 64,
                top: 20,
                bottom: 20,
                data:['传输异常','传输正常']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    label: {
                        emphasis: {
                            textStyle: {
                                fontSize: '12',
                            }
                        }
                    },
                    data:this.state.areaData
                }
            ],
            color:this.state.color
        };
        myChart.setOption(option,true);
        myChart.resize();
    }
    //获取省份
    getProvince = () => {
        Axios.get(HttpUrl+'vehicle/open/v1/area').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let provinceArr=[];
                for(let i=0;i<length;i++){
                    provinceArr.push(<Option key={res.data.data[i].id} value={ res.data.data[i].id + ','+ res.data.data[i].value }>{ res.data.data[i].value }</Option>)
                }
                this.setState({
                    provinceArr:provinceArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
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
                    cityArr.push(<Option key={res.data.data[i].id} value={ res.data.data[i].id + ','+ res.data.data[i].value }>{ res.data.data[i].value }</Option>)
                }
                this.setState({
                    cityArr:cityArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    selectCity = (e) => {
        this.setState({
            selectedCity:e.split(',')[1]
        })
    }
    selectCarModal = (e) => {
        this.setState({
            selectedCarModal:e
        })
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
                    this.list()
                }else if(e === '2'){
                    this.rightList(this.state.startPage,this.state.pageSize)
                }
            }
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
    list = () => {
        Axios.post(HttpUrl+'data/packet/statistics',{
            'province':this.state.selectedProvince,
            'city':this.state.selectedCity,
            'carModelId':this.state.selectedCarModal
        }).then(res=> {
            if(res.data.code === '100000'){
                if(res.data.data){
                    let arr=[]
                    arr.push({name:'传输异常',value:res.data.data.abnormity})
                    arr.push({name:'传输正常',value:res.data.data.normal})
                    this.setState({
                        areaData:arr,
                        color:['#FFC400','#38A4DD']
                    })
                    this.setEcharts()
                }else{
                    this.setState({
                        areaData:[{name:'暂无数据',value:0}],
                        color:["#aaa"]
                    })
                    this.setEcharts()
                }
            }else{
                message.warning(res.data.message)
            }
        }) 
    }
    rightList = (pageNumber,pageSize) => {
        Axios.post(HttpUrl+'data/packet/select',{
            'pageSize':pageSize,
            'startPage':pageNumber,
            'message':this.props.form.getFieldValue('message'),
            'carModelId':this.state.selectedCarModal
        }).then(res=> {
            if(res.data.code === '100000'){
                let length=res.data.data.list.length
                for(let i=0;i<length;i++){
                    res.data.data.list[i].num=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;
                }
                this.setState({
                    rightData:res.data.data.list
                })
            }else{
                message.warning(res.data.message)
            }
        }) 
    }
    search = () => {
        if(this.state.tabKey === '1'){
            this.list()
        }else{
            this.rightList(this.state.startPage,this.state.pageSize)
        }
    }
    //导出
    realDataExport = () => {
        if(!this.props.form.getFieldValue('message')){
            message.warning('请先输入查询条件')
        }else{
            Axios.post(HttpUrl+'data/packet/select/export',{
                'startPage':1,
                'pageSize':-1,
                'message':this.props.form.getFieldValue('message') || null,
                'carModelId':this.state.selectedCarModal || null
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
    //清除条件
    clearCondition = () => {
        this.setState({
            selectedProvince:'',
            selectedCity:'',
            selectedCarModal:'',
            areaData:[],
            cityArr:[]
        })
        this.props.form.resetFields();
    }
    render() {
        const { getFieldDecorator }=this.props.form
        return (
        <div className="content statistic" >
            <Tabs type="card" onChange={ this.tabChange} >
                <TabPane tab="按地区" key="1">
                    <div className='content-title'>   
                        <Form layout="inline">
                            <div className='searchType' style={{width:'100%'}}>
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
                                <FormItem label="车型" className='smallLable' >
                                { getFieldDecorator('carModal')(<Select 
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    onSelect={ this.selectCarModal}
                                    style={{width:'160px',marginBottom:'10px'}}>
                                    {this.state.carArr}
                                </Select>)}
                                </FormItem>
                                {
                                    this.state.btnList.includes('realListA') ?
                                    <Button type="primary" className='btn searchBtn'  onClick={this.search} >查询</Button>
                                    : ''
                                }
                                <Button type="primary" className='btn clearBtn' ghost  onClick={this.clearCondition} >清除条件</Button>
                            </div>
                        </Form>
                    </div>
                </TabPane>
                <TabPane tab="按单车" key="2"> 
                    <div className='content-title'> 
                        <Form layout="inline">
                            <div className='searchType' style={{width:'100%'}}>
                                <FormItem label="车型" className='smallLable' >
                                { getFieldDecorator('carModal')(<Select 
                                    getPopupContainer={triggerNode => triggerNode.parentNode}
                                    onSelect={ this.selectCarModal}
                                    style={{width:'160px',marginBottom:'10px'}}>
                                    {this.state.carArr}
                                </Select>)}
                                </FormItem>
                                <FormItem label="关键字">
                                        { getFieldDecorator('message')( <Input placeholder='车牌号、VIN、终端SN' autoComplete='off'/>)}
                                </FormItem>
                                {
                                    this.state.btnList.includes('realListB') ?
                                    <Button type="primary" className='btn searchBtn'  onClick={this.search} >查询</Button>
                                    : ''
                                }
                                <Button type="primary" className='btn clearBtn' ghost  onClick={this.clearCondition} >清除条件</Button>
                            </div>
                        </Form>
                    </div>
                </TabPane>
            </Tabs>
            <div>
                {
                    this.state.tabKey === '2' ?
                    <div  className='oprateHead'>
                        <Button type="primary" className='btn' onClick={ this.realDataExport} ghost style={{marginBottom:'0px'}}>
                            <img src={exports} alt="" />
                            导出
                        </Button>
                    </div>
                    : ''
                }
               <div className='table' style={{border:'1px solid #EBEDF8',background:"#fff",marginTop:'25px'}}>
                    <div style={{display:this.state.tabKey === '1' ? 'block' : 'none',marginTop:'30px'}}>
                        <div id='echarts' style={{ height: 500,margin:'auto'}}>

                        </div>
                    </div>
                    <div style={{display:this.state.tabKey === '2' ? 'block' : 'none'}}>
                        <Table
                            scroll={1650}
                            columns={this.state.columns}
                            dataSource={this.state.rightData}
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
                    .smallLable .ant-form-item-label{width:35px;}
                    .searchType{
                        clear:both;
                        display:table;
                        content:''
                    }
                    .statistic .ant-tabs-bar{margin:0px !important;}
                    .statistic .content-title {border-top:none;}
                    .ant-tabs{overflow:inherit}
                    .searchBtn{margin-top:5px;vertical-align:top;margin-left:40px;}
                    .clearBtn{margin-Top:5px;vertical-Align:top;}
                `}
            </style>
        </div>
        )
    }
}

const distributions = Form.create()(distribution);
export default distributions;