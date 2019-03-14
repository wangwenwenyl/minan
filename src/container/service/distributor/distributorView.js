// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';

import { Map, Marker } from 'react-amap';

class distributorView extends Component {
    state = {
        show: false,
        title: '查看详情',
        record: {},
        mapKey: '71477380fc31e5291f93952b10091bf6',
        mapZoom: 16,
        mapStyle: "amap://styles/whitesmoke",
        mapCenter: { longitude: 0, latitude: 0 },
        markerPosition: { longitude: 0, latitude: 0 },
    }

    cancel = () => {
        this.setState({ show: false });
    }

    ok = () => {
        this.setState({ show: false });
    }

    showModal = (record) => {
        // console.log(record);
        this.setState({
            record: record,
            show: true,
            markerPosition: { longitude: record.lon, latitude: record.lat },
            mapCenter: { longitude: record.lon, latitude: record.lat }
        });
    }

    // 表格查看
    render() {
        let { show, title, record, mapKey, mapStyle, mapZoom, mapCenter, markerPosition } = this.state
        return (
            // "id": 147,
            // "distributorCoding": "12345671234",
            // "name": "北京测试1汽车服务有限公司",
            // "editorperson": null,
            // "address": "南彩镇南彩村",
            // "province": "北京市",
            // "city": "北京市",
            // "area": "顺义区",
            // "phone": "13300000001",
            // "longitude": false,
            // "lon": "116.397499",
            // "dimension": false,
            // "lat": "39.908722",
            // "createTime": "2018-11-22T10:22:47.000+0000",
            // "createTimeStr": "2018-11-22 18:22:47",
            // "modifyTime": "2018-11-22T10:22:47.000+0000",
            // "modifyTimeStr": "2018-11-22 18:22:47",
            <Modal onCancel={this.cancel} onOk={this.ok} title={`${title} - ${record.name}`} visible={show} destroyOnClose className="ModalView">
                <div>
                    <Row style={{ padding: '0px 16px' }}>
                        <Col span={24}>
                            <div>
                                <span className='label'>经销商名称:</span>
                                <span className='itemDetail'>{record.name}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>经销商编码:</span>
                                <span className='itemDetail'>{record.distributorCoding}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>联系电话:</span>
                                <span className='itemDetail'>{record.phone}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>经销商地址:</span>
                                <span className='itemDetail'>{record.address}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>编辑人:</span>
                                <span className='itemDetail'>{record.editorperson}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>编辑时间:</span>
                                <span className='itemDetail'>{record.modifyTimeStr}</span>
                            </div>
                            {/* map https://elemefe.github.io/react-amap/components/about */}
                            <div style={{ width: '100%', height: 200, border: '1px solid #d9d9d9' }}>
                                <Map 
                                    amapkey={mapKey}
                                    zoom={mapZoom}
                                    center={mapCenter}
                                    mapStyle={mapStyle} >
                                    <Marker position={markerPosition} />
                                </Map>
                            </div>
                        </Col>
                    </Row>
                </div>

                <style>
                {`
                .treeBox{width:663px !important;height:607px !important;}
                .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                .itemDetail{color:#333;}
                `}
                </style>
            </Modal>
        );
    }
};

export default Form.create()(distributorView);