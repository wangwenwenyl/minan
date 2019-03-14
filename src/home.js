import React, { Component } from 'react';
import { LocaleProvider,Layout, notification, Icon, message } from 'antd';
import './style/index.css';
import Menus from './component/menu/menu';
import { Route, Redirect, Switch } from 'react-router-dom';
import Headers from './component/header/header'
import DeviceManage from './container/deviceManage/deviceManage/deviceManage';//设备管理
import FileManage from './container/otaManage/fileManage/fileManage';//文件管理
import TaskManage from './container/otaManage/taskManage/taskManage';//任务管理
import JobDetail from './container/otaManage/taskManage/jobDetail';//任务详情
import Distribution from './container/statisticManage/distributionStatistic/distribution';//车辆分布统计
import Alarm from './container/statisticManage/alarmStatistic/alarm';//报警信息统计
import Travel from './container/statisticManage/travelStatistic/travel';//报警信息统计
import Online from './container/statisticManage/onlineStatistic/online';//报警信息统计
import Charge from './container/statisticManage/chargeStatistic/charge';//充电时长统计
import Battery from './container/statisticManage/batteryStatistic/battery';//电池均衡统计
import Endurance from './container/statisticManage/enduranceStatistic/endurance';//续航里程分析统计
import PowerUse from './container/statisticManage/powerUseStatistic/powerUse';//耗电量统计
import CarRepair from './container/statisticManage/carRepairStatistic/carRepair';//车辆保养统计
import RealData from './container/statisticManage/realDataStatistic/realData';//实时数据流统计
import HistoryData from './container/remoteMonitor/historyData/historyData';//历史数据
import historyAlarm from './container/remoteMonitor/historyAlarm/historyAlarm';//历史告警
import informationManagement from './container/vehicleManagement/informationManagement/informationManagement';//车辆信息管理
import Index from './container/index/index'   //zmj-首页
import commonAccount from './container/accountManagement/commonAccount/commonAccount';//一般账号管理
import modelsManage from './container/vehicleManagement/modelsManage/modelsManage';//车型管理
import forwardManagement from './container/sysManage/forwardManagement/forwardManagement'  //转发管理
import resourceManagement from './container/sysManage/resourceManagement/resourceManagement'  //资源管理
import systemParams from './container/sysManage/systemParams/systemParams'  //系统参数
import userManagement from './container/sysManage/userManagement/userManagement'  //用户管理
import versionManage from './container/sysManage/versionManage/versionManage'  //版本管理
import logManagement from './container/sysManage/logManagement/logManagement'  //日志管理
import roleManagement from './container/sysManage/roleManagement/roleManagement'  //角色管理
import DataDictionary from './container/sysManage/dataDictionary/DataDictionary'  //数据字典
import original from './container/sysManage/originalpage'  //原始页
import historicalTrajectory from './container/remoteMonitor/historicalTrajectory/historicalTrajectory';//历史轨迹管理
import carList from './container/remoteMonitor/carMonitor/carlist'
import messagePublish from './container/service/message/message';
import notice from './container/service/notice/notice';
import faq from './container/service/faq/faq';
import maintenance from './container/service/maintenance/maintenance';
import distributor from './container/service/distributor/distributor';
import network from './container/service/network/network';
import fence from './container/service/fence/fence';
import banquan from './img/banquan.png'
import moment from 'moment';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import  "moment/locale/zh-cn";

