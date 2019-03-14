// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Button, message } from 'antd';
import { Map, Marker } from 'react-amap';
import Axios from 'axios';

import { HttpUrl, httpConfig } from '../../../util/httpConfig';

const Search = Input.Search;

class networkModify extends Component {
    state = {
        // modal 窗口变量
        loading: false,
        show: false,
        title: '编辑维保网点',       

        // AMap 变量
        mapKey: '71477380fc31e5291f93952b10091bf6',
        mapZoom: 16,
        mapStyle: "amap://styles/whitesmoke",
        mapCenter: { longitude: 0, latitude: 0 },
        markerPosition: { longitude: 0, latitude: 0 },
        geocoder: null,

        // updata 变量
        record: {},
    }

    // 取消
    cancel = () => {
        this.setState({ show: false });
    }

    // 确定 
    // 提交表单
    ok = (e) => {        
        e.preventDefault();
        let state = this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('表单数据: ', values);
                this.modify({
                    id: state.record.id,
                    province: state.province,
                    city: state.city,
                    area: state.district,
                    longitude: state.longitude,
                    dimension: state.dimension,
                    lat: state.lat,
                    lon: state.lon,
                    distributorCoding: state.distributorCoding || '',
                    ...values
                }).then((res) => {
                    // 隐藏loading和modal窗口
                    // console.log(res)
                    this.setState({
                        loading: false,
                        show: false,
                    });
                    this.props.refreshList();
                }).catch((err) => {
                    message.warning(err.message);
                });
            }
        });
    }

    // add
    showModal = (record) => {
        // console.log(record);
        this.setState({
            show: true,
            mapCenter: { longitude: record.lon, latitude: record.lat },
            markerPosition: { longitude: record.lon, latitude: record.lat },
            record: { ...record },
        });
    }

    // 6.4维护网点管理修改
    // 请求方式：POST; 接口路径：http://42.159.92.113/api/appserv/maintainer/updateMaintainer
    modify = (options) => {
        let data = options || {};
        let params = Object.assign({}, data);
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + 'appserv/maintainer/updateMaintainer', { ...params }, httpConfig)
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

    // 查找地址 高德地图逆地理编码
    // geoCode https://lbs.amap.com/api/javascript-api/guide/services/geocoder
    searchAddress = () => {
        // console.log(this.state);
        this.props.form.validateFields(['address'], (err, value) => {
            if (!err) {
                // console.log('=====', value); // 靠, value 是个对像, 
                AMap.plugin('AMap.Geocoder', () => {
                    let geocoder = new AMap.Geocoder({
                        // city: '全国',
                    });
                    geocoder.getLocation(value.address, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // result中对应详细地理坐标信息
                            let position = result.geocodes[0].location;
                            let address = result.geocodes[0].addressComponent;
                            this.setState({
                                mapCenter: { longitude: position.lng, latitude: position.lat },
                                markerPosition: { longitude: position.lng, latitude: position.lat },
                                province: address.province,
                                city: address.city,
                                area: address.district,
                                longitude: 0,
                                dimension: 0,
                                lat: position.lat,
                                lon: position.lng,
                            });
                        }
                    });
                });
            }
        });
    }

    // 输入有变化时候
    changeAddress = (e) => {
        let delayTime = 1500;
        if (e.target.value !== '' || e.target.value !== null) {
            setTimeout(this.searchAddress, delayTime);
            this.setState({
                address: e.target.value
            });
        }
    }

    // 表格查看
    render() {
        let state = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, },
        };

        return (
            <div className="content" >
                <Modal onCancel={this.cancel} onOk={this.ok} okButtonProps={{ loading: state.loading }} title={`${state.title}`} visible={state.show} destroyOnClose >
                    <Form>
                        <Form.Item {...formItemLayout} label="维修网点名称">
                            {getFieldDecorator('name', {
                                initialValue: state.record.name,
                                rules: [
                                    { required: true, whitespace: true, message: '维修网点名称不能为空' },
                                    { pattern: /[a-zA-z0-9\u4E00-\u9FA5]+$/, message: '名称不能包含空格和特殊字符' },
                                    { max: 100, message: '维修网点名称应限制在100 字符以内' },
                                ],
                            })(
                                <Input placeholder="例如: 北京测试1汽车服务有限公司" />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="维修网点编码">
                            {getFieldDecorator('distributorCoding', {
                                initialValue: state.record.distributorCoding,
                                rules: [
                                    { required: true, whitespace: true, message: '维修网点名称不能为空' },
                                    { pattern: /[a-zA-z0-9]+$/, message: '英文大小写、数字' },
                                    { max: 30, message: '维修网点编码应限制在30字符以内' },
                                ],
                            })(
                                <Input placeholder="例如:12345671234" />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="联系电话">
                            {getFieldDecorator('phone', {
                                initialValue: state.record.phone,
                                rules: [{
                                    required: true, message: '联系电话不能为空',
                                    rules: [
                                        { required: true, whitespace: true, message: '联系电话不能为空' },
                                        { pattern: /[a-zA-z0-9\u4E00-\u9FA5]+$/, message: '联系电话只能是数字' },
                                        { max: 13, message: '联系电话应限制在13字符及以内' },
                                    ],
                                }],
                            })(
                                <Input placeholder="例如:13300000001" />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="维修网点地址">
                            {getFieldDecorator('address', {
                                initialValue: state.record.address,
                                rules: [
                                    { required: true, whitespace: true, message: '维修网点地址不能为空', },
                                    { pattern: /[a-zA-z0-9\u4E00-\u9FA5]+$/, message: '中文、英文大小写、数字或字符' },
                                    { max: 200, message: '维修网点应限制在200字符及以内' },
                                ],
                            })(
                                <Search
                                    placeholder="例如:北京市朝阳区阜荣街10号"
                                    enterButton="查询"
                                    onSearch={() => { this.searchAddress(state.address) }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                    {/* map https://elemefe.github.io/react-amap/components/about */}
                    <div style={{ width: '100%', height: 200, border: '1px solid #d9d9d9' }}>
                        <Map
                            useAmapUI
                            amapkey={state.mapKey}
                            zoom={state.mapZoom}
                            center={state.mapCenter}
                            mapStyle={state.mapStyle} >
                            <Marker position={state.markerPosition} />
                        </Map>
                    </div>
                </Modal>

                <style>
                {`
                .ant-form-item-with-help{margin-bottom:24px;}
                `}
                </style>
            </div>
        );
    }
};

export default Form.create()(networkModify);