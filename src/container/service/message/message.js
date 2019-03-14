/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import Axios from 'axios';
import { message, Divider, Collapse, Form, Input, Select, Button, DatePicker } from 'antd';

import Table from "../../../component/table/table";
import { HttpUrl, httpConfig } from '../../../util/httpConfig';

// import MessagePreview from './messagePreview';
// import MessageModify from './messageModify';
// import MessageAdd from './messageAdd';
import MessageEdit from './messageEdit';
import MessagePreview from './messagePreview';

import checkedArrow from './../../../img/checkedArrow.png';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { Option } = Select;
const { RangePicker } = DatePicker;
class messagePublish extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        offlineLocked: false,   // 下线不可重复请求

        table: {
            list: [],           // 表格数据列表
            currentPage: 1,     // 当前页码
            total: 1,           // 数据总条数
            loading: true,      // 拉取数据时候loading开关
            startPage: 1,       // 起始页
            pageSize: 10,       // 每次条数
        },

        // 搜索条件
        search: {
            topic: '',
            timeType: '0',
            beginTime: '',
            endTime: '',
            sortName: '',
            type: [],
            expire: [],
            collapse: false,    // 搜索框弹出缩回开关
        },

        // 快速搜索选项
        options: {
            type: [
                { value: 1, label: '系统消息', },
                { value: 2, label: '告警通知', },
                { value: 3, label: '推荐消息', },
                // { value: 4, label: '问卷调查', },
                { value: 5, label: '启动页广告', },
                { value: 6, label: '轮播广告', },
                { value: 7, label: '保养提醒', },
            ],

            expire: [
                { value: 0, label: '待发布', },
                { value: 4, label: '草稿', },
                { value: 2, label: '发布中', },
                { value: 3, label: '已下线', },
            ],
        },
        
        // 需要大量渲染的写方法里
        columns: [
            { title: '序号', width: 70, dataIndex: 'vid', fixed: 'left', },
            { title: '信息位', dataIndex: 'type', className: 'textLeft', fixed: 'left', width: 100, render: (text) => { return this.renderTableType(text) } },
            { title: '标题', dataIndex: 'topic', className: 'textLeft', width: 280, fixed: 'left', },
            { title: '信息格式', dataIndex: 'control', width: 100, render: (text) => { return (<span>{Number(text) === 1 ? '图文' : Number(text) === 2 ? '链接' : '图片'}</span>) } },
            { title: '状态', dataIndex: 'expire', width: 80, render: (text) => { return this.renderTableExpire(text) } },
            { title: '信息点击量', dataIndex: 'infoClick', width: 160, },
            { title: '信息有效期', dataIndex: 'pushEndTimeStr', width: 160, },
            { title: '创建时间', dataIndex: 'createTimeStr', width: 160, },
            { title: '下线时间', dataIndex: 'offLineTimeStr', width: 160, },
            { title: '发布人', dataIndex: 'createUser', width: 140, },
            { title: '操作', dataIndex: 'action', width: 160, fixed: 'right', render: (text, record) => { return this.renderTableActionButtons(text, record) } },
        ]
    }
    componentDidMount() {
        this.search();
    }

    // 设置表格上虚拟id, 所有数据必须加一个key主键, 不然console.log报错
    setVid = (data) => {
        if (data.length && data.length > 0) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = index;
            })
        }
        return data;
    }

    // ====================
    // ajax
    // ====================
    // 11.5信息列表查询    
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/app/message/getMessageList
    list = (options) => {
        let { table, search } = this.state;
        let opts = options || {};
        let params = Object.assign({
            // 普通列表
            pageSize: table.pageSize,
            startPage: table.startPage,
            // 搜索条件
            topic: search.topic,
            timeType: search.timeType,
            beginTime: search.beginTime,
            endTime: search.endTime,
            type: search.type,
            expire: search.expire,
            sortName: search.sortName,            
        }, opts);
        return new Promise((resolve, reject) => {
            this.setState(Object.assign(this.state.table, { loading: true }));
            Axios.post(HttpUrl + 'appserv/app/message/getMessageList', { ...params }, httpConfig)
                .then((res) => {
                    this.setState(Object.assign(this.state.table, { loading: false }));
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 11.1创建活动接口
    // 请求方式:POST;接口路径:http://42.159.92.113/api/appserv/app/message/addMessage
    addMessage = (record) => {
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/app/message/addMessage', { ...record }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }  

    // 11.3更新活动接口
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/app/message/updateMessage
    updateMessage = (record) => {
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/app/message/updateMessage', { ...record }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 11.4信息活动下线
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/app/message/messageOffLine
    messageOffLine = (record) => {
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/app/message/messageOffLine', { ...record }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });        
    }

    // 12.6消息通知管理模板短信模板查询
    // 请求方式：GET,接口路径：http://42.159.92.113/api/appserv/push/getMmsTemplateList
    getMmsTemplateList = (options) => {
        let option = options || {};
        let params = Object.assign({}, option);
        return new Promise((resolve, reject) => {
            Axios.get(HttpUrl + 'appserv/push/getMmsTemplateList', { ...params }, httpConfig)
            .then((res) => {
                if (res.data.code === '100000') {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            });
        });
    }

    // 12.2消息通知管理添加
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/push/addPush
    addNotice = (record) => {
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/push/addPush', { ...record }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }
    
    // ======================
    // 表格方法
    // ======================
    offLine = (record) => {
        let { talbe } = this.state;
        this.messageOffLine(record)
        .then((res) => {
            // 刷下
            this.search();
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    edit = (option) => {
        this.formEdit.showModal(option);
    }

    // 显示添加记录
    addRecord = (record) => {
        this.edit(record);
    }

    // 显示修改记录窗口
    modifyRecord = (record) => {
        this.edit(record);
    }

    // 显示修改记录窗口
    preview = (record) => {
        this.formPreview.showModal(record);
    }

    // 变更页码
    changePage = (page) => {
        console.log(page);
        let { table } = this.state;
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                table: Object.assign(table, {
                    list: this.setVid(res.data.page.list),
                    pageSize: res.data.page.pageSize,
                    total: res.data.page.total,
                    pages: res.data.page.pages,
                    currentPage: page,
                })
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }    

    // ====================
    // 搜索框方法
    // ====================
    collapseChange = () => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                collapse: !this.state.search.collapse,
            }),
        });
    }

    // 关键字变化
    changeSearchTopic = (e) => {
        let {search} = this.state;
        this.setState({
            search: Object.assign(search, {
                topic: e.target.value.trim(),
            })
        });
    }

    // 搜索时间类型
    changeSearchTimeType = (value) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                timeType: value,
            }),
        });
    }

    // 选择时间
    changeRangePicker = (e, t) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                beginTime: t[0],
                endTime: t[1],
            }),
        });
    }

    // 搜索
    search = () => {
        let { table } = this.state;
        this.list()
            .then((res) => {
                this.setState({
                    table: Object.assign(table, {
                        list: this.setVid(res.data.page.list),
                        pageSize: res.data.page.pageSize,
                        total: res.data.page.total,
                        pages: res.data.page.pages,
                    })
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // 快速搜索
    searchCheck = (item, fieldType) => {
        console.log(item)
        let { search } = this.state;
        let expire = search.expire;
        let type = search.type;
        switch (fieldType) {
            case 'expire':
                search.expire.indexOf(item.value + '') >= 0
                    ? expire = search.expire.filter(i => i !== item.value + '')
                    : expire.push(item.value + '');
                break;
            case 'type':
                search.type.indexOf(item.value + '') >= 0
                    ? type = search.type.filter(i => i !== item.value + '')
                    : type.push(item.value + '');
                break;
            default:
                break;
        }
        // 变更搜索条件
        this.setState({
            search: Object.assign(search, {
                expire: expire,
                type: type,
            }),
        });
        // 搜索
        this.search();
    }

    // 清除条件
    clearCondition = () => {
        this.setState(Object.assign(this.state.search, {
            topic: '',
            timeType: '',
            beginTime: '',
            endTime: '',
            sortName: '',
            type: [],
            expire: [],
        }));
        this.props.form.resetFields();
        this.search();
    }

    // ==================
    // table 列渲染
    // ==================
    // 1系统消息, 2告警通知 ,3 推荐消息,4 问卷调查, 5 启动页广告，6轮播广告,7保养提醒
    renderTableType = (text) => {
        let str;
        let _text = Number(text);
        if (_text === 1) { str = '系统消息' }
        else if (_text === 2) { str = '告警通知' }
        else if (_text === 3) { str = '推荐消息' }
        else if (_text === 4) { str = '问卷调查' }
        else if (_text === 5) { str = '启动页广告' }
        else if (_text === 6) { str = '轮播广告' }
        else { str = '保养提醒' }
        return (<span>{str}</span>)
    }

    // 到发布时间后才会在APP端看到,发布状态 0 待发布 1 已发布 2 发布中 3 已下线 4草稿
    renderTableExpire = (text) => {
        let str;
        let _text = Number(text);
        if (_text === 0) { str = '待发布' }
        else if (_text === 1) { str = '发布中'}
        else if (_text === 2) { str = ' 已发布' }
        else if (_text === 3) { str = '已下线' }
        else { str = '草稿' }
        return (<span>{str}</span>)
    }

    // 渲染表格操作按钮
    renderTableActionButtons = (text, record) => {
        return (
            <span>
                {/*
                操作描述:
                草稿：预览、修订            { value: 4, label: '草稿', },
                待发布：预览、修订、下线     { value: 0, label: '待发布', },
                发布中：预览、下线          { value: 2, label: '发布中', },
                已下线：预览               { value: 3, label: '已下线', },


                已发布：预览               { value: 1, label: '已发布', },
                */}
                <a href="javascript:void(0);" onClick={() => { this.preview(record) }}>预览</a>
                {
                    (Number(record.expire) === 4 || Number(record.expire) === 0) &&
                    <span>
                        <Divider type="vertical" />
                        <a href="javascript:void(0);" onClick={() => { this.modifyRecord({ type: 'edit', record: record }) }}>修订</a>
                    </span>
                }
                {
                    (Number(record.expire) === 2 || Number(record.expire) === 0) &&
                    <span>
                        <Divider type="vertical" />
                        <a href="javascript:void(0);" onClick={() => { this.offLine(record) }}>下线</a>
                    </span>
                }
            </span>
        )
    }

    render() {
        let { columns, table, search, options } = this.state;
        let { getFieldDecorator } = this.props.form;
        return (
            <div className="content" >
                {/* 搜索选项 */}
                <div className="content-title">
                    <Form layout="inline">
                        <div className="searchType">
                            <FormItem label="关键字">
                                {getFieldDecorator('title', {
                                    initiaValue: search.topic,
                                })(
                                    <Input placeholder="关键字" onChange={this.changeSearchTopic} />
                                )}
                            </FormItem>
                            <FormItem label="选择时间" >
                                {getFieldDecorator('timeType', {
                                    initiaValue: search.timeType,
                                })(
                                    <Select style={{ width: '200px' }} onChange={this.changeSearchTimeType}>
                                        <Option value="0">开始时间</Option>
                                        <Option value="1">结束时间</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem >
                                <RangePicker onChange={this.changeRangePicker} format={'YYYY-MM-DD HH:mm:ss'} />
                            </FormItem>
                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }} >查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost >清除条件</Button>
                        </div>

                        <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                            <Panel header={search.collapse ? <span>收起</span> : <span>更多</span>} key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >消息位：</div>
                                    <div className='moreBox' >
                                        {
                                            options.type.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={search.type.indexOf(item.value + '') >= 0 ? 'checks checked' : 'checks'}
                                                    onClick={() => this.searchCheck(item, 'type')} >
                                                    {item.label}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className='searchType'>
                                    <div className='typeTitle' >信息状态：</div>
                                    <div className='moreBox' >
                                        {
                                            options.expire.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={search.expire.indexOf(item.value + '') >= 0 ? 'checks checked' : 'checks'}
                                                    onClick={() => this.searchCheck(item, 'expire')} >
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

                {/* // 表格上按钮 */}
                <div className="oprateHead">
                    <Button type="primary" className='btn' ghost onClick={() => { this.addRecord({type: 'add'}) }} >发布信息</Button>
                </div>

                {/* 表格容器 */}
                <div className="table table_list tableInfo ">
                    <Table
                        scroll={1650}
                        columns={columns}
                        dataSource={table.list}
                        loading={table.loading}
                        total={table.total}
                        current={table.currentPage}
                        pageSize={table.pageSize}
                        onChange={this.changePage}
                    />
                </div>

                {/* 弹出窗口 */}
                <MessageEdit
                    setVid={this.setVid}
                    refresh={this.search}
                    addMessage={this.addMessage}
                    updateMessage={this.updateMessage}
                    addNotice={this.addNotice}
                    getMmsTemplateList={this.getMmsTemplateList}
                    wrappedComponentRef={(form) => this.formEdit = form}
                />
                <MessagePreview 
                    wrappedComponentRef={(form) => this.formPreview = form} 
                />

                {/* 样式 */}
                <style>
                {`
                .tableInfo table td{ 
                    max-width:350px; 
                    word-wrap:break-word; 
                    text-overflow:ellipsis; 
                    white-space:nowrap; 
                    overflow:hidden; 
                }
                .checks.checked {border: 1px solid rgb(54, 137, 255); color: rgb(54, 137, 255);background:url(${checkedArrow}) no-repeat right bottom;}
                .ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} 
                .ant-table-tbody td.maxWidth,.ant-table-thead th.maxWidth { max-width:280px;min-width:10%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;}
                `}
                </style>
            </div>
        )
    }
}

export default Form.create()(messagePublish);;