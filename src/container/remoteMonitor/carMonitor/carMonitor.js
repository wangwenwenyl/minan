import React from 'react'
import { Row, Col, Tabs, Pagination } from 'antd'
import './carMonitor.css'
import { Map } from 'react-amap'
import carimg from './../../../img/che.png'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/gauge';
import { webSocketUrl, webSocketUrl1 } from './../../../util/httpConfig'
import DataConfig from './dataConfig'
import monitor from './../../../img/index/monitor2.jpg'
import monitor2 from './../../../img/index/monitor.jpg'
import setting from './../../../img/index/set.jpg'
import lock from './../../../img/carMonitor/10.png'
import lock1 from './../../../img/carMonitor/13.png'
import onlock from './../../../img/carMonitor/11.png'
import onlock2 from './../../../img/carMonitor/12.png'
import trunk from './../../../img/carMonitor/17.png'
import trunk2 from './../../../img/carMonitor/16.png'
import untrunk from './../../../img/carMonitor/15.png'
import untrunk2 from './../../../img/carMonitor/22.png'
import cardoor from './../../../img/carMonitor/1.png'
import cardoor2 from './../../../img/carMonitor/8.png'
import uncardoor from './../../../img/carMonitor/7.png'
import uncardoor2 from './../../../img/carMonitor/22.png'
import skylight from './../../../img/carMonitor/20.png'
import skylight2 from './../../../img/carMonitor/6.png'
import unskylight from './../../../img/carMonitor/19.png'
import unskylight2 from './../../../img/carMonitor/18.png'
import Aconditioner from './../../../img/carMonitor/9.png'
import Aconditioner2 from './../../../img/carMonitor/14.png'
import Dflashhorns from './../../../img/carMonitor/2.png'
import Dflashhorns2 from './../../../img/carMonitor/4.png'
import carStatus from './../../../img/carMonitor/carstatus.png'
import sim from './../../../img/carMonitor/iccid.png'
import speed from './../../../img/carMonitor/chesu.png'
import mileage from './../../../img/carMonitor/icon.png'
import model from './../../../img/carMonitor/xinghao.png'
import motor from './../../../img/carMonitor/dianji.png'
import rname from './../../../img/carMonitor/rname.png'
import online from './../../../img/index/online.png'
import outline from './../../../img/index/outline.png'
import wran from './../../../img/index/warn.png'
import unwarn from './../../../img/index/unwarn.png'
import charging from './../../../img/index/charging.png'
import outage from './../../../img/index/outage.png'
import botIcon from './../../../img/bot.png'
import commonWarn from './commonWarm'

const TabPane = Tabs.TabPane;
class carMonitor extends React.Component {
    constructor() {
        super()
        this.state = {
            list: ['信息体', '车辆静态信息', '参数查询'],
            content: [
                { item: '内容一' },
                { item: '内容二' },
                { item: '内容三' }
            ],
            current: 0,
            click: false,
            websocketData: [],
            carMonitorClick: false,   //车控
            configVisable: false,
            carDetailDom: "", //车辆信息dom
            driveMData: "",   //驱动电机数据
            energySVData: "",  //可充电储能装置电压数据
            energySTData: "",    //可充电储能子系统温度
            mapInstance: '',
            getStatus: false,
            websocketMonitor: '',
            carMonitorMsg: "",  //车控提示
            timer: 60,  //计时器
            WebSocketType: false,
            monitorList: {
                VEHICLE_CENTRAL_LOCK: false, // 解锁中控锁
                VEHICLE_BACK_DOOR: false,    //开启后备门
                VEHICLE_WINDOW: false,
                SKY_LIGHT: false,   //天窗
                AIR_CONDITION: false,
                VEHICLE_CENTRAL_LOCK2: false,
                VEHICLE_BACK_DOOR2: false,
                VEHICLE_WINDOW2: false,
                SKY_LIGHT2: false,
                REMOTE_LOCATING: false
            },
            scrollToptarget: false //是否置顶
        }
        this.settime = ''
    }
    componentDidMount() {
        let _t = this
        console.log(this.props.match.params.vin)
        this.WebSocketconnect()
        this.websocketMonitor()
        window.addEventListener('scroll', this.handleScroll, true)
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll, true);
    }
    handleScroll = (event) => {
        let scrollTops = event.target.scrollTop
        if (scrollTops >= 370) {
            this.setState({ scrollToptarget: true })
        } else {
            this.setState({ scrollToptarget: false })
        }
    }
    //菜单项单击事件
    spanClick = (index) => {
        this.setState({ current: index })
        switch (index) {
            case 0:
                document.getElementById("root").scrollTo(0, 360)
                break;
            case 1:
                document.getElementById("root").scrollTo(0, 1470)
                break;
            case 2:
                document.getElementById("root").scrollTo(0, 1823)
                break;
        }
    }
    setEcharts1 = (websocketData) => {
        let myChart = echarts.init(document.getElementById('echarts1'));
        let myChart2 = echarts.init(document.getElementById('echarts2'));
        let val = websocketData.vehicleBaseData
        console.log(val)
        let option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}Km/h"
            },
            toolbox: {
                feature: {
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [
                {
                    name: '车速',
                    type: 'gauge',
                    radius: "100%",
                    distance: 1,
                    axisTick: {
                        length: '3'
                    },
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [[0.2, "#94BDFF"], [0.8, "#347FFF"], [1, "#FD7A7A"]],
                        }
                    },
                    splitLine: {
                        length: '4',
                        lineStyle: {
                            width: 1,
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: true,
                        length: "70%",
                        width: 4,
                    },
                    detail: {
                        formatter: '{value}\nKm/h',
                        fontSize: 14,
                        color: '#333333',
                        offsetCenter: [0, "80%"]
                    },
                    title: {
                        show: false,
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic'
                    },
                    data: [{ value: val ? val.speed : 0, name: 'Km/h' }]
                },

            ]
        };
        let option2 = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}Km"
            },
            toolbox: {
                feature: {
                    restore: {
                        show: false
                    },
                    saveAsImage: {
                        show: false
                    }
                }
            },
            series: [
                {
                    name: '累计里程',
                    type: 'gauge',
                    radius: "100%",
                    distance: 1,
                    axisTick: {
                        length: '3'
                    },
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [[0.2, "#94BDFF"], [0.8, "#347FFF"], [1, "#FD7A7A"]],
                        }
                    },
                    splitLine: {
                        length: '4',
                        lineStyle: {
                            width: 1,
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: true,
                        length: "70%",
                        width: 4,
                    },
                    detail: {
                        formatter: '{value}\nKm',
                        fontSize: 14,
                        color: '#333333',
                        offsetCenter: [0, "80%"]
                    },
                    title: {
                        show: false,
                        fontWeight: 'bolder',
                        fontSize: 14,
                        fontStyle: 'italic'
                    },
                    data: [{ value: val ? val.sumKm : 0, name: 'Km/h' }]
                }
            ]
        }
        myChart.setOption(option, true);
        myChart2.setOption(option2, true);
    }
    //websocket连接
    WebSocketconnect = () => {
        let _t = this
        if ("WebSocket" in window) {
            var ws = new WebSocket(webSocketUrl);
            ws.onerror = function () {
                // setTimeout(()=>{
                //     _t.WebSocketconnect()
                // },3000)
                console.log('fail...')
            }
            ws.onopen = function () {
                console.log("send...");
            };
            ws.onmessage = function (evt) {
                console.log("succes")
                let params = {
                    token: sessionStorage.getItem("token"),
                    vinName: _t.props.match.params.vin
                }
                var received_msg = evt.data;
                if (received_msg == 'CONN-IS-OK') {
                    ws.send(JSON.stringify(params))
                    return;
                }
                if (JSON.parse(received_msg).code == "100000") {
                    let websocketData = JSON.parse(received_msg).data
                    _t.setState({ websocketData })
                    _t.setEcharts1(websocketData)
                    _t.setState({
                        driveMData: websocketData.driveMotorData ? websocketData.driveMotorData.drivemotorSingleDatas ? websocketData.driveMotorData.drivemotorSingleDatas[0] : null : null,
                        energySVData: websocketData.energyStorageVoltageData ? websocketData.energyStorageVoltageData.energyStorageVoltageSingleDataList ? websocketData.energyStorageVoltageData.energyStorageVoltageSingleDataList[0] : null : null,
                        energySTData: websocketData.energyStorageTempData ? websocketData.energyStorageTempData.energyStorgeTempSingleData ? websocketData.energyStorageTempData.energyStorgeTempSingleData[0] : null : null,
                        getStatus: true
                    })
                }
            };
        } else {
            alert("您的浏览器不支持 WebSocket!");
        }
    }
    //车辆详情收起缩放
    floatBox = () => {
        this.setState({ click: !this.state.click })
    }
    // 车控
    carMonitorClick = () => {
        this.setState({ carMonitorClick: !this.state.carMonitorClick })
    }
    //设置
    carConfig = () => {
        this.setState({ configVisable: true })
    }
    //取消设置
    carConfigCancel = () => {
        this.setState({ configVisable: false })
    }
    //通用告警
    commonWarm = () => {
        let data = this.state.websocketData.warningData.commonWarm
        let arr = []
        let str = ''
        for (let i in data) {
            if (data[i] > 0) {
                arr.push(commonWarn[i])
                str = arr.join(',')
            } else {
                str = '无'
            }
        }
        return str;
    }
    //整车数据  驱动电机
    carChange = (num) => {
        console.log(num)
        let data = this.state.websocketData.driveMotorData.drivemotorSingleDatas[num - 1]
        this.setState({ driveMData: data })
    }
    //可充电储能装置电压
    carChange2 = (num) => {
        let data = this.state.websocketData.energyStorageVoltageData.energyStorageVoltageSingleDataList[num - 1]
        this.setState({ energySVData: data })
    }
    //可充电储能装置温度
    carChange3 = (num) => {
        let data = this.state.websocketData.energyStorageTempData.energyStorgeTempSingleData[num - 1]
        this.setState({ energySTData: data })
    }
    //地图
    map = {
        created: (map) => {
            this.setState({ mapInstance: map })
            window.AMapUI.loadUI(['misc/PathSimplifier'], (PathSimplifier) => {
                this.initPage(PathSimplifier)
            })
        }
    }
    initPage = (PathSimplifier) => {
        let positionData = this.state.websocketData.list
        let pathSimplifier = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: this.state.mapInstance, //所属的地图实例
            clickToSelectPath: false,
            getPath: function (pathData, pathIndex) {
                let lnglatList = [];
                for (var i = 0, len = pathData.length; i < len; i++) {
                    lnglatList.push(pathData[i].position);
                }
                return lnglatList;
            },
            getHoverTitle: function (pathData, pathIndex, pointIndex) {
                console.log(pathData)
                if (pointIndex >= 0) {
                    //point 
                    return (
                        `<div class="path_title">
                           <p>${pathData[pointIndex].location}</p>
                            <p>东经${pathData[pointIndex].position[0] + '°'} 北纬${pathData[pointIndex].position[1] + '°'}</p>
                            <p>${pathData[pointIndex].uploadTime}</p>
                        </div>`
                    )
                }
                // return pathData.location + '，点数量' + pathData.length;
            },
            renderOptions: {
                pathLineStyle: {
                    strokeStyle: "#3885FF",
                    borderStyle: "#3885FF",
                },
                keyPointStyle: {
                    fillStyle: "#FFFFFF",
                    strokeStyle: "#3885FF",
                    lineWidth: "2px"
                },
                pathLineHoverStyle: {
                    strokeStyle: "#3885FF",
                    borderStyle: "#3885FF",
                },
                pathLineSelectedStyle: {
                    strokeStyle: "#3885FF",
                    borderStyle: "#3885FF",
                },
                renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
            }
        });
        window.pathSimplifier = pathSimplifier;
        let data = this.state.websocketData.list
        if (data) {
            pathSimplifier.setData([data])
        }
        // pathSimplifier.setData([{
        //     name: '路线0',
        //     points: [{
        //         name: "点a",
        //         lnglat: [116.405289, 39.904987]
        //     }, {
        //         name: "点b",
        //         lnglat: [113.964458, 40.54664]
        //     }, {
        //         name: "点c",
        //         lnglat: [111.47836, 41.135964]
        //     }, {
        //         name: "点d",
        //         lnglat: [108.949297, 41.670904]
        //     }, {
        //         name: "点e",
        //         lnglat: [106.380111, 42.149509]
        //     }, {
        //         name: "点f",
        //         lnglat: [103.774185, 42.56996]
        //     }, {
        //         name: "点g",
        //         lnglat: [101.135432, 42.930601]
        //     }, {
        //         name: "点h",
        //         lnglat: [98.46826, 43.229964]
        //     }, {
        //         name: "点i",
        //         lnglat: [95.777529, 43.466798]
        //     }, {
        //         name: "点j",
        //         lnglat: [93.068486, 43.64009]
        //     }, {
        //         name: "点k",
        //         lnglat: [90.34669, 43.749086]
        //     }, {
        //         name: "点l",
        //         lnglat: [87.61792, 43.793308]
        //     }]
        // }]);
    }
    //车控
    websocketMonitor = () => {
        let token = sessionStorage.getItem('token')
        let _t = this;
        if ("WebSocket" in window) {
            var ws = new WebSocket(webSocketUrl1 + token);
            this.setState({ websocketMonitor: ws })
            ws.onerror = function () {
                console.log('fail...')
            }
            ws.onopen = function () {
                console.log("send...");
            };
            ws.onmessage = function (evt) {
                console.log("------success")
                let code = JSON.parse(evt.data).code
                if (code != "290001") {
                    _t.setState({ carMonitorMsg: JSON.parse(evt.data).msg })
                }
                if (code == "100000" || code == "290033" || code == "290023" || code == "290022" || code == "290012") {
                    _t.setState({ WebSocketType: false })
                    clearTimeout(_t.settime)
                    setTimeout(() => {
                        let list = _t.state.monitorList
                        for (let i in list) {
                            list[i] = false
                        }
                        _t.setState({ monitorList: list, carMonitorMsg: '' })
                    }, 3000)
                }
            }
        }
    }
    carMonitors = (type, monitor) => {
        if (this.state.WebSocketType) {
            return;
        }
        let list = this.state.monitorList
        for (let i in list) {
            list[i] = false
        }
        list[type == 2 ? monitor + '2' : monitor] = true
        this.setState({ WebSocketType: true, monitorList: list, timer:60 }, () => {
            this.timer()
        })
        let params = {
            cid: monitor,
            data: {
                open: type
            },
            vin: this.props.match.params.vin,
            reqId: 1,
            seq: "0a67117818394177"
        }
        this.state.websocketMonitor.send(JSON.stringify(params))
    }
    timer = () => {
        let _t = this;
        if (_t.state.timer > 0) {
            this.setState({ timer: this.state.timer - 1 })
            this.settime = setTimeout(_t.timer, 1000)
        } else {
            let list = _t.state.monitorList
            for (let i in list) {
                list[i] = false
            }
            _t.setState({ monitorList: list, carMonitorMsg: '' })
            return false;
        }
    }
    render() {
        let baseInfo = this.state.websocketData.vehicleControlBaseInfo
        let baseData = this.state.websocketData.vehicleBaseData
        let warningData = this.state.websocketData.warningData
        let extremumData = this.state.websocketData.extremumData
        let driveMData = this.state.driveMData
        let driveNum = this.state.websocketData.driveMotorData
        let energySVData = this.state.energySVData
        let energyNum = this.state.websocketData.energyStorageVoltageData
        let energySTData = this.state.energySTData
        let energySTNum = this.state.websocketData.energyStorageTempData
        let vehicleSInfo = this.state.websocketData.vehicleStaticInfo
        let paramQueryD = this.state.websocketData.paramQueryData
        return (
            <div className="car_monitor" id="car_monitor" >
                <Row>
                    <Col span={24} className="car_title">单车监控</Col>
                    <Col span={24} className="car_map">
                        {this.state.getStatus && <Map amapkey={'71477380fc31e5291f93952b10091bf6'}
                            events={this.map}
                            plugins={this.mapPlugins}
                            useAMapUI={true}
                            mapStyle={"amap://styles/whitesmoke"}
                        />}
                        {/* 车辆信息 */}
                        <div className={['car_detail', this.state.click && 'car_detail_click'].join(' ')}>
                            {!this.state.click && baseInfo &&
                                <div>
                                    <p><span className="dot"></span><span>车牌号：{baseInfo && baseInfo.plateNo && baseInfo.plateNo}</span>
                                        <span style={{ float: 'right', marginRight: "10px" }}>
                                            <img src={baseInfo.onlineStatus == '1' ? online : outline} />
                                            <img style={{ marginLeft: '6px' }} src={baseInfo.warningStatus == '1' ? wran : unwarn} />
                                            <img style={{ marginLeft: '6px' }} src={baseInfo.chargeStatus == '1' ? charging : outage} />
                                        </span>
                                    </p>
                                    <p><span className="dot"></span>车型：{baseInfo && baseInfo.carType && baseInfo.carType}</p>
                                    <p><span className="dot"></span>车主：{baseInfo && baseInfo.name && baseInfo.name}{baseInfo && baseInfo.mobile && baseInfo.mobile}</p>
                                    <p><span className="dot"></span>车身颜色：{baseInfo && baseInfo.carColor && baseInfo.carColor}</p>
                                    <p><span className="dot"></span>VIN：{baseInfo && baseInfo.vin && baseInfo.vin}</p>
                                    <p><span className="dot"></span>终端SN：{baseInfo && baseInfo.sn && baseInfo.sn}</p>
                                    <p><span className="dot"></span>终端SN状态：{baseInfo && baseInfo.snStatus && baseInfo.snStatus == '1' ? '在线' : '离线'}</p>
                                </div>}
                            {!this.state.click &&
                                <p className="car_detail_bot">
                                    <span onClick={this.carMonitorClick} style={{ cursor: 'pointer', color: this.state.carMonitorClick ? "#3689FF" : "#5F6579" }}><img src={this.state.carMonitorClick ? monitor2 : monitor}></img>车控</span>
                                    <span onClick={this.carConfig} style={{ cursor: 'pointer' }}><img src={setting}></img>设置</span>
                                </p>}
                            <div className={!this.state.click ? "float_box" : "float_box1"} onClick={this.floatBox}><span></span></div>
                        </div>
                        {/* 车控 */}
                        <div className="car_monitor_m" style={{ display: this.state.carMonitorClick ? "block" : "none" }}>
                            {this.state.carMonitorMsg && <p>{this.state.carMonitorMsg}<span>{this.state.timer}s</span></p>}
                            <div>
                                <div onClick={() => { this.carMonitors(1, "VEHICLE_CENTRAL_LOCK") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_CENTRAL_LOCK ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_CENTRAL_LOCK ? lock1 : lock}></img></span>
                                    <p>解锁中控锁</p>
                                </div>
                                <div onClick={() => { this.carMonitors(1, "VEHICLE_BACK_DOOR") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_BACK_DOOR ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_BACK_DOOR ? trunk2 : trunk}></img></span>
                                    <p>开启后备门</p>
                                </div>
                                <div onClick={() => { this.carMonitors(1, "VEHICLE_WINDOW") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_WINDOW ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_WINDOW ? cardoor2 : cardoor}></img></span>
                                    <p>开启车窗</p>
                                </div>
                                <div onClick={() => { this.carMonitors(1, "SKY_LIGHT") }}>
                                    <span style={{ border: this.state.monitorList.SKY_LIGHT ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.SKY_LIGHT ? skylight2 : skylight}></img></span>
                                    <p>开启天窗</p>
                                </div>
                                <div onClick={() => { this.carMonitors(1, "AIR_CONDITION") }}>
                                    <span style={{ border: this.state.monitorList.AIR_CONDITION ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.AIR_CONDITION ? Aconditioner2 : Aconditioner}></img></span>
                                    <p>开启空调</p>
                                </div>
                                <div onClick={() => { this.carMonitors(2, "VEHICLE_CENTRAL_LOCK") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_CENTRAL_LOCK2 ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_CENTRAL_LOCK2 ? onlock2 : onlock}></img></span>
                                    <p>锁定中控锁</p>
                                </div>
                                <div onClick={() => { this.carMonitors(2, "VEHICLE_BACK_DOOR") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_BACK_DOOR2 ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_BACK_DOOR2 ? untrunk2 : untrunk}></img></span>
                                    <p>关闭后备门</p>
                                </div>
                                <div onClick={() => { this.carMonitors(2, "VEHICLE_WINDOW") }}>
                                    <span style={{ border: this.state.monitorList.VEHICLE_WINDOW2 ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.VEHICLE_WINDOW2 ? uncardoor2 : uncardoor}></img></span>
                                    <p>关闭车窗</p>
                                </div>
                                <div onClick={() => { this.carMonitors(2, "SKY_LIGHT") }}>
                                    <span style={{ border: this.state.monitorList.SKY_LIGHT2 ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.SKY_LIGHT2 ? unskylight2 : unskylight}></img></span>
                                    <p>关闭天窗</p>
                                </div>
                                <div onClick={() => { this.carMonitors(1, "REMOTE_LOCATING") }}>
                                    <span style={{ border: this.state.monitorList.REMOTE_LOCATING ? "1px solid #3689FF" : "1px solid #E4E4E4" }}><img src={this.state.monitorList.REMOTE_LOCATING ? Dflashhorns2 : Dflashhorns}></img></span>
                                    <p>双闪鸣笛</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={24}>
                        <Col span={24} className="top_nav" style={{ background: "#fff", position: this.state.scrollToptarget ? "fixed" : "relative", top: "0", zIndex: "10" }}>
                            {this.state.list.map((val, index) => {
                                return (
                                    <span className={index == this.state.current ? "span_active" : ''} onClick={() => { this.spanClick(index) }}><a>{val}</a></span>
                                )
                            })}
                        </Col>
                        <Col span={24} style={{ color: "#000" }}>
                            <div id="carData" className="car_data">
                                <p><span></span><span style={{ color: "#333B5B" }}>整车数据</span></p>
                                <div className="car_data_top">
                                    <Col span={6} className="data_detail">
                                        <p>车辆状态：{baseData && baseData.vehicleStatus}</p>
                                        <p>充电状态：
                                        {baseData && baseData.chargeStatus}
                                        </p>
                                        <p>运行模式：
                                        {baseData && baseData.workingModel}
                                        </p>
                                    </Col>
                                    <Col span={6} className="data_detail">
                                        <p>总电压：{baseData && baseData.totalVoltage}</p>
                                        <p>总电流：{baseData && baseData.totalCurrent}</p>
                                        <p>加速踏板行程值：{baseData && baseData.accPedal}</p>
                                    </Col>
                                    <Col span={6} className="data_detail">
                                        <p>SOC：{baseData && baseData.soc}</p>
                                        <p>档位：
                                        {baseData && baseData.gear && baseData.gear.gear}
                                        </p>
                                        <p>制动踏板状态：{baseData && baseData.brakePedalStatus}</p>
                                    </Col>
                                    <Col span={6} className="data_detail">
                                        <p>DC-DC状态：{baseData && baseData.dcStatus}</p>
                                        <p>绝缘电阻：{baseData && baseData.insulateResist}</p>
                                        <p>数据采集时间：{this.state.websocketData && this.state.websocketData.uploadTime}</p>
                                    </Col>
                                </div>
                                <div className="car_data_middle">
                                    <Col span={8}>
                                        <div style={{ float: "right" }}>
                                            <p>车速</p>
                                            <div id="echarts1" ></div>
                                            <p className="wran_data_dot">报警数据<span></span><span></span></p>
                                            <div className="warn_data">
                                                <p>最高报警：{warningData && warningData.maxWarnLevel}</p>
                                                <p>通用报警：{warningData && warningData.commonWarm}</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <img src={carimg}></img>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <p>累计里程</p>
                                            <div id="echarts2"></div>
                                            <p className="extremum_data_dot"><span></span><span></span>极值数据</p>
                                            <div className="extremum_data">
                                                <Tabs
                                                    defaultActiveKey="1"
                                                    tabPosition="left"
                                                >
                                                    <TabPane tab="最高电压" key="1">
                                                        <p>子系统号：{extremumData && extremumData.maxVoltageCellSysNum}</p>
                                                        <p>单体代号：{extremumData && extremumData.maxVoltageCellCode}</p>
                                                        <p>电压值：{extremumData && extremumData.cellMaxVoltage}</p>
                                                    </TabPane>
                                                    <TabPane tab="最低电压" key="2">
                                                        <p>子系统号：{extremumData && extremumData.minVoltageCellSysNum}</p>
                                                        <p>单体代号：{extremumData && extremumData.minVoltageCellCode}</p>
                                                        <p>电压值：{extremumData && extremumData.cellMinVoltage}</p>
                                                    </TabPane>
                                                    <TabPane tab="最高温度" key="3">
                                                        <p>子系统号：{extremumData && extremumData.maxTempSysNum}</p>
                                                        <p>探针序号：{extremumData && extremumData.maxTempProbeSeq}</p>
                                                        <p>温度值：{extremumData && extremumData.maxTemp}</p>
                                                    </TabPane>
                                                    <TabPane tab="最低温度" key="4">
                                                        <p>子系统号：{extremumData && extremumData.minTempSysNum}</p>
                                                        <p>探针序号：{extremumData && extremumData.minTempProbeSeq}</p>
                                                        <p>温度值：{extremumData && extremumData.minTemp}</p>
                                                    </TabPane>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </Col>
                                </div>
                                <div className="car_data_bottom">
                                    <Col span={8}>
                                        <div>
                                            <div>
                                                <p className="right_icon"><img src={rname}></img></p>
                                                <h3>驱动电机数据</h3>
                                                {<p>驱动电机状态：
                                            {driveMData && driveMData.driveMotorStatus}
                                                </p>}
                                                <p>控制器温度：
                                        {driveMData && driveMData.controllerTemp}
                                                </p>
                                                <p>驱动电机转速：{driveMData && driveMData.revs}</p>
                                                <p>驱动电机转矩：{driveMData && driveMData.torque}</p>
                                                <p>驱动电机温度：{driveMData && driveMData.driveMotorTemp}</p>
                                                <p>控制器输入电压：{driveMData && driveMData.controllerVoltage}</p>
                                                <p>控制器直流母线电流：{driveMData && driveMData.controllerCurrent}</p>
                                            </div>
                                            <Pagination size="small" defaultCurrent={1} total={driveNum && driveNum.driveMotorNum * 10} onChange={this.carChange}></Pagination>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <div>
                                                <p className="right_icon"><img src={rname}></img></p>
                                                <h3>可充电储能装置电压数据：</h3>
                                                <p>可充电储能装置电压：
                                        {energySVData && energySVData.voltage}
                                                </p>
                                                <p>可充电储能装置电流：
                                        {energySVData && energySVData.current}
                                                </p>
                                                <p>单体电池总数：
                                        {energySVData && energySVData.singleBatterySum}
                                                </p>
                                                <p>本帧起始电池序号：
                                        {energySVData && energySVData.frameBatteryCode}
                                                </p>
                                                <p>本帧单体电池总数：
                                        {energySVData && energySVData.frameBatterySum}
                                                </p>
                                                <p>单体电池电压：
                                        {energySVData && energySVData.singleBatteryVoltage.join(',')
                                                    }
                                                </p>
                                            </div>
                                            <Pagination size="small" defaultCurrent={1} total={energyNum && energyNum.sysNum * 10} onChange={this.carChange2}></Pagination>
                                        </div>
                                    </Col>
                                    <Col span={8}>
                                        <div>
                                            <div>
                                                <p className="right_icon"><img src={rname}></img></p>
                                                <h3>可充电储能装置温度数据</h3>
                                                <p>可充电储能温度探针个数：{
                                                    energySTData && energySTData.probeNum
                                                }</p>
                                                <p>可充电储能子系统各温度探针检测到的温度值：{
                                                    energySTData && energySTData.sysTemps.join(',')
                                                }</p>
                                            </div>
                                            <Pagination size="small" defaultCurrent={1} total={energySTNum && energySTNum.sysNum * 10} onChange={this.carChange3}></Pagination>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            <p style={{ background: "#F1F2F4", height: "5px" }}></p>
                            <div id="carStatic">
                                <p className="car_static"><img src={carStatus} />车辆静态信息</p>
                                <p className="car_line"><span><span></span></span></p>
                                <div style={{ marginLeft: "4%" }}>
                                    <p><img src={sim} /></p>
                                    <p>SIM卡ICCID号</p>
                                    <p>{vehicleSInfo && vehicleSInfo.iccid && vehicleSInfo.iccid}</p>
                                </div>
                                <div>
                                    <p><img src={speed} /></p>
                                    <p>最高车速 </p>
                                    <p>{vehicleSInfo && vehicleSInfo.maxSpeed && (vehicleSInfo.maxSpeed + "公里")}</p>
                                </div>
                                <div>
                                    <p><img src={mileage} /></p>
                                    <p>纯电续驶里程</p>
                                    <p>{vehicleSInfo && vehicleSInfo.extensionMileage && (vehicleSInfo.extensionMileage + "公里")}</p>
                                </div>
                                <div>
                                    <p><img src={model} /></p>
                                    <p>型号 </p>
                                    <p>{vehicleSInfo && vehicleSInfo.carModel && vehicleSInfo.carModel}</p>
                                </div>
                                <div style={{ marginRight: "4%" }}>
                                    <p><img src={motor} /></p>
                                    <p>驱动电机布置型式/位置</p>
                                    <p>{vehicleSInfo && vehicleSInfo.drivingMotorType && vehicleSInfo.drivingMotorType}</p>
                                </div>
                            </div>
                            <p style={{ background: "#F1F2F4", height: "5px" }}></p>
                            <div id="searchData">
                                <p className="car_static"><img src={carStatus} />参数查询</p>
                                <p className="car_line"><span><span></span></span></p>
                                <div className="searc_data">
                                    <Col span={8}>
                                        <p><span></span>车载终端本地存储时间周期{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['1']}ms</p>
                                        <p><span></span>远程服务与管理平台域名长度：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['4']}M</p>
                                        <p><span></span>硬件版本：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['7']}</p>
                                        <p><span></span>终端应答超时时间：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['10']}s</p>
                                        <p><span></span>公共平台域名长度：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['13']}n</p>
                                        <p><span></span>是否处于抽样监测：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['16']}</p>
                                    </Col>
                                    <Col span={8}>
                                        <p><span></span>正常时，信息上报时间周期：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['2']}ms</p>
                                        <p><span></span>远程服务与管理平台域名：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['5']}M</p>
                                        <p><span></span>固件版本：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['8']}</p>
                                        <p><span></span>平台应答超时时间：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['11']}s</p>
                                        <p><span></span>公共平台域名：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['14']}</p>
                                        <p><span></span>更新时间：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.reloadTime}</p>
                                    </Col>
                                    <Col span={8}>
                                        <p><span></span>出现报警时，信息上报时间周期：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['3']}ms</p>
                                        <p><span></span>远程服务与管理平台端口：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['6']}M</p>
                                        <p><span></span>车载终端心跳发送周期：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['9']}</p>
                                        <p><span></span>连续三次登入失败后，到下一次登入的间隔时间：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['12']}s</p>
                                        <p><span></span>公共平台端口：{paramQueryD && paramQueryD.paramQueryDataMap && paramQueryD.paramQueryDataMap['15']}</p>
                                    </Col>
                                </div>
                            </div>
                            <div style={{textAlign:"center"}}><img src={botIcon} style={{verticalAlign:"bottom"}} /></div>
                        </Col>
                    </Col>
                </Row>
                {/* 参数设置 */}
                <DataConfig configVisable={this.state.configVisable} carConfigCancel={this.carConfigCancel} vin={this.props.match.params.vin}></DataConfig>
                <style>
                    {`
                        body{min-width:auto}
                        .overlay-title{background-color:#fff!important}
                        .ant-tabs-nav{border: 1px solid #E4E4E4;}
                        .ant-pagination li{margin-right: 5px!important;}
                    `}
                </style>
            </div>
        )
    }
}

export default carMonitor