const { Content, Footer ,Header} = Layout;
class Home extends React.Component{
    constructor(props, context){
        super(props) 
        this.state = {
            collapsed: false,
            menuid:'',
            parentName:'首页',
            menuName:'',
            redirectTo:''
        }
    }
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillReceiveProps(){
        this.setState({
            pathname:this.props.history.location.pathname,
        })
    }
    //获取导航栏目
    getMenuName=(parentName,name)=>{
        this.setState({parentName:parentName,menuName:name})
        sessionStorage.setItem("parentName",parentName)
        if(name) sessionStorage.setItem("menuName",name)
        else sessionStorage.removeItem("menuName")
    }
    //菜单收起/展开
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }
    onWindowResize = () => {
        if(document.querySelector('body').offsetWidth<1024){
            this.setState({
                collapsed:true
            })
        }else{
            this.setState({
                collapsed:false
            })
        }
    }
    render(){
        const menuid = this.state.menuid
        const token = sessionStorage.getItem('token')
        return (
            <LocaleProvider locale={zh_CN}>  
            <div style={{height:'100%'}}>
            {this.props.redirectTo?<Redirect to={this.props.redirectTo}></Redirect>:null}
                <Layout style={{height:"100%"}}>
                    <Layout>
                        <Menus collapsed={this.state.collapsed} toggleCollapsed={this.toggleCollapsed} pathname={this.props.history.location.pathname} getMenuName={this.getMenuName}/>
                        <Layout style={{flexDirection: 'column'}}>
                            <Header className="idnex_header" style={{backgroundColor:'#fff',padding:'0',boxShadow:"0 2px 4px 0 rgba(219,219,219,0.50)"}}>
                                <Headers></Headers>
                            </Header>
                            <Content style={{  overflow: 'initial',borderRadius:'6px',width:'99%',height:"100%"}}>
                                <Switch>
                                    <Route exact path="/page/deviceManage/deviceManage/:id" component={DeviceManage} />    {/* 设备信息管理 */}
                                    <Route exact path="/page/distribution/distribution/:id" component={Distribution} />    {/* 车辆分布统计 */}
                                    <Route exact path="/page/alarm/alarm/:id" component={Alarm} />    {/* 报警信息统计 */}
                                    <Route exact path="/page/travel/travel/:id" component={Travel} />    {/* 行驶里程统计 */}
                                    <Route exact path="/page/online/online/:id" component={Online} />    {/* 车辆在线统计 */}
                                    <Route exact path="/page/charge/charge/:id" component={Charge} />    {/* 充电时长统计 */}
                                    <Route exact path="/page/battery/battery/:id" component={Battery} />    {/* 电池均衡统计 */}
                                    <Route exact path="/page/endurance/endurance/:id" component={Endurance} />    {/* 续航里程分析统计 */}
                                    <Route exact path="/page/power/power/:id" component={PowerUse} />    {/* 耗电量统计 */}
                                    <Route exact path="/page/car/car/:id" component={CarRepair} />    {/* 车辆保养统计 */}
                                    <Route exact path="/page/real/real/:id" component={RealData} />    {/* 实时数据流统计 */}
                                    <Route exact path="/page/historyData/historyData/:id" component={HistoryData} />    {/* 历史数据 */}
                                    <Route exact path="/page/historyAlarm/historyAlarm/:id" component={historyAlarm} />    {/* 历史告警 */}
                                    <Route exact path="/page/:id" component={Index}/>
                                    <Route exact path="/page/vehicleManagement/informationManagement/informationManagement/:id" component={informationManagement} /> {/* 车辆信息管理 */}
                                    {/* <Route exact path="/page/sysManagement/originalpage/35" component={original} /> 车型管理 */}
                                     <Route exact path="/page/vehicleManagement/modelsManage/modelsManage/:id" component={modelsManage} /> {/*车型管理 */}

                                    <Route exact path="/page/accountManagement/commonAccount/commonAccount/:id" component={commonAccount} /> {/* 一般账号管理 */}
                                    <Route exact path="/page/sysManagement/forwardManagement/forwardManagement/:id" component={forwardManagement} /> {/* 转发资源管理 */}
                                    <Route exact path="/page/sysManagement/resourceManagement/resourceManagement/:id" component={resourceManagement} /> {/* 资源管理 */}
                                    <Route exact path="/page/sysManagement/systemParams/systemParams/:id" component={systemParams} /> {/* 系统参数 */}
                                    <Route exact path="/page/sysManagement/userManagement/userManagement/:id" component={userManagement} /> {/* 用户管理 */}
                                    <Route exact path="/page/sysManagement/versionManage/versionManage/:id" component={versionManage} /> {/* 版本管理 */}

                                    <Route exact path="/page/sysManagement/logManagement/logManagement/:id" component={logManagement} /> {/* 日志管理 */}
                                    <Route exact path="/page/sysManagement/roleManagement/roleManagement/:id" component={roleManagement} /> {/* 角色管理 */}
                                    <Route exact path="/page/fileManage/fileManage/:id" component={FileManage} /> {/* 文件管理 */}
                                    <Route exact path="/page/taskManage/taskManage/:id" component={TaskManage} /> {/* 任务管理 */}
                                    <Route exact path="/page/taskManage/jobdetail/:id" component={JobDetail} /> {/* 任务详情 */}
                                    <Route exact path="/page/sysManagement/dataDictionary/:id" component={DataDictionary} /> {/* 数据字典 */}
                                    <Route exact  path="/page/historicalTrajectory/historicalTrajectory/:id" component={historicalTrajectory} /> {/* 历史轨迹*/}
                                    <Route exact  path="/page/remoteMonitor/carMonitor/:id" component={carList} />   {/* 单车监控*/}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    <Route exact path="/page/sysManagement/originalpage/:id" component={original} /> {/* 原始页 */}
                                    
                                    <Route exact path="/page/service/message/:id" component={messagePublish} />
                                    <Route exact path="/page/service/notice/:id" component={notice} /> 
                                    <Route exact path="/page/service/faq/:id" component={faq} /> 
                                    <Route exact path="/page/service/maintenance/:id" component={maintenance} /> 
                                    <Route exact path="/page/service/distributor/:id" component={distributor} /> 
                                    <Route exact path="/page/service/network/:id" component={network} /> 
                                    <Route exact path="/page/service/fence/:id" component={fence} /> 
                                    
                                </Switch>
                                <div style={{fontSize:'5px', lineHeight:'20px',verticalAlign:'middle',textAlign:'left',padding:'0px 10px',color:"#999"}}>
                                    <img src={banquan} alt=""/>
                                </div>
                            </Content>
                            <style>
                                {`
                                    sup{-webkit-text-size-adjust:none;font-size:1px}
                                `}
                            </style>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        </LocaleProvider>
        )
    }
}

export default Home