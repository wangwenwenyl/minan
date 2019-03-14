/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { Modal, Row, Col, Form, DatePicker, TimePicker, Input, Select, Button, Checkbox, Radio, message } from 'antd';
import Axios from 'axios';
import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import moment from 'moment';
import {validatorRoleName,validatorNewsName} from './../../../util/validator'
import NoticeAddTrggerConditions from './noticeAddTrggerConditions';

const Option = Select.Option;
const { TextArea } = Input;

class noticeAdd extends Component {
    constructor(props, context) {
        super(props);
    }

    // 状态
    state = {
        show: false,
        title: '添加',
        pushType: 1,
        loading: false,

        nameSelect: [],        
        selectTimeId: 0,
        selectTimeCount: 1,
        selectTimeArr: [],
        selectWeeksArr: [],

        notice: {
            // 添加通知需要的参数
            title: '',                  // 消息标题
            way: 1,                     // 推送渠道 1：APP 2：短信
            pushType: 1,                // 通知类型 1：及时 2：固定
            messageCenter: 0,           // 是否保存在消息中心 1 : 否  2： 是
            saveMessageCenter: false,   // 需要一个状态保存checked
            messageDigit: 0,            // 消息位 1系统消息, 2告警通知 ,3 推荐消息,7保养提醒
            different: 0,               // 用户标签，传值为 0 
            differentiate: 1,           // 及时通知是否立即发送（1 : 否  2： 是）如果是，则 selectTime 必选为空
            noticePushNow: false,
            selectTime: '',             // 及时通知不是立即发送，则必选择发送时间,最多选择 5 个，中间以‘;’分隔,请去掉最后末尾得分号
            mmsType: '',                // 短信类型，如果是短信方式,此项必传,App不用传
            name: '',                   // 短信模板名称，
            message: '',                // 消息内容
            mode: 0,                    // 触发方式 （0：定时触发 1：事件触发）
            weekDay: 1,                 // 触发条件，当触发方式为 0 （即 定时触发）时，选择触发条件，1：每天  2：每周  3：每月
            pushTimeStr: '',            // 发送时间，定时触发得触发条件为 1、3（即每天、每月）时，必填此项，如果为3（即每月）只要选中的天数对应上即可
            week: '',                   // 每周的星期几发送，定时触发的触发条件为 2（即每周）时，必填此项，值为：
            condition: 2,               // 事件触发的触发条件， 2：生日 3：车辆安防告警 4：车辆故障告警5：保养
            alarmEvent: 1,              // 事件触发的触发条件为 5（即维修保养）时，此项必填，
            eventName: '',              // 车辆故障告警自定义触发条件名称
            alarmTrigger: '',           // 车辆故障告警触发条件，存储告警的故障码，以 “;”分割
            alarmEventTime: '',
        },

        select: {
            waySelect: [
                { value: 1, label: 'App' },
                { value: 2, label: '短信' },
            ],
            // 选项数据 注：如果messageCenter 为2，则必选此项，为1 则不显示此项
            // 1系统消息, 2告警通知 ,3 推荐消息,7保养提醒
            messageDigitSelect: [
                { value: 1, label: '系统消息' },
                { value: 2, label: '告警通知' },
                { value: 3, label: '推荐消息' },
                { value: 7, label: '保养提醒' },
            ],
            modeSelect: [
                { value: 0, label: '定时触发' },
                { value: 1, label: '事件触发' },
            ],
            // 2：生日 3：车辆安防告警 4：车辆故障告警5：保养
            conditionSelect: [
                { value: 1, label: '系统通知' },
                { value: 2, label: '生日' },
                { value: 3, label: '车辆安防告警' },
                { value: 4, label: '车辆故障告警' },
                { value: 5, label: '保养' },
                { value: 6, label: '推荐消息' },
                { value: 7, label: '车辆控制' },
                { value: 8, label: '添加一般账号短信' },
                { value: 9, label: '重置密码' },
                { value: 10, label: 'PIN码重置' },
            ],
            
            alarmEventCarControlSelect: [
                { value: 14, label: '车窗开启成功' },
                { value: 15, label: '车窗关闭成功' },
                { value: 16, label: '天窗开启成功' },
                { value: 17, label: '天窗关闭成功' },
                { value: 18, label: '中控锁解锁成功' },
                { value: 19, label: '中控锁锁定成功' },
                { value: 20, label: '后背门解锁成功' },
                { value: 21, label: '后背门锁定成功' },
                { value: 22, label: '空调开启成功' },
                { value: 23, label: '空调调节成功' },
                { value: 24, label: '空调关闭成功' },
                { value: 25, label: '热管理开启成功' },
                { value: 26, label: '热管理关闭成功' },
               
            ],
            alarmEventTimeSelect: [
                { value: 0, label: '实时触发' },
                { value: 1, label: '提前2小时' },
                { value: 2, label: '提前5小时' },
                { value: 3, label: '提前12小时' },
                { value: 4, label: '提前24小时' },
                { value: 5, label: '提前2天' },
                { value: 6, label: '提前3天' },
                { value: 7, label: '提前5天' },
                { value: 8, label: '提前10天' },
            ],
            alarmEventMaintainSelect: [
                { value: 0, label: '实时触发' },
            ],
            alarmEventSecuritySelect: [
                { value: 3, label: '电子围栏-驶入' },
                { value: 4, label: '电子围栏-驶出' },
                { value: 5, label: '防盗-报警' },
                { value: 6, label: '防盗-报警解除' },
                { value: 7, label: '移动-报警' },
                { value: 8, label: '移动-报警解除' },
                { value: 9, label: '添加车辆成功' },
                { value: 10, label: '解绑成功' },
                { value: 11, label: '充电完成' },
                { value: 12, label: '充电提醒' },
                { value: 13, label: '验证码' },
            ],
            mmsTemplate: [], // 短信模板
            triggerConditionsSelect: [], // 故障信息
            triggerConditionMaintenance: [],
        }
    }

