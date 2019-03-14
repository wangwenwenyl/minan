import React from 'react'
import { Menu,Icon,Layout} from 'antd'
import { Link } from 'react-router-dom';
import Axios from 'axios' 
import { httpConfig } from '../../util/httpConfig';
import open from '../../img/open.png'
import close from '../../img/menu-close.png'
import  label  from './logo.png';
import { connect } from 'react-redux'
import {toggleCollapsed} from './../../redux/user.redux'

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

@connect(
    state=>state.user,
    { toggleCollapsed }
)
class MenuNew extends React.Component{
    constructor(props){
        super(props)
        this.state={
            collapsed: false,
            collapsed1: false,
            mode: 'inline',
            openKey:'',
            selectedKey:'',
            firstHide: true,
            menuListData:''
        }
    }
    componentDidMount(){
        this.getMenuList()
        window.addEventListener('resize', this.onWindowResize)
        
        this.setState({
            openKey:sessionStorage.getItem('openkey'),
        })
    }
   
  
    onWindowResize = () => {
        console.log(document.querySelector('body').offsetWidth)
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
   
    //获取菜单项
    getMenuList=()=>{
        Axios.get('sys/system/resource/userResource',httpConfig)
        .then(res=>{
            if(res.data.code === '100000'){
                console.log(res.data.data)
                this.setState({
                    menuListData:res.data.data
                    // menuListData:[
                    //     {"id":"1","name":"首页","url":"/page","parentId":"-1","icon":"home","openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //     {"id":"2","name":"设备管理","url":"/page","parentId":"-1","icon":"line-chart","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //     "list":[
                    //          {"id":"35","name":"设备信息管理","url":"/page/deviceManage/deviceManage","parentId":"2","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         ]},
                    //     {"id":"7","name":"OTA管理","url":"/page","parentId":"-1","icon":"desktop","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //          "list":[
                    //             {"id":"24","name":"升级任务管理","url":"/page/taskManage/taskManage","parentId":"7","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"23","name":"文件管理","url":"/page/fileManage/fileManage","parentId":"7","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"}
                    //             ]},
                    //     {"id":"3","name":"车辆管理","url":"/page","parentId":"-1","icon":"car","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //               "list":[ 
                    //                 {"id":"17","name":"车型管理","url":"/page/vehicleManagement/modelsManage/modelsManage","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //                 {"id":"14","name":"车辆信息管理","url":"/page/vehicleManagement/informationManagement/informationManagement","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //                 ]},
                    //     {"id":"6","name":"远程监控","url":"/page/deviceManagement/historyManage","parentId":"-1","icon":"line-chart","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //        "list":[
                    //             {"id":"13","name":"历史数据","url":"/page/historyData/historyData","parentId":"2","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"10","name":"历史报警","url":"/page/historyAlarm/historyAlarm","parentId":"2","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"11","name":"历史轨迹","url":"/page/historicalTrajectory/historicalTrajectory","parentId":"2","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"13","name":"单车监控","url":"/page/remoteMonitor/carMonitor","parentId":"2","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"}
                    //         ]},
                    //     {"id":"4","name":"账户管理","url":"/page","parentId":"-1","icon":"user","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //             "list":[
                    //                  {"id":"15","name":"一般账户","url":"/page/accountManagement/commonAccount/commonAccount","parentId":"4","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //                 // {"id":"16","name":"企业账号","url":"/page/ownerManage/companyAccount","parentId":"4","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"}
                    //             ]},
                             
                       
                    //     {"id":"300","name":"统计分析","url":"/page","parentId":"-1","icon":"car","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //        "list":[ 
                    //             {"id":"350","name":"车辆分布统计","url":"/page/distribution/distribution","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"351","name":"报警信息统计","url":"/page/alarm/alarm","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"352","name":"行驶里程统计","url":"/page/travel/travel","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"353","name":"车辆在线统计","url":"/page/online/online","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"354","name":"充电时长统计","url":"/page/charge/charge","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"355","name":"电池均衡统计","url":"/page/battery/battery","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"356","name":"续航里程分析","url":"/page/endurance/endurance","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"357","name":"耗电量统计","url":"/page/power/power","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"358","name":"车辆保养统计","url":"/page/car/car","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"359","name":"实时数据流统计","url":"/page/real/real","parentId":"3","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         ]},
                    // {"id":"5","name":"服务管理","url":"/page","parentId":"-1","icon":"appstore","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //        "list":[
                    //         {"id":"20","name":"信息发布管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"21","name":"通知推送管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"22","name":"问题反馈管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"19","name":"维修保养管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"182","name":"经销商管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"183","name":"维修网点管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //         {"id":"184","name":"电子围栏管理","url":"/page/sysManagement/originalpage","parentId":"5","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"}
                    //     ]},
                    // {"id":"8","name":"系统管理","url":"/page/organizationManage/orgManage","parentId":"-1","icon":"setting","openType":null,"resourceType":null,"sort":null,"status":"1",
                    //         "list":[
                    //             {"id":"26","name":"角色管理","url":"/page/sysManagement/roleManagement/roleManagement","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"28","name":"用户管理","url":"/page/sysManagement/userManagement/userManagement","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"27","name":"资源管理","url":"/page/sysManagement/resourceManagement/resourceManagement","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"29","name":"版本管理","url":"/page/sysManagement/originalpage","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"30","name":"日志管理","url":"/page/sysManagement/logManagement/logManagement","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"32","name":"转发管理","url":"/page/sysManagement/forwardManagement/forwardManagement","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"34","name":"系统参数","url":"/page/sysManagement/systemParams/systemParams","parentId":"8","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"},
                    //             {"id":"31","name":"数据字典","url":"/page/sysManagement/dataDictionary","parentId":"10","icon":null,"openType":null,"resourceType":null,"sort":null,"status":"1"}
                               
                    //         ]} 
                    // ]
                })
            }
        })
    }

    onOpenChange = v => {
        if(v[v.length - 1] == 1){
            this.setState({
                selectedKey:''
            })
            sessionStorage.removeItem('selectedKey')
            sessionStorage.setItem('openkey',v[v.length - 1])
            return false
        }
        this.setState({
            openKey: v[v.length - 1]
        })
        sessionStorage.setItem('openkey',v[v.length - 1])
    };
    menuClick = (e) =>{
        console.log(e)
        this.setState({
            selectedKey: e.key,
            openKey:e.keyPath[1]
        });
        sessionStorage.setItem('openkey',e.keyPath[1])
        
    }
    // toggleCollapsed = () => {
    //     this.setState({
    //       collapsed: !this.state.collapsed,
    //     });
    // }
    
    render(){
        let _t = this
        return (
            <div className='menuHeight'>
      
                <Sider
                    trigger={null}
                    breakpoint="lg"
                    style={{ overflowY: 'auto' }}
                    collapsed={this.props.collapsed}
                >
                <div style={{position:'relative',zIndex:1000}}>
                                <div className="logo">
                                    <div >
                                    <img src={label} style={{marginTop:30}}/>
                                    </div>
                                    {_t.props.collapsed ?'': <div style={{marginTop:15}}> 敏安汽车服务平台</div>}
                                
                                    <div style={{height:1,margin:'15px auto',width:'80%',borderTop:'1px solid #1D2E51'}}></div>

                                </div>
                </div>
                <div className="menuList">
                {this.state.menuListData &&<Menu  
                    theme="dark"
                    mode="inline" 
                    onOpenChange={this.onOpenChange}
                    inlineCollapsed={this.props.collapsed}
                    onClick={this.menuClick}
                    openKeys={this.props.collapsed?[this.state.openKey]:[sessionStorage.getItem('openkey')]}
                    selectedKeys={[this.props.pathname]}
                    onSelect={_t.props.getmenuId}
                    forceSubMenuRender={false}
                    >
                    {this.state.menuListData.map(function (item) {
                        return (
                        item.children ?
                        <SubMenu key={item.id} title={<span><img src={item.icon} className="imgStyle"/><span>{item.name}</span></span>}>
                            {/* {_t.state.collapsed 
                            ? <div className='openMenu'><img src={item.icon} className='wicon' />{item.name}</div>
                            : ''} */}
                            {item.children && item.children.map(function(menulist){
                                return(
                                    <Menu.Item key={menulist.url?menulist.url+'/'+menulist.id:''} onClick={()=>{_t.props.getMenuName(item.name,menulist.name)}}>
                                        <Link to={menulist.url?menulist.url+'/'+menulist.id:''} >{menulist.name}</Link>
                                    </Menu.Item>
                                )
                            })}
                        </SubMenu>:
                        <SubMenu key={item.id}
                            title={<span><Link to={item.url+'/'+item.id} className="firstMenu" 
                            style={{color:'#fff',display:"block",width:"100%",textDecoration:'none'}}>
                            <img  className="imgStyle" src={item.icon} /><span>{item.name}</span></Link></span>}
                            onTitleClick={()=>{_t.props.getMenuName(item.name)}}>
                        </SubMenu>
                        )
                    })}
                </Menu>}
                </div>
                <div className="bottom-label">
                     <div onClick={this.props.toggleCollapsed} className="reposition" style={{marginTop:7}}> 
                            {
                                this.props.collapsed ?<img src={open} alt=""/> : <img style={{transform:'rotate(180deg)'}} src={open} alt=""/>
                            }
                    </div> 
                </div>
               
                </Sider>
                <style>
                        {`
                        .menuList{
                            margin-top:${this.props.collapsed ? '83px' : '130px' };
                            margin-bottom:50px;
                        }
                        .bottom-label {
                            width:${this.props.collapsed ?'80px' : '200px' };
                            height:40px;
                            border-top:${this.state.collapsed1 ?'1px solid #1D2E51' : '' };
                            position:fixed;
                            background:#001135;
                            left:0px;
                            bottom:0px;
                             z-index:10000
                        }
                        .reposition{
                            textAlign:right;
                            width:50px;
                            padding-right:10px;
                            margin-left:${this.props.collapsed ?'34px ' : '160px' };
                           
                        }
                        .imgStyle{
                            margin-right:${this.props.collapsed ? '36px' : '10px'};
                            width:${this.props.collapsed ? '20px':'16px'  };
                            height:${this.props.collapsed ? '20px':'16px' };
                            margin-top:-3px;
                        }
                        .logo{text-align:center;position:fixed;left:0px;
                               width:${this.props.collapsed ?'80px' : '200px' };}
                        .logo {font-size: 16px;color: #FFFFFF;
                           height:${this.props.collapsed ?'80px' : '135px' };background:#001135}
                        #nprogress .spinner{
                            left: ${this.props.collapsed ? '70px' : '206px'};
                            right: 0 !important;
                        }
                        .ant-menu-item-selected::after{
                            display:block;
                            width:0;
                            height:0;
                            border-width:10px 0 10px 10px;
                            border-style:solid;
                            border-color:transparent transparent transparent #fc0;/*透明 透明 透明 黄*/
                            position:absolute;
                            top:50%;
                            left:110%;
                            z-index:999;
                         }
                         .ant-menu-dark .ant-menu-submenu-title .ant-menu-submenu-arrow, .ant-menu-dark .ant-menu-sub .ant-menu-submenu-title .ant-menu-submenu-arrow {
                           
                            margin-right: 15px;
                        }
                         .ant-menu-dark, .ant-menu-dark .ant-menu-sub {
                            background: #001135;
                        }
                        .ant-layout-sider {
                            background: #001135;  
                        }
                        .ant-menu-dark .ant-menu-inline.ant-menu-sub {
                            background: #000; 
                        }
                        .ant-menu-submenu-title{margin-bottom:0px !important;}
                        .ant-menu-submenu-open .ant-menu-submenu-title{background:rgba(0,0,0,0.15)  !important;}
                        .wicon{margin-right:10px;}
                        .ant-menu-submenu:first-child .ant-menu-submenu-arrow{display:none;}
                        .openMenu{border-bottom:1px solid rgba(255,255,255,0.4);color:#fff;display:inline-block;width:100%;height:40px;line-height:40px;padding-left:20px;}
                        .openMenu:hover{color:#fff;}
                        ::-webkit-scrollbar {
                            width: 10px;     
                            height: 10px;
                        }
                        ::-moz-scrollbar{
                            width: 10px;     
                            height: 4px;
                        }
                        ::-moz-scrollbar-thumb{
                            -moz-border-radius: 5px;
                            -moz-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                            background: rgba(0,0,0,0.1);
                        }
                        ::-webkit-scrollbar-thumb {
                            -webkit-border-radius: 5px;
                            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                            background: rgba(0,0,0,0.1);
                        }
                        .ant-menu-submenu-placement-rightTop{position:absolute;left:80px !important;}
                        .ant-layout-sider{height:100%!important}
                        `}
                    </style>
                
            </div>
        )
    }
}

export default MenuNew