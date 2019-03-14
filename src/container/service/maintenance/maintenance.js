/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Button, Divider, Form, message, Input, Popconfirm, Icon } from 'antd';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import MaintenanceView from './maintenanceView';
import MaintenanceEdit from './maintenanceEdit';

const FormItem = Form.Item;

class maintenance extends Component {
    // 数据状态
    state = {
        deleteLocked: false,
        table: {
            list: [],       // 数据列表
            total: 1,       // 总条数
            pageSize: 10,   // 每页大小    
            pages: 1,       // 总页数
            currentPage: 1, // 当前页
            startPage: 1,   // 起始页
            loading: false,
        },

        search: {
            title: '',
        },

        select: {
            records: [],
            row: [],
        },
        
        columns: [
            { title: '序号', dataIndex: 'vid', width: 60 },
            { title: '维保标题', dataIndex: 'title', key: 'pushType', className: 'textLeft' },
            { title: '维保依据', dataIndex: 'according', className: 'textLeft', render: (text) => (text === 1 ? '按总里程' :'按周期') },
            { title: 'km', dataIndex: 'totalMileage', },
            { title: '天', dataIndex: 'period', },
            { title: '是否启用', dataIndex: 'isUse', render: (text) => (text === 1 ? '是' : '否') },
            { title: '操作', dataIndex: 'id', render: (text, item) => { return this.renderTableActionButtons(text, item) } },
        ],
    }

    componentDidMount() {
        this.search();
    }
        
    // 设置数据表格id和key
    setVid = (data) => {
        if (data.length && data.length > 0) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = index;
            })            
        }
        return data;
    }

    // =======================
    // ajax
    // =======================
    // 8.1维修保养管理列表查询
    // 请求方式： POST 接口路径：http://42.159.92.113/api/appserv/maintenance/getMaintenanceList
    list = (options) => {
        let { table, search } = this.state;
        let params = Object.assign({
            startPage: table.startPage,
            pageSize: table.pageSize,
            title: search.title,
        }, options || {});
        return new Promise( (resolve, reject) => {
            this.setState({ table: Object.assign(table, { loading: true }) });
            Axios.post(HttpUrl + 'appserv/maintenance/getMaintenanceList', { ...params }, httpConfig)
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

    // 8.2维修保养管理添加
    // 请求方式： POST 接口路径： http://42.159.92.113/api/appserv/maintenance/addMaintenance
    add = (record) => {
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/maintenance/addMaintenance', { ...record }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                        this.search();
                    } else {
                        reject(res.data)
                    }
                });
        });
    }

    // 8.4维修保养管理修改
    // 请求方式：POST 接口路径： http://42.159.92.113/api/appserv/maintenance/updateMaintenance
    update = (record) => {
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + 'appserv/maintenance/updateMaintenance', { ...record }, httpConfig)
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

    // 8.5维修保养管理删除
    // 请求方式：POST; 接口路径：http://42.159.92.113/api/appserv/maintenance/deleteMaintenance
    delete = (params) => {
        let state = this.state;
        if (!state.deleteLocked) {
            return new Promise((resolve, reject) => {
                this.setState({ deleteLocked: true });
                Axios.post(HttpUrl + 'appserv/maintenance/deleteMaintenance', { ...params }, httpConfig)
                    .then((res) => {
                        this.setState({ deleteLocked: false });
                        if (res.data.code === '100000') {
                            resolve(res.data);
                        } else {
                            reject(res.data)
                        }
                    });
            });            
        } else {
            message.warning('删除请求已发出,请稍候...');
        }        
    }

    searchTitleChange = (e) => {
        this.setState({
            search: Object.assign(this.state.search, { title: e.target.value, })
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
                    total: res.data.page.total,        // 总条数
                    pages: res.data.page.pages,        // 总页面
                })
            });
        })
        .catch((err) => {
            message.warning(err.message)
        })
    }

    // 清除选择条件
    clearCondition = () =>  {
        this.setState({
            search: Object.assign(this.state.search,{title: ''}),
        });
        this.props.form.resetFields();
        this.search();
    }

    // 页码变更
    changePage = (page) => {
        let { table } = this.state;
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                table: Object.assign(table, {
                    list: this.setVid(res.data.page.list),
                    currentPage: page,
                    total: res.data.page.total,        // 总条数
                    pages: res.data.page.pages,        // 总页面
                })                
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }    

    // 修改记录
    editRecord = (record) => {
        // console.log(this.formModify);
        this.formEdit.showModal(record);
    }

    addRecord = (record) => {
        this.editRecord(record);
    }

    modifyRecord = (record) => {
        this.editRecord(record);
    }

    // 记录详情
    view = (record) => {
        this.formView.showModal(record);
    }

    deleteRecord = (RowKeys) => {
        let arr = [];
        if (RowKeys.records.length === 0){
            return message.warning('请选择你要删除的数据');
        }
        
        RowKeys.records.forEach((item) => {
            arr.push(item.id);
        });

        this.delete({ ids: arr })
        .then((res) => {
            this.setState({
                select: Object.assign(this.state.select, {
                    records: [],
                    row: [],
                }),
            });
            this.search();
        })
        .catch((err) => {
            message.warning(err.message)
        });
    }

    // 渲染操作按钮
    renderTableActionButtons = (text, record) => {
        return (
            <span>
                <a href="javascript:void(0);" onClick={() => { this.modifyRecord({ type: 'edit', record: record}) }}>编辑</a>
                <Divider type="vertical" />
                <a href="javascript:void(0);" onClick={() => { this.view(record) }}>详情</a>
            </span>
        )
    }

    // 选择表格列
    onSelectChange = (selectedRowKeys, selectedRowRecord) => {
        this.setState({
            select: Object.assign(this.state.select, {
                records: selectedRowRecord,
                row: selectedRowKeys,
            }),
        });
        console.log(this.state.select);
    }

    // ================
    // 渲染页面
    render() {
        const { table, select, columns } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            selectedRowKeys: select.row,
            onChange: this.onSelectChange,
        };
        return (
            <div className="content">
                {/* 搜索选项 */}
                <div className="content-title">                    
                    <Form layout="inline">
                        <div className="searchType">
                            <FormItem label="维保标题">
                                {getFieldDecorator('title')(
                                    <Input onChange={this.searchTitleChange} style={{ width: '200px' }} />
                                )}
                            </FormItem>
                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }}>查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost>清除条件</Button>
                        </div>
                    </Form>
                </div>

                {/* // 表格上按钮 */}
                <div className="oprateHead">
                    <Button type="primary" className='btn' ghost onClick={() => this.addRecord({ type: 'add' })}>新增</Button>
                    <Popconfirm title="确认删除记录?" icon={<Icon type="exclamation-circle" />} onConfirm={() => this.deleteRecord(select)} okText="确认" cancelText="取消">
                        <Button type="primary" className='btn' ghost >删除</Button>
                    </Popconfirm>
                </div>

                {/* 数据列表 */}
                <div className="table table_lis">
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={table.list}
                        loading={table.loading}
                        total={table.total}
                        current={table.currentPage}
                        pageSize={table.pageSize}
                        onChange={this.changePage}
                    />
                </div>

                <MaintenanceView wrappedComponentRef={(form) => this.formView = form} />
                <MaintenanceEdit
                    refresh={this.search}
                    add={this.add}
                    update={this.update}
                    wrappedComponentRef={(form) => this.formEdit = form} />
                <style>
                    {`.ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} `}
                </style>
            </div>
        );
    }
}

export default Form.create()(maintenance);