    componentDidMount() {
        this.refreshSelect();
    }

    refreshSelect = () => {
        // 拉取短信数据, 感觉有点蛋疼
        this.getMmsTemplateList({ type: 1 })
            .then((res) => {
                this.setState({
                    select: Object.assign(this.state.select, {
                        mmsTemplate: res.data,
                    })
                })
                // 拉取故障信息
                return this.props.getTriggerConditions();
            })
            .then((res) => {
                this.setState({
                    select: Object.assign(this.state.select, {
                        triggerConditionsSelect: res,
                    }),
                });
                // 拉取自定义故障列表
                return this.props.triggerConditionMaintenance();
            })
            .then((res) => {
                this.setState({
                    select: Object.assign(this.state.select, {
                        triggerConditionMaintenance: res,
                    })
                });
            })
            .catch((err) => {
                message.warning(err.message);
            });
    }

    getMmsTemplateList = (option) => {
        return this.props.getMmsTemplateList(option);
    }

    triggerConditionMaintenance = (option) => {
        return this.props.triggerConditionMaintenance(option)
    }

    // 显示modal窗口
    showModal = (type) => {
        this.setState({
            show: true,
            loading: false,
            pushType: type.pushType,
            notice: Object.assign(this.state.notice, {
                title: '',                  // 消息标题
                way: 1,                     // 推送渠道 1：APP 2：短信
                pushType: type.pushType,    // 通知类型 1：及时 2：固定
                messageCenter: 0,           // 是否保存在消息中心 1 : 否  2： 是
                saveMessageCenter: false,   // 需要一个状态保存checked
                messageDigit: 0,            // 消息位 1系统消息, 2告警通知 ,3 推荐消息,7保养提醒
                different: 0,               // 用户标签，传值为 0 
                differentiate: 1,           // 及时通知是否立即发送（1 : 否  2： 是）如果是，则 selectTime 必选为空
                noticePushNow: false,
                selectTime: '',             // 及时通知不是立即发送，则必选择发送时间,最多选择 5 个，中间以‘;’分隔,请去掉最后末尾得分号
                mmsType: '',                // 短信类型,如果是短信方式,此项必传,App不用传
                name: '',                   // 短信模板名称，
                message: '',                // 消息内容
                mode: 0,                    // 触发方式 （0：定时触发 1：事件触发）
                weekDay: 1,                 // 触发条件，当触发方式为 0 （即 定时触发）时，选择触发条件，1：每天  2：每周  3：每月
                pushTimeStr: '',            // 发送时间，定时触发得触发条件为 1、3（即每天、每月）时，必填此项，如果为3（即每月）只要选中的天数对应上即可
                week: '',                   // 每周的星期几发送，定时触发的触发条件为 2（即每周）时，必填此项，值为：
                condition: 2,               // 事件触发的触发条件， 2：生日 3：车辆安防告警 4：车辆故障告警5：保养
                alarmEvent: 1,              // 事件触发的触发条件为 5（即维修保养）时，此项必填，
                eventName: '',              // 车辆故障告警自定义触发条件名称
                alarmTrigger: '',           // 车辆故障告警触发条件，存储告警的故障码，以 “;”分割
                alarmEventTime: '',
            }),
        }, () => {console.log(this.state)});
    }

