/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Divider, message, Input, Form, Button, Select, Modal } from 'antd';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import DistributorView from  './distributorView';
import DistributorEdit from  './distributorEdit';

const FormItem = Form.Item;
const Option = Select.Option;
class distributor extends Component {
    // 数据状态
    state = {
        // talbe
        table: {
            loading: false,
            currentPage: 1,
            list: [],
            pageSize: 10,
            total: 1,
            startPage: 1,
            selectedRowKeys: [],
            selectedRowRocrod: [],
            deleteLocked: false,
            confirmModal: false,
        },
        
        // search
        search: {
            name: '',
            province: '',
            city: '',
            area: '',
            areaList: [],
            subAreaList: [],
        },

        // 表格列
        columns: [
            { title: '序号', dataIndex: 'vid', width: 80 },
            { title: '经销商名称', dataIndex: 'name', className:'textLeft' },
            { title: '地址', dataIndex: 'address', className: 'textLeft' },
            { title: '联系电话', dataIndex: 'phone', align: 'left' },
            { title: '编辑时间', dataIndex: 'modifyTimeStr', align: 'left' },
            { title: '操作', dataIndex: 'action', render: (text, rec) => { return this.renderTableActionButtons(text, rec) } },
        ],
    }

    componentDidMount() {
        let { search } = this.state;
        this.search();
        this.getAllArea()
        .then((res) => {
            this.setState({
                search: Object.assign(search, {
                    areaList: res.data,
                }),
            });
        })
        .catch((err) => {
            message.warning(err.message)
        });
    }

