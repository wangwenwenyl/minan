import React from 'react'
import { Row, Col, Icon, Menu, Dropdown, Modal, Form, Input, Popover, message, Button } from 'antd'
import './header.css'
import { Link } from 'react-router-dom';
import userLogo from './../../img/user.png'
import newsLogo from './../../img/news.png'
import localLogo from './../../img/dingwei.png'
import warn2 from './../../img/warn2.png'
import Axios from 'axios';
import { httpConfig, webSocketUrl } from './../../util/httpConfig'
import { validatorPassword } from './../../util/validator'
import { withRouter } from 'react-router-dom'

const confirm = Modal.confirm
const FormItem = Form.Item
message.config({
    top: 100,
    duration: 2,
    maxCount: 1
})

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            count: '',
            warnMsg: [],
            idToPage: '',
            confirmDirty: false,
            name:sessionStorage.getItem("username")
        }
        this.handelLogout = this.handelLogout.bind(this)
    }
    componentDidMount() {
        this.WebSocketconnect()
        Axios.interceptors.response.use((data) => {
            console.log(data)
            if (data.data.code == '120002') {
                this.logout()
                this.props.history.push('/')
            }
            return data;
        }, err => {
            console.log(err.response)
            if (err.response && err.response.status == '401') {    //没有接口权限
                message.warn(err.response.data.message)
                if (err.response.data.code == '120002') {
                    this.logout()
                    this.props.history.push('/')
                } else if (err.response.data.code == '60002') {
                    this.props.history.push('/page/1')
                }
            } else if (err.response && err.response.status) {
                message.error(err.response.status)
            } else {
                message.error('网络错误！')
            }
            return Promise.resolve(err);
        })

    }
    //websocket连接
    WebSocketconnect = () => {
        let _t = this
        if ("WebSocket" in window) {
            var ws = new WebSocket(webSocketUrl);
            ws.onerror = function () {
                console.log('fail...')
            }
            ws.onopen = function () {
                console.log("send...");
            };
            ws.onmessage = function (evt) {
                var received_msg = evt.data;
                if (received_msg == 'CONN-IS-OK') {
                    let params = {
                        token:sessionStorage.getItem('token'),
                        warnInfo:'waring'
                    }
                    ws.send(JSON.stringify(params));
                    return;
                }
                if(JSON.parse(received_msg) && JSON.parse(received_msg).code === '100000'){
                    _t.setState({warnMsg:JSON.parse(received_msg).data.warningList})
                }
            };
        } else {
            alert("您的浏览器不支持 WebSocket!");
        }
    }
    handelLogout() {
        let _t = this
        confirm({
            title: '退出',
            content: '确认退出登录吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                _t.logout()
                _t.props.history.push('/')
            },
            onCancel() { },
        });
    }
    logout = () => {
        sessionStorage.clear()
    }
    changePwd = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    password: values.originPwd,
                    id: sessionStorage.getItem('userId'),
                    newPassword: values.password
                }
                this.setState({
                    visible: false
                })
                Axios.put('/sys/system/user/editPassword', params, httpConfig)
                    .then(res => {
                        if (res.status == 200 && res.data.code === '100000') {
                            sessionStorage.clear()
                            this.props.history.push('/')
                            message.success('修改成功');
                        } else {
                            message.error(res.data.message);
                        }
                    })
            }
        })
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    hideModal = () => {
        this.setState({
            visible: false
        })
    }
    //校验两次密码
    repeatPwd = (rule, value, callback) => {
        const form = this.props.form;
        const regPassword =/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,16}$/;
        if(!value){
            callback('请输入密码');
        }
        else if (value && value !== form.getFieldValue('password')) {
            callback('两次输入密码不一致！');
            return false;
        } else {
            if (!regPassword.test(value)) {
                callback('6-16个数字/英/符号组合(至少两种)');
                return false;
            }
            callback();
        }
    }
    //推送展示框
    // showMsg=()=>{
    //     let _t = this
    //     let a = <a >{this.state.count}</a>
    //     confirm({
    //         title: '告警提醒',
    //         content: <div>{this.state.warnMsg.map((data)=>{
    //             <p>{data.warminglevel}级告警信息{data.warmingCount}条</p>
    //         })}</div>,
    //         okText:'确认',
    //         cancelText:'取消',
    //         onOk() {

    //         },
    //         onCancel() {},
    //       });
    // }
    keycode = (event) => {
        if (event.keyCode == '32') {
            event.preventDefault();
            return false;
        }
    }
    back = () => {
        if(sessionStorage.getItem("menuName") === '升级任务管理'){
            this.props.history.push('/page/taskManage/taskManage/'+12)
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['repeatpassword'], { force: true });
        }
        callback();
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a rel="noopener noreferrer" href="javascript:;" onClick={this.showModal}>修改密码</a>
                </Menu.Item>
                <Menu.Item>
                    <a rel="noopener noreferrer" href="javascript:;" onClick={this.handelLogout}>退出</a>
                </Menu.Item>
            </Menu>
        )
        const { getFieldDecorator } = this.props.form
        const content = (
            <div className="warings">
            {this.state.warnMsg &&
                this.state.warnMsg.map((v,index)=>{
                    return(
                        <p key={index} style={{color:"#FF3636"}}><span><img src={warn2} /></span><span>{v.plateNo+'于'+v.uploadStartTime+'发生'+v.warningInfo}</span></p>
                    )
                })
            }
                <div style={{height:"36px",lineHeight:"36px",borderTop:"1px solid #E4E4E4",textAlign:"right"}}>
                    <a onClick={()=>{
                        this.props.history.push('/page/historyAlarm/historyAlarm/16')
                        sessionStorage.setItem('openkey',5)
                    }}>更多报警></a>
                </div>
            </div>
        );
        const title =(
            <div style={{background:"#3689FF",color:"#fff",height:"36px",lineHeight:"36px",paddingLeft:"20px"}}>最新报警</div>
        )
        return (
            <div className='header_all' >
                {/* {this.props.redirectTo?<Redirect to={this.props.redirectTo}></Redirect>:null} */}
                <Row type="flex" justify="center" algin="middle">
                    <Col span={6} style={{ paddingLeft: "10px" }}>
                        <img src={localLogo} />
                        <span style={{ fontSize: "14px", color: "#333333", marginLeft: "2px" }}>
                            {sessionStorage.getItem("parentName")}
                            <span onClick={  () => this.back()} className='back'>
                                {sessionStorage.getItem("menuName") ? ">" + sessionStorage.getItem("menuName") : ''}
                            </span>
                            {this.props.location.pathname === '/page/taskManage/jobDetail/12' ? ">" + "查看详情" : ''}
                        </span>
                    </Col>
                    <Col span={18} className="user">
                        <Popover 
                        placement="bottomRight" 
                        content={content} title={title}
                        overlayClassName="waring_popover"
                        >
                            <img src={newsLogo} style={{ marginRight: "30px" }} />
                        </Popover>
                        <img src={userLogo} />
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a className="user_name">{this.state.name}
                                <Icon type="caret-down" spin={false} style={{ fontSize: 10, marginLeft: '4px', verticalAlign: 'unset', marginRight: '5px' }} />
                            </a>
                        </Dropdown>
                    </Col>
                </Row>
                <Modal
                    title="重置密码"
                    visible={this.state.visible}
                    onOk={this.changePwd}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose={true}
                    className='password-change'
                    width='340px'
                >
                    <Form className="login-form">
                        <FormItem hasFeedback className="form_input pwd_input">
                            {getFieldDecorator('originPwd', {
                                rules: [
                                    { required: true, validator: validatorPassword }

                                ],
                            })(<Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入旧密码"
                                type="password"
                                autoComplete='off'
                                onKeyDown={this.keycode}
                            />)}
                        </FormItem>
                        <FormItem hasFeedback className="form_input pwd_input">
                            {getFieldDecorator('password', {
                                rules: [
                                    { required: true, validator: validatorPassword },
                                    { validator: this.validateToNextPassword }

                                ],
                            })(<Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入密码"
                                type="password"
                                autoComplete='off'
                                onKeyDown={this.keycode}
                            />)}
                        </FormItem>
                        <FormItem hasFeedback className="form_input pwd_input">
                            {getFieldDecorator('repeatpassword', {
                                rules: [
                                    // { required: true, message: '请再次输入密码' }, 
                                    { validator: this.repeatPwd }
                                ],
                            })(<Input
                                prefix={<Icon type="lock" autoComplete='off' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请再次输入密码"
                                onKeyDown={this.keycode}
                                onBlur={this.handleConfirmBlur}
                            />)}
                        </FormItem>
                    </Form>
                </Modal>
                <style>
                    {`
                        .pwd_input{margin-bottom:24px!important}
                        .back:hover{cursor:pointer}
                    `}
                </style>
            </div>
        )
    }
}
const Headers = Form.create()(withRouter(Header))
export default Headers