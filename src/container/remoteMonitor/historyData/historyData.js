/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {Radio,Tabs,message, AutoComplete,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "../../../component/table/table";
import {HttpUrl,httpConfig} from '../../../util/httpConfig'
import {disabledDate,transformDate} from './../../../util/util'
import exports from './../../../img/exports.png'
import nodata1 from './../../../img/nodata1.png'
import nodata2 from './../../../img/nodata2.png'
import nodata3 from './../../../img/nodata3.png'
import moment from 'moment';
import { reduce } from 'zrender/lib/core/util';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
class distoryData extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:false,
        tableData:[],
        tabKey:'1',
        dataStatus:1,
        startTime:'',
        endTime:'',
        btnList:'',
        columns1:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '车辆状态',dataIndex: 'vehicleStatus' ,className:'clounWidth'},
            { title: '充电状态',dataIndex: 'chargeStatus',className:'clounWidth'},
            { title: '运行模式',dataIndex: 'workingModel',className:'clounWidth'},
            { title: '车速',dataIndex: 'speed',className:'clounWidth',
                render:(text,record) =>{
                    return ( record.speed + 'km/h')
                }},
            { title: '累计里程',dataIndex: 'sumKm',className:'clounWidth',render:(text,record)=>{
                return (record.sumKm + 'km')
            }},
            { title: '总电压',dataIndex: 'totalVoltage',className:'clounWidth',render:(text,record) => {
                return (record.totalVoltage + 'V')
            }},
            { title: '总电流',dataIndex: 'totalCurrent',className:'clounWidth',render:(text,record) => {
                return (record.totalCurrent + 'A')
            }},
            { title: 'SOC',dataIndex: 'soc',className:'clounWidth',render:(text,record) => {
                return (record.soc + '%')
            }},
            { title: 'DC/DC状态',dataIndex: 'dcStatus',className:'clounWidth'},
            { title: '挡位',dataIndex: 'gea',className:'clounWidth'},
            { title: '绝缘电阻',dataIndex: 'insulateResist',className:'clounWidth',render:(text,record) => {
                return (record.insulateResist + 'KΩ')
            }},
            { title: '加速踏板行程值',dataIndex: 'accPedal',className:'clounWidth',render:(text,record) => {
                return (record.accPedal + '%')
            }},
            { title: '制动踏板状态',dataIndex: 'brakePedalStatus',className:'clounWidth',render:(text,record) =>{
                if( record.brakePedalStatus == '数据无效'){
                    return (record.brakePedalStatus )
                }else{
                    return (record.brakePedalStatus + '%')
                }
            }}
        ],
        columns2:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '驱动电机个数',dataIndex: 'driveMotorNum' ,className:'clounWidth'},
            { title: '驱动电机序号',dataIndex: 'driveMotorSeq',className:'clounWidth'},
            { title: '驱动电机状态',dataIndex: 'driveMotorStatus',className:'clounWidth'},
            { title: '驱动电机控制器温度',dataIndex: 'controllerTemp',className:'clounWidth',render:(text,record) =>{
                return (record.controllerTemp + '℃')
            }},
            { title: '驱动电机转速',dataIndex: 'revs',className:'clounWidth',render:(text,record) => {
                return (record.revs + 'r/min')
            }},
            { title: '驱动电机转矩',dataIndex: 'torque',className:'clounWidth',render:(text,record) => {
                return (record.torque + 'N*m')
            }},
            { title: '驱动电机温度',dataIndex: 'driveMotorTemp',className:'clounWidth',render:(text,record) => {
                return (record.driveMotorTemp + '℃')
            }},
            { title: '电机控制器输入电压',dataIndex: 'controllerVoltage',className:'clounWidth',render:(text,record) => {
                return (record.controllerVoltage + 'V')
            }},
            { title: '电机控制器直流母线电流',dataIndex: 'controllerCurrent',className:'clounWidth',render:(text,record) => {
                return (record.controllerCurrent + 'A')
            }},
        ],
        columns3:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '最高电压电池子系统号',dataIndex: 'maxVoltageCellSysNum' ,className:'clounWidth'},
            { title: '最高电压电池单体代号',dataIndex: 'maxVoltageCellCode',className:'clounWidth'},
            { title: '电池单体电压最高值',dataIndex: 'cellMaxVoltage',className:'clounWidth',render:(text,record) => {
                return (record.cellMaxVoltage + 'V')
            }},
            { title: '最低电压电池子系统号',dataIndex: 'minVoltageCellSysNum',className:'clounWidth'},
            { title: '最低电压电池单体代号',dataIndex: 'minVoltageCellCode',className:'clounWidth'},
            { title: '电池单体电压最低值',dataIndex: 'cellMinVoltage',className:'clounWidth',render:(text,record) => {
                return (record.cellMinVoltage + 'V')
            }},
            { title: '最高温度子系统号',dataIndex: 'maxTempSysNum',className:'clounWidth'},
            { title: '最高温度探针序号',dataIndex: 'maxTempProbeSeq',className:'clounWidth'},
            { title: '最高温度值',dataIndex: 'maxTemp',className:'clounWidth',render:(text,record) => {
                return (record.maxTemp + '℃')
            }},
            { title: '最低温度子系统号',dataIndex: 'minTempSysNum',className:'clounWidth'},
            { title: '最低温度探针序号',dataIndex: 'minTempProbeSeq',className:'clounWidth'},
            { title: '最低温度值',dataIndex: 'minTemp',className:'clounWidth',render:(text,record) => {
                return (record.minTemp + '℃')
            }},
        ],
        columns4:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '最高报警级别',dataIndex: 'maxWarnLevel' ,className:'clounWidth'},
            { title: '温度差异报警',dataIndex: 'tempDifferenceWarn',className:'clounWidth'},
            { title: '电池高温报警',dataIndex: 'cellHighTempWarn',className:'clounWidth'},
            { title: '车载储能装置类型过压报警',dataIndex: 'chargeHighVoltageWarn',className:'clounWidth'},
            { title: '车载储能装置类型欠压报警',dataIndex: 'chargeLowVoltageWarn',className:'clounWidth'},
            { title: 'SOC低报警',dataIndex: 'lowSocWarn',className:'clounWidth'},
            { title: '单体电池过压报警',dataIndex: 'cellHightVoltageWarn',className:'clounWidth'},
            { title: '单体电池欠压报警',dataIndex: 'cellLowVoltageWarn',className:'clounWidth'},
            { title: 'SOC过高报警',dataIndex: 'highSocWarn',className:'clounWidth'},
            { title: 'SOC跳变报警',dataIndex: 'socJumpWarn',className:'clounWidth'},
            { title: '可充电储能系统不匹配报警',dataIndex: 'chargeMismatchWarn',className:'clounWidth'},
            { title: '电池单体一致性差报警',dataIndex: 'cellInconsistWarn',className:'clounWidth'},
            { title: '绝缘报警',dataIndex: 'insulationWarn',className:'clounWidth'},
            { title: 'DC-DC温度报警',dataIndex: 'dcTempWarn',className:'clounWidth'},
            { title: '制动系统报警',dataIndex: 'breakWarn',className:'clounWidth'},
            { title: 'DC-DC状态报警',dataIndex: 'dcStatusWarn',className:'clounWidth'},
            { title: '驱动电机控制器温度报警',dataIndex: 'driveMotorControllerTempWarn',className:'clounWidth'},
            { title: '高压互锁状态报警',dataIndex: 'highVoltageLockWarn',className:'clounWidth'},
            { title: '驱动电机控温度报警',dataIndex: 'driveMotorTempWarn',className:'clounWidth'},
            { title: '车载储能装置类型过充',dataIndex: 'overChargeWarn',className:'clounWidth'},
        ],
        columns5:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '可充电储能子系统个数',dataIndex: 'sysNum' ,className:'clounWidth'},
            { title: '可充电储能子系统号',dataIndex: 'sysCode',className:'clounWidth'},
            { title: '可充电储能装置电压',dataIndex: 'voltage',className:'clounWidth',render:(text,record) => {
                return (record.voltage + 'V')
            }},
            { title: '可充电储能装置电流',dataIndex: 'current',className:'clounWidth',render:(text,record) => {
                return (record.current + 'A')
            }},
            { title: '单体电池总数',dataIndex: 'singleBatterySum',className:'clounWidth'},
            { title: '本帧起始电池序号',dataIndex: 'frameBatteryCode',className:'clounWidth'},
            { title: '本帧单体电池总数',dataIndex: 'frameBatterySum',className:'clounWidth'},
            { title: '单体电池电压',render:function(text,record){
                return <div style={{width:'120px',height:'38px',lineHeight:'38px',overflow:'hidden',textOverflow:'ellipsis'}} title={record.singleBatteryVoltage ? eval(record.singleBatteryVoltage).join(',') : ''}>{record.singleBatteryVoltage ? eval(record.singleBatteryVoltage).join(',') + 'V': ''}</div>
            },className:'clounWidth',width:120,overflow:'hidden',textOverflow:'ellipsis'}
        ],
        columns6:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '采集时间',dataIndex: 'uploadTime',className:'clounWidth'},
            { title: '接收时间',dataIndex: 'serverTime' ,className:'clounWidth'},
            { title: '数据类型',dataIndex: 'packetType',className:'clounWidth'},
            { title: '可充电储能子系统个数',dataIndex: 'sysNum' ,className:'clounWidth'},
            { title: '可充电储能子系统号',dataIndex: 'sysCode',className:'clounWidth'},
            { title: '可充电储能温度探针个数',dataIndex: 'probeNum',className:'clounWidth'},
            { title: '可充电储能子系统各温度探针检测到的温度值',dataIndex: 'sysTemps',
            render:function(text,record){
                return <div style={{width:'300px',height:'38px',lineHeight:'38px',overflow:'hidden',textOverflow:'ellipsis'}}  title={record.sysTemps ? eval(record.sysTemps).join(',') : ''}>{record.sysTemps ? eval(record.sysTemps).join(',') + '℃': ''}</div>
            },className:'clounWidth',width:300,overflow:'hidden',textOverflow:'ellipsis'},
        ],
    }
    componentDidMount(){
        // let _that=this
        // this.props.form.setFieldsValue({'searchTime':[moment(),moment()]})
        // setTimeout(() => {
        //     _that.props.form.resetFields()
        // },10)
        // let obj={
        //     'pageNo':this.state.pageNumber,
        //     'pageSize':this.state.pageSize,
        //     'name':this.props.form.getFieldValue('keyword') || null,
        //     'startTime':transformDate(this.props.form.getFieldValue('searchTime')[0]),
        //     'endTime':transformDate(this.props.form.getFieldValue('searchTime')[1])
        // }
        this.btnList()
    }
    //历史数据通用接口
    dataList = (url,obj) => {
        this.setState({
            loading:true,
            dataStatus:2
        })
        Axios.post(HttpUrl+url,obj).then(res => {
            if(res.data.code === "100000"){
                let length=res.data.data.list.length;
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(obj.pageNo-1)*this.state.pageSize;
                    res.data.data.list[i].key=i+1+(obj.pageNo-1)*this.state.pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.totalCount,
                    current:obj.pageNo,
                    loading:false,
                   
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                }else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //整车数据
    dataList1 = (obj) => {
        this.dataList('vehicle/historyData/selectVehicleDate',obj)
    }
    //驱动电机数据
    dataList2 = (obj) => {
        this.dataList('vehicle/historyData/selectDriveMotorData',obj)
    }
    //极值数据
    dataList3 = (obj) => {
        this.dataList('vehicle/historyData/selectExtremumData',obj)
    }
    //报警数据
    dataList4 = (obj) => {
        this.dataList('vehicle/historyData/selectWarningData',obj)
    }
    //可充电储能装置电压数据
    dataList5 = (obj) => {
        this.dataList('vehicle/historyData/selectEnergyStorageVoltageData',obj)
    }
    //可充电储能装置温度数据
    dataList6 = (obj) => {
        this.dataList('vehicle/historyData/selectEnergyStorageTempData',obj)
    }
    //面板切换
    tabChange = (e) => {
        this.setState({
            tableData:[],
            tabKey:e
        })
        let obj={
            'pageNo':this.state.pageNumber,
            'pageSize':this.state.pageSize,
            'name':this.props.form.getFieldValue('keyword'),
            'startTime':this.state.startTime || null,
            'endTime':this.state.endTime || null
        }
        if(this.props.form.getFieldValue('keyword')){
            this.handle(e,obj)
        }
    }
    //日期选择
    dateChange = (moment,dateStrings,string) => {
        this.setState({
            startTime:dateStrings[0],
            endTime:dateStrings[1]
        })
    }
    //获取权限按钮
    btnList = () => {
        let length=this.props.location.pathname.split('/').length
        let pageId=this.props.location.pathname.split('/')[length-1]
        Axios.get(HttpUrl+ 'sys/system/resource/pageButton?pageId='+pageId).then(res => {
            if(res.data.code === '100000'){
                let length2=res.data.data.length
                let btnList=[]
                for(let i=0;i<length2;i++){
                    btnList.push(res.data.data[i].function)
                }
                this.setState({
                    btnList:btnList
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //查询
    search = () => {
        let obj={
            'pageNo':this.state.pageNumber,
            'pageSize':this.state.pageSize,
            'name':this.props.form.getFieldValue('keyword'),
            'startTime':this.state.startTime || null,
            'endTime':this.state.endTime || null
        }
        if(this.props.form.getFieldValue('keyword')){
            this.handle(this.state.tabKey,obj)
        }else{
            message.warning('请输入关键字查询')
        }
        
    }
    //清除条件
    clearCondition = () => {
        this.props.form.resetFields()
        this.setState({
            startTime:'',
            endTime:'',
            tableData:[],
            loading:false,
            dataStatus:1,
            pageNumber:1,
            current:1,
            pageSize:10,
            total:"",
        })
    }
    //判断执行的函数
    handle = (e,obj) => {
        if(e === '1'){
            this.dataList1(obj)
        }else if(e === '2' ){
            this.dataList2(obj)
        }else if(e === '3'){
            this.dataList3(obj)
        }else if(e === '4'){
            this.dataList4(obj)
        }else if(e === '5'){
            this.dataList5(obj)
        }else if(e === '6'){
            this.dataList6(obj)
        }
    }
    //数据导出
    deviceExport = () => {
        let tabKey=this.state.tabKey
        if(this.props.form.getFieldValue('keyword')){
            if(tabKey === '1'){
                this.exportHandle('vehicle/historyData/exportVehicleDate')
            }else if(tabKey === '2'){
                this.exportHandle('vehicle/historyData/exportDriveMotorData')
            }else if(tabKey === '3'){
                this.exportHandle('vehicle/historyData/exportExtremumData')
            }else if(tabKey === '4'){
                this.exportHandle('vehicle/historyData/exportWarningData')
            }else if(tabKey === '5'){
                this.exportHandle('vehicle/historyData/exportEnergyStorageVoltageData')
            }else if(tabKey === '6'){
                this.exportHandle('vehicle/historyData/exportEnergyStorageTempData')
            }
        }else{
            message.warning('请输入关键字查询')
        }
    }
    //导出函数判断
    exportHandle = (url) => {
        let token=sessionStorage.getItem('token')
        Axios.get(HttpUrl+url+'?name='+(this.props.form.getFieldValue('keyword') || '') +
        '&startTime='+(this.state.startTime || '') +
        '&endTime='+(this.state.endTime || '') +
        '&token='+token).then(res => {
            if( res.data.code === "220008" || res.data.code === "220009"){
                message.warning(res.data.message)
            }else{
                window.location=HttpUrl+url+'?name='+(this.props.form.getFieldValue('keyword') || '') +
                                                                            '&startTime='+(this.state.time[0] || '') +
                                                                            '&endTime='+(this.state.time[1] || '') +
                                                                            '&token='+token
            }
        })
    }
    //分页
    onChange = (pageNumber) => {
        this.setState({
            tableData:[],
            loading:true
        })
        let obj={
            'pageNo':pageNumber,
            'pageSize':this.state.pageSize,
            'name':this.props.form.getFieldValue('keyword'),
            'startTime':this.state.startTime || null,
            'endTime':this.state.endTime || null
        }
        this.handle(this.state.tabKey,obj)
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {tabKey,btnList}=this.state
        return (
        <div className="content" >
            <div className='content-title'>   
                <Form layout="inline">
                    <div className='searchType'>
                        <FormItem label="关键字搜索">
                        { getFieldDecorator('keyword')( <AutoComplete 
                            style={{width:'200px'}}
                            dataSource={ this.state.searchDataSource}
                            onSearch={this.handleSearch} placeholder='车牌号、VIN、设备SN'/>)}
                        </FormItem>
                        <FormItem label="采集时间">
                        { getFieldDecorator('searchTime')( <RangePicker
                            getCalendarContainer={triggerNode => triggerNode.parentNode}
                            style={{width:'340px'}} 
                            disabledDate={disabledDate}
                            showTime={{
                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                          }}
                          onChange={this.dateChange}
                            format="YYYY-MM-DD HH:mm:ss"
                        />)}
                        </FormItem>
                        <Button type="primary" className='btn' style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.search}>查询</Button>
                        <Button type="primary" className='btn' ghost onClick={this.clearCondition}>清除条件</Button>
                    </div>
                </Form>
            </div>
            <div>
                <div  className='oprateHead'>
                    {
                        tabKey === '1' &&  btnList.includes('exporta') || tabKey === '2' &&  btnList.includes('exportb') ||
                        tabKey === '3' &&  btnList.includes('exportc') || tabKey === '4' &&  btnList.includes('exportd') ||
                        tabKey === '5' &&  btnList.includes('exporte') || tabKey === '6' &&  btnList.includes('exportf') ?
                        <Button type="primary" className='btn' onClick={ this.deviceExport} ghost>
                        <img src={exports} alt="" />
                        导出</Button>
                        : ''
                    }
                </div>
                <div className='table'>
                    <Tabs type="card" className='historyBox' onChange={ this.tabChange}>
                        <TabPane tab="整车数据" key="1" className='historyItem'>
                            <Table
                                scroll={2550}
                                columns={this.state.columns1}
                                dataSource={this.state.tableData}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                            {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                        </TabPane>
                        <TabPane tab="驱动电机数据" key="2">
                            <Table
                                scroll={2350}
                                columns={this.state.columns2}
                                dataSource={this.state.tableData}
                                // loading={this.state.loading}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                             {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                        </TabPane>
                        <TabPane tab="极值数据" key="3">
                            <Table
                                scroll={2650}
                                columns={this.state.columns3}
                                dataSource={this.state.tableData}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                             {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                        </TabPane>
                        <TabPane tab="报警数据" key="4">
                            <Table
                                scroll={3850}
                                columns={this.state.columns4}
                                dataSource={this.state.tableData}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                             {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                        </TabPane>
                        <TabPane tab="可充电储能装置电压数据" key="5">
                            <Table
                                scroll={1850}
                                columns={this.state.columns5}
                                dataSource={this.state.tableData}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                             {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                        </TabPane>
                        <TabPane tab="可充电储能装置温度数据" key="6">
                            <Table
                                scroll={1350}
                                columns={this.state.columns6}
                                dataSource={this.state.tableData}
                                total={this.state.total}
                                current={this.state.current}
                                pageSize={this.state.pageSize}
                                onChange={this.onChange}
                            />
                             {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入查询条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            <style>
                {`
                    .historyBox .ant-tabs-bar{margin:0px}
                    .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{margin-right:0px;border-top:none;border-left:none;}
                    .dataStatus{width:260px;text-align:center;position:absolute;left:45%;top:45%;}
                    .ant-tabs-tab-active{background:#F1F2F4 !important;color:#333 !important;}
                    .ant-tabs-tab{color:#999;line-height:32px !important;padding:0 10px !important;font-size:12px;}
                    .ant-tabs-tab:hover{color:#333 !important;}
                    .historyBox .ant-tabs-card-content{margin-top:-8px}
                    .oprateHead .btn{margin-bottom:0px;}
                    .table{margin-top:25px;}
                `}
            </style>
        </div>
        )
    }
}

const distoryDatas = Form.create()(distoryData);
export default distoryDatas;