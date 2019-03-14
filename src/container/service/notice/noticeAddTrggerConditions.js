/* eslint-disable no-unused-expressions */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { Modal, Tree, Col, Form, Row, Input, message } from 'antd';

import Axios from 'axios';
import { HttpUrl, httpConfig } from '../../../util/httpConfig';

const { TreeNode } = Tree;

class noticeAddTrggerConditions extends Component {
    constructor(props, context) {
        super(props, context);
    }

    // 状态
    state = {
        loading: false,
        show: false,
        title: '触发条件维护',
        isAdded: false,
        data:{
            list: [],
        },
        record: {
            eventName: '',
            alarmTrigger: [],
        },
    }

    showModal = (list) => {
        this.setState({
            show: true,
            data: Object.assign(this.state.data, {
                list: list,
            }),
        });
    }

    // 故障事件变更
    alarmTriggerCheck = (codes) => {
        codes = codes.filter(item => item !== 'BMS' && item !== 'MCU' && item !== 'OTHER');
        this.setState({
            record: Object.assign(this.state.record, {
                alarmTrigger: codes.join(';'),
            })
        });
    }

    // 输入事件变更
    eventNameChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                eventName: e.target.value,
            })
        });
    }

    // 取消
    cancel = () => {
        this.setState({ show: false });
    }

    // 提交数据
    ok = () => {
        this.props.form.validateFields((err, value)=> {
            if (!err) {
                if (this.state.record.alarmTrigger.length === 0){
                    return message.warning('没有选择故障类型');
                }
                this.addAlarmFaultCode({
                    eventName: this.state.record.eventName,
                    alarmTrigger: this.state.record.alarmTrigger
                })
                .then((res) => {
                    this.setState({ 
                        show: false,
                        isAdded: true, 
                    });
                    this.props.refreshSelect();
                })
                .catch((err) => {
                    message.warning(err.message)
                })
            }
        });        
    }

    // ==================
    // ajax
    // ==================
    // 请求方式： POST 接口路径： http://42.159.92.113/api/appserv/push/addAlarmFaultCode
    addAlarmFaultCode = (option) => {
        option = option || {};
        return new Promise((resolve, reject) => {
            this.setState({ loading: true});
            Axios.post(HttpUrl + 'appserv/push/addAlarmFaultCode', { ...option }, httpConfig)
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

    // 渲染模板
    render() {
        let state = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="notice notice_view">
                <Modal
                    okButtonProps={{ loading: this.state.loading }}
                    onCancel={this.cancel} 
                    onOk={this.ok} 
                    title={`${state.title}`} 
                    visible={state.show} 
                    destroyOnClose 
                    className="Modal_View">
                    <Form>
                        <Form.Item {...formItemLayout} label="触发条件">
                            {getFieldDecorator('eventName', {
                                rules: [{
                                    required: true, whitespace: true, message: '触发条件名称不能为空',
                                }],
                            })(
                                <Input onChange={this.eventNameChange.bind(this)} placeholder="例如: 温度过低故障" />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="选择故障" style={{ height: '300px', overflowY: 'auto' }}>
                            <Tree 
                                checkable 
                                onCheck={this.alarmTriggerCheck}
                                // onSelect={this.onSelect}
                            >
                                <TreeNode title="BMS" key="BMS" >
                                    {state.data.list.map((item) => (
                                        item.alarmType === 'BMS' && <TreeNode data={item} title={item.alarmName} key={item.alarmCode} />
                                    ))}
                                </TreeNode>
                                <TreeNode title="MCU" key="MCU" >
                                    {state.data.list.map((item) => (
                                        item.alarmType === 'MCU' && <TreeNode data={item} title={item.alarmName} key={item.alarmCode} />
                                    ))}
                                </TreeNode>
                                <TreeNode title="OTHER" key="OTHER" >
                                    {state.data.list.map((item) => (
                                        item.alarmType === 'OTHER' && <TreeNode data={item} title={item.alarmName} key={item.alarmCode} />
                                    ))}
                                </TreeNode>
                            </Tree>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(noticeAddTrggerConditions);