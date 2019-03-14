/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-constructor */
// 优化需求:
// react 最好把接口和参数都扔在主页面, 弹窗数据全从主页面拿, 后期优化
// state参数数据最好模块化
// 最好使用一个弹窗, 多个弹窗导致相同同接口多次调用
import React, { Component } from 'react';
import { Divider, message, Input, Collapse, Form, Button, DatePicker, Popconfirm, Icon, Modal } from 'antd';
import Axios from 'axios';
import moment from 'moment';

import NoticeAdd from './noticeAdd';
import NoticeModify from './noticeModify';
import NoticeView from './noticeView';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import checkedArrow from './../../../img/checkedArrow.png';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;

class notice extends Component {
    constructor(props, context) {
        super(props, context);
    }
    
    state = {
        list: [],           // 数据列表
        total: 1,           // 数据总条数
        currentPage: 1,     // 当前页码
        loading: false,     // 加载时的动画变量
        pageSize: 10,       // 每页条数
        startPage: 1,       // 搜索起始页
        
        collapse: false,    // 搜索框扩展收缩变量
        updateStatusLocked: false,    // 状态变更开关变量

        table: {

        },

        modal: {
            showConfirmModal: false,
            record: {},
        },

        search: {
            title: '',
            beginTime: '',
            endTime: '',
            moment: [],
            messageDigit: [],
            pushType: [],
            status: [],
        },

        // 搜索选项
        options: {
            // 没有接口获取,写死1系统消息, 2告警通知 ,3 推荐消息 ,4 问卷调查, 5 启动页广告，6轮播广告,7保养提醒
            messageDigit: [
                { value: 0, label: '系统通知',},
                { value: 2, label: '告警通知',},
                { value: 1, label: '推荐消息',},
                // { value: 4, label: '问卷调查',},
                // { value: 5, label: '启动页广告',},
                // { value: 6, label: '轮播广告',},
                { value: 3, label: '保养提醒',},
            ],

            // 通知类型 （searchPush） （1 及时  2 固定）  
            pushType: [
                { value: 1, label: '及时消息',},
                { value: 2, label: '固定消息',},
            ],

            // 处理状态 （searchStatus） （0：启用 1：禁用）
            status: [
                { value: 0, label: '启用', },
                { value: 1, label: '禁用', },
            ],
        },

        columns: [
            { title: '序号', dataIndex: 'vid', width: 70, fixed: 'left',},
            { title: '消息类型', dataIndex: 'pushType', width: 100, fixed: 'left', render: (t) => {return (<span>{Number(t) === 1 ? '及时' : '固定'}</span>)} },
            { title: '推送方式', dataIndex: 'way', width: 100, render: (t) => {return(<span>{Number(t) === 1 ? 'App' : '短信'}</span>)}},
            { title: '消息位', dataIndex: 'messageDigit', width: 120, render: (text, record) => { return this.messageDigit(text, record)}},
            { title: '消息标题', dataIndex: 'title', width: 280,  className: 'textLeft '},
            { title: '消息内容', dataIndex: 'message', className: 'textLeft maxWidth', },
            { title: '状态', dataIndex: 'status', width: 80, render: (t) => {return (<span>{ t === 0 ? '启用': '禁用'}</span>) } },
            { title: '创建时间', dataIndex: 'createTimeStr', width: 160,},
            { title: '创建人', dataIndex: 'createUser', width: 100, },
            { title: '操作', dataIndex: 'action', width: 140, fixed: 'right', render: (t,p) => { return this.renderTableActionButtons(t,p)}},
        ],
    }