    // ====================
    // 表格方法
    // 设置默认id
    setVid = (data) => {
        if(data.length && data.length > 0) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = index;
            });
        }        
        return data;
    }

    // ====================
    // ajax
    // ====================
    // 拉取列表 请求方式：POST,接口路径：http://42.159.92.113/api/appserv/distributor/getDistributorList
    list = (option) => {
        let { search, table } = this.state;
        let params = Object.assign({
            name: search.name,
            province: search.province,
            city: search.city,
            area: search.area,
            pageSize: table.pageSize,
            startPage: table.startPage,
        }, option || {});
        return new Promise((resolve, reject) => {
            this.setState({ 
                table: Object.assign(table, { 
                    loading: true 
                })
            });
            Axios.post(HttpUrl + 'appserv/distributor/getDistributorList', { ...params }, httpConfig)
                .then((res) => {
                    this.setState({ 
                        table: Object.assign(table, { 
                            loading: false 
                        }) 
                    });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data)
                    }
                });
        });
    }

    // 5.2经销商添加
    // 请求方式：POST 接口路径： http://42.159.92.113/api/appserv/distributor/addDistributor
    add = (record) => {
        return new Promise((resolve, reject) => {
            this.setState({ loading: true })
            Axios.post(HttpUrl + 'appserv/distributor/addDistributor', { ...record }, httpConfig)
                .then((res) => {
                    this.setState({ loading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                        this.search();
                    } else {
                        reject(res.data)
                    }
                });
        });
    }

    // 5.4经销商修改
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/distributor/updateDistributor
    update = (record) => {
        return new Promise((resolve, reject) => {
            this.setState({ loading: true })
            Axios.post(HttpUrl + 'appserv/distributor/updateDistributor', { ...record }, httpConfig)
                .then((res) => {
                    this.setState({ loading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data)
                    }
                });
        });
    }

    // 5.5 经销商删除
    // 请求方式：POST;接口路径：http://42.159.92.113/api/appserv/distributor/deleteDistributor
    delete = (params) => {
        let { table } = this.state;
        if (!table.deleteLocked) {
            return new Promise((resolve, reject) => {
                this.setState({ talbe: Object.assign(table, { deleteLocked: true, }), });
                Axios.post(HttpUrl + 'appserv/distributor/deleteDistributor', { ...params }, httpConfig)
                    .then((res) => {
                        this.setState({ talbe: Object.assign(table, { deleteLocked: false, }), });
                        if (res.data.code === '100000') {
                            resolve(res.data);
                        } else {
                            reject(res.data);
                        }
                    });
            });
        } else {
            message.warning('删除请求已发出,请稍候...');
        }
    }

    // 0.2.1查询全部区域信息
    // 请求方式：Get, 接口路径:http://42.159.92.113/api/vehicle/open/v1/area
    getAllArea = () => {
        return new Promise((resolve, reject) => {
            this.setState({ areaLoading: true });
            Axios.get(HttpUrl + 'vehicle/open/v1/area', {}, httpConfig)
                .then((res) => {
                    this.setState({ areaLoading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 0.2.2查询查询子区域信息(例如 北京 下面的所有区域数据)
    // 请求方式：Get; 接口路径：http://42.159.92.113/api/vehicle/open/v1/area/{parentId}/subset
    getSubArea = (parentId) => {
        return new Promise((resolve, reject) => {
            this.setState({ areaLoading: true });
            Axios.get(HttpUrl + `vehicle/open/v1/area/${parentId}/subset`, {}, httpConfig)
                .then((res) => {
                    this.setState({ areaLoading: false });
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    // 详情
    viewRecord = (record) => {
        this.formView.showModal(record);
    }

    // modify
    editRecord = (record) => {
        this.formEdit.showModal(record);
    }

    addRecord = (record) => {
        this.editRecord(record);
    }

    modifyRecord = (record) => {
        this.editRecord(record);
    }

    showConfirmModal = (record) => {
        let { table } = this.state;
        this.setState({
            table: Object.assign(table, {
                confirmModal: true,
            })
        })
    }

    hideConfirmModal = () => {        
        let { table } = this.state;
        this.setState({
            table: Object.assign(table, {
                confirmModal: false,
            })
        });
    }

    deleteRecord = () => {
        let { table } = this.state;
        let arr = [];
        this.hideConfirmModal();
        if (table.selectedRowRocrod.length === 0) {
            return message.warning('请选择你要删除的数据');
        }
        table.selectedRowRocrod.forEach((item, index) => {
            arr.push(item.id);
        });
        this.delete({ ids: arr })
            .then((res) => {
                this.setState({
                    table: Object.assign(table, {
                        selectedRowRocrod: [],
                        selectedRowKeys: [],
                    }),
                });
                this.search();
            })
            .catch((err) => {
                message.warning(err.message);
            })
    }

    

    keywordChange = (e) => {
        this.setState({
            search: Object.assign(this.state.search, {
                name: e.target.value,
            })
        });
    }

    // 一级省直辖市选择
    changeArea = (value) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                province: value,
            })
        });
        this.props.form.resetFields(['searchProvince']); // 重选择一级, 重置二级

        this.getSubArea(value)
            .then((res) => {
                this.setState({ search: Object.assign(search, { subAreaList: res.data }) });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // 选择子区域
    changeSubArea = (value) => {
        this.setState({
            search: Object.assign(this.state.search, {
                city: value,
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
                })                
            });
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    clearCondition = () => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                name: '',
                province: '',
                city: '',
                area: '',
            }),
        })
        this.props.form.resetFields();
        this.search();
    }

    // 页码变更
    changePage = (page) => {
        let {table} = this.state;
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                table: Object.assign(table, {
                    list: this.setVid(res.data.page.list),
                    currentPage: page,
                })                
            })
        })
        .catch((err) => {
            message.warning(err.message);
        });
    }

    // 选择表格列
    onSelectChange = (selectedRowKeys, selectedRowRocrod) => {
        let { table } = this.state;
        this.setState({
            table: Object.assign(table, {
                selectedRowKeys: selectedRowKeys,
                selectedRowRocrod: selectedRowRocrod,
            })
        });
        // console.log(table);
    }

    renderTableActionButtons = (text, record) => {
        return (
            <span>
                <a href="javascript:void(0);" onClick={() => { this.modifyRecord({ type: 'edit', record: record }) }}>编辑</a>
                <Divider type="vertical" />
                <a href="javascript:void(0);" onClick={() => { this.viewRecord(record) }}>详情</a>
            </span>
        )
    }

    // ==================
    // 渲染页面
    render() {
        let { search, table, columns } = this.state;
        let { getFieldDecorator } = this.props.form;
        let rowSelection = {
            selectedRowKeys: table.selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div className="content">
                <div className="content-title">
                    {/* 搜索选项 */}
                    <Form layout="inline">
                        <div className="searchType">
                            <FormItem label="经销商名称">
                                {getFieldDecorator('keyword')(
                                    <Input onChange={this.keywordChange} style={{ width: '200px' }} />
                                )}
                            </FormItem>
                            <Form.Item label="地区">
                                {getFieldDecorator('searchArea')(
                                    <Select
                                        placeholder="省份"
                                        style={{ width: 160 }}
                                        onSelect={this.changeArea} 
                                    >
                                        {search.areaList.map(item => <Option key={item.id}>{item.value}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('searchProvince')(
                                    <Select
                                        placeholder="市级"
                                        style={{ width: 160 }}
                                        onSelect={this.changeSubArea}
                                    >
                                        {
                                            search.subAreaList.map(item => <Option key={item.id}>{item.value}</Option>)
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Button onClick={this.search} type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }} >查询</Button>
                            <Button onClick={this.clearCondition} type="primary" className='btn' ghost >清除条件</Button>
                        </div>
                    </Form>
                </div>

                {/* 列表头按钮 */}
                <div className='oprateHead'>
                    <Button type="primary" className='btn' onClick={() => { this.addRecord({ type: 'add', record: {} }) }} ghost>新增</Button>
                    <Button type="primary" className='btn' onClick={this.showConfirmModal} ghost>删除</Button>
                </div>

                {/* 数据列表 */}
                <div className="table table_list tableInfo">
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

                <Modal
                    title={`确认提示`}
                    onCancel={this.hideConfirmModal}
                    onOk={this.deleteRecord}
                    visible={this.state.table.confirmModal}
                    destroyOnClose>
                    <div className="confirm_modal">
                        确定要删除嘛?
                    </div>
                </Modal>

                <div className="ModalBox">
                    <DistributorView wrappedComponentRef={(form) => this.formView = form} />
                    <DistributorEdit
                        update={this.update}
                        add={this.add}
                        refresh={this.search}
                        wrappedComponentRef={(form) => this.formEdit = form} 
                    />
                </div>

                <style>
                {`
                .tableInfo table td{ 
                    max-width:200px; 
                    word-wrap:break-word; 
                    text-overflow:ellipsis; 
                    white-space:nowrap; 
                    overflow:hidden; 
                }
                .confirm_modal{text-align:center;padding: 10px 0;}
                .ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} 
                `}
                </style>
            </div>
        );
    }
}

export default Form.create()(distributor);;