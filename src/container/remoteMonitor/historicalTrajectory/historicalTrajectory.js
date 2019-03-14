/*远程监控>历史轨迹========cq*/
import React, { Component } from 'react';
import Axios from 'axios';
import ViewInform from './maphistory';
import { message, Form, Input, Button, Modal, DatePicker, Timeline } from 'antd';
import Table from "../../../component/table/table"
import {httpConfig, HttpUrl} from '../../../util/httpConfig';
import nodata1 from './../../../img/nodata1.png'
import nodata2 from './../../../img/nodata2.png'
import nodata3 from './../../../img/nodata3.png'
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class deviceManage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            columns: [{
                title: '序号',
                width: 60,
                dataIndex: 'number',
                fixed: 'left'
            }, {
                title: '开始时间',
                dataIndex: 'startTime',
                width: 170
            }, {
                title: '始发地',
                dataIndex: 'startLocation',
                minWidth: 300
            }, {
                title: '目的地',
                dataIndex: 'endLocation',
                minWidth: 300
            }, {
                title: '总里程(公里)',
                dataIndex: 'sumKm',
                width: 170
            }, {
                title: '用时(h)',
                dataIndex: 'sumTime',
                width: 170
            }, {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 150,
                render: (text, record) =>
                    <span><a href="javascript:;" style={{ marginRight: 15 }} onClick={() => this.viewList(record)}>详情</a></span>
            },
            ],
            pageSize: 10,
            pageNumber: 1,
            defaultCurrent: 1,
            current: 1,
            selectedRowKeys: [],
            startTime: '',
            endTime: '',
            name: '',
            viewVisite: false,
            visible: true,
            hisVisible: true,
            draggable: true,
            dataStatus:1,
            listData:[],
            total:'',
            // details: [],//详情data
            // path: [],//得到的轨迹
            // makerPath: [],//行驶轨迹
            // routeList: [],//详情坐标点集
            // markerStart: '',
            // markerEnd: '',
            // historMarker: '',
            // animation: ''
        };
    }
    componentDidMount() {
    }
    // map={
    //     center: [{longitude:116.397428,  latitude: 39.90923}],
    //     zoom: 17
    // }
    // map的事件
     //分页获取数据
     onChange = (pageNumber) =>{
        this.trajectory(pageNumber,this.state.pageSize)
    }
    //查询
    search = () => {
        this.trajectory(this.state.pageNumber, this.state.pageSize)
    }
    //列表
    trajectory = (pageNumber, pageSize) => {
        Axios.post(HttpUrl+'vehicle/historyTrack/find', {
            startPage:pageNumber,
            pageSize:pageSize,
            name: this.props.form.getFieldValue('searchName'),
            startTime: this.state.startTime,
            endTime: this.state.endTime
        }, httpConfig).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.code === '100000') {
                console.log(res.data.data.list)
                for (let i = 0; i < res.data.data.list.length; i++) {
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key = res.data.data.list[i].id;
                }
                this.setState({
                    listData: res.data.data.list,
                    current:pageNumber,
                    total: res.data.data.total,
                    loading: false
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                }else{
                    this.setState({
                        dataStatus:''
                    })
                }
            } else if (res.data.code === '999999') {
                message.warning('请输入设备SN/VIN/车牌号查询')
            }
        })
    }
    //条件查询
    chearSearch = () => {
        this.props.form.resetFields()
        this.setState({
            startTime: '',
            endTime: '',
            name: '',
            dataStatus:1,
            listData:[],
            pageSize: 10,
            pageNumber: 1,
            defaultCurrent: 1,
            current: 1,
            total:'',
            selectedRowKeys:[]
        })
    }
    onSearch = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.setState({
            startTime: dateString[0],
            endTime: dateString[1]
        })
    }
    onOk = (value) => {
        console.log('onOk: ', value);
    }
    //详情，轨迹回放
    viewList = (record) => {
        this.form.viewLists(record)
    }
   
    render() {
        const { getFieldDecorator } = this.props.form;
        const { selectedRowKeys, details } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                });
            }
        };
        
        
        return (
            <div className="content" >
                <div className='content-title' ref="mmp">
                    <Form layout="inline">
                        <div className='searchType' style={{ width: '100%' }}>
                            <FormItem label="关键字搜索：">
                                {getFieldDecorator('searchName')(<Input autoComplete='off' placeholder='设备SN、VIN、车牌号' />)}
                            </FormItem>
                            <FormItem label="统计时间：">
                                {getFieldDecorator('numName')(<RangePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['开始时间', '结束时间']}
                                    onChange={this.onSearch}
                                    onOk={this.onOk}
                                />)}
                            </FormItem>
                            <Button type="primary" className='btn' style={{ marginLeft: '54px', marginTop: '5px' }} onClick={this.search}>查询</Button>
                            <Button type="primary" className='btn' ghost onClick={this.chearSearch}>清除条件</Button>
                        </div>

                    </Form>
                </div>
                <div className='trajectoryTable'>
                    <Table
                        scroll={1720}
                        columns={this.state.columns}
                        dataSource={this.state.listData}
                        loading={this.state.loading}
                        total={this.state.total}
                        current={this.state.current}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}
                    />
                     {
                                this.state.dataStatus === 1 ?
                                <div className='dataStatus' >
                                        <img src={nodata1} alt=""/>
                                        <div >温馨提示：请输入条件进行查询</div>
                                </div>
                                : this.state.dataStatus === 2 ? 
                                <div className='dataStatus' >
                                        <img src={nodata2} alt=""/>
                                        <div >查询中，请稍后...</div>
                                </div>
                                : this.state.dataStatus === 3 ? 
                                <div className='dataStatus' >
                                        <img src={nodata3} alt=""/>
                                        <div>哎呀，没有找到符合条件的数据</div>
                                </div>
                                : ''
                                
                            }
                </div>
                {/* 详情 */}
                <ViewInform wrappedComponentRef={(form) => this.form = form}></ViewInform>
                {/* <Modal
                    title="详情"
                    visible={this.state.viewVisite}
                    onOk={this.viewSuccess}
                    onCancel={this.viewCancel}
                    footer={null}
                    destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                    maskClosable={false}
                    destroyOnClose={true}
                    className='mapModal'
                >
                    <MMap  wrappedComponentRef={(form) => this.form = form} />
                </Modal> */}
                <style>{`
                    .content-title{box-shadow: 0 2px 4px 0 rgba(216,216,216,0.50);}
                    .trajectoryTable{margin-top:40px;position: relative;}
                    .trajectoryTable .ant-table-body{min-height:427px;}
                    .mapModal{width:900px!important;position: relative;}
                    .mapModal .ant-modal-body{height:560px!important;padding:10px!important}
                    .details{width:330px;height:147px;background: #FFFFFF; box-shadow: 0 2px 4px 1px rgba(216,216,216,0.50); border-radius: 3px;position: absolute;top:60px;right:20px}
                    .input-card{position: absolute;bottom:20px;left:20px}
                    .ant-timeline-item-content{font-size:12px}
                    .ant-timeline-item{padding:10px 10px 10px 0 }
                    .ant-timeline-item-last .ant-timeline-item-content{min-height:auto}
                    .sumCss{font-size:12px;}
                    .sumCss span { display: inline-block;width:50%}
                    .dataStatus{width:200px;text-align:center;position:absolute;left:45%;top:45%;}
                `}</style>
            </div>
        )
    }
}
const deviceManages = Form.create()(deviceManage);
export default deviceManages;