import React from 'react'
import {Row,Col,Cascader,Select,Icon,Form,Switch} from 'antd'
import './index.css'
import Map from './map'
import online from './../../img/index/online.png'
import outline from './../../img/index/outline.png'
import wran from './../../img/index/warn.png'
import unwarn from './../../img/index/unwarn.png'
import charging from './../../img/index/charging.png'
import outage from './../../img/index/outage.png'
import open from './../../img/index/open.png'
import {getAxiosData,postAxios,getAxios}  from './../../util/common'
import indexURL from './indexURL'
import { connect } from 'react-redux'
import {close,opens} from './../../redux/user.redux'
const Option = Select.Option;
@connect(
    state=>state.user,
    {close,opens}
)
class Index extends React.Component{
    constructor(props){
        super(props)
        this.state={
            searchOption:[],   //搜索框内容
            value:undefined,  //搜索框中值
            options:[],          //区域
            statistics:'',   //统计数据
            open:true,
            updataTime:'',
            defaultCity:['全国'],
            selected:false,    //下拉框是否选中
            popupVisible:false,
            distClusterStatus:true
        }
        
    }
    onRef=(ref)=>{
        this.child = ref
    }
    componentDidMount(){
       this.area()
       this.statistical('全国')
       this.getTime()
    }
    //搜索框
    fetch=(value,callback)=>{
        let params = {
            enterParam:value
        }
        console.log(value)
        getAxiosData(indexURL.searchInput,params,(data)=>{
            if(data.code === "100000"){
                callback(data.data)
            }
        })
    }
    handleSearch=(value)=>{
        this.setState({ searchOption:[] })
        this.fetch(value, data => {
            console.log(data)
            this.setState({ searchOption:data })},()=>{
                console.log(this.state.searchOption)
            });
    }
    handleChange=(value)=>{
        this.setState({value})
    }
    onSelect=(value,option)=>{
        console.log(option)
        if(option.props.title){
            this.child.getinfoData(option.props.title)
            this.child.zoomIn()
        }
    }
    //获取省市区
    area=()=>{
        let options = [{value:'全国',label:'全国',id:''}]
        getAxios(indexURL.area,(data)=>{
            if(data.code === '100000'){
                data.data.map(d=>{
                    options.push({value:d.value,label:d.value,id:d.id,isLeaf: false})
                })
                this.setState({options})
            }
        })
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getAxios(indexURL.area+'/'+selectedOptions[0].id+'/subset',(data)=>{
            if(data.code === '100000'){
                targetOption.loading = false;
                targetOption.children = []
                if(data.data){
                    data.data.map(d=>{
                        targetOption.children.push({value:d.value,label:d.value,id:d.id})
                    })
                    this.setState({
                    options: [...this.state.options],
                    });
                }
            }
        })
    }
    onChangeArea=(value, selectedOptions)=>{
        console.log(value, selectedOptions);
        this.setState({defaultCity:value,selected:true})
        this.child.districtSearch(selectedOptions)
        this.statistical(value[0],value[1])
    }
    //统计
    statistical=(province,city)=>{
        let params={
            province:province,
            city:city
        }
        postAxios(indexURL.statistical,params,(data)=>{
            if(data.code=="100000"){
                this.setState({statistics:data.data,selected:false})
            }
        })
    }
    //放大全屏
    open=()=>{
        if(this.state.open){
            this.props.close()
        }else{
            this.props.opens()
        }
        this.setState({open:!this.state.open})
    }
    //刷新界面
    reload=()=>{
        this.statistical()
        this.child.carClick()
        this.getTime()
    }
    getTime=()=>{
        let time = new Date
        let updataTime = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()
        this.setState({updataTime})
    }
    //地图划动列表随之改变    
    setCity=(val)=>{
        let selectedOptions = this.state.options.filter((v)=>{
            return v.value==val.province
        })
        if(selectedOptions.length>0){
            this.loadData(selectedOptions)
            this.setState({defaultCity:[val.province,val.city]})
            this.statistical(val.province,val.city)
        }
    }
    //地区显示开关
    mapChange=(checked)=>{
        this.setState({distClusterStatus:checked})
        if(checked){
            this.child.distClustershow(true)
            this.child.removeMarker()
        }else{
            this.child.distClusterremove(true)
        }
    }
    render(){
        const statistics = this.state.statistics
        const map = this.props.__map__
        const options = this.state.searchOption.map((data,index)=>
            <Option key={index} value={data.val+data.plateNo} title={data.vin}>
                <span>{data.name=='车主手机号'?data.name+'：'+data.val+'车牌号：'+data.plateNo:data.name+'：'+data.val}</span>
                <span style={{float:"right"}}>
                    <img src={data.onlineStatus==1?online:outline}></img>
                    <img src={data.warningStatus==1?wran:unwarn}></img>
                    <img src={data.chargeStatus==1?charging:outage}></img>
                </span>
            </Option> 
        )
        return(
            <div style={{height:"100%"}}>
                <Row style={{height:"100%"}}>
                    <Col span={this.state.open?19:24} style={{height:"100%",padding:"10px",minHeight:"622px"}}>
                    <div >
                        <Select
                            showSearch
                            value={this.state.value}
                            placeholder={'请输入车牌号、VIN码、终端SN、车主手机号'}
                            style={{width:"300px",height:"36px",position:"absolute",top:"35px",left:"25px",zIndex:"102",fontSize:"12px"}}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleSearch}
                            onChange={this.handleChange}
                            onBlur={()=>{this.setState({searchOption:[]})}}
                            onSelect={this.onSelect}
                            allowClear
                            autoClearSearchValue={false}
                            dropdownClassName="searchOption"
                        >
                        {options}
                        </Select>
                    </div>
                    {/* 地图 */}
                    <Map onRef={this.onRef} setCity={this.setCity} selected={this.state.selected} distClusterStatus={this.state.distClusterStatus}></Map>
                    <div className="index_open" onClick={this.open}>{<img src={this.state.open?open:''} />}<span>{this.state.open?"全屏":"退出全屏"}</span></div>
                    <div className="index_switch"><Switch defaultChecked onChange={this.mapChange}/></div>
                    <div className="color_line">高<span></span>低</div>
                    <div className="updata_div">数据刷新时间:{this.state.updataTime}<span onClick={this.reload}><Icon type="sync" /></span></div>
                    </Col>
                    <Col span={this.state.open?5:0}  style={{padding:"10px 10px 10px 0",height:"100%",minHeight:"622px"}}>
                        <div className="index_right">
                            <Cascader options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChangeArea}    
                            value={this.state.defaultCity}
                            changeOnSelect
                            expandTrigger='hover'
                            // popupVisible={this.state.popupVisible}
                            style={{width:"100%",border:"1px solid #E4E4E4",borderRadius:"100px"}}>
                            </Cascader>
                        </div>
                        <div className="index_right_box">
                            <p className="box_top">今日总监控量</p>
                            <p className="box_middle"><span className="car_num">{statistics&&statistics.onlineSum&&statistics.onlineSum}</span>辆</p>
                            <p className="box_bottom box_bottom1"><span>昨日总监控量</span><span>{statistics&&statistics.onlineYesterdaySum&&statistics.onlineYesterdaySum}辆</span></p>
                        </div>
                        <div className="index_right_box color1">
                            <p className="box_top">今日开机量</p>
                            <p className="box_middle"><span className="car_num">{statistics&&statistics.onlineToday&&statistics.onlineToday}</span>辆</p>
                            <p className="box_bottom box_bottom2"><span>昨日开机量</span><span>{statistics&&statistics.onlineYesterday&&statistics.onlineYesterday}辆</span></p>
                        </div>
                        <div className="index_right_box color2">
                            <p className="box_top">今日总里程</p>
                            <p className="box_middle"><span className="car_num">{statistics&&statistics.sumKmToday&&statistics.sumKmToday}</span>km</p>
                            <p className="box_bottom box_bottom3"><span>昨日总里程</span><span>{statistics&&statistics.sumKmYesterday&&statistics.sumKmYesterday}km</span></p>
                        </div>
                        <div className="index_right_box color3">
                        <p className="box_top">今日能耗</p>
                            <p className="box_middle"><span className="car_num">{statistics&&statistics.powerToday&&statistics.powerToday}</span>kw*h</p>
                            <p className="box_bottom box_bottom4"><span>昨日能耗</span><span>{statistics&&statistics.powerYesterday&&statistics.powerYesterday}kw*h</span></p>
                        </div>
                    </Col>
                </Row>
                <style>
                    {`
                        .amap-ui-district-cluster-marker span:first-child{
                            height:22px!important;
                        }
                        .amap-ui-district-cluster-marker span:last-child{
                            line-height:10px!important;
                        }
                        .amap-ui-district-cluster-marker-body{
                            background:#fffeef!important;
                            color:#555!important;
                        }
                        .ant-select-dropdown-placement-bottomLeft{
                            width:auto!important;
                            min-width:300px;
                        }
                        .ant-cascader-picker-label{z-index:10!important;}
                        #root .amap-scalecontrol{left:15px!important;bottom:15px!important}
                    `}
                </style>
            </div>
        )
    }
}
export default Index