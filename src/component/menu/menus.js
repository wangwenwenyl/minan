
import React, { Component } from 'react';
import { Menu,Icon,Layout,Breadcrumb,Button } from 'antd';
import { Link } from 'react-router-dom';
// import folds from '../../styles/img/folds.png'
// import cookies from 'js-cookie'
import OTAimg from './../../img/OTA.png'
const SubMenu = Menu.SubMenu;
const { Sider } = Layout;
var leftMenu=JSON.parse(sessionStorage.getItem('leftMenu'))
class SiderCustom extends Component {
    constructor(props) {
        super(props);
    } 
    state = {
        collapsed: false,
        mode: 'inline',
        openKey:'',
        selectedKey:'',
        firstHide: true,        
    };
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(){
        console.log(this.props.pathname)
    }
    setMenu = (openKey,selectedKey) => {
        console.log(openKey)
        console.log(selectedKey)
        this.setState({
            openKey: openKey,
            selectedKey: selectedKey
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
    setMenuOpen = props =>{
        if(props.pathname == '/page'){
            this.setState({
                openKey: props.pathname,
                selectedKey: props.pathname
            });
        }else{
            this.setState({
                openKey: props.pathname.substr(0, props.pathname.lastIndexOf('/')),
                selectedKey: props.pathname
            });
        }
    }
    onOpenChange = v => {
        console.log(v)
        if(v[1]=="/page"){
            this.setState({
                openKey:v[v.length-1],
                selectedKey:''
            });
        }else{
            this.setState({
                openKey: v[v.length - 1],
                firstHide: false,
            })
        }
    };
    toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }
    menuClick = (e) =>{
        this.setState({
            selectedKey: e.key,
        });
    }
    render() {
        return (
                <Sider
                    trigger={null}
                    breakpoint="lg"
                    style={{ overflowY: 'hidden',height:'100% !important'}}
                >
                <Menu  
                    theme="dark"
                    mode="inline"
                    onOpenChange={this.onOpenChange}
                    inlineCollapsed={this.state.collapsed}
                    onClick={this.menuClick}
                    openKeys={[this.state.openKey]}
                    selectedKeys={[this.state.selectedKey]}
                    forceSubMenuRender={false}
                    >
                    <SubMenu title={<span><span className='menu-icon'><img src={OTAimg} style={{marginTop:'-7px'}} alt=""/></span>设备管理</span>}>
                       <Menu.Item key="/page/organizationManage/equipManage">
                            <Link to='/page/organizationManage/equipManage'>设备信息管理</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu title={<span><span className='menu-icon'><img src={OTAimg} style={{marginTop:'-7px'}} alt=""/></span>OTA管理</span>}>
                       <Menu.Item key="/page/deviceManage/deviceManage">
                            <Link to='/page/deviceManage/deviceManage'>设备信息管理</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                    <style>
                        {`
                            .ant-layout-sider{width:180px !important;flex: 0 0 180px !important;min-width:100px !important;max-width:180px !important;overflow-y:hidden;}
                            .ant-layout {
                                height: 100% !important;
                                min-height: 100%;
                            }
                        `}
                    </style>
                </Sider>
        )
    }
}
export default SiderCustom;