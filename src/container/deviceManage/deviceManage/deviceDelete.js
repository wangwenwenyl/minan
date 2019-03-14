/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import Qs from 'qs'
import { Link } from 'react-router-dom';
import {Row,Col,Form,Modal,message,Input,TreeSelect} from 'antd';
import {validatorPasswordInfo} from './../../../util/validator'
import moment from 'moment';
import {HttpUrl, httpConfig} from '../../../util/httpConfig'
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const FormItem = Form.Item;
class deleteDevice extends Component {

    constructor(props, context) {
        super(props, context);
    }
    state = {
        deleteModal:false,
        record:'',
        action:''
    }
    componentDidMount(){
        
    }
    deviceSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err){
                this.checkPassword().then(res => {
                    if(res){
                        if(this.state.action === '删除'){
                            this.delete()
                        }else if(this.state.action === '报废'){
                            this.giveup()
                        }else if(this.state.action === '审核通过'){
                            this.check()
                        }
                    }
                })
            }
        })
    }
    deleteSubmit = (record,action) => {
        this.setState({
            deleteModal:true,
            record:record,
            action:action
        })
    }
    //删除
    delete = () => {
        Axios.post(HttpUrl+"equip/equipment/deleteEquipment",{
            'equipmentId':this.state.record.eqmId
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    deleteModal:false
                })
                this.props.list()
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //报废
    giveup = () => {
        Axios.post(HttpUrl+"equip/equipment/scrapEqm",{
            'equipmentId':this.state.record.eqmId
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    deleteModal:false
                })
                this.props.list()
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //审核通过
    check = () => {
        Axios.post(HttpUrl+"equip/equipment/registerCheckPass",{
            'equipmentId':this.state.record.eqmId
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    deleteModal:false
                })
                this.props.list()
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //密码验证
    checkPassword = () => {
        return Axios.post('sys/system/user/checkPassword',{
            'password':this.props.form.getFieldValue('password')
        },httpConfig).then(res => {
            if(res.data.code === '100000'){
                return Promise.resolve(true);
            }else{
                return Promise.resolve(false);
            }
        })
    }
    sureDelete = () => {
        if(this.props.form.getFieldValue('password')){
            this.deviceSubmit()
        }
    }
    cancelDelete = () => {
        this.setState({
            deleteModal:false
        })
    }
    render() {
        const { getFieldDecorator}=this.props.form
        return (
        <div className="content" >
            <Modal
                title={ this.state.action }
                visible={this.state.deleteModal}
                okText='确定'
                cancelText="取消"
                onCancel={ this.cancelDelete}
                onOk={ this.sureDelete}
                destroyOnClose={true}
                className='deleteBox'
            >
                <Form layout="inline" onSubmit={ this.deviceSubmit}>
                    <Row style={{padding:'0px 16px'}}>   
                        <Col span={24} >
                            <div style={{textAlign:'center',marginBottom:'5px'}}>
                            {
                                this.state.action === '删除' ?
                                '确定删除该设备吗？'
                                : this.state.action === '报废' ?
                                '确定报废该设备吗？'
                                : this.state.action === '审核通过' ?
                                '确定审核通过该设备吗？'
                                : ''
                            }
                            </div>
                            <FormItem label="">
                            { getFieldDecorator('password',{
                                rules:[{
                                    validator:validatorPasswordInfo
                                }]
                            })( < Input style={{marginLeft:'35%',width:'220px'}} type='password' autoComplete='off'/>)}
                            </FormItem>
                            {
                                 this.props.form.getFieldValue('password') ? '' :
                                <div style={{marginLeft:'20%'}}>
                                    <span style={{fontSize:'10px',color:'#FF3636'}}>
                                        请输入管理员密码
                                    </span>
                                    <span style={{fontSize:'10px',color:'##3F3F3F'}}>
                                    {
                                        this.state.action === '删除' ?
                                        '(删除后的设备不可恢复)'
                                        : this.state.action === '报废' ?
                                        '(报废后的设备不可恢复)' 
                                        : ''
                                    }
                                    </span>
                                </div>
                            }
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <style>
                {`
                    .deleteBox{width:463px !important;height:300px !important;}
                    .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    .deleteBox .ant-form-explain{margin-left:35%;}
                `}
            </style>
        </div>
        )
    }
}
const deletes = Form.create()(deleteDevice);
export default deletes;