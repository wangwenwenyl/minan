// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';

import { Map, Marker } from 'react-amap';

class networkView extends Component {
    state = {
        show: false,
        title: '查看详情',
        record: {},

        // AMap 变量
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
        console.log(record);
        this.setState({
            record: record,
            show: true,
            markerPosition: { longitude: record.lon, latitude: record.lat },
            mapCenter: { longitude: record.lon, latitude: record.lat }
        });
    }

    // 表格查看
    render() {
        let { show, title, record, mapKey, mapStyle, mapZoom, mapCenter, markerPosition } = this.state;
        return (
            <Modal 
                onCancel={this.cancel} 
                onOk={this.ok} title={`${title} - ${record.name}`}
                footer={null}
                visible={show} 
                destroyOnClose 
                className="ModalView"
            >
                <div>
                    <Row style={{ padding: '0px 16px' }}>
                        <Col span={24}>
                            <div>
                                <span className='label'>维修网点名称:</span>
                                <span className='itemDetail'>{record.name}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>维修网点编码:</span>
                                <span className='itemDetail'>{record.code}</span>
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
                                <span className='itemDetail'>{record.editorPerson}</span>
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
                .label{color:#999;width:105px;text-align:right;line-height:45px;padding-right:12px;font-size:13px;display:inline-block;}
                .itemDetail{color:#333;}
                `}
                </style>
            </Modal>
        );
    }
};

export default Form.create()(networkView);