/* eslint-disable no-script-url */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Divider, Input, message, Popconfirm, Form, Select, Button, Icon, DatePicker } from 'antd';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import FaqEdit from './faqEdit';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

class faq extends Component {
    // 状态数据
    state = {
        table: {
            list: [],           // 表格窗口
            currentPage: 1,     // 当前页
            total: 1,           // 记录总条数
            loading: true,      // 表格加载动画
            pageSize: 10,
        },

        // 搜索条件
        search: {
            content: '',	    // 可选	Body	String	问题反馈管理反馈内容，如查询全部，则赋值为空
            status: '',	        // 可选	Body	String	问题反馈管理处理状态，默认为待处理 （0：待处理  1：已处理）
            beginTime: '',	    // 可选	Body	String	问题反馈管理反馈开始时间，如查询全部，则赋值为空
            endTime: '',	    // 可选	Body	String	问题反馈管理反馈结束时间，如查询全部，则赋值为空
        },

        deleteLocked: false,        // 删除记录请求状态变量,防止多次请求
        // 序号 反馈内容 反馈账号 反馈时间 处理时间 处理状态 操作
        columns: [
            { title: '序号', dataIndex: 'vid', width: 100 },
            { title: '反馈内容', dataIndex: 'content', key: 'pushType', className: 'textLeft maxWidth', },
            { title: '反馈账号', dataIndex: 'opinionAccount', width: 160 },
            { title: '反馈时间', dataIndex: 'createTimeStr', width: 200 },
            { title: '处理时间', dataIndex: 'modifyTimeStr', width: 200 },
            { title: '处理状态', dataIndex: 'status', width: 140, render: (text) => { return(<span>{ text === 1 ? '已处理' : '未处理' }</span>)}},
            { title: '操作', dataIndex: 'action', width: 140, render: (tit, rec) => { return this.renderTableActionButtons(tit, rec) } },
        ],
    }

    componentDidMount() {
        this.search();
    }
    // ===================
    // search 框方法
    // ===================
    // 选择搜索
    changeSearchContent = (e) => {
        let { search } = this.state;
        this.setState({ 
            search: Object.assign(search, { content: e.target.value.trim() }),
        });
    }

    // 选择搜索状态
    changeSearchStatus = (value) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, { status: value *1 }),
        });
    }

    // 选择搜索时间 
    changeSearchCreateTime = (moment, dateStr) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                beginTime: dateStr[0] + ' 00:00:00',
                endTime: dateStr[1] + ' 23:59:59',
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
                    total: res.data.page.total,
                    pages: res.data.page.pages,
                    pageSize: res.data.page.pageSize,
                })
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    // 清除搜索条件
    clearCondition = () => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                content: '',
                status: '',
                beginTime: '',
                endTime: '',
            })
        });
        this.props.form.resetFields();
        this.search();
    }

    // =========================
    // 表格方法
    // =========================
    // 设置页面id和key
    setVid = (data) => {
        if(data.length && data.length > 0) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = index;
            });
        }
        return data;
    }

    // 变更页码
    changePage = (page) => {
        let { table, search } = this.state;
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                table: Object.assign(table, {
                    list: this.setVid(res.data.page.list),
                    total: res.data.page.total,
                    pages: res.data.page.pages,
                    pageSize: res.data.page.pageSize,
                    currentPage: page,
                })
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    // 编辑记录
    editRecord = (option) => {
        this.formEdit.showModal(option);
    }

    // 删除记录
    // id	必选	Body	String	问题反馈管理id，不能为空
    deleteRecord = (record) => {
        this.delete(record)
            .then((res) => {
                message.success(res.message);
                this.search();
            })
            .catch((err) => {
                message.warning(err.message);
            })
    }

    // ====================
    // ajax
    // ====================
    // 7.1问题反馈管理列表查询
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/opinion/getOpinionList
    list = (options) => {
        let { table, search } = this.state;
        let params = Object.assign({
            content: search.content,
            status: search.status,
            beginTime: search.beginTime,
            endTime: search.endTime,
            pageSize: table.pageSize,
            startPage: table.startPage,
        }, options || {});
        return new Promise((resolve, reject) => {
            this.setState({ table: Object.assign(table, { loading: true }) });
            Axios.post(HttpUrl + 'appserv/opinion/getOpinionList', { ...params }, httpConfig)
                .then((res) => {
                    this.setState({ table: Object.assign(table, { loading: false }) });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });

    }

    // 删除 http://42.159.92.113/api/appserv/opinion/deleteOpinion
    delete = (record) => {
        let state = this.state;
        let params = {id: record.id};
        if (!state.deleteLocked) {            
            return new Promise((resolve, reject) => {
                this.setState({ deleteLocked: true });
                Axios.post(HttpUrl + 'appserv/opinion/deleteOpinion', { ...params }, httpConfig)
                    .then((res) => {
                        this.setState({ deleteLocked: false });
                        if (res.data.code === '100000') {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }                        
                    });
            });
        } else {
            message.warning('删除请求已发送,请稍候...');
        }        
    }

    // http://42.159.92.113/api/appserv/opinion/updateOpinionStatus
    update = (record) => {
        let state = this.state;
        if (!state.updataLocked) {
            return new Promise((resolve, reject) => {
                this.setState({ updataLocked: true });
                Axios.post(HttpUrl + 'appserv/opinion/updateOpinionStatus', { ...record }, httpConfig)
                    .then((res) => {
                        this.setState({ updataLocked: false });
                        if (res.data.code === '100000') {
                            resolve(res.data);
                            this.search();
                        } else {
                            reject(res.data);
                        }
                    });
            });            
        } else {
            message.warning('请求已经提交,请稍候...');
        }
    }

    // ===============
    // 方法 除了原生方法其它自定义方法最好用箭头函数
    // 渲染表格操作
    renderTableActionButtons = (title, record) => {
        return (
            <span>
                <a href="javascript:void(0);" onClick={() => { 
                    Number(record.status) === 0 
                        ? this.editRecord({ type: 'dispose', record: record }) 
                        : this.editRecord({ type: 'detail', record: record }) 
                    } }>
                    {Number(record.status) === 0 ? '处理' : '详情'}
                </a>
                <Divider type="vertical" />
                <Popconfirm
                    title={`确认删除记录?`}
                    placement="left"
                    icon={<Icon type="exclamation-circle" />}
                    onConfirm={() => { this.deleteRecord(record) }}
                    okText="确认"
                    cancelText="取消"
                >
                    <a href="javascript:void(0);">删除</a>
                </Popconfirm>
            </span>
        )
    }

    // 渲染页面
    render() {
        const { table, select, columns } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="content">
                {/* 搜索框 */}
                <div className="content-title">
                    <Form layout="inline">
                        <div className="searchType">
                            <FormItem label="反馈内容">
                                {getFieldDecorator('content')(
                                    <Input 
                                        style={{ width: '200px' }}
                                        onChange={this.changeSearchContent}
                                    />
                                )}
                            </FormItem>
                            {/* 
                            <FormItem label="处理状态">
                                {getFieldDecorator('status')(
                                    <Select 
                                        style={{ width: '120px' }} 
                                        onChange={this.changeSearchStatus} 
                                        placeholder="请选择一个种处理状态" 
                                    >
                                        <Option value="0">未处理</Option>
                                        <Option value="1">已处理</Option>
                                    </Select>
                                )}
                            </FormItem> 
                            */}
                            <FormItem lable="反馈时间">
                                {getFieldDecorator('createTimeStr')(
                                    <RangePicker allowClear={false} onChange={this.changeSearchCreateTime} />
                                )}
                            </FormItem>
                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }}>查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost>清除条件</Button>
                        </div>
                    </Form>
                </div>

                {/* 表格 */}
                <div className="table table_list">
                    <Table
                        columns={columns}
                        dataSource={table.list}
                        loading={table.loading}
                        total={table.total}
                        current={table.currentPage}
                        pageSize={table.pageSize}
                        onChange={this.changePage}
                    />
                </div>

                <FaqEdit 
                    update={this.update}
                    refresh={this.search}
                    wrappedComponentRef={(form) => this.formEdit = form} />

                {/* 样式 */}
                <style>
                    {`
                    .ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} 
                    .ant-table-tbody td.maxWidth,.ant-table-thead th.maxWidth { max-width:200px;min-width:10%;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;}
                    .treeBox{width:663px !important;height:607px !important;}
                    .treeBox h4{padding:12px 0;margin:0;}
                    .treeBox .textInput{width:350px;overflow:inherit;height:auto;margin-bottom:12px;}
                    .label{color:#999;width:104px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;display:inline-block;width:170px;overflow:hidden;text-overflow:ellipsis;height:30px;line-height:45px;white-space:nowrap;}
                    `}
                </style>
            </div>
        );
    }
}

export default Form.create()(faq);