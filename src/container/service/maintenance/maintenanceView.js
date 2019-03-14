// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Row, Col } from 'antd';

class maintenanceView extends Component {
    state = {
        show: false,
        title: '查看详情',
        record: {},
    }

    cancel = () => {
        this.setState({ show: false });
    }

    ok = () => {
        this.setState({ show: false });
    }

    showModal = (record) => {
        this.setState({
            record: record,
            show: true
        });
    }

    // 表格查看
    render() {
        let { show, title, record } = this.state
        return (
            <Modal 
                onCancel={this.cancel} 
                onOk={this.ok} 
                title={`${title} - ${record.title}`} 
                visible={show}
                destroyOnClose >
                <div>
                    <Row style={{ padding: '0px 16px' }}>
                        <Col span={24}>
                            <div>
                                <span className='label'>维保标题:</span>
                                <span className='itemDetail'>{record.title}</span>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className='label'>维保概述:</span>
                                <span className='itemDetail'>{record.summarize}</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <span className='label'>维保依据:</span>
                                <span className='itemDetail'>{ Number(record.according) === 0 ? '按周期' : '按总里程' }</span>
                            </div>
                            <div>
                                <span className='label'>是否启用:</span>
                                <span className='itemDetail'>{ Number(record.isUse) === 0 ? '否' : '是' }</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div>
                                <span className='label'>周期:</span>
                                <span className='itemDetail'>{record.title}</span>
                            </div>
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

export default Form.create()(maintenanceView);