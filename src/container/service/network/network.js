/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Divider, message, Form, Button, Input, Select, Popconfirm, Icon } from 'antd';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import Table from "../../../component/table/table";

import NetworkView from './networkView';
import NetworkModify from './networkModify';
import NetworkAdd from './networkAdd';

const Option = Select.Option;
class network extends Component {
    // 页面常量
    state = {
        table: {
            pageSize: 10,
            startPage: 1,
            currentPage: 1,
            list: [],
            loading: false,
        },

        deleteRecords: {
            locked: false, // 删除请求
            selectedRowKeys: [], // 选择列表
        },

        search: {
            name: '',
            area: '',
            province: '',
            city: '',
        },

        area: {
            list: [],
            subList: [],
            loading: false,
        },

        // 表格列
        columns: [
            { title: '序号', dataIndex: 'vid', width: 80 },
            { title: '维修网点名称', dataIndex: 'name', className: 'textLeft', key: 'pushType', },
            { title: '地址', dataIndex: 'address', className: 'textLeft' },
            { title: '联系电话', dataIndex: 'phone', align: 'left', },
            { title: '编辑时间', dataIndex: 'modifyTimeStr', align: 'left', },
            { title: '操作', dataIndex: 'action', render: (text, rec) => { return this.renderTableActionButtons(text, rec) } },
        ],
    }

    componentDidMount() {
        let { area } = this.state;
        this.search();

        this.getAllArea()
            .then((res) => {
                // console.log('haha', this.setVid(res.data));
                this.setState({
                    area: Object.assign(area, {
                        list: this.setVid(res.data),
                    })
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // 设置表格id和key
    setVid = (data) => {
        if(data.length && data.length > 0) {
            data.forEach((item, index) => {
                item.vid = index + 1;
                item.key = item.id;
            });
        }        
        return data;
    }

    // 请求方式：POST; 接口路径：http://42.159.92.113/api/appserv/maintainer/getMaintainerList
    list = (options) => {
        // console.log(options);
        let { table, search } = this.state;
        let params = Object.assign({
            name: search.name,
            province: search.province,
            city: search.city,
            area: search.area,
            pageSize: table.pageSize,
            startPage: table.startPage,
        }, options || {});

        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + 'appserv/maintainer/getMaintainerList', { ...params }, httpConfig)
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

    // 6.5 维护网点管理删除
    // 请求方式：POST;接口路径：http://42.159.92.113/api/appserv/maintainer/deleteMaintainer
    delete = (selectedRowKeys) => {
        // console.log(selectedRowKeys);
        let { deleteRecords } = this.state;
        let params = { ids: selectedRowKeys };
        if (selectedRowKeys && selectedRowKeys.length === 0) {
            return message.warning('请选择你要删除的记录!');
        }
        if (!deleteRecords.locked ) {
            this.setState({ deleteRecords: Object.assign(deleteRecords, { locked: true }) });
            Axios.post(HttpUrl + 'appserv/maintainer/deleteMaintainer', { ...params }, httpConfig)
            .then((res) => {
                this.setState({ deleteRecords: Object.assign(deleteRecords, { locked: false }) });
                if (res.data.code === '100000') {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }                        
            }); 
        } else {
            message.warning('删除请求已发出,请稍候...');
        }
    }

    // 0.2.1查询全部区域信息
    // 请求方式：Get, 接口路径:http://42.159.92.113/api/vehicle/open/v1/area
    getAllArea = () => {
        return new Promise( (resolve, reject) => {
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
    
    // 改变
    changeName = (e) => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                name: e.target.value.trim(),
            })
        });
    }

    // 选择省份直辖市级
    searchProvince = (value) => {
        let { area, search } = this.state;

        this.setState({
            search: Object.assign(search, {
                province: value,
            })
        });

        this.props.form.resetFields(['searchArea']); // 重选择一级, 重置二级

        this.getSubArea(value)
            .then((res) => {
                // console.log(res);
                this.setState({
                    area: Object.assign(area, {
                        subList: this.setVid(res.data),
                    }),
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // 选择子区域
    changeCity = (value) => {
        let { search } = this.state;
        // console.log(value);
        this.setState({ 
            search: Object.assign(search, {
                city: value,
            }) 
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

    // 清除搜索条件
    clearCondition = () => {
        let { search } = this.state;
        this.setState({
            search: Object.assign(search, {
                name: '',
                province: '',
                city: '',
                area: '',
            }),
        });
        this.props.form.resetFields();
        this.search();
    }

    // 添加
    add = (record) => {
        this.formAdd.showModal(record);
    }

    // 详情
    detail = (record) => {
        this.formView.showModal(record);
    }

    // modify
    modify = (record) => {
        this.formModify.showModal(record);
    }

    // ===================
    // 渲染列表操作按钮
    renderTableActionButtons = (text, record) => {
        return (
            <span>
                <a href="javascript:void(0);" onClick={() => { this.modify(record) }}>编辑</a>
                <Divider type="vertical" />
                <a href="javascript:void(0);" onClick={() => { this.detail(record) }}>详情</a>
            </span>
        );
    }

    // 选择列
    onSelectChange = (selectedRowKeys) => {
        let { deleteRecords } = this.state;
        this.setState({
            deleteRecords: Object.assign(deleteRecords, {
                selectedRowKeys: selectedRowKeys
            }),
        });
    }

    // 页码变更 Promise写会不会蛋疼
    changePage = (page) => {
        let { table } = this.state;
        this.list({
            startPage: page,
        })
        .then((res) => {
            this.setState({
                table: Object.assign( table, {
                    list: this.setVid(res.data.page.list),
                    pageSize: res.data.page.pageSize,
                    currentPage: page,
                    startPage: page,
                    total: res.data.page.total,
                    pages: res.data.page.pages,
                }),
            });
        })
        .catch((res) => {
            message.warning(res.message);
        });
    }

    // 页面代码
    render() {
        const { table, search, area, columns, deleteRecords } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            onChange: this.onSelectChange
        };
        return (
            <div className="content">
                {/* 搜索选项 */}
                <div className="content-title">                    
                    <Form layout="inline">
                        <Form.Item label="维修网点名称">
                            {getFieldDecorator('searchName', {
                                initialValue: search.name,
                            })(
                                <Input onChange={this.changeName}/>
                            )}
                        </Form.Item>
                        <Form.Item label="地区">
                            {getFieldDecorator('searchProvince', {
                                initialValue: search.province,
                            })(
                                <Select
                                    placeholder="省份"
                                    style={{ width: 160 }}
                                    onSelect={this.searchProvince} 
                                >
                                    {
                                        area.list.map(item => <Option key={item.id}>{item.value}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('searchCity', {
                                initialValue: search.city,
                            })(
                                <Select
                                    placeholder="市级"
                                    style={{ width: 160 }}
                                    onSelect={this.changeCity}
                                >
                                    {
                                        area.subList.map(item => <Option key={item.id}>{item.value}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.search} style={{ marginLeft: '54px', marginTop: '5px' }} >查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.clearCondition} ghost>清除条件</Button>
                        </Form.Item>                        
                    </Form>
                </div>

                {/* 表格上按钮 */}
                <div className='oprateHead'>
                    <Button type="primary" className='btn' onClick={() => { this.add() }} ghost>新增</Button>
                    <Popconfirm 
                        title="确认删除记录?" 
                        icon={<Icon type="exclamation-circle" />} 
                        onConfirm={() => { this.delete(deleteRecords.selectedRowKeys) }} 
                        okText="确认" 
                        cancelText="取消"
                    >
                        <Button type="primary" className='btn' ghost >删除</Button>
                    </Popconfirm>
                    {/* <Button type="primary" className='btn' onClick={() => { this.delete(deleteRecords.selectedRowKeys) }} ghost>删除</Button> */}
                </div>

                {/* 数据列表 */}
                <div className="table table_list tableInfo">
                    <Table
                        columns={columns}
                        dataSource={table.list}
                        loading={table.loading}
                        total={table.total}
                        current={table.currentPage}
                        pageSize={table.pageSize}
                        rowSelection={rowSelection}
                        onChange={this.changePage}
                    />
                </div>

                {/* 弹出窗口 */}
                <NetworkView wrappedComponentRef={(form) => this.formView = form} />
                <NetworkModify 
                    refreshList={this.search}
                    wrappedComponentRef={(form) => this.formModify = form} 
                />
                <NetworkAdd
                    refreshList={this.search}
                    wrappedComponentRef={(form) => this.formAdd = form} 
                />

                {/* 自定义样式 */}
                <style>
                {`
                .tableInfo table td{ 
                    max-width:260px; 
                    word-wrap:break-word; 
                    text-overflow:ellipsis; 
                    white-space:nowrap; 
                    overflow:hidden; 
                }
                .ant-table-tbody td.textLeft,.ant-table-thead th.textLeft { text-align: left !important; padding-left:20px !important;} `}
                </style>
            </div>
        );
    }
}

export default Form.create()(network);;