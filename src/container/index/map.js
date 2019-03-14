import React from 'react'
import {Col,Tooltip} from 'antd'
import {Map,Markers,Polygon,InfoWindow} from 'react-amap'
import {postAxios} from './../../util/common'
import indexURL from './indexURL'
import markerIcon from './../../img/zaixianche.png'  //在线
import outline from './../../img/index/lixianche.png'
import markerIconB from './../../img/index/zaixian.png'  //在线
import outlineB from './../../img/index/lixianbig.png'
import wran from './../../img/index/warn.png'
import unwarn from './../../img/index/unwarn.png'
import charging from './../../img/index/charging.png'
import outage from './../../img/index/outage.png'
import battery80 from './../../img/index/dianchi80.png'
import battery50 from './../../img/index/dianchi50.png'
import battery0 from './../../img/index/dianchi0.png'
import online from './../../img/index/online.png'
import outlines from './../../img/index/outline.png'
import warnbig from './../../img/index/icon_gaojing.png'
import all from './../../img/index/icon_quanbucheliang.png'
import onlinebig from './../../img/index/icon_zaixianche.png'
import outlinebig from './../../img/index/icon_lixianche.png'
import {webSocketUrl} from './../../util/httpConfig'

const sts = {
    url:markerIcon,
    size:{
        width:36,
        height:47
    }
}
const polygon ={
    strokeWeight: 1,
    fillOpacity: 1,
    fillColor: 'rgba(102,170,0,0.5)',
    strokeColor: 'rgb(255, 255, 255)'
}
const useCluster = {
    gridSize:'60',
    offset:[0,0],
    zoomOnClick:true,
    averageCenter:true
}
class MAP extends React.Component {
    constructor(){
        super()
        this.state={
            distCluster:'',
            dataList:[],
            mapInstance:'',
            district:'',
            useCluster:false,
            markers:[], //markerz坐标
            visible:false,  //区域框
            path:[],   //区域轨迹
            mapCenter:[106.205583,36.725011],
            markerVisible:false,
            allMarkers:'',
            infoVisible:false,      //弹框
            infoPosition:{},
            InfoWindowData:{},
            mapData:[],
            markerMouseS:false,  //marker划过状态
            mapstatus:false
        }
        this.mapPlugins = ['ToolBar','Scale'];
        this.ws = ''
        const type = false;
    }
    componentDidMount(){
        // this.loadUI();
        this.props.onRef(this)
    }
    loadUI=()=>{
        window.AMapUI.loadUI(['geo/DistrictCluster'], (DistrictCluster) => {
            this.initPage(DistrictCluster);
            this.getLocationWS(this.state.distCluster)
        })
    }
    initPage=(DistrictCluster)=>{
        let _t = this
        console.log("AMapUI Loaded Done");
        let distCluster = new DistrictCluster({
            map: this.state.mapInstance, //所属的地图实例
            zIndex:11,
            autoSetFitView:false,
            getPosition: function(item) {
                return item.position;
            },
            renderOptions: {
                //基础样式
                featureStyle: {
                    fillStyle: 'rgba(0,120,243,1)', //填充色
                    lineWidth: 1, //描边线宽
                    strokeStyle: 'rgb(255, 255, 255)', //描边色
                    //鼠标Hover后的样式
                    hoverOptions: {
                        fillStyle: 'rgba(255,255,255,0.2)'
                    }
                },
                featureClickToShowSub:true,
                clusterMarkerEventSupport: true,
                //标注信息Marker上需要监听的事件
                // clusterMarkerEventNames: ['mouseover'],
                //直接定义某写区划面的样式
                getFeatureStyle: function(feature, dataItems) {
                    let sum = dataItems.length/_t.state.dataList.length
                    if (0<sum<=0.05) {
                        return {
                            fillStyle: '#EDFFFF'
                        }; 
                    }else if(0.06<sum<=0.1) {
                        return {
                            fillStyle: '#DAF2FF'
                        };
                    }else if(0.11<sum<=0.15){
                        return {
                            fillStyle: '#BDDFFF'
                        };
                    }else if(0.16<sum<=0.2){
                        return {
                            fillStyle: '#8DB2E7'
                        };
                    }else if(0.21<sum<=0.3){
                        return {
                            fillStyle: '#6CA7F4'
                        };
                    }else if(0.3<sum<=0.4){
                        return {
                            fillStyle: '#3496FA'
                        };
                    }else if(0.4<sum<=0.5){
                        return{
                            fillStyle:'#0085FF'
                        }
                    }else if(0.5<sum<=1){
                        return{
                            fillStyle:'#0078F3'
                        }
                    }
                    return {};
                }
            },
        });
        window.distCluster = distCluster;
        distCluster.on('clusterMarkerMouseover',function(e,record){
            console.log()
        })
        this.setState({distCluster})
        
    }
    map={
        expandZoomRange:true,
        created: (map) => {
            this.setState({mapInstance:map})
            window.AMap.plugin('AMap.DistrictSearch', () => {
                let district = new window.AMap.DistrictSearch({
                    subdistrict: 0,   //获取边界不需要返回下级行政区
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: 'district'
                });
                this.setState({ district });
            });
            window.AMapUI.loadUI(['geo/DistrictCluster'], (DistrictCluster) => {
                this.initPage(DistrictCluster);
                this.getLocationWS()
            })
            let _t = this 
            map.on('zoomchange',function(){
                let zoom = map.getZoom()
                console.log(_t.state.mapstatus)
                console.log(zoom)
                if(zoom>=11){
                    _t.distClusterremove()
                    _t.setState({visible:false})
                   if(!_t.state.markerVisible){
                    _t.setState({markers:_t.state.dataList})
                    map.add(_t.state.allMarkers);
                    _t.setState({markerVisible:true})
                   }
                   if(!_t.props.distClusterStatus){
                    _t.setState({useCluster:false})
                   }
                }else{
                    if(!_t.props.distClusterStatus){
                        if(_t.state.mapstatus){
                            _t.setState({useCluster:useCluster})
                        }
                        return false;
                    }
                    _t.distClustershow()
                    if(_t.state.markerVisible){
                        map.remove(_t.state.allMarkers);
                        _t.setState({markerVisible:false})
                    }
                    _t.setState({infoVisible:false})
                }
            })
            map.on('moveend',function(){
                if(_t.props.selected){
                    return;
                }
                map.getCity( function(info){
                    if(map.getZoom()<=4){
                        _t.props.setCity({province:"全国"})
                    }else if(map.getZoom()<=7){
                        let infos = info
                        delete infos.city
                        _t.props.setCity(infos)
                    }else if(map.getZoom()>7){
                        _t.props.setCity(info)
                    }
                });
            })
        },
        click:(map)=>{
            this.setState({infoVisible:false})
        }
    }
    markerEvents={
        created:(allMarkers)=>{
            this.setState({allMarkers})
        },
        click:(MapsOption, marker) => {
            this.setState({infoVisible:false})
            this.getinfoData(marker.F.extData.vin)
        },
        mouseover:(e) => {
            const marker = e.target;
            marker.render(this.renderMarkerHover);
        },
        mouseout:(e) => {
            const marker = e.target;
            marker.render(this.renderMarker);
        }
    }
    //获取窗体信息
    getinfoData = (vin) => {
        postAxios(indexURL.markerData,{vin:vin},(data)=>{
            if(data.code === "100000"){
                let dataList = data.data; 
                console.log(data.data)
                if(data.data)
                this.setState({
                    infoPosition:{
                        'longitude':dataList.position[0],
                        'latitude':dataList.position[1]
                    },
                    InfoWindowData:dataList,
                    infoVisible:true
                })
                this.state.mapInstance.setCenter(dataList.position)
            }
        })
    }
     //地图标记图标
    renderMarkerLayout=(extData,type)=>{
        let status = extData
        let w = 0
        if(status.warnStatus==1&&status.chargeStatus==1){
            w = 28
        }else if(status.warnStatus!=1&&status.chargeStatus!=1){
            w = 0
        }else{
            w = 22
        }
        return(<div>
            <div style={{textAlign:"center"}}>
                {status.warnStatus=="1"?<img  src={wran} style={{marginBottom:"-13px"}}/>:''}
                {status.chargeStatus=="1"?<img  src={charging} style={{marginBottom:"-13px"}}/>:''}
                <p style={{background:"#FFFFFF",boxShadow: "0 2px 4px 0 rgba(151,151,151,0.50)",borderRadius:"100px",height:"4px",
                width:`${w}px`,margin:"0 auto"}}></p>
            </div>
            <div>
                <img src={status.onlineStatus=="1"?type?markerIcon:markerIconB:type?outline:outlineB}/>
            </div>
        </div>)
    }
    renderMarker=(extData)=>{
        return (this.renderMarkerLayout(extData,true))
    }
    renderMarkerHover=(extData)=>{
        return(this.renderMarkerLayout(extData,false))
    }
    //获取位置
    getLocationWS=()=>{
        let _t = this
        if ("WebSocket" in window){
            this.ws = new WebSocket(webSocketUrl);
            this.ws.onerror = function(){
                console.log('fail...')
            }
            this.ws.onopen = function(){
                console.log("send...");
            };
            this.ws.onmessage = function (evt) {
                _t.getLocation(evt)
            };
        } else{
            alert("您的浏览器不支持 WebSocket!");
        }
    }
    getLocation=(evt)=>{
        let dataList = []
        let markers  = []
        let params = {
            token:sessionStorage.getItem("token")
        }
        var received_msg = evt.data;
        if(received_msg=='CONN-IS-OK'){
            this.ws.send(JSON.stringify(params))
            return;
        }
        if(JSON.parse(received_msg).code == "100000"){
            let data = JSON.parse(received_msg)
            for (var i = 0, len = data.data.list.length; i < len; i++) {
                if(data.data.list[i].position){
                dataList.push({
                    position: [
                        data.data.list[i].position[0],
                        data.data.list[i].position[1]
                    ]
                });
                markers.push({
                    position: {
                        longitude:data.data.list[i].position[0],
                        latitude:data.data.list[i].position[1]
                    },
                    chargeStatus:data.data.list[i].chargeStatus,     //充电状态                //添加图标状态
                    onlineStatus:data.data.list[i].onlineStatus,        //在线状态
                    warnStatus:data.data.list[i].warnStatus,      //告警状态
                    vin:data.data.list[i].vin
                })
            }
            }
            this.setState({mapData:data.data})
            this.setState({dataList:markers})
            if(this.props.distClusterStatus){
                this.state.distCluster.setData(dataList)
            }else{
                this.setState({markers})
            }
            this.type = false;
        }
    } 
    //移除数据
    distClusterremove=(type)=>{
        if(type){
            this.state.mapInstance.setZoom(4)
            this.setState({markers:this.state.dataList,useCluster:useCluster,mapstatus:true})
        }
        window.distCluster.hide()
    }
    distClustershow=(type)=>{
        if(type){
            this.setState({useCluster:false,markers:[],mapstatus:false},()=>{
                this.state.mapInstance.remove(this.state.allMarkers)
                this.state.mapInstance.setZoom(4)
            })
        }
        window.distCluster.show()
       
    }
    removeMarker=()=>{
        this.state.mapInstance.remove(this.state.allMarkers)
    }
    //区域改变地图随之改变
    districtSearch=(val)=>{
        console.log(val)
        let _t = this
        if(this.state.district&&val[0]!="全国"&&val.length>0){
            let district = _t.state.district
            let abcode = ''
            if(val.length<1){
                abcode = val[0].id
            }else{
                abcode = val[val.length-1].id
            }
            district.search(abcode, function(status, result) {
                let bounds = result.districtList[0].boundaries;
                let center = result.districtList[0].center;
                if(bounds){
                    _t.setState({path:bounds,visible:true,mapCenter:center})
                    if(val.length>1){
                        _t.state.mapInstance.setZoomAndCenter(9,center);
                    }else{
                        _t.state.mapInstance.setZoomAndCenter(6,center);
                    }
                }
            })
        }else{
            _t.setState({path:[],visible:false})
            _t.state.mapInstance.setZoom(4)
        }
    }
    //放大地图
    zoomIn=()=>{
        this.state.mapInstance.setZoom(13)
    }
    //筛选车辆
    carClick=(status)=>{
        let params = {
            token:sessionStorage.getItem("token")
        }
        if(status){
            status=="1"?params.onlineStatus = "1":status=="2"?params.onlineStatus = "0":params.warnStatus="1";
        }
        this.ws.send(JSON.stringify(params))
    }
    //划过车辆状态显示
    carMouseOver=()=>{
       
    }
    //单车监控
    carMonitor=(vin)=>{
        window.open(".././carMonitor/"+vin, "_blank", "height=500,width=1010,scrollbars=yes,resizable=1,modal=false,toolbar:yes,alwaysRaised=yes");
    }
    render(){
        return(
            <Map amapkey={'71477380fc31e5291f93952b10091bf6'}  
                events={this.map}
                plugins={this.mapPlugins}
                useAMapUI= {true}
                center={this.state.mapCenter}
                zoom={4}
                mapStyle={"amap://styles/whitesmoke"}
                resizeEnable={true}
            >
            <Polygon
                events={this.events}
                path={this.state.path}
                visible={this.state.visible}
                style={polygon}
            />
            <Markers
                markers={this.state.markers}
                render={this.renderMarker}
                useCluster={this.state.useCluster}
                events={this.markerEvents}
            />
            <InfoWindow
                position={this.state.infoPosition}
                visible={this.state.infoVisible}
                isCustom={true}
                // offset={this.state.offset}
                events={this.windowEvents}
            >
                <div>
                    <div className="infoWindow">
                        <Col span={18}>
                            <p>{this.state.InfoWindowData.plateNo}</p>
                            <p style={{fontSize:"12px"}}>{this.state.InfoWindowData.name}  {this.state.InfoWindowData.mobile}</p>
                        </Col>
                        <Col span={6} style={{textAlign:"right",height:"49px"}}>
                            {this.state.InfoWindowData.vehicleBaseData?this.state.InfoWindowData.vehicleBaseData.soc>50?<img src={battery80}></img>:this.state.InfoWindowData.vehicleBaseData.soc>=25?<img src={battery50}></img>:<img src={battery0}></img>:''}
                            <p style={{margin:"4px 0",color:"#49E16C"}}>{this.state.InfoWindowData.vehicleBaseData?this.state.InfoWindowData.vehicleBaseData.soc:''}%</p>
                        </Col>
                        <p style={{fontSize:"10px",marginTop:"15px",color: "#E5E5E5"}}>VIN码：{this.state.InfoWindowData.vin}</p>
                        <p style={{fontSize:"10px",color: "#E5E5E5"}}>位置：{this.state.InfoWindowData.location}</p>
                    </div>
                    <div className="infoWindowIcon">
                        {this.state.InfoWindowData.onlineStatus&&this.state.InfoWindowData.onlineStatus=="1"?<img src={online}></img>:<img src={outlines}></img>}
                        {this.state.InfoWindowData.warnStatus&&this.state.InfoWindowData.warnStatus=="1"?<img src={wran}></img>:<img src={unwarn}></img>}
                        {this.state.InfoWindowData.chargeStatus&&this.state.InfoWindowData.chargeStatus=="1"?<img src={charging}></img>:<img src={outage}></img>}
                    </div>
                    <div className="infoWindowBtn">
                        <a onClick={()=>{this.carMonitor(this.state.InfoWindowData.vin)}}>单车监控</a>
                    </div>
                </div>
            </InfoWindow>
            <div className="mapBar">
                <Tooltip
                    placement="left" 
                    title={this.state.mapData&&"全部车辆："+this.state.mapData.allCount} 
                    overlayClassName="car_count">
                    <p onClick={()=>{this.carClick()}}><img src={all}></img></p>
                </Tooltip>
                <Tooltip 
                    placement="left" 
                    title={this.state.mapData&&"在线车辆："+this.state.mapData.onLineCount}
                    overlayClassName="car_count">
                    <p onClick={()=>{this.carClick("1")}}><img src={onlinebig}></img></p>
                </Tooltip>
                <Tooltip 
                    placement="left" 
                    title={this.state.mapData&&"离线车辆："+this.state.mapData.offLineCount+''}
                    overlayClassName="car_count">
                    <p onClick={()=>{this.carClick("2")}}><img src={outlinebig}></img></p>
                </Tooltip>
                <Tooltip 
                    placement="left" 
                    title={this.state.mapData&&"告警车辆："+this.state.mapData.warningCount+''}
                    overlayClassName="car_count">
                    <p onClick={()=>{this.carClick("3")}}><img src={warnbig}></img></p>
                </Tooltip>
            </div>
            </Map>
        )
    }
}

export default MAP