    cancel = () => {
        this.setState({ show: false });
    }

    submit = () => {
        this.props.form.validateFields((err, value) => {    
            console.log(value)        
            if(!err) {
                this.addNotice()
                .then((res) => {
                    this.setState({ show: false });
                    this.props.refresh();
                })
                .catch((err) => {
                    message.warning(err.message);
                });
                // 如果保存到消息中心
                if (this.state.notice.saveMessageCenter && this.state.notice.way === 1) {
                    this.addMessage()
                    .catch((err) => {
                        message.warning('添加到消息中心失败')
                    });
                }
            }
        });
    }

    // ===============
    // 表单字段事件
    // ===============
    noticeTitleChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                title: e.target.value.trim(),
            })
        });
    }

    noticeSelectTimeCahnge = (value, date, gId) => {
        let state = this.state;
        state.selectTimeArr[gId] = date;
    };

    // 变更推送方式
    noticeWayChange = (value) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                way: value
            })
        });
    };

    // 是否保存在消息中心
    noticeMessageCenterChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                saveMessageCenter: e.target.checked,
                messageCenter: e.target.checked ? 2 : 1,
            }),
        });
    };

    // 短信模板选择
    noticeMmsTemplateChange = (value) => {
        let mms = '';
        this.state.select.mmsTemplate.forEach((item) => {
            if (item.title === value) {
                mms = item.content;
            }
        });
        this.setState({
            notice: Object.assign(this.state.notice, {
                name: value,
                message: mms,
            }),
        })
    };

    // 是否立即发送
    noticeDifferentiateChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                differentiate: e.target.checked ? 2 : 1,
                noticePushNow: e.target.checked
            })
        });
    };

    // 触发时间方式
    noticeWeekDayChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                weekDay: e.target.value
            }),
        });
    };

    // 改变时间方式
    onPushTimeStrChange = (memont, dateTime) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                pushTimeStr: dateTime,
            })
        });
    }

    // 星期选择
    noticeWeekChange = (e) => {
        this.setState({
            selectWeeksArr: e,
            notice: Object.assign(this.state.notice, {
                week: e.join(';')
            })
        });
    }

    // 触发方式
    noticeModeChange = (value) => {
        let state = this.state;
        this.setState({
            notice: Object.assign(state.notice, { mode: value })
        });
    };

    // 触发事件
    noticeConditionChange = (value) => {
        this.setState({
            notice: Object.assign(this.state.notice, { condition: value })
        });
    }

    // 触发时间选择
    noticeAlarmEventChange = (value) => {
        this.setState({
            notice: Object.assign(this.state.notice, { alarmEvent: value})
        });
    }

    // 触发事件为生日时选择时间
    noticeAlarmEventTimeChange = (value) => {
        console.log('触发事件为生日时选择时间:', value);
        this.setState({
            notice: Object.assign(this.state.notice, { alarmEventTime: value })
        });
    }

    // 触发事件为安保
    noticeAlarmEventSecurityChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                alarmEvent: e,
            })
        });
    }

    // 触发事件为故障选择
    noticeAlarmEventFaultChange = (value, item) => {
        // item : { props: {children: "徐毅测试故障", value: "66035"}}
        this.setState({
            notice: Object.assign(this.state.notice, {
                eventName: item.props.children,
                alarmTrigger: item.props.value,
            }),
        })
    }

    // 触发事件为保养选择
    noticeAlarmEventMaintainChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                alarmEvent: e.target.value === 1 ? 1 : 2
            }),            
        });
    }

    // 消息变更
    noticeMessageChange = (e) => {
        this.setState({
            notice: Object.assign(this.state.notice, {
                message: e.target.value,
            }),
        });
    }

    addCustomTigger = () => {
        this.formTrgger.showModal(this.state.select.triggerConditionMaintenance);
    }

    // 添加删除时间
    addNoticeSelectTimeItem = () => {
        let state = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');
        let nextKeys = keys.concat(++state.selectTimeId);
        form.setFieldsValue({
            keys: nextKeys,
        });
        state.selectTimeCount++;
    };

    // 删除时间选择窗口
    removeNoticeSelectTimeItem = (gid, index) => {
        let state = this.state;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== gid),
        });
        state.selectTimeCount--;
        state.selectTimeArr.splice(index, 1);
    }

    // ====================
    // ajax
    // ====================
    // 11.1创建活动接口
    // 请求方式：POST 接口路径：http://42.159.92.113/api/appserv/app/message/addMessage
    addMessage = () => {
        let params = {
            // 已有字段
            topic: this.state.notice.title,
            message: this.state.notice.message,
            pushTime: this.state.notice.pushTimeStr,
            // 没有的字段
            type: 1,
            control: 1,
            pushEndTime: '2019-12-12 23:59:59',
            expire: 0,
            h5Link: '',
            img: [],
        };
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + `appserv/app/message/addMessage`, { ...params }, httpConfig)
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
    // 12.2消息通知管理添加
    // 请求方式：POST, 接口路径：http://42.159.92.113/api/appserv/push/addPush
    addNotice = () => {
        let state = this.state;
        // console.log(state.selectTimeArr.join(';'));
        let params = {
            title: state.notice.title,
            way: state.notice.way,
            pushType: state.notice.pushType,
            messageCenter: state.notice.messageCenter,
            messageDigit: state.notice.messageDigit,
            different: state.notice.different,
            differentiate: state.notice.differentiate,
            selectTime: state.selectTimeArr.join(';'),
            mmsType: state.notice.mmsType,
            name: state.notice.name,
            message: state.notice.message,
            mode: state.notice.mode,
            weekDay: state.notice.weekDay,
            pushTimeStr: state.notice.pushTimeStr,
            week: state.notice.week,
            condition: state.notice.condition,
            alarmEvent: state.notice.alarmEvent,
            eventName: state.notice.eventName,
            alarmTrigger: state.notice.alarmTrigger,
        };
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + `appserv/push/addPush`, { ...params }, httpConfig)
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
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, },
        };
        const formItemLayoutNoticeLabel = {
            wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 18, offset: 6 }, },
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        // 如果不是立即发不要执行这个方法
        const formTimeItems = !state.notice.noticePushNow && keys.map((gId, index) => (            
            <Form.Item {...formItemLayoutNoticeLabel} required={false} key={gId} >
                <Row gutter={0}>
                    <Col span={14} >
                        {getFieldDecorator(`selectTime_${gId}`, {
                            rules: [{ required: true, message: "选择推送时间", }],
                        })(
                            <DatePicker showTime onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, index + 1)} format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </Col>
                    <Col span={4} >
                        <Button type="dashed" icon="minus" 
                            onClick={() => this.removeNoticeSelectTimeItem(gId, index + 1)} />
                    </Col>
                </Row>
            </Form.Item>
        ));
        return (
            <div className="notice notice_add" >
                {/* 通知类型 1：及时  2：固定 */}
                <Modal 
                    onCancel={this.cancel} 
                    onOk={this.submit} 
                    title={state.pushType === 1 ? `${state.title}及时通知` : `${state.title}固定通知`}
                    okButtonProps={{ loading: state.loading }} 
                    visible={state.show} 
                    destroyOnClose className="Modal_Notice_Add" >
                    <Form className="notice_from" style={{ height: '480px', overflowY: 'auto', overflowX: 'hidden'}}>
                        <Form.Item {...formItemLayout} label="消息标题">
                            {getFieldDecorator('title', {
                                rules: [

                                    {required:true,
                                        validator:validatorNewsName}
                                    // { required: true, whitespace: true, message: '消息标题不能为空', },
                                    // { max: 30, message: '输入名称不能大于30字符', },
                                ],
                            })(
                                <Input onChange={this.noticeTitleChange} placeholder="例如: 探险活动" style={{ width: '90%' }}/>
                            )}
                        </Form.Item>
                        
                        {/* 推送渠道 */}
                        <Form.Item {...formItemLayout} label="推送渠道" defaultValue={1}>
                            {getFieldDecorator('way', {
                                // initialValue: 'App',
                                rules: [{
                                    required: true, message: '推送渠道不能为空',
                                }],
                            })(
                                <Select onChange={this.noticeWayChange} style={{ width: 200 }} >
                                    {
                                        state.select.waySelect.map((item) => <Option key={item.value} value={item.value}>{item.label}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>

                        {/* 保存到消息中心 */}
                        {state.notice.way === 1 && <Form.Item {...formItemLayoutNoticeLabel} defaultValue={1}>
                            {getFieldDecorator('messageCenter', {
                                // initialValue: false,
                                rules: [{
                                    required: false, message: '是否保存在消息中心不能为空',
                                }],
                            })(
                                <Checkbox checked={state.notice.saveMessageCenter} onChange={this.noticeMessageCenterChange} >
                                    是否保存在消息中心
                                </Checkbox>
                            )}
                        </Form.Item>}

                        {/* 消息位 固定消息可用 */}
                        {state.notice.saveMessageCenter && 
                        <Form.Item {...formItemLayout} label="消息位" defaultValue={0}>
                            {getFieldDecorator('messageDigit', {
                                initialValue: '系统通知',
                                rules: [{
                                    required: true, message: '消息位不能为空',
                                }],
                            })(
                                <Select style={{ width: 200 }} >
                                    {
                                        state.select.messageDigitSelect.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>}

                        {/* 用户标签 直接传0就行了 */}
                        <Form.Item {...formItemLayout} label="用户标签" defaultValue={0}>
                            {getFieldDecorator('different', {
                                initialValue: state.notice.different,
                                rules: [{
                                    required: true, message: '用户标签不能为空',
                                }],
                            })(
                                <Select style={{ width: 200 }} >
                                    <Option key={0} value={0}>所有用户</Option>
                                </Select>
                            )}
                        </Form.Item>
                        
                        {/* 推送时间 */}
                        {state.pushType === 1 && <Form.Item {...formItemLayout} label="推送时间">
                            {getFieldDecorator('differentiate')(
                                <Checkbox checked={state.notice.noticePushNow} onChange={this.noticeDifferentiateChange} >
                                    立即发送
                                </Checkbox>
                            )}
                        </Form.Item>}

                        {/* 选择推送时间 */}
                        {state.pushType === 1 && !state.notice.noticePushNow && <Form.Item {...formItemLayoutNoticeLabel}>
                            <Row gutter={0}>
                                <Col span={14} >
                                    {getFieldDecorator('selectTime_0', {
                                        rules: [{
                                            required: true, message: '推送时间不能为空',
                                        }],
                                    })(
                                        <DatePicker onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, 0)} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                                </Col>
                                <Col span={4} >
                                    <Button type="dashed" icon="plus" onClick={this.addNoticeSelectTimeItem} disabled={state.selectTimeCount === 5} />
                                </Col>
                            </Row>
                        </Form.Item>}

                        {state.pushType === 1 && !state.notice.noticePushNow && formTimeItems}                        

                        {/* 触发方式 */}
                        {state.pushType === 2 && <div>
                            <Form.Item {...formItemLayout} label="触发方式">
                                {getFieldDecorator('mode', {
                                    initialValue: state.notice.mode,
                                    rules: [{
                                        required: true, message: '触发方式不能为空',
                                    }],
                                })(
                                    <Select style={{ width: 200 }} onChange={this.noticeModeChange} >
                                        {
                                            state.select.modeSelect.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            { state.notice.mode === 0 && <div>
                                <Form.Item {...formItemLayoutNoticeLabel} >
                                    {getFieldDecorator('weekDay',{
                                        rules: [
                                            { required: true, message: '触发时间方式不能空',}
                                        ],
                                    })(
                                        <Radio.Group onChange={this.noticeWeekDayChange}>
                                            <Radio value={1}>每天</Radio>
                                            <Radio value={2}>每周</Radio>
                                            <Radio value={3}>每月</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>
                                {(state.notice.weekDay === 1 || state.notice.weekDay === 3) && <Form.Item {...formItemLayoutNoticeLabel} >
                                    {getFieldDecorator('pushTimeStr',{
                                        initialValue: null,
                                        rules: [{
                                            required: true, message: '时间不能为空',
                                        }],
                                    })(                                        
                                        state.notice.weekDay === 1 
                                            ? <TimePicker onChange={this.onPushTimeStrChange} format={'HH:mm'} minuteStep={5} />

                                            :<div>
                                            <span style={{color:'red',fontSize:12}}>“亲～发送时间为 上午8点-10点哦～”</span>
                                            <DatePicker onChange={this.onPushTimeStrChange} format={'YYYY/MM/DD'} />
                                            </div> 
                                            
                                    )}
                                </Form.Item>}
                                {state.notice.weekDay === 2 && <Form.Item {...formItemLayoutNoticeLabel} defaultValue={[]} >
                                <span style={{color:'red',fontSize:12}}>“亲～发送时间为 上午8点-10点哦～”</span>
                                    {getFieldDecorator('week', {
                                        initialValue: state.selectWeeksArr,
                                        rules: [{
                                            required: true, message: '请选择一天为发送信息时间',
                                        }],
                                    })(
                                        <Checkbox.Group onChange={this.noticeWeekChange} style={{ width: "80%" }}>
                                            <Row>
                                                <Col span={6}><Checkbox value="MON">周一</Checkbox></Col>
                                                <Col span={6}><Checkbox value="TUE">周二</Checkbox></Col>
                                                <Col span={6}><Checkbox value="WED">周三</Checkbox></Col>
                                                <Col span={6}><Checkbox value="THU">周四</Checkbox></Col>
                                                <Col span={6}><Checkbox value="FRI">周五</Checkbox></Col>
                                                <Col span={6}><Checkbox value="SAT">周六</Checkbox></Col>
                                                <Col span={6}><Checkbox value="SUN">周日</Checkbox></Col>
                                            </Row>
                                        </Checkbox.Group>
                                    )}
                                </Form.Item>}
                            </div>}

                            {/* 触发事件 */}
                            {state.notice.mode === 1 && <div>
                                <Form.Item {...formItemLayout} label="触发事件" defaultValue={2}>
                                    {getFieldDecorator('condition', {
                                        initialValue: state.notice.condition,
                                        rules: [{
                                            required: true, message: '触发事件不能为空',
                                        }],
                                    })(
                                        <Select onChange={this.noticeConditionChange} style={{ width: 200 }} >
                                        {
                                            state.select.conditionSelect.map(
                                                item => <Option key={item.value} value={item.value}>{item.label}</Option>
                                            )
                                        }
                                        </Select>
                                    )}
                                </Form.Item>

                                {/* 触发事件为生日时选择时间 需要显示state.notice.condition === 2 暂时不显示*/}
                                {state.notice.condition === 100 && <Form.Item defaultValue={0} {...formItemLayout} label="触发时间" >
                                    {getFieldDecorator('alarmEventTime', {
                                        initialValue: state.notice.alarmEventTime,
                                        rules: [{
                                            required: true, message: '触发时间不能为空',
                                        }],
                                    })(
                                        <Select onChange={this.noticeAlarmEventTimeChange} style={{ width: 200 }} >
                                            {
                                                state.select.alarmEventTimeSelect.map(
                                                    item => <Option key={item.value} value={item.value}>{item.label}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </Form.Item>}

                                {/* 触发事件为车辆安防告警时选择项 */}
                                {state.notice.condition === 3 && <Form.Item defaultValue={0} {...formItemLayout} label="触发条件" >
                                    {getFieldDecorator('alarmEvent', {
                                        // initialValue: 0,
                                        rules: [{
                                            required: true, message: '触发条件不能为空',
                                        }],
                                    })(
                                        <Select onChange={this.noticeAlarmEventSecurityChange} style={{ width: 200 }} >
                                            {
                                                state.select.alarmEventSecuritySelect.map(
                                                    item => <Option key={item.value} value={item.value}>{item.label}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </Form.Item>}

                                {/* 触发事件为车辆控制时选择项 */}
                                {state.notice.condition === 7 && <Form.Item defaultValue={0} {...formItemLayout} label="触发条件" >
                                    {getFieldDecorator('alarmEvent', {
                                        // initialValue: 0,
                                        rules: [{
                                            required: true, message: '触发条件不能为空',
                                        }],
                                    })(
                                        <Select onChange={this.noticeAlarmEventSecurityChange} style={{ width: 200 }} >
                                            {
                                                state.select.alarmEventCarControlSelect.map(
                                                    item => <Option key={item.value} value={item.value}>{item.label}</Option>
                                                )
                                            }
                                        </Select>
                                    )}
                                </Form.Item>}

                                {/* 触发事件为车辆故障告警时选择项 */}
                                {state.notice.condition === 4 && <Form.Item defaultValue={0} {...formItemLayout} label="触发条件" >
                                    <Row gutter={0}>
                                        <Col span={14} >
                                            {getFieldDecorator('eventName', {
                                                // initialValue: state.notice.alarmEventTime,
                                                rules: [{
                                                    required: true, message: '触发条件不能为空',
                                                }],
                                            })(
                                                <Select onChange={this.noticeAlarmEventFaultChange} style={{ width: 200 }} >
                                                    {
                                                        state.select.triggerConditionsSelect.map(
                                                            (item, index) => <Option key={item.key} value={item.alarmTrigger}>{item.eventName}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )}
                                        </Col>
                                        <Col>
                                            <Button type="dashed" icon="plus" onClick={this.addCustomTigger} />
                                        </Col>
                                    </Row>
                                    
                                </Form.Item>}
                                

                                {/* 触发事件为保养时选择项 1：按周期 2：按总里程*/}
                                {state.notice.condition === 5 && <Form.Item {...formItemLayoutNoticeLabel} >
                                    {getFieldDecorator('alarmEvent', {
                                        rules: [
                                            { required: true, message: '保养选项不能为空'}
                                        ],
                                    })(
                                        <Radio.Group onChange={this.noticeAlarmEventMaintainChange}>
                                            <Radio value={1}>按周期</Radio>
                                            <Radio value={2}>按总里程</Radio>
                                        </Radio.Group>
                                    )}
                                </Form.Item>}
                            </div>}
                        </div>}

                        {/* 消息内容 */}
                        {state.notice.way === 2 && <Form.Item {...formItemLayout} label="短信模板">
                            {getFieldDecorator('name', {
                                initialValue: state.notice.name,
                                rules: [{
                                    required: true, message: '短信模板不能为空',
                                }],
                            })(
                                <Select onChange={this.noticeMmsTemplateChange.bind(this)} style={{ width: 200 }} >
                                    {
                                        state.select.mmsTemplate.map(item => <Option key={item.title} value={item.title}>{item.title}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>}

                        {/* 消息内容 */}
                        <Form.Item {...formItemLayout} label="消息内容">
                            {getFieldDecorator('message', {
                                initialValue: state.notice.message,
                                rules: [
                                    { required: true, whitespace: true, message: '消息内容不能为空或者空字符', }, 
                                    { max: 300, message: '消息内容最多300字内', }
                                ],
                            })(
                                <TextArea 
                                    style={{width:'90%'}}
                                    onChange={this.noticeMessageChange} 
                                    autosize={{ minRows: 4, maxRows: 6 }} 
                                    placeholder="例如: 探险活动" />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>

                <NoticeAddTrggerConditions
                    wrappedComponentRef={(form) => this.formTrgger = form}
                    triggerConditionMaintenance={this.props.triggerConditionMaintenance}
                    refreshSelect={this.refreshSelect}
                />
                <style>
                {`
                .ant-form-item-with-help{margin-bottom:24px;}
                `}
                </style>
            </div>
        )
    }
}

export default Form.create()(noticeAdd);