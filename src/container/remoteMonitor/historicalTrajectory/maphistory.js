import React, { Component, Fragment } from 'react'
import { Map, Polyline, Marker } from 'react-amap';
import { Timeline, Modal, Form, Button, Icon, Col, Slider } from 'antd';
import Axios from 'axios';
import { httpConfig } from '../../../util/httpConfig';
import carpng from './../../../img/zaixianche.png'
const polylines = {
    strokeColor: '#3885FF',
    strokeWeight: 3,
    lineCap: 'round'
}
const makerPolyline = {
    strokeColor: '#AF5',
    strokeWeight: 5,
    lineCap: 'round'
}
const markerStarts = {
    width: '12px',
    height: '12px',
    color: '#000',
    borderRadius: '100%',
    textAlign: 'center',
    lineHeight: '30px',
    background: '#ffffff',
    border: ' 2px solid #31D675',
    boxShadow: '0 2px 4px 0 #8FFFBD',
    position: 'absolute',
    top: '20px',
    left: '-6px'
}
const markerEnds = {
    width: '12px',
    height: '12px',
    color: '#000',
    borderRadius: '100%',
    textAlign: 'center',
    lineHeight: '30px',
    background: '#ffffff',
    border: ' 2px solid #F75757',
    boxShadow: '0 2px 4px 0 #FFC0C0',
    position: 'absolute',
    top: '20px',
    left: '-6px'
}
class viewInform extends Component {
    constructor() {
        super()
        this.state = {
            details: [],//详情data
            path: [],//得到的轨迹
            makerPath: [],//行驶轨迹
            routeList: [],//详情坐标点集
            markerStart: '',
            markerEnd: '',
            historMarker: '',
            animation: '',
            viewVisite: false,
            hisVisible: false,
            allMarkers: '',
            lineEvent: '',
            mapEvent: '',
            btnstatus:true,  //按钮播放状态
            sliderValue:0, //进度条值
            totalTime:0,
            timer:''  //定时器
        }
    }
    componentDidMount() {
    }
    viewLists = (record) => {
        Axios.get('http://42.159.92.113/api/vehicle/historyTrack/findDetails?id='+record.id, httpConfig).then(res => {
            if (res.status == 200 && res.data.code === '100000') {
                this.setState({
                    viewVisite: true,
                    details: res.data.data.details,
                    routeList: res.data.data.routeList
                })
                let positionArr = []
                for (let i = 0; i < res.data.data.routeList.length; i++) {
                    positionArr.push([
                        res.data.data.routeList[i].position[0],
                        res.data.data.routeList[i].position[1],
                    ])
                }
                if (true) {
                    // let markerStart = new AMap.LngLat(res.data.data.details.startLon,res.data.data.details.startLat)
                    this.setState({
                        path: positionArr,
                        makerPath: positionArr,
                        markerStart: 
                        {
                            longitude: res.data.data.details.startLon,
                            latitude: res.data.data.details.startLat,}
                        ,
                        markerEnd: {
                            longitude: res.data.data.details.endLon,
                            latitude: res.data.data.details.endLat,
                        },
                        content: res.data.data.details,
                    })
                }
            }
        })
    }
    viewCancel = () => {
        this.setState({
            details: [],//详情data
            path: [],//得到的轨迹
            makerPath: [],//行驶轨迹
            routeList: [],//详情坐标点集
            markerStart: '',
            markerEnd: '',
            historMarker: '',
            animation: '',
            viewVisite: false,
            sliderValue:0, //进度条值
            totalTime:0,
        })
    }
    mapEvents = {
        created: (mapEvent) => {
            this.setState({ mapEvent })
        }
    }
    historEvents = {
        created: (allMarkers) => {
            this.setState({ allMarkers })
        },
        // moving: (e) => {
        //     this.state.lineEvent.setPath(e.passedPath);
        // }

    }
    lineEvents = {
        created: (lineEvent) => {
            this.setState({ lineEvent })
        },
    }
    polyline={
        created: (lineEvent) => {
            let distance = Math.round(AMap.GeometryUtil.distanceOfLine(this.state.path));
            let totalTime = distance/1000/1000*60*60
            console.log(this.state.path)
            this.setState({totalTime})
        },
    }
    startAnimation = () => {
        let lineArr = this.state.path
        let lineArrN = []
        for (let i = 0; i < lineArr.length; i++) {
            lineArrN.push(new AMap.LngLat(lineArr[i][0], lineArr[i][1]))
        }
        if(this.state.sliderValue>0){
            setTimeout(()=>{
                this.state.allMarkers.resumeMove();
            },500)
        }else{
            this.state.allMarkers.moveAlong(lineArrN, 1000);
        }
        this.setState({btnstatus:false})
        this.progressBar()
    }
    //进度条
    progressBar=()=>{
        let self = this
        let timer = setInterval(()=>{
            this.setState({sliderValue:self.state.sliderValue+1},()=>{
                if(self.state.sliderValue>this.state.totalTime){
                    clearInterval(timer)
                    this.setState({sliderValue:0,btnstatus:true})
                }
            })
        },1000)
        this.setState({timer})
    }
    pauseAnimation = () => {
        clearInterval(this.state.timer)
        this.state.allMarkers.pauseMove()
        this.setState({btnstatus:true})
    }
    resumeAnimation = () => {
        this.state.allMarkers.resumeMove();
    }
    stopAnimation = () => {
        this.state.allMarkers.stopMove()
    }
    formatter=(value)=>{
        let t='';
        // let s = value*(this.state.totalTime/100)
        let s = value
        if(s > -1){
            let min = Math.floor(s/60);
            let sec = s % 60;
            if(min <= 9){t += "0";}
            t += min + ":";
            if(sec <= 9){t += "0";}
            t += sec.toFixed(0)
        }
        return t
    }
    render() {
        let { details } = this.state;
        let t = this.state.totalTime
        return (
            <Modal
                title="详情"
                visible={this.state.viewVisite}
                onOk={this.viewSuccess}
                onCancel={this.viewCancel}
                footer={null}
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                destroyOnClose={true}
                className='mapModal'
            >
                <Fragment>
                    <div style={{ width: '100%', height: '100%' }}>
                        <Map
                            zoom={10}
                            mapStyle={"amap://styles/whitesmoke"}
                            center={this.state.markerStart}
                            events={this.mapEvents}
                            version={'1.4.2'}
                        >
                            {/* 开始点 */}
                            {this.state.markerStart &&
                                <Marker position={this.state.markerStart} offset={[0,-26]}>
                                    <div style={markerStarts}></div>
                                </Marker>
                            }
                            {this.state.markerEnd &&
                                <Marker position={this.state.markerEnd} offset={[0,-26]} >
                                    <div style={markerEnds}></div>
                                </Marker>
                            }
                            {this.state.path && <Polyline
                                path={this.state.path}
                                visible={true}
                                showDir={false}
                                style={polylines}
                                events={this.polyline}
                            />}
                            {/* <Polyline
                                events={this.lineEvents}
                                showDir={false}
                                style={makerPolyline}
                            /> */}
                            {this.state.path && <Marker
                                position={this.state.path[0]}
                                offset={[-20,-40]}
                                events={this.historEvents}
                            >
                                <div><img src={carpng}></img></div>
                            </Marker>}
                        </Map>
                    </div>
                    <div className='details' style={{ padding: 10 }}>
                        <div style={{ fontSize: 12, width: '100%', borderBottom: '1px solid  #E4E4E4', padding: '2px 0 6px' }}>{details.startTime ? details.startTime : null}</div>
                        <Timeline>
                            <Timeline.Item color="green">{details.startLocation ? details.startLocation : null}</Timeline.Item>
                            <Timeline.Item color="red">{details.endLocation ? details.endLocation : null}</Timeline.Item>
                        </Timeline>
                        <div className='sumCss'><span style={{ paddingLeft: 16 }}>总里程：{details.sumKm ? details.sumKm : null}km</span><span>用时：{details.sumTime ? details.sumTime : null}</span></div>
                    </div>
                    <div className="marker_slider">
                        <Button onClick={this.state.btnstatus?this.startAnimation:this.pauseAnimation}><Icon type={this.state.btnstatus?"caret-right":"pause"} /></Button>
                        <div style={{float:"right",marginLeft:"20px",width:"500px"}}>
                            <Col span={19}><Slider
                                onChange={this.onChange}
                                max={this.state.totalTime}
                                value={this.state.sliderValue}
                                tipFormatter={this.formatter}
                            />
                            </Col>
                            <Col span={5} style={{background:"rgba(51, 51, 51,0.8)"}}>
                            <div style={{height:"26px",lineHeight:"26px",color:"#fff",padding:"0 10px"}}>{this.formatter(this.state.sliderValue)+'/'+this.formatter(this.state.totalTime)}</div>
                            </Col>
                        </div>
                    </div>
                </Fragment>
                <style>
                    {`
                        .marker_slider{position: absolute;bottom: 20px;left:50%;margin-left:-280px}
                        .marker_slider button,.marker_slider button:hover,.marker_slider button:focus{width:40px;height:26px;background:#333333;border-radius: 2px;color:#fff;font-size:15px;border:1px solid #333333}
                        .marker_slider .ant-slider{opacity: 0.8;background: #333333;padding:13px 0;margin:0;}
                        .marker_slider .ant-slider-rail,.marker_slider .ant-slider-step,.marker_slider .ant-slider-handle,.ant-slider-step,.ant-slider-track{top:11px}
                        .ant-slider-handle{width:10px;height:10px;margin-left:-2px;margin-top: -3px;}
                    `}
                </style>
            </Modal>

        )
    }
}

const viewInforms = Form.create()(viewInform);
export default viewInforms;