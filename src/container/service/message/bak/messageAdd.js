/* eslint-disable jsx-a11y/alt-text */
// 查看消息
// 表单巨大, 结构复杂
import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Steps, Button, Select, Radio, Checkbox, DatePicker, Upload, Icon, message} from 'antd';
import Axios from 'axios';
// import Ueditor from 'react-ueditor-wrap';
import { HttpUrl, httpConfig } from '../../../../util/httpConfig';
// import { trim } from '../../../util/util';

const Step = Steps.Step;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class messageAdd extends Component {
    state = {
        id: -1,
        uploadId: -1, // 上传窗口id
        uploadApi: `${HttpUrl}appserv/uploadFile/uploadMessageImage`,
        
        // modal 窗口使用变量
        loading: false,
        show: false,
        title: '信息发布',

        // 上传的文件列表
        bootImgFileList: [],
        adImgFileList: [],
        uploadImgChecked: false,

        // 步骤
        currentStep: 0,
        steps: [
            { title: '设置发布策略' },
            { title: '编辑内容' },
            { title: '通知推送(可选择)' }
        ],

        record: {
            topic: undefined,
            type: 1,
            pushNow: false,
            control: 1,
            
            startTime: undefined,
            endTime: undefined,
            // 第二步 链接变量
            h5Link: '',             // 链接类型活动必填，其它活动类型不用填
            message: '',            // 活动内容（图文类型活动为必填）
            description: '',

            img: [],                // 启动广告页/广告轮播图传此参数，即信息格式control为3（图片）时，此参数必填
            
            sync: false,            // 同步

            expire: 0,              // 到发布时间后才会在APP端看到,发布状态 0 待发布 1 已发布 2 发布中 3 已下线 4草稿
            action: 0,              // 暂时无用先传0

            // 上传列表数组
            bootImgFileList: [],
            adImgFileList: [],
            uploadCount: 0,
            uploadGroupId: 0,
        },        

        // 第三步
        notice: {
            title: '',
            way: 1,
            pushType: 1,            // pushType	必选	Body	String	通知类型 1：及时  2：固定
            messageDigit: 0,        // 消息位(0:系统通知;1:推荐消息;2:告警通知;3:保养提醒;4:调查问卷) 注：如果messageCenter 为2，则必选此项，为1 则不显示此项
            messageCenter: false,   // messageCenter	可选	Body	String	是否保存在消息中心（1 : 否  2： 是
            name: 1,
            differentiate: false,   // 及时消息可选	Body	String	及时通知是否立即发送（1 : 否  2： 是）如果是，则 selectTime 必选为空
            message: '',

            // 选项数据 注：如果messageCenter 为2，则必选此项，为1 则不显示此项            
            nameSelect: [],
            selectTimeId: 0,
            selectTimeCount: 1,
            selectTimeArr: [],    
        },
        select:{
            messageDigit: [
                { key: 0, value: '系统通知' },
                { key: 1, value: '推荐消息' },
                { key: 2, value: '告警通知' },
                { key: 3, value: '保养提醒' },
                { key: 4, vlaue: '调查问卷' },
            ],
            way: [
                { key: 1, value: 'App' },
                { key: 2, value: '短信' },
            ],
            // 表单预选数据
            type: [
                { key: 1, value: '系统消息' },
                { key: 2, value: '告警通知' },
                { key: 3, value: '推荐消息' },
                { key: 4, value: '问卷调查' },
                { key: 5, value: '启动页广告' },
                { key: 6, value: '轮播广告' },
                { key: 7, value: '保养提醒' },
            ],
            // 信息格式 1 图文。2 链接。3 图片
            control: [
                { key: 1, value: '图文' },
                { key: 2, value: '链接' },
            ],
        }
    }

    // 初始化
    componentDidMount() {
        // let state = this.state;
        // 拉取第三步 消息模板并赋值
        this.getMmsTemplateList()
        .then((res) => {
            // state.notice.nameSelect = res.data;
            this.setState({
                notice: Object.assign(this.state.notice, {
                    nameSelect: res.data,
                })
            });
        })
        .catch((err) => {
            message.warning(`错误:${err.message}`);
        });
        console.log(this.state.notice);
    }

    getMmsTemplateList = () => {
        return this.props.getMmsTemplateList();
    }

    // ========================
    // 表单改变方法 第一步和第二步
    // ========================
    // 改变消息标题
    messageTopicChnage = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                topic: e.target.value,
            }),
        });
    }

    // 改变图信息位
    messageTypeChange = (e) => {
        let state = this.state;        
        // 变更类型时候需要设置记录成未选择, 不然会出bug
        if (e === 5 || e === 6) {
            this.setState({
                select: Object.assign(state.select, {
                    control: [{ key: 3, value: '图片' }],
                }),
                record: Object.assign(state.record, {
                    control: 3,
                })
            });
        }
        else {
            this.setState({
                select: Object.assign(state.select, {
                    control: [
                        { key: 1, value: '图文' },
                        { key: 2, value: '链接' },
                    ],
                }),
                record: Object.assign(state.record, {
                    control: 1,
                })
            });
        }
        console.log(this.state.record)
    }

    // 信息格式变更
    messageControlChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, { control: Number(e.target.value) }),
        });
    }

    // 立即发布
    messagePushNowChange = (e) => {
        let state = this.state;
        console.log(state.record);
        this.setState({
            record: Object.assign(state.record, { pushNow: e.target.checked }),
        });
    }

    // 改变发布时间
    messagePushTimeChange = (moment, date) => {
        let state = this.state;
        this.setState({
            record: Object.assign(state.record, { 
                pushTime: date,
                pushEndTime: '',
                startTime: moment,
                endTime: '', 
            }),
        });
    }

    // 改变发布时间
    messagePushEndTimeChange = (moment, date) => {
        let state = this.state;
        this.setState({
            record: Object.assign(state.record, {
                pushTime: date[0],
                pushEndTime: date[1], 
                startTime: moment[0],
                endTime: moment[1],
            }),
        });
        console.log(state.record);
    }

    // 消息发布链接改变
    messageH5LinkChange = (e) => {
        console.log(e)
        this.setState({
            record: Object.assign(this.state.record, {
                h5Link: e.target.value,
            })
        });
    }
    
    // 消息描述改变
    messageDescriptionChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                description: e.target.value,
            })
        });
    }

    // 同步选项改变
    messageSyncChange = (e) => {
        let state = this.state;
        this.setState({
            record: Object.assign(state.record, { sync: e.target.checked }),
        });
        console.log(state.record);
    }

    // 编辑内容改变
    messageUeditorChage = (e) => {
        let state = this.state;
        this.setState({
            record: Object.assign(state.record, {message: e}),
        });
    }


    // 上传图片链接地址变更
    messageImgToLinkChange = (event, gId) => {
        console.log(event, gId);
    }

    // 增加一个上传组
    addUploadItem = (type) => {
        let state = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');
        let nextKeys = keys.concat(++state.record.uploadGroupId);
        form.setFieldsValue({
            keys: nextKeys,
        });
        state.record.uploadCount++;

        console.log('nextKeys', nextKeys, 'uploadCount', state.record.uploadCount);

        // 增加指定数组
        let arr = type === 6 
            ? state.record.adImgFileList 
            : state.record.bootImgFileList;

        arr.push([]);

        type === 6
            ? this.setState({
                record: Object.assign(state.record, {
                    adImgFileList: arr,
                })
            })
            : this.setState({
                record: Object.assign(state.record, {
                    bootImgFileList: arr,
                })
            });
        console.log(state.record);
    }

    // 删除上传组
    removeUploadItem = ({gId, type, gIndex}) => {
        let state = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');

        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter(key => key !== gId),
        });
        state.record.uploadCount--;

        // 删除指定组
        let arr = type === 6 
            ? state.record.adImgFileList 
            : state.record.bootImgFileList;

        // let _tmpArr = arr.filter((item, index) => index !== gIndex );

        type === 6
            ? this.setState({ 
                record: Object.assign(state.record, {
                    adImgFileList: arr.filter((item, index) => index !== gIndex),
                })
            })
            : this.setState({ 
                record: Object.assign(state.record, {
                    bootImgFileList: arr.filter((item, index) => index !== gIndex),
                })
            });
    }

    /**
     * 组件图片上传成功方法,
     * res 回包数据 * gId 组id * pId 图片id * type 图片类型
     */
    uploadImgSuccess = ({ res, gId, pId, type }) => {
        let Obj = {
            imgUrl: res.data,
            imgToUrl: '',
            imgType: type === 5 ? 3 : (type === 6 && pId === 0) ? 1 : 2,
            imgKey: gId,
            key: `${gId}_${pId}`,
        }

        type === 6
            ? state.record.adImgFileList[gId][pId] = Obj
            : state.record.bootImgFileList[gId][pId] = Obj;
        console.log(state.record.adImgFileList[gId]);
        type === 6
            ? this.setState({
                record: Object.assign(state.record, {
                    adImgFileList: state.record.adImgFileList,
                })
            })
            : this.setState({
                record: Object.assign(state.record, {
                    bootImgFileList: state.record.bootImgFileList,
                })
            });
        console.log(state.record);
    }
    
    // ==============================
    // 第三步 通知发布所有方法
    // ==============================
    // notic from field change
    noticeMessageCenterChange = e => {
        let state = this.state;
        state.notice.messageCenter = e.target.checked;
        this.setState({
            notice: Object.assign(state.notice, {
                messageCenter: state.notice.messageCenter
            })
        });
    }

    noticeWayChange = value => {
        let state = this.state;
        state.notice.way = value;
        this.setState({
            way: Object.assign(state.notice, {
                way: state.notice.way,
            })
        });
    }

    //
    noticeDifferentiateChange = e => {
        let state = this.state;
        state.notice.differentiate = e.target.checked;
        this.setState({
            differentiate: Object.assign(state.notice, {
                differentiate: state.notice.differentiate,
            })
        });
    }

    // 选择时间
    noticeSelectTimeCahnge = (value, date, gId) => {
        state.notice.selectTimeArr[gId] = date;
    }

    // 短信模板变更方法
    noticeNameSelectChange = (title) => {
        let state = this.state;
        state.notice.nameSelect.forEach((item) => {
            if(item.title === title) {
                this.setState({
                    notice: Object.assign(state.notice, {
                        name: title,
                        message: item.content,
                    })
                })
            }
        });
    }

    addNoticeSelectTimeItem = () => {
        let state = this.state;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(++state.notice.selectTimeId);
        form.setFieldsValue({
            keys: nextKeys,
        });
        state.notice.selectTimeCount++;
    }

    removeNoticeSelectTimeItem = (k, index) => {
        let state = this.state;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        state.notice.selectTimeCount--;
        state.notice.selectTimeArr.splice(index,1);
    }

    // 请求方式： POST 接口路径：http://42.159.92.113/api/appserv/push/addPush
    publishNotice = (options) => {
        let data = options || {};
        let params = Object.assign({}, data);
        return new Promise((resolve, reject) => {
            Axios.post(HttpUrl + 'appserv/push/addPush', { ...params }, httpConfig)
                .then((res) => {
                    if (res.data.code === '100000') {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                });
        });
    }

    saveNotice = () => {
        let state = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    pushType: 1,
                    different: 0,
                    way: state.notice.way,
                    title: values.title,
                    messageCenter: state.notice.messageCenter ? 2 : 1,
                    differentiate: state.notice.differentiate ? 2 : 1,
                    selectTime: state.notice.selectTimeArr.join(';'),
                    name: state.notice.name,
                    message: values.message,
                };
                this.publishNotice(params)
                .then((res) => {
                    this.setState({
                        show: false,
                    });
                })
                .catch((err) => {
                    message.warning(err.message)
                });
            }
        });
    }
    
    // ========================
    // step button
    // ========================
    // 取消 也需要提交代码
    cancel = () => {
        this.setState({ show: false });
    }

    // 下一步
    next = (step) => {
        this.setState({ currentStep: this.state.currentStep + 1 });
    }
    
    // 上一步
    prev = () => {
        this.setState({ currentStep: this.state.currentStep - 1 });
    }
    
    // 第一步
    checkStepOne = () => {
        let state = this.state;
        let fields = state.record.pushNow ? ['topic', 'type', 'control', 'pushTime'] : ['topic', 'type', 'control', 'pushEndTime'];
        this.props.form.validateFields(fields, (err, value) => {
            if (!err) {
                this.setState({ 
                    currentStep: this.state.currentStep + 1,
                    record: Object.assign(state.record, {
                        topic: trim(value.topic),
                    }),
                });
                console.log(state.record);
            }
        });
    } 

    // 检查第二步
    checkStepTwo = () => {
        let state = this.state;
        let fields = ['h5Link'];
        switch (state.record.control) {
            case 1:
                if (state.record.message === '' || state.record.message === null) {
                    return message.warning('图文内容不能为空');
                }
                break;
            case 2:
                fields = ['h5Link'];
                break;
            case 3:
                break;
            default:
                break;
        }
        // console.log(fields);
        this.props.form.validateFields(fields, (err, value) => {
            console.log(fields, value);
            if (!err) {
                this.setState({ currentStep: this.state.currentStep + 1 });
            }
        });
    }


    // 保存记录
    saveMessageRecord = () => {
        let state = this.state;
        let fields = ['h5Link'];
        let { getFieldValue } = this.props.form;
        switch (state.record.control) {
            case 1:
                if(state.record.message === '' || state.record.message === null){
                    return message.warning('图文内容不能为空');
                }
                break;
            case 2:
                fields = ['h5Link'];                
                break;
            case 3:
                let keys = getFieldValue('keys');
                fields = keys.map(key => `imgToUrl_${key}`);
                break;
            default:
                break;
        }
        // console.log(fields);
        this.props.form.validateFields(fields, (err, value) => {
            if (!err) {
                if (state.record.control === 3) {
                    let img = [];
                    let arr = state.record.type === 6 ? state.adImgFileList : state.bootImgFileList;
                    // 整合一下数据
                    fields.forEach((item, index) => { 
                        let groupId = item.split('_')[1] * 1;
                        arr.forEach((item, index) => {
                            if (state.record.type === 6 && item.length === 2 ) {
                                item[0] !== undefined && item[0] !== null && img.push(item[0]);
                                item[1] !== undefined && item[1] !== null && img.push(item[1]);
                            }
                            else if (state.record.type === 5 && item.length === 1 ) {
                                item[0] !== undefined && item[0] !== null && img.push(item[0]);
                            }
                            else {
                                return message.warning('请检查是否有图片没有上传!')
                            }
                        });
                    });
                    img = Array.from(new Set(img)); // 去重 
                    this.setState({
                        record: Object.assign(state.record, {
                            img: img,
                        }),
                    });
                }
                this.publish({
                    ...state.record,
                })
                .then((res) => {
                    this.setState({
                        show: false,
                    });
                })
                .catch((err) => {
                    message.warning(err.message);
                });
            }
        });
        
    }

    // 整合字段和上传列表
    mergeImgList = (value, uploadList) => {
        let imgList = [];
        let state = this.state;
        let _value = Object.entries(value);
        uploadList.map((item, uindex) => {
            _value.map((vItem, vindex) => {
                if (`imgToUrl${item.groupId}` === vItem[0]) {
                    console.log('imgToUrl:', state);
                    imgList.push({
                        imgUrl: item.response.data,
                        imgToUrl: vItem[1],
                        ImgKey: item.groupId,
                        imgUploadComponentId: item.uploadId,
                        imgUploadGroupId: item.groupId,
                        imgType: state.record.type === 5 && item.uploadId === 0 ? 3 : state.record.type === 6 && item.uploadId === 0 ? 1: 2,
                    });
                }
            });
        });
        return imgList;
    }

    // 显示弹出窗口
    // 调试的时候只需要变更currentStep,record下的type和control的值就可跳转到相应页面
    // currentStep 步骤条第几步
    // type 信息位
    // control 信息格式
    showModal = () => {
        let state = this.state;
        this.setState({
            show: true,
            currentStep: 1, // 重置步骤
            
            // record: {}, // 清空记录
            record: Object.assign(state.record, {
                topic: '',
                type: 5,
                pushNow: false,
                control: 3,

                startTime: null,
                endTime: null,

                img:[],

                // 同步
                sync: false,
                expire: 0, // 到发布时间后才会在APP端看到,发布状态 0 待发布 1 已发布 2 发布中 3 已下线 4草稿
                action: 0, // 暂时无用先传0
            }),
            fileList: [],
        });
    }

    showPriview = (type) => {
        let state = this.state;
    }

    /**
     * 组件图片上传成功方法,
     * res 回包数据
     * gId 组id
     * pId 图片id
     * type 图片类型
     */
    uploadImgSuccess = ({res, gId, pId, type}) => {
        let state = this.state;
        let Obj = {
            imgUrl: res.data,
            imgToUrl: '',
            imgType: type === 5 ? 3 : (type === 6 && pId === 0) ? 1 : 2,
            imgKey: gId,
            key: `${gId}_${pId}`,
        }
        console.log(state.record.bootImgFileList);
        type === 6
            ? state.record.adImgFileList[gId] = [Obj]
            : state.record.bootImgFileList[gId] = [Obj];
        type === 6
            ? this.setState({ 
                record: Object.assign(state.record, {
                    adImgFileList: state.record.adImgFileList
                })
            })
            : this.setState({
                record: Object.assign(state.record, {
                    bootImgFileList: state.record.bootImgFileList
                })
            });
        console.log(state.record);
    }

    // 检测上传文件
    checkUploadImgFile = ({ file, gId, pId, type }) => {
        let ExtName = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
        if (ExtName === '.jpg' || ExtName === '.jpeg' || ExtName === '.png' || ExtName === '.gif') {
            new Promise(resolve => {
                var reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onload = function (e) {
                    var base64 = e.target.result
                    var img = new Image();
                    img.src = base64
                    img.onload = function () {
                        resolve({ 
                            width: img.width, 
                            height: img.height,
                        })
                    };
                };
            })
            .then(img => {
                // 暂时注解
                if(type === 6 && pId === 0) {
                    if (img.width > 1242 || img.height > 2208) {
                        this.setState({ uploadImgChecked: false });
                        message.warning(`文件尺寸超出范围(1242x2208)`);
                    }
                } 
                else if(type === 6 && pId === 1) {
                    if (img.width > 1242 || img.height > 2688) {
                        this.setState({ uploadImgChecked: false });
                        message.warning('文件尺寸超出范围(1242x2688)');
                    }
                }
                else if(type === 5) {
                    if (img.width > 375 || img.height > 150) {
                        this.setState({ uploadImgChecked: false });
                        message.warning('文件尺寸超出范围(375x150)');
                    }
                } else {
                    // 上传文件又要拆方法
                    this.setState({ uploadImgChecked: true });
                }
            });
        } else {
            message.warning('文件格式有误');
        }
    }
    // 变更链接地址(evnet事件, gid组id)
    changeImgToLink = (event, gId) => {
        let state = this.state;
        console.log(event, gId);
    }
    // ===============

    // 11.1创建活动接口
    // 请求方式:POST;接口路径:http://42.159.92.113/api/appserv/app/message/addMessage
    publish = (options) => {
        let data = options || {};
        let params = Object.assign({}, data);
        return new Promise((resolve, reject) => {
            this.setState({ loading: true });
            Axios.post(HttpUrl + 'appserv/app/message/addMessage', { ...params }, httpConfig)
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

    // 页面
    render() {
        const state = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        const formItemLayoutWithOutLabel = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24, },
                sm: { span: 20, },
            },
        };
        const formItemLayoutUploadLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const formItemLayoutNoticeLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 6 },
            },
        };

        // modal页脚stepsActions, 简单点不要太复杂了
        const stepOneButton = [            
            <Button key="cancel" onClick={this.cancel} >取消</Button>,
            <Button key="next" type="primary" onClick={this.checkStepOne} >下一步</Button>,
        ];
        const stepTwoButton = [
            <Button key="prev" type="primary" onClick={this.prev}>上一步</Button>,
            <Button key="next" type="primary" loading={state.loading} onClick={state.record.sync ? this.checkStepTwo : this.saveMessageRecord } >
                {state.record.sync ? '下一步' : '保存'}
            </Button>,
            <Button key="priview" type="primary" onClick={() => { this.showPriview(state.record.type)}}>预览</Button>,
        ];
        const stepThreeButton = [
            <Button key="prev" type="primary" onClick={this.prev} >上一步</Button>,
            <Button key="save" type="primary" onClick={this.saveNotice}>保存</Button>,
        ];

        const urlRegExp = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
        // http://fex.baidu.com/ueditor/#start-toolbar
        const editorConfig = {
            toolbars: [
                [
                    'fontfamily', //字体
                    'fontsize', //字号                    
                    'bold',
                    'italic',
                    'underline',
                    '|',
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    '|',
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    'link', //超链接
                    'simpleupload', //单图上传
                    'insertimage', //多图上传
                    '|',
                    'insertunorderedlist', //无序列表
                    '|',                    
                    'fullscreen',
                ],                
            ],
            autoHeightEnabled: false, //是否自动长高，
            autoClearinitialContent: false, // 是否删除空的inlineElement节点（包括嵌套的情况）
            autoFloatEnabled: true,
            focus: false,
            initialFrameWidth: '100%', // 初始化编辑器宽度
            initialFrameHeight: 300,
            maximumWords: 10000,
            serverUrl: state.uploadApi, // 服务器统一请求接口路径,需要和后台一起配置
            // ueditorUrl: '', // 设置ueditor(百度编辑器)js文件的地址
            // ueditorConfigUrl: '', // 设置百度编辑器默认config文件地址
        };
        
        // =================
        // 上传图片
        // =================
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        // {/* 上传组件, 轮播图显示一个, 启动页显示两个 */ }
        // 需要传一个key值到上传组件里, 数据需要        
        const uploadItem = (key) => (
            <Form.Item {...formItemLayoutUploadLabel}>
            <Row gutter={16}>
                {state.record.type === 5 && <Col className="gutter-row" span={6}>
                    <Upload
                        accept=".jpg,.jpeg,.png,.gif"
                        fileList={false}
                        listType="picture-card"
                        // beforeUpload={(file) => this.checkUploadImgFile({ file: file, gId: key, pId: 0, type: state.record.type })}
                        onSuccess={(e) => this.uploadImgSuccess({ res: e, gId: key, pId: 0, type: state.record.type })}
                        action={state.uploadApi}>
                        {
                            state.bootImgFileList[key] && state.bootImgFileList[key][0] 
                            ? <img src={state.bootImgFileList[key][0] && state.bootImgFileList[key][0].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                            : <Icon type="plus" />
                        }
                    </Upload>
                    <p>375*150</p>
                </Col>}
                {/* 如果是首页图多加一个上传组件 */}
                {state.record.type === 6 && <Col className="gutter-row" span={6}>                    
                    <div>
                        <Upload
                            accept=".jpg,.jpeg,.png,.gif"                            
                            fileList={false}
                            listType="picture-card"
                            // beforeUpload={(file) => this.checkUploadImgFile({file: file, gId: key, pId: 0, type: state.record.type}) }
                            onSuccess={(e) => this.uploadImgSuccess({ res: e, gId: key, pId: 0, type: state.record.type })}
                            action={state.uploadApi}>
                            {
                                state.adImgFileList[key] && state.adImgFileList[key][0]
                                ? <img src={state.adImgFileList[key][0] && state.adImgFileList[key][0].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                                : <Icon type="plus" />
                            }
                        </Upload>
                        <p>2688x1242</p>
                    </div>
                </Col>}
                {state.record.type === 6 && <Col className="gutter-row" span={6}>
                    <div>
                        <Upload
                            accept=".jpg,.jpeg,.png,.gif"
                            fileList={false}
                            listType="picture-card"
                            // beforeUpload={(file) => this.checkUploadImgFile({ file: file, gId: key, pId: 1, type: state.record.type })}
                            onSuccess={(e) => { this.uploadImgSuccess({ res: e, gId: key, pId: 1, type: state.record.type })}}
                            action={state.uploadApi}>
                            {
                                state.adImgFileList[key] &&state.adImgFileList[key][1]
                                ? <img src={state.adImgFileList[key][1] && state.adImgFileList[key][1].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                                : <Icon type="plus" />
                            }
                        </Upload>
                        <p>1242×2208</p>
                    </div>
                </Col>}
            </Row>
            </Form.Item>
        );

        // 此处要做个判断如果步骤为2的才渲染,不然会和第三步的增加的冲
        const formItems = keys.map((gId, index) => (
            <div key={index}>
            <Form.Item
                {...formItemLayoutWithOutLabel}
                label={`${index + 1}、链接地址`}
                required={false}
                key={gId} >
                    {getFieldDecorator(`imgToUrl_${gId}`, {
                    rules: [
                        { required: true, message: "链接地址不能为空", }, 
                        { pattern: urlRegExp, message: '链接格式不正确', },
                    ],
                })(
                    <Input 
                        onChange={(e) => { this.messageImgToLinkChange(e, gId) }} 
                        placeholder="图片跳转链接" 
                        style={{ width: '90%', marginRight: 12 }} 
                    />
                    )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button" type="minus-circle-o"
                        style={{fontSize: '20px', verticalAlign: 'middle'}}
                        disabled={keys.length === 1}
                        onClick={() => this.removeUploadItem({gId:gId, type:state.record.type, gIndex:index})}
                    />
                ) : null}                
            </Form.Item>
            {/* 上传组件 */ }
            {uploadItem(gId)}
            </div>
        ));

        // 第三步 时间选择
        const formTimeItems = keys.map((k, index) => (
            // 此处要做个判断如果步骤为3的才渲染,不然会和第二步的增加的冲
            state.currentStep === 2 &&
            <Form.Item {...formItemLayoutNoticeLabel} required={false} key={k} >
                <Row gutter={16}>
                    <Col span={12} >
                        {getFieldDecorator(`selectTime_${k}`, {
                            rules: [{ required: true, message: "选择推送时间", }],
                        })(
                            <DatePicker showTime onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, index+1)} format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </Col>
                    <Col span={12} >
                        <Button type="dashed" icon="minus" onClick={() => this.removeNoticeSelectTimeItem(k, index+1) }/>
                    </Col>
                </Row>
            </Form.Item>
        ));
        
        return (            
            <div className="content" >                
                <Modal
                    width={640}
                    onCancel={this.cancel} 
                    onOk={this.ok} 
                    okButtonProps={{ loading: state.loading }} 
                    title={`${state.title}`}
                    footer={state.currentStep === 0 ? stepOneButton : state.currentStep === 1 ? stepTwoButton : stepThreeButton}
                    visible={state.show} 
                    destroyOnClose 
                >
                    {/* 步骤条 */}
                    <Steps current={state.currentStep} size={'small'}>
                        {state.steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <Form className="steps-content">
                        {/* =============第一步============= */}
                        { state.currentStep === 0 && <div className="minan-steps">
                                {/* 标题 */}
                                <Form.Item {...formItemLayout} label="标题">
                                    {getFieldDecorator('topic', {
                                        initialValue: state.record.topic,
                                        rules: [{
                                            required: true, 
                                            whitespace: true, 
                                            message: '标题不能为空',
                                        },{
                                            max: 30, 
                                            message: '输入名称不能大于30字符',
                                        }],
                                    })(
                                        <Input
                                            className="man-width90"
                                            onChange={this.messageTopicChnage}
                                            placeholder="例如: 探险活动" 
                                        />
                                    )}
                                </Form.Item>

                                {/* 信息位 */}
                                <Form.Item {...formItemLayout} label="信息位">
                                    {getFieldDecorator('type', {
                                        initialValue: state.record.type,
                                        rules: [{
                                            required: true, 
                                            message: '信息位不能为空',
                                        }],
                                    })(
                                        <Select
                                            style={{ width: 200 }}
                                            onChange={this.messageTypeChange}
                                            placeholder="选择你需要的信息位" >
                                            {
                                                state.select.type.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                                            }
                                        </Select>
                                    )}
                                </Form.Item>

                                {/* 信息格式 */}
                                <Form.Item {...formItemLayout} label="信息格式" defaultValue={this.state.record.control}>
                                    {getFieldDecorator('control', {
                                        initialValue: state.record.control,
                                        rules: [{
                                            required: true, 
                                            message: '信息格式不能为空',
                                        }],
                                    })(
                                        <Radio.Group onChange={this.messageControlChange}>
                                            {
                                                state.select.control.map(item => <Radio key={item.key} value={item.key}>{item.value}</Radio>)
                                            }
                                        </Radio.Group>
                                    )}
                                </Form.Item>

                                {/* 发布时间 */}
                                <Form.Item {...formItemLayout} label="发布时间">
                                    {getFieldDecorator('pushNow', {
                                        // initialValue: state.record.publishNow,
                                        rules: [{
                                            required: false, 
                                            message: '立即发布',
                                        }],
                                    })(
                                        <Checkbox 
                                            checked={state.record.pushNow} 
                                            onChange={this.messagePushNowChange}>
                                            立即发布
                                        </Checkbox>
                                    )}
                                </Form.Item>

                                {/* 选择时间 */}
                                { state.record.pushNow 
                                ?
                                <Form.Item {...formItemLayout} label="选择时间">
                                    {getFieldDecorator('pushTime', {
                                        initialValue: state.record.startTime,
                                        rules: [{
                                            required: true, 
                                            message: '发布时间不能为空',
                                        }],
                                    })(
                                        <DatePicker 
                                            showTime
                                            onChange={this.messagePushTimeChange}
                                            format="YYYY-MM-DD HH:mm" 
                                        />
                                    )}
                                </Form.Item> 
                                :
                                <Form.Item {...formItemLayout} label="选择时间">
                                    {getFieldDecorator('pushEndTime', {
                                        // initialValue: [state.record.startTime, state.record.endTime], // 添加初始值后不报提示, 最好不加
                                        rules: [{
                                            required: true, 
                                            message: '发布时间不能为空',
                                        }],
                                    })(
                                        <RangePicker
                                            showTime
                                            format="YYYY-MM-DD HH:mm"                                            
                                            placeholder={['开始时间', '结束时间']}                                            
                                            onChange={this.messagePushEndTimeChange}
                                        />
                                    )}
                                </Form.Item>
                                }
                            </div>
                        }
                        {/* =============第二步============= */}
                        {state.currentStep === 1 && <div className="minan-steps">
                            {/* 富文本编辑器 */}
                            {state.record.control === 1 && <div className="steps-box">      
                                <div>                                    
                                    {/* <Ueditor
                                        editorConfig={editorConfig}
                                        onChange={this.messageUeditorChage}
                                        id="content" 
                                        height="200"
                                        ref="ueditor"
                                    /> */}
                                </div>
                            </div> }

                            {/* 消息链接 */}
                            { state.record.control === 2 && <div className="steps-box">
                                {/* 链接 */}
                                <Form.Item {...formItemLayout} label="链接">
                                    {getFieldDecorator('h5Link', {
                                        rules: [
                                            { required: true, message: '链接不能为空', },
                                            { message: '链接格式不正确', pattern: urlRegExp, }
                                        ],
                                    })(
                                        <Input onChange={this.messageH5LinkChange} className="man-width90" placeholder="例如: 探险活动" />
                                    )}
                                </Form.Item>
                                {/* 信息介绍 */}
                                <Form.Item {...formItemLayout} label="信息介绍">
                                    {getFieldDecorator('description', {
                                        rules: [{
                                            required: false, message: '信息介绍不能为空',
                                        }],
                                    })(
                                        <TextArea
                                            className="man-width90"
                                            onChange={this.messageDescriptionChange}
                                            autosize={ {minRows:4, maxRows: 6} } 
                                            placeholder="信息介绍" 
                                        />
                                    )}
                                </Form.Item>
                            </div>}

                            {/* 是否同步添加消息通知 */}
                            {state.record.control !== 3 && <div className="minan-steps">
                                {/* 发布时间 */ }
                                < Form.Item {...formItemLayout} label="同步">
                                    {getFieldDecorator('sync', {
                                    // initialValue: state.record.publishNow,
                                    rules: [{
                                        required: false, message: '是否同步添加消息通知',
                                    }],
                                })(
                                    <Checkbox
                                        checked={state.record.sync}
                                        onChange={this.messageSyncChange}>
                                        是否同步添加消息通知
                                    </Checkbox>
                                )}
                                </Form.Item>
                            </div>}

                            {/* 图片上传预览 */}
                            {/* https://ant.design/components/form-cn/#components-form-demo-dynamic-form-item */}
                            {state.record.control === 3 && <div className="steps-box step-upload-list">
                                <section style={{ height:'300px', overflowY:'auto', border: '1px solid #eee', marginBottom: '24px', padding: '10px'}}>
                                    {state.currentStep === 1 && formItems}
                                </section>
                                <Form.Item>
                                    {/* // 失效属按长度来算 */}
                                    {`已上传${state.record.uploadCount}组图片，最多10组`}
                                    <Button
                                        disabled={state.record.uploadCount >= 10}
                                        onClick={ () => {this.addUploadItem(state.record.type)}} 
                                        style={{ marginLeft: '20px' }} >
                                        添加文件
                                    </Button>
                                </Form.Item>
                            </div>}

                            {/* 视频上传,暂时不做,预留 */}
                            {state.record.control === 4 &&
                                <div className="">视频上传,暂时不做,预留</div>
                            }
                            </div>
                        }

                        {/* =============第三步============= */}
                        { state.currentStep === 2 && <div className="minan-steps" style={{height: '400px', overflowY: 'auto', overflowX:'hidden'}}>
                            {/* 标题 */}
                            <Form.Item {...formItemLayout} label="通知类型">
                                <span>及时消息</span>
                            </Form.Item>

                            {/* 推送渠道 */}
                            <Form.Item {...formItemLayout} label="推送渠道">
                                {getFieldDecorator('type', {
                                    initialValue: state.notice.way,
                                    rules: [{
                                        required: true, message: '推送渠道不能为空',
                                    }],
                                })(
                                    <Select onChange={this.noticeWayChange} style={{ width: 200 }} placeholder="选择你需要的推送渠道">
                                        {
                                            state.select.way.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                                        }
                                    </Select>
                                )}
                            </Form.Item>

                            {/* 消息标题 */}
                            <Form.Item {...formItemLayout} label="消息标题">
                                {getFieldDecorator('title', {
                                    rules: [{
                                        required: true, whitespace: true, message: '消息标题不能为空',
                                    }],
                                })(
                                    <Input className="man-width90" placeholder="例如: 探险活动" />
                                )}
                            </Form.Item>

                            {/* 保存 */}
                            <Form.Item {...formItemLayout} label="保存">
                                {getFieldDecorator('messageCenter', {
                                    rules: [{
                                        required: false, message: '是否保存在消息中心不能为空',
                                    }],
                                })(
                                    <Checkbox
                                        checked={state.notice.messageCenter}
                                        onChange={this.noticeMessageCenterChange}
                                    >
                                        是否保存在消息中心
                                    </Checkbox>
                                )}
                            </Form.Item>

                            {/* 消息位 */}
                            {state.notice.messageCenter &&<div>
                                <Form.Item {...formItemLayout} label="消息位">
                                    {getFieldDecorator('messageDigit', {
                                        initialValue: state.notice.way,
                                        rules: [{
                                            required: true, message: '消息位不能为空',
                                        }],
                                    })(
                                        <Select style={{ width: 200 }} >
                                            {
                                                state.select.messageDigit.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </div>}

                            {/* 推送时间 */}
                            <Form.Item {...formItemLayout} label="推送时间">
                                {getFieldDecorator('noticePushNow')(
                                    <Checkbox
                                        checked={state.notice.differentiate}
                                        onChange={this.noticeDifferentiateChange} >
                                        立即发送
                                    </Checkbox>
                                )}
                            </Form.Item>

                            {/* 选择推送时间 */}
                            <Form.Item {...formItemLayoutNoticeLabel}>
                                <Row gutter={16}>
                                    <Col span={12} >
                                        {getFieldDecorator('selectTime_0', {
                                            rules: [{
                                                required: true, message: '推送时间不能为空',
                                            }],
                                        })(
                                            <DatePicker onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, 0)} showTime format="YYYY-MM-DD HH:mm:ss" />
                                        )}
                                    </Col>
                                    <Col span={12} >
                                        <Button type="dashed" icon="plus" onClick={this.addNoticeSelectTimeItem} disabled={state.notice.selectTimeCount===5} />
                                    </Col>
                                </Row>
                            </Form.Item>

                            {formTimeItems}

                            {/* 消息模板 */}
                            { state.notice.way === 2 && <div>                            
                            < Form.Item {...formItemLayout} label="消息模板" >
                                {getFieldDecorator('name', {
                                    rules: [{
                                        required: true, whitespace:true, message: '消息标题不能为空',
                                    }],
                                })(
                                    <Select
                                        className="man-width90"
                                        onChange={this.noticeNameSelectChange}>
                                        {
                                            state.select.name.map((item, index) => <Option key={index} value={item.title}  >{item.title}</Option>)
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            </div>}                            

                            {/* 消息内容 */}
                            <Form.Item {...formItemLayout} label="消息内容">
                                {getFieldDecorator('message', {
                                    initialValue: state.notice.message,
                                    rules: [{
                                        required: true, whitespace: true, message: '消息内容不能为空',
                                    }, {
                                        max: 50, min: 10, message: '短信内容最少10个字, 最多50字',
                                    }],
                                })(
                                    <TextArea
                                        className="man-width90"
                                        autosize={{ minRows: 4, maxRows: 6 }}
                                        placeholder="例如: 探险活动"
                                    />
                                )}
                            </Form.Item>
                        </div>}
                    </Form>
                </Modal>                

                {/* fix bug ueditor本身有bug, 切换页面的时候会多一个textarea,隐藏 */}
                {/* textarea#undefined{display:none;} */}
                <style>
                {`
                .man-width90{width:90%}
                .ant-form-item-with-help{margin-bottom:24px;}
                .minan-steps{padding-top:24px;}
                textarea#undefined{display:none;}
                .uploadPreview:hover{}
                `}
                </style>
            </div>
        );
    }
};

export default Form.create()(messageAdd);