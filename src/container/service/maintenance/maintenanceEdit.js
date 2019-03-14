/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-direct-mutation-state */
// 查看维保详情
import React, { Component } from 'react';
import { Modal, message, Input, Form, Row, Col, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const RadioGroup = Radio.Group;
class maintenanceEdit extends Component {
    state = {
        show: false,
        title: '添加维修保养记录',
        type: 'add',
        totalMileageStart: 0,
        totalMileageEnd: 0,
        record: {},
    }

    // 显示窗口
    showModal = (option) => {
        let totalMileage;
        if(option.type === 'add') {
            totalMileage = [0, 0];
        } else {            
            totalMileage = option.record.totalMileage !== null && option.record.totalMileage.split('-');
        }
        this.setState({
            show: true,
            type: option.type,
            totalMileageStart: totalMileage[0] || 0,
            totalMileageEnd: totalMileage[1] || 0,
            record: option.type === 'add' ? {} : Object.assign(this.state.record, option.record),
        });
    }

    cancel = () => {
        this.setState({ show: false });
    }

    ok = () => {
        let state = this.state;
        this.props.form.validateFields((err, values) => { 
console.log(values)
            if (!err) {
                if(Number(values.totalMileageStart)>Number(values.totalMileageEnd))
                {
                    message.warning('结束行程不能小于开始行程')
                }else{
                    if (this.state.type === 'edit') {
                    this.update(Object.assign(state.record, {
                        totalMileage: [values.totalMileageStart, values.totalMileageEnd].join('-'),
                        ...values
                    }));
                } else {
                    this.add(Object.assign(state.record, {
                        totalMileage: [values.totalMileageStart, values.totalMileageEnd].join('-'),
                        ...values
                    }));
                }
                }
               
            }
        });
    }

    // ajax
    // 提交添加
    add = (record) => {
        this.setState({ loading: true });
        this.props.add({ ...record })
            .then((res) => {
                message.success(res.message);
                this.setState({
                    loading: false,
                    show: false,
                });
                this.props.refresh();
            })
            .catch((err) => {
                message.warning(err.message);
                this.setState({
                    loading: false,
                });
            });
    }

    update = (record) => {
        this.setState({ loading: true });
        this.props.update({ ...record })
            .then((res) => {
                message.success(res.message);
                this.setState({ loading: false, show: false, });
                this.props.refresh();
            })
            .catch((err) => {
                message.warning(err.message);
                this.setState({ loading: false, });
            });
    }

    // ======================
    // 表单记录字段变化
    // ======================
    titleChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                title: e.target.value.trim(),
            })
        })
    }

    accordingChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                according: e.target.value,
            }) 
        });
    }

    totalMileageStartChange = (e) => {
        this.setState({
            totalMileageStart:  e.target.value,
        })
    }

    totalMileageEndChange = (e) => {
        this.setState({
            totalMileageEnd:  e.target.value,
        })
    }

    isUseChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record,{
                isUse: e.target.value,
            })
        });
    }

    // 表格查看
    render() {
        const { show, title, record, loading, type, totalMileageStart, totalMileageEnd } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, },
        };
        return (
            <Modal 
                okButtonProps={{ loading: loading }}
                cancelButtonProps={{ disabled: loading }}
                maskClosable={loading}
                onCancel={this.cancel}
                onOk={this.ok}
                title={type === 'add' ? title : '编辑维修保养记录'}
                visible={show}
                destroyOnClose >
                <Form onSubmit={this.handleSubmit}>
                    <Row style={{ padding: '0px 16px' }}>
                        <Col span={24}>
                            <Form.Item label="维保标题" {...formItemLayout}>
                                {getFieldDecorator('title', {
                                    initialValue: record.title,
                                    rules: [
                                        { required: true, whitespace: true, message: '维保标题不能为空' },
                                        { max: 30,  message: '标题字数最大范围在30字数之内' },
                                    ]
                                })(
                                    <Input onChange={this.titleChange} placeholder='维保标题不能为空' />
                                )}
                            </Form.Item>

                            <Form.Item label="维保概述" {...formItemLayout}>
                                {getFieldDecorator('summarize',{
                                    initialValue: record.summarize,
                                    rules: [
                                        { required: true, whitespace: true, message: '维保概述不能为空' },
                                        { max: 300, message: '维保概述字数最大范围在300字数之内' },
                                    ]
                                })(
                                    <TextArea autosize={{ minRows: 3, maxRows: 4 }} placeholder='维保概述' />
                                )}
                            </Form.Item>

                            <Form.Item label="维保依椐" {...formItemLayout}>
                                {getFieldDecorator('according', {
                                    initialValue: record.according,
                                    rules: [{
                                        required: true,
                                        message: '维保依椐不能为空',
                                    }]
                                })(
                                    <RadioGroup onChange={this.accordingChange} >
                                        <Radio value={0}>按周期</Radio>
                                        <Radio value={1}>按行驶里程</Radio>
                                    </RadioGroup>
                                )}
                            </Form.Item>

                            {record.according === 0 && <Form.Item label="周期" {...formItemLayout}>
                                <Row gutter={4}>
                                    <Col span={10} >
                                        {getFieldDecorator('period', {
                                            initialValue: record.period || 0,
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '保养周期不能为空并且只能为整数',
                                                pattern: /^[1-9]\d*$/,
                                            }]
                                        })(
                                            <Input />
                                        )}
                                    </Col>
                                </Row>
                            </Form.Item>}
                            
                            {record.according === 1 && <Form.Item label="累计行驶里程" {...formItemLayout}>
                                <Row gutter={4}>
                                    <Col span={10} >
                                        <Form.Item>
                                            {getFieldDecorator('totalMileageStart', {
                                                initialValue: totalMileageStart || 0,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '不能为空且为整数',
                                                    pattern: /^[1-9]\d*$/,
                                                }]
                                            })(
                                                <Input onChange={this.totalMileageStartChange}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={4} style={{textAlign: 'center'}}>-</Col>
                                    <Col span={10} >
                                        <Form.Item>
                                            {getFieldDecorator('totalMileageEnd', {
                                                initialValue: totalMileageEnd || 0,
                                                rules: [{
                                                    required: true,
                                                    whitespace: true,
                                                    message: '不能为空且为整数',
                                                    pattern: /^[1-9]\d*$/,
                                                }]
                                            })(
                                                <Input onChange={this.totalMileageEndChange} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form.Item>}

                            <Form.Item label="是否启用" {...formItemLayout}>
                                {getFieldDecorator('isUse', {
                                    initialValue: record.isUse,
                                    rules: [{
                                        required: true,
                                        message: '是否启用不能为空',
                                    }]
                                })(
                                    <RadioGroup onChange={this.isUseChange} >                                        
                                        <Radio value={0}>否</Radio>
                                        <Radio value={1}>是</Radio>
                                    </RadioGroup>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

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

export default Form.create()(maintenanceEdit);