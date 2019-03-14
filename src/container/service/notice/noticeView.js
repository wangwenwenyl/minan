/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { Modal, Col, Form, Row, } from 'antd';

class noticeView extends Component {
    constructor(props, context) {
        super(props, context);
    }

    // 状态
    state = {
        show: false,
        title: '查看',
        record: {},
    }

    showModal = (record) => {
        this.setState({ 
            show: true,
            record: record,
        });
        console.log(record);
    }

    okAndCancel = () => {
        this.setState({ show: false });
    }

    // 没有接口获取,写死1系统消息, 2告警通知 ,3 推荐消息 ,4 问卷调查, 5 启动页广告，6轮播广告,7保养提醒
    renderMessageDigit = () => {
        let str;
        let digit = this.state.record.messageDigit;
        if (digit === 1) { str = '系统消息' }
        else if (digit === 2) { str = '告警通知' }
        else if (digit === 3) { str = '推荐消息' }
        else if (digit === 4) { str = '问卷调查' }
        else if (digit === 5) { str = '启动页广告' }
        else if (digit === 6) { str = '轮播广告' }
        else if (digit === 7) { str = '保养提醒' }
        else { str = '无' }
        return (<span>{str}</span>);
    }

    // 渲染模板
    render() {
        let state = this.state;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, },
        };
        return (            
            <div className="notice notice_view">
                <Modal 
                    onCancel={this.okAndCancel} 
                    onOk={this.okAndCancel} 
                    title={`${state.title} - ${state.record.title === '' ? '无标题' : state.record.title}`} 
                    visible={state.show} 
                    destroyOnClose 
                    className="ModalView">
                    <Form style={{ height: '480px', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Form.Item {...formItemLayout} label="消息类型">
                            {state.record.pushType === 1 ? '及时消息' : '固定消息'}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="消息标题">
                            {state.record.title}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="消息位">
                            {this.renderMessageDigit()}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="用户标签">
                            {state.record.different === 0 && '所有用户'}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="触发事件">
                            {state.record.eventName || '无'}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="倒计时时间">
                            {state.record.countdownTimeStr}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="消息内容">
                            {state.record.message}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="推送时间">
                            {state.record.pushTimeStr}
                        </Form.Item>
                    </Form>
                </Modal>

                <style>
                {`
                .treeBox{width:663px !important;height:607px !important;}
                .label{color:#999;width:105px;text-align:right;line-height:45px;padding-right:12px;font-size:13px;display:inline-block;}
                .itemDetail{color:#333;}
                `}
                </style>
            </div>
        )
    }
}

export default Form.create()(noticeView);