    componentDidMount() {
        this.list()
        .then((res) => {
            this.setState({
                list: this.setVid(res.data.page.list),
                total: res.data.page.total,
                pages: res.data.page.pages,
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    // 设置表格上虚拟id, 所有数据必须加一个key主键, 不然console.log报错
    setVid = (data) => {
        if(data.length && data.length > 0) {
            data.forEach((item, index)=> {
                item.vid = index + 1;
                item.key = index;
            })
        }
        return data;
    }

    // ======================
    // 搜索方法
    // ======================
    // 搜索框弹出弹入
    collapseChange = () => {
        this.setState({ collapse: !this.state.collapse });
    }

    // 关键字变更 
    searchTitleChange = (e) => {
        this.setState({
            search: Object.assign(this.state.search, {
                title: e.target.value.trim(),
            })
        });
    }

    // 搜索日期变更
    searchDateChange = (moment, date) => {
        let state = this.state;
        this.setState({
            search: Object.assign(state.search, {
                beginTime: date[0],
                endTime: date[1],
                moment: moment
            })
        });
    }

    // 选择检查项
    searchCheck = (item, type) => {
        let state = this.state;
        let messageDigit = state.search.messageDigit;
        let pushType = state.search.pushType;
        let status = state.search.status;
        switch (type) {
            case 'messageDigit':
                state.search.messageDigit.indexOf(item.value + '') >= 0 
                    ? messageDigit = state.search.messageDigit.filter(i => i !== item.value + '')
                    : messageDigit.push(item.value + '');
            break;
            case 'pushType':
                state.search.pushType.indexOf(item.value + '') >= 0 
                    ? pushType = state.search.pushType.filter(i => i !== item.value + '')
                    : pushType.push(item.value + '');
            break;
            case 'status':
                state.search.status.indexOf(item.value + '') >= 0
                    ? status = state.search.status.filter(i => i !== item.value + '')
                    : status.push(item.value + '');
            break;
            default:
            break;
        }
        this.setState({
            search: Object.assign(state.search, {
                messageDigit: messageDigit,
                pushType: pushType,
                status: status,
            })
        });
        // 点击搜索
        this.search();
    }

    // 清除条件
    clearCondition = () => {
        this.setState({
            search: Object.assign(this.state.search, {
                keyword: '',
                beginTime: '',
                endTime: '',
                moment: '',
                messageDigit: [],
                pushType: [],
                status: [],
            })
        });
        this.props.form.resetFields();
        this.search();
    }

    // 搜索
    search = () => {
        this.list()
        .then((res) => {
            this.setState({
                list: this.setVid(res.data.page.list),
                total: res.data.page.total,
                pages: res.data.page.pages,
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    // ======================
    // ajax
    // ======================
    // 拉取列表 http://42.159.92.113/api/appserv/push/getPushList
    list = (options) => {
        let state = this.state;
        let option = options || {};
        let params = Object.assign({
            title: state.search.title,
            beginTime: state.search.beginTime,
            endTime: state.search.endTime,
            searchMode: state.search.pushType,
            searchMessage: state.search.messageDigit,
            searchStatus: state.search.status,
            pageSize: state.pageSize,
            startPage: state.startPage,
        }, option);
        return new Promise((resolve, reject)=> {
            this.setState({ loading: true })
            Axios.post(HttpUrl + 'appserv/push/getPushList', { ...params }, httpConfig)
                .then((res) => {
                    this.setState({ loading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }                    
                });
        });        
    }

    // 禁用启用
    // 请求方式：POST; 接口路径：http://42.159.92.113/api/appserv/push/updateStatus
    updataStatus = (record) => {
        let state = this.state;
        let params = {
            id: record.id,
            status: Number(record.status) === 0 ? 1 : 0,
        }
        // 防止多次请求
        if (!state.updateStatusLocked){
            this.setState({ updateStatusLocked: true });
            return new Promise((resolve, reject) => {
                Axios.post(HttpUrl + 'appserv/push/updateStatus', { ...params }, httpConfig)
                    .then((res) => {
                        this.setState({ updateStatusLocked: false });
                        if (res.data.code === '100000') {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }
                    });
            });            
        } else {
            message.warning('请求已经发送,请稍候...');
        }
    }

    // 12.6消息通知管理模板短信模板查询
    // 请求方式：GET,接口路径：http://42.159.92.113/api/appserv/push/getMmsTemplateList
    getMmsTemplateList = (option) => {
        let data = option || {};
        return new Promise((resolve, reject) => {
            Axios.get(HttpUrl + 'appserv/push/getMmsTemplateList', { ...data }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 12.7消息通知管理固定模板事件触发的车辆故障告警的触发条件下拉框显示
    // 请求方式：GET 接口路径：http://42.159.92.113/api/appserv/push/selectTriggerConditions
    getTriggerConditions = () => {
        return new Promise((resolve, reject) => {
            Axios.get(HttpUrl + 'appserv/push/selectTriggerConditions', { }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(this.setVid(res.data.data));
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 12.8消息通知管理固定模板事件触发的车辆故障告警的固定模板触发条件维护
    // 请求方式： GET 接口路径：http://42.159.92.113/api/appserv/push/selectTriggerConditionMaintenance
    triggerConditionMaintenance = (option) => {
        option = option || {};
        return new Promise((resolve, reject) => {
            Axios.get(HttpUrl + 'appserv/push/selectTriggerConditionMaintenance', { ...option}, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(this.setVid(res.data.data));
                    } else {
                        reject(res.data);
                    }
                });
        });
    }
    
    // ==================
    // 表格操作
    // ==================
    toggleStatus = () => {
        let record = this.state.modal.record;
        this.updataStatus(record)
            .then((res) => {
                return this.list();
            })
            .then((res) => {
                this.setState({
                    list: this.setVid(res.data.page.list),
                    total: res.data.page.total,
                    pages: res.data.page.pages,
                });
            })
            .catch(err => message.warning(err.message));
        this.hideConfirmModal();
    }

    // 页码点击切换
    changePage = (page) => {
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                list: this.setVid(res.data.page.list),
                total: res.data.page.total,
                pages: res.data.page.pages,
                currentPage: page,
            });
        })
        .catch((err) => {
            message.warning(err.message)
        });
    }

    view = (record) => {
        this.formView.showModal(record);
    }

    modify = (record) => {
        this.formModify.showModal(record);
    }

    add = (options) => {
        this.formAdd.showModal(options);
    }

    showConfirmModal = (record) => {
        let { modal } = this.state;
        this.setState({
            modal: Object.assign(modal, {
                showConfirmModal: true,
                record: record,
            }),
        });
    }

    hideConfirmModal = () => {
        let { modal } = this.state;
        this.setState({
            modal: Object.assign(modal, {
                showConfirmModal: false,
            })
        });
    }

    // =============================
    // 渲染表格消息位
    // 0: 系统通知; 1: 推荐消息; 2: 告警通知; 3: 保养提醒; 4: 调查问卷
    messageDigit = (text) => {
        let str;
        let _text = Number(text);
        if (_text === 1) { str = '推荐消息'}
        else if (_text === 0) { str = '系统通知' }
        else if (_text === 2) { str = '告警通知' }
        else if (_text === 3) { str = '保养提醒' }
        else if (_text === 4) { str = '调查问卷' }
        return (<span>{str}</span>)
    }

    // 渲染表格操作按钮
    renderTableActionButtons(text, record) {
        return (
            <div>
                <a href="javascript:void(0);" onClick={() => { this.view(record)}}>查看</a>
                <Divider type="vertical" />
                <a href="javascript:void(0);" onClick={() => { this.modify(record)}}>修改</a>
                <Divider type="vertical" />
                {/* <a href="javascript:void(0);" onClick={() => { this.toggleStatus(record) }} >{record.status === 0 ? '禁用' : '启用'}</a> */}
                <a href="javascript:void(0);" onClick={() => { this.showConfirmModal(record) }} >{record.status === 0 ? '禁用' : '启用'}</a>
                
            </div>
        )
    }

    // 渲染页面
    render() {
        let state = this.state;
        const { getFieldDecorator } = this.props.form;
        return ( 
            <div className="content" >
                <div className='content-title'>
                    <Form layout="inline">
                        <div className="searchType">
                            <FormItem label="关键字搜索">
                                {getFieldDecorator('keyword',{
                                    initialValue: state.search.keyword
                                })(
                                    <Input onChange={this.searchTitleChange} />
                                )}
                            </FormItem>
                            <FormItem label="创建时间">
                                {getFieldDecorator('searchTime')(
                                    <RangePicker
                                        style={{ width: '300px' }}
                                        onChange={this.searchDateChange}
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )}
                            </FormItem>
                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }}>查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost >清除条件</Button>
                        </div>
                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={this.state.collapse ? <span>收起</span> : <span>更多</span>} key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >消息位：</div>
                                    <div className='moreBox' >
                                        {
                                            state.options.messageDigit.map((item,index) => (
                                                <div
                                                    key={index}
                                                    className={state.search.messageDigit.indexOf(item.value + '') >= 0 ? 'checks checked' : 'checks'}
                                                    onClick={() => this.searchCheck(item, 'messageDigit')} >
                                                    {item.label}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >消息类型：</div>
                                    <div className='moreBox' >
                                        {
                                            state.options.pushType.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={state.search.pushType.indexOf(item.value + '') >= 0 ? 'checks checked' : 'checks'}
                                                    onClick={() => this.searchCheck(item, 'pushType')} >
                                                    {item.label}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >消息状态：</div>
                                    <div className='moreBox'>
                                        {
                                            state.options.status.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={state.search.status.indexOf(item.value + '') >= 0 ? 'checks checked' : 'checks'}
                                                    onClick={() => this.searchCheck(item, 'status')} >
                                                    {item.label}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
                </div>
                <div>
                    <div className="oprateHead">
                        <Button type="primary" className='btn' ghost onClick={() => {this.add({ pushType: 1 })}} >创建及时消息</Button>
                        <Button type="primary" className='btn' ghost onClick={() => {this.add({ pushType: 2 })}} >创建固定消息</Button>
                    </div>
                    <div className="table table_list">
                        <Table
                            scroll={1650}
                            columns={state.columns}
                            dataSource={state.list}
                            loading={state.loading}
                            total={state.total}
                            current={state.currentPage}
                            pageSize={state.pageSize}
                            onChange={this.changePage}
                        />
                    </div>
                </div>

                <Modal
                    title={`确认提示`}
                    onCancel={this.hideConfirmModal}
                    onOk={this.toggleStatus}
                    visible={this.state.modal.showConfirmModal}
                    destroyOnClose>
                    <div className="confirm_modal">
                        确定要禁用启用此记录嘛?
                    </div>
                </Modal>

                {/* 弹出窗口 把父组件方法方法传进子组件, 蛋疼*/}
                <NoticeView 
                    wrappedComponentRef={(form) => this.formView = form} 
                />
                {/* 这里最好使用一个弹窗, 两个窗导致接口调了两次, 后期有空优化, */}
                <NoticeModify
                    refresh={this.search}
                    wrappedComponentRef={(form) => this.formModify = form} 
                    getMmsTemplateList={this.getMmsTemplateList}
                    getTriggerConditions={this.getTriggerConditions}                    
                    triggerConditionMaintenance={this.triggerConditionMaintenance}
                />
                <NoticeAdd
                    refresh={this.search}
                    wrappedComponentRef={(form) => this.formAdd = form} 
                    getMmsTemplateList={this.getMmsTemplateList}
                    getTriggerConditions={this.getTriggerConditions} 
                    triggerConditionMaintenance={this.triggerConditionMaintenance}
                />
                <style>
                {`
                .confirm_modal{text-align:center;padding: 24px 0;}
                .checks.checked {border: 1px solid rgb(54, 137, 255); color: rgb(54, 137, 255);background:url(${checkedArrow}) no-repeat right bottom;}
                .ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} 
                .ant-table-tbody td.maxWidth,.ant-table-thead th.maxWidth { max-width:280px;min-width:10%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;}
                `}                
                </style>
            </div>
        );
    }
}

export default Form.create()(notice);