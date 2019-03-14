/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-direct-mutation-state */
// 查看编辑faq
import React, { Component } from 'react';
import { Modal, message, Input, Radio, Form, Row, Col } from 'antd';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
class faqEdit extends Component {
    state = {
        show: false,
        loading: false,
        title: '处理问题',
        type: 'dispose',
        record: {},
    }

    // 显示窗口
    showModal = (option) => {
        // console.log(option);
        this.setState({
            show: true,
            title: option.type === 'dispose' ? '处理问题' : '查看问题',
            type: option.type,
            record: Object.assign(this.state.record, option.record),
        });
    }

    cancel = () => {
        this.setState({ show: false });
    }

    ok = () => {
        let state = this.state;
        if (state.type === 'dispose') {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.update(Object.assign(state.record, values));
                }
            });
        } else {
            this.setState({ show: false });
        }
    }

    // ajax
    // 提交添加
    update = (record) => {
        this.setState({ loading: true });
        this.props.update({ ...record })
            .then((res) => {
                // message.success(res.message);
                this.setState({
                    loading: false,
                    show: false,
                });
                this.props.refresh();
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    // ======================
    // 表单记录字段变化
    // ======================
    statusChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                title: e.target.value,
            })
        })
    }

    disposeChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                dispose: e.target.value.trim(),
            }),
        });
    }

    // 表格查看
    render() {
        let state = this.state
        let { getFieldDecorator } = this.props.form;
        let formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 16 }, },
        };
        return (
            <Modal
                okButtonProps={{ loading: state.loading }}
                cancelButtonProps={{ disabled: state.loading }}
                onCancel={this.cancel}
                onOk={this.ok}
                title={state.title}
                visible={state.show}
                destroyOnClose >
                <Form>
                    <Form.Item label="反馈账号" {...formItemLayout}>
                        {state.record.opinionAccount}
                    </Form.Item>

                    <Form.Item label="反馈时间" {...formItemLayout}>
                        {state.record.createTimeStr}
                    </Form.Item>

                    <Form.Item label="反馈内容" {...formItemLayout}>
                        {state.record.content}
                    </Form.Item>

                    <Form.Item label="处理状态" {...formItemLayout}>
                        {state.type === 'detail' ? state.record.status === 1 ? '已处理' : '未处理' : ''}
                        {state.type === 'dispose' && getFieldDecorator('status', {
                            initialValue: state.record.status,
                            rules: [
                                { required: true, message: '处理状态不能为空',},                                
                            ]
                        })(
                            <RadioGroup onChange={this.statusChange} >
                                <Radio value={0}>未处理</Radio>
                                <Radio value={1}>已处理</Radio>
                            </RadioGroup>
                        )}
                    </Form.Item>

                    <Form.Item label="处理时间" {...formItemLayout}>
                        {state.record.modifyTimeStr}
                    </Form.Item>

                    <Form.Item label='处理反馈' {...formItemLayout}>
                        {state.type === 'detail' && state.record.dispose}
                        {state.type === 'dispose' && getFieldDecorator('dispose', {
                            initialValue: state.record.dispose,
                            rules: [
                                { required: true, whitespace: true, message: '处理反馈不能为空', },
                                { max: 300, message: '处理反馈字数最大范围在300字数之内' },
                            ]
                        })(
                            <TextArea
                                style={{ width: '90%' }}
                                onChange={this.disposeChange}
                                autosize={{ minRows: 4, maxRows: 6 }}
                                placeholder="例如: 探险活动" 
                            />
                        )}
                    </Form.Item>
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

export default Form.create()(faqEdit);