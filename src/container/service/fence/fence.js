/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { message, Form, Input, Button, } from 'antd';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import FenceView from './fenceView';

class fence extends Component {
    // 页面变量
    state = {
        table:{
            list: [],
            loading: false,
            pageSize: 10,
            startPage: 1,
            currentPage: 1,
        },
        
        search: {
            name: '',
            mobile: '',
        },        

        columns: [
            { title: '序号', dataIndex: 'vid', width: 80 },
            { title: '账号', dataIndex: 'mobile', width: 160 },
            { title: '电子围栏名称', dataIndex: 'name', className: 'textLeft', key: 'pushType', },
            { title: '车牌号', dataIndex: 'plateNo', className: 'textLeft' },
            { title: 'VIN', dataIndex: 'vin', className: 'textLeft', },
            { title: '操作', dataIndex: 'action', render: (text, rec) => { return this.renderTableActionButtons(text, rec) } },
        ],
    }
    componentDidMount() {
        this.search();
    }
    // 设置页面上的id
    setVid = (data) => {
        if(data.length) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = index;
            });
        }
        return data;
    }
    
    // 列表
    // 10.1电子围栏管理列表查询
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/barrier/getBarrierList
    list = (options) => {
        let { table, search } = this.state;
        let params = Object.assign({
            name: search.name,
            mobile: search.mobile,
            pageSize: table.pageSize,
            startPage: table.startPage,
        }, options || {});
        return new Promise((resolve, reject) => {
            this.setState({ table: Object.assign(table, { loading: true }) });
            Axios.post(HttpUrl + 'appserv/barrier/getBarrierList', { ...params }, httpConfig)
                .then((res) => {
                    this.setState({ table: Object.assign(table, { loading: false }) });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(reject);
                    }
                });
        });
    }

    // 10.2电子围栏管理详情查询
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/barrier/findById
    // id	必选	Body	String	电子围栏id，不能为空
    // vin	必选	Body	String	vin
    // mark	必选	Body	String	0为圆; 2为行政区
    getRecordDetail = (record) => {
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + 'appserv/barrier/findById', { ...record }, httpConfig)
                .then((res) => {
                    this.setState({ loading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(reject);
                    }
                });
        });
    }

    // 查看详情
    view = (record) => {        
        this.formView.showModal(record);
    }

    searchNameChange = (e) => {
        this.setState({
            search: Object.assign(this.state.search, {
                name: e.target.value.trim(),
            })            
        });
    }

    searchMobileChange = (e) => {
        this.setState({
            search: Object.assign(this.state.search, {
                mobile: e.target.value.trim(),
            })
        });
    }

    // 详情
    search = () => {
        let { table, search } = this.state;
        this.list({
            name: search.name,
            mobile: search.mobile,
            pageSize: table.pageSize,
            startPage: table.startPage,
        })
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
            message.warning(err.message)
        });
    }

    // 清除条件
    clearCondition = () => {
        this.setState({
            search: Object.assign(this.state.search, {
                name: '',
                mobile: '',
            })
        });
        this.props.form.resetFields();
        this.search();
    }

    // 变更页码
    changePage = (page) => {
        let { table } = this.state;
        this.list({ startPage: page})
            .then((res) => {
                this.setState({
                    table: Object.assign(table, {
                        list: this.setVid(res.data.page.list),
                        currentPage: page,
                    })
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // 表格方法
    renderTableActionButtons = (text, record) => {
        return (
            <a href="javascript:void(0)" onClick={() => this.view(record)}>详情</a>
        );
    }

    render() {
        const {table, search, columns} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 10 },
        };
        return (
            <div className="content">
                <div className="content-title">
                    <div className="searchType">
                        {/* 搜索选项 */}
                        <Form layout="inline">
                            <Form.Item {...formItemLayout}
                                label="电子围栏名称" 
                            >
                                {getFieldDecorator('name', {
                                    initialValue: search.name,
                                })(
                                    <Input onChange={this.searchNameChange} style={{ width: '200px' }} />
                                )}
                            </Form.Item>

                            <Form.Item label="帐号" {...formItemLayout}>
                                {getFieldDecorator('mobile', {
                                    initialValue: search.mobile,
                                })(
                                    <Input onChange={this.searchMobileChange} style={{ width: '200px' }} />
                                )}
                            </Form.Item>

                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }}>查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost>清除条件</Button>
                        </Form>
                    </div>
                </div>

                {/* 数据列表 */}
                <div className="table table_list">
                    <Table
                        columns={columns}
                        dataSource={table.list}
                        loading={table.loading}
                        total={table.total}
                        current={table.currentPage}
                        pageSize={table.pageSize}
                        onChange={this.changePage} />
                </div>

                <FenceView wrappedComponentRef={(form) => this.formView = form} />

                <style>
                {`.ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} `}
                </style>
            </div>
        );
    }
}

export default Form.create()(fence);