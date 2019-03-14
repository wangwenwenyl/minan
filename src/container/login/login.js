import React from 'react'
import {Row,Col,Form,Icon,Input,Button,Checkbox,message} from 'antd'
import { Redirect } from 'react-router-dom'
import Axios from 'axios'
import './login.css'
import LogoLogin from './img/logo1.png'
import { httpConfig,HttpUrl } from '../../util/httpConfig';
import {keycode} from './../../util/validator'
import logobgleft from './img/logo_bg1.png'
import userLogo from './img/user.png'
import pwdLogo from './img/pwd.png'
import codeLogo from './img/code.png'
import {validatorPassword} from './../../util/validator'

const FormItem = Form.Item;
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            imgurl:'',
            msg:'',
            token:''
        }
    }
    componentDidMount(){
        this.getcode()             
    }
    handleSubmit = (e) => {
        let _t = this
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let seed = this.state.imgurl.split('=')[1]
            values.seed=seed
          if (!err) {
            let params = values
            Axios.post('sys/system/login',params,httpConfig)
            .then(res => {
                if(res.status == 200 && res.data.code === '100000'){
                   sessionStorage.setItem('token',res.data.data.token)
                   sessionStorage.setItem('parentName','首页')
                   sessionStorage.setItem('userId',res.data.data.id)
                   sessionStorage.setItem('username',res.data.data.name)
                   this.props.history.push('/page/1')
                   this.setState({
                    token:res.data.data.token
                    })
                }else if(res.data.code ==='120003'){
                    this.updateMsg('账号或密码错误，请重新输入')
                }else if(res.data.code ==='120005'){
                    this.updateMsg('验证码不正确，请重新输入')
                    this.getcode()
                }else if(res.data.code ==='120006'){
                    this.updateMsg('验证码已过期，请重新输入')
                    this.getcode()
                }else if(res.data.code ==='120008'){
                    this.updateMsg('账号已禁用')
                    this.getcode()
                }
            })
          }
        });
    }
    updateMsg=(msg)=>{
        this.setState({msg:msg})
    }
    getcode=()=>{
        //sys/system/generateCaptcha
        Axios.get('sys/system/generateCaptcha',httpConfig)
        .then(res => {
            if(res.status == 200 && res.data.code === '100000'){
                this.setState({
                    imgurl:HttpUrl+'/sys/system/getCaptcha?seed='+res.data.data
                })
            }
        })
    }
    hasErrors(fieldsError) {
        // console.log(Object.keys(fieldsError).some(field => fieldsError[field]))
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    accountEmpty=()=>{
        this.props.form.setFieldsValue({'account':''})
    }
    pwdEmpty=()=>{
        this.props.form.setFieldsValue({'password':''})
    }
    captchaEmapty=()=>{
        this.props.form.setFieldsValue({'captcha':''})
    }
    resetFields=()=>{
        this.props.form.resetFields()
    }
    render(){
        const { getFieldDecorator,getFieldsError, getFieldError, isFieldTouched } = this.props.form
        const userNameError = getFieldError('account');
        const passwordError = getFieldError('password');
        const captchaError = getFieldError('captcha');
        const suffix =  isFieldTouched('account') ? <Icon type="close-circle" onClick={this.accountEmpty} /> : null;
        const suffixPwd =  isFieldTouched('password') ? <Icon type="close-circle" onClick={this.pwdEmpty} /> : null;
        const suffixCaptcha =  isFieldTouched('captcha') ? <Icon type="close-circle" onClick={this.captchaEmapty} /> : null;
        return (
            <div className="login_div" id="loginDiv">
            {this.props.redirectTo?<Redirect to={this.props.redirectTo}></Redirect>:null}
                <Row type="flex" justify="space-around" className="login_row">
                    <Col className="logo_title" span={22} offset={2}>敏安汽车车联网服务平台</Col>
                    <Col className="logo_bg_left">
                        <img src={logobgleft}></img>
                    </Col>
                    <Col span={8}  className="login_col">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <p className="textAlgin_center user_login_title">登录中心</p>
                        {this.state.msg && <p className='login_warn'><Icon type="minus-circle" />{this.state.msg}</p>}
                        <FormItem  className="form_input"
                            validateStatus={userNameError ? 'error' : ''}
                            help={userNameError || ''}
                        >
                            {getFieldDecorator('account', {
                                rules: [
                                { required: true, message: '请输入用户名'},
                                {max:20,min:4,message:'用户名为4-20字符'},
                                // { validator: this.checkName }
                                ]
                            })(<Input
                                prefix={<img src={userLogo} />}
                                placeholder="用户名" 
                                suffix={suffix}
                                type="text"
                                onFocus={this.removeWarn}
                                onKeyDown={keycode}
                                
                            />)}
                        </FormItem>
                        <FormItem className="form_input"
                            validateStatus={passwordError ? 'error' : ''}
                            help={passwordError || ''}                  
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                { required: true, message: '请输入密码' },
                                { validator: validatorPassword }
                                ],
                            })(<Input
                                prefix={<img src={pwdLogo} />}
                                type="password"
                                suffix={suffixPwd} 
                                placeholder="密码"
                                onKeyDown={keycode}
                            />)}
                        </FormItem>
                        <FormItem className="form_input"
                            validateStatus={captchaError ? 'error' : ''}
                            help={captchaError || ''}
                            style={{marginBottom:"0px"}}                  
                        >
                            {getFieldDecorator('captcha', {
                                    rules: [
                                    { required: true, message: '请输入验证码' }
                                    // { validator: this.checkName }
                                    ],
                            })(  <Input className="v_code_input"           
                                prefix={<img src={codeLogo} style={{height:'18px'}} />}
                                addonAfter={<img src={this.state.imgurl} style={{width:'100%',height:'38px'}}/>} 
                                type="text"
                                suffix={suffixCaptcha} 
                                placeholder="验证码" 
                                onKeyDown={keycode}
                                autoComplete='off'
                            />)}
                            <span className="v_change" style={{float:"right",cursor:'pointer',fontSize:"12px",color:"#000"}} onClick={this.getcode}>换一换</span>
                        </FormItem>
                        <FormItem className="login_btn">
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}
const Logins = Form.create()(Login)
export default Logins