/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-direct-mutation-state */
// 查看编辑faq
import React, { Component } from 'react';
import { Modal, Form, message } from 'antd';

import { Map, Marker } from 'react-amap';

import dingWei from './img/dingwei.png';

// import { url } from 'inspector';
// import { createRequireFromPath } from 'module';

class fenceView extends Component {
    state = {
        show: false,
        loading: false,
        title: '电子围栏详情',
        record: { },

        // AMap 变量
        mapKey: '71477380fc31e5291f93952b10091bf6',
        mapZoom: 16,
        mapStyle: "amap://styles/whitesmoke",
        mapCenter: { longitude: 116.407526, latitude: 39.90403 },
        markerPosition: { longitude: 116.407526, latitude: 39.90403 },
        markStyle: {
            background: `url(${dingWei}) no-repeat`,
        }
        
    }

    // 添加记录
    showModal = (record) => {
        this.setState({
            show: true,
            record: Object.assign(this.state.record, record),
            mapCenter: Object.assign(this.state.mapCenter, { longitude: record.lon, latitude: record.lat }),
            markerPosition: Object.assign(this.state.markerPosition,{ longitude: record.lon, latitude: record.lat }),
        });
    }

    okAndCancel = () => {
        this.setState({ show: false });
    }

    // 表格查看
    render() {
        let state = this.state
        let formItemLayout = {labelCol: { xs: { span: 24 }, sm: { span: 6 }, },wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, },};
        let markStyle = {
            background: `url(${dingWei})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '20px',
            height: '30px',
            color: '#000',
            textAlign: 'center',
            lineHeight: '30px'
        }
        return (
            <Modal
                onCancel={this.okAndCancel}
                onOk={this.okAndCancel}
                title={state.title}
                visible={state.show}
                destroyOnClose >
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="账号" {...formItemLayout}>
                        {state.record.mobile}
                    </Form.Item>

                    <Form.Item label="电子围栏名称" {...formItemLayout}>
                        {state.record.name}
                    </Form.Item>

                    <Form.Item label="车牌号" {...formItemLayout}>
                        {state.record.plateNo}
                    </Form.Item>

                    <Form.Item label="VIN" {...formItemLayout}>
                        {state.record.vin}
                    </Form.Item>
                </Form>
                {/* map https://elemefe.github.io/react-amap/components/about */}
                <div style={{ width: '100%', height: 200, border: '1px solid #d9d9d9' }}>
                    <Map
                        amapkey={state.mapKey}
                        zoom={state.mapZoom}
                        center={state.mapCenter}
                        mapStyle={state.mapStyle} >
                        <Marker position={state.markerPosition} >
                            <div style={markStyle} />
                        </Marker>
                    </Map>
                </div>

                <style>
                {`
                .ant-form-item-with-help{margin-bottom:24px;}
                .treeBox{width:663px !important;height:607px !important;}
                .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                .itemDetail{color:#333;}
                `}
                </style>
            </Modal>
        );
    }
};

export default Form.create()(fenceView);