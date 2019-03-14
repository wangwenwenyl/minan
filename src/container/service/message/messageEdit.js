/* eslint-disable jsx-a11y/alt-text */
// 查看消息
// 表单巨大, 结构复杂
import React, { Component } from 'react';
import { Row, Col, Modal, Form, Input, Steps, Button, Select, Radio, Checkbox, DatePicker, Upload, Icon, message } from 'antd';
import moment from 'moment';
import { HttpUrl, httpConfig } from '../../../util/httpConfig';
import WEditor from './WEditor';
import {validatorRoleName,validatorNewsName} from './../../../util/validator'
import MessagePreview from './messagePreview';

let Step = Steps.Step;
let Option = Select.Option;
let { TextArea } = Input;
let { RangePicker } = DatePicker;

let token = sessionStorage.getItem('token');
let uploadApi = `${HttpUrl}appserv/uploadFile/uploadMessageImage`;
let type = 'add'; // 全局变量, 判断窗口类型, 渲染的时候用的

class messageEdit extends Component {
    state = {
        modal: {
            show: false,
            title: '添加新消息记录',
            type: 'add',
            loading: false,
            keys: [],
        },
        // 消息字段, 不能为命为message 和antd的message重了
        news: { },

        // 第三步添加通知
        notice: {
            title: '',
            way: 1,
            mmsType: '',
            pushType: 1,            // 通知类型         必选	Body	String	通知类型 1：及时  2：固定
            messageDigit: 0,        // 消息位(0:系统通知;1:推荐消息;2:告警通知;3:保养提醒;4:调查问卷) 注：如果messageCenter 为2，则必选此项，为1 则不显示此项
            messageCenter: false,   // 消息中心         可选	Body	String	是否保存在消息中心（1 : 否  2： 是
            name: 1,                // 短信模板名
            differentiate: 0,       // 及时消息         可选	Body	String	及时通知是否立即发送（1 : 否  2： 是）如果是，则 selectTime 必选为空
            message: '',            // 消息内容

            // 选项数据 注：如果messageCenter 为2，则必选此项，为1 则不显示此项            
            selectTimeId: 0,
            selectTimeCount: 1,
            selectTimeArr: [],    
        },

        // 表单选项
        select: {
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
                { key: 5, value: '轮播广告' },
                { key: 6, value: '启动页广告' },
                { key: 7, value: '保养提醒' },
            ],
            // 信息格式 1 图文。2 链接。3 图片
            control: [
                { key: 1, value: '图文' },
                { key: 2, value: '链接' },
            ],
            // 短信模板
            name: [],
        },

        // 步骤
        steps: {
            current: 2, // 0, 1, 2
            label: [
                { title: '设置发布策略' },
                { title: '编辑内容' },
                { title: '通知推送(可选择)' }
            ],
        },
    }

    componentDidMount() {
        // let { notice } = this.state;
        this.getMmsTemplateList();
    }

    // =====================
    // 父级方法
    getMmsTemplateList = () => {
        let { select } = this.state;
        this.props.getMmsTemplateList()
        .then((res) => {            
            this.setState({
                select: Object.assign(select, {
                    name: this.props.setVid(res.data),
                }),
            });
        })
        .catch((err) => {
            message.warning('获取短信模板失败');
        });
    }

    // 添加通知
    addNotice = (record) => {
        let { modal } = this.state;
        this.setState({ modal: Object.assign(modal, { loading: true }) });
        this.props.addNotice(record)
            .then((res) => {
                message.success('编辑成功');
                this.setState({
                    modal: Object.assign(modal, {
                        loading: false,
                        show: false,
                    })
                });
            })
            .catch((err) => {
                this.setState({ modal: Object.assign(modal, { loading: false }) });
                message.warning(err.message);
            })
    }

    // 添加消息
    addMessage = (record) => {
        let { modal } = this.state;
        this.setState({ modal: Object.assign({ loading: true }) });
        console.log(record)
        this.props.addMessage(record)
            .then((res) => {
                message.success('添加成功');
                this.setState({
                    modal: Object.assign(modal, {
                        loading: false,
                        show: false,
                    })
                });
                this.props.refresh();
            })
            .catch((err) => {
                message.warning(err.message);
            })
    }

    // 升级消息
    updateMessage = (record) => {
        let { modal } = this.state;
        this.setState({ modal: Object.assign({ loading: true }) });
        this.props.updateMessage(record)
            .then((res) => {
                message.success('添加成功');
                this.setState({
                    modal: Object.assign(modal, {
                        loading: false,
                        show: false,
                    })
                });
                this.props.refresh();
            })
            .catch((err) => {
                message.warning(err.message);
            })
    }

    // 方法 
    // 调试时候
    // 改变下面 steps: Object.assign(steps,{current: 2}) 改变current的值显示第几步
    // 改变defaultRecord中的type和control为显示不同的页面
    showModal = (option) => {
        let { modal, news, steps, notice, select } = this.state;
        
        let defaultRecord = {       // 消息模板
            topic: '',              // 标题
            type: 1,                // 1系统消息, 2告警通知 ,3 推荐消息 ,4 问卷调查, 5 启动页广告，6轮播广告,7保养提醒
            pushNow: false,
            control: '',             // 信息格式 1 图文。2 链接。3 图片
            pushTime: '',           // 发布时间
            pushTimeMemont: '',            
            pushEndTime: '',        // 发布结束时间
            pushEndTimeMemont: '',
            // 第二步 链接变量
            h5Link: '',             // 链接类型活动必填，其它活动类型不用填
            message: '',            // 活动内容
            description: '',        // 消息描述
            img: [],                // 启动广告页/广告轮播图传此参数，即信息格式control为3
            sync: false,            // 同步

            expire: 0,              // 到发布时间后才会在APP端看到,发布状态 0 待发布 1 已发布 2 发布中 3 已下线 4草稿
            action: 0,              // 暂时无用先传0

            // 上传列表数组
            bootImgFileList: [],
            adImgFileList: [],
            uploadGroupCount: 0,
            uploadGroupId: 0,
        };
        // 如果是编辑
        if (option.type === 'edit') {
            option.record = this.rebuildUploadImg(option.record);
            type = 'edit';
        } else {
            type = 'add';
        }

        this.setState({
            modal: Object.assign(modal, {
                type: option.type,
                show: true,
                title: option.type === 'add' ? '添加消息记录' : '编辑消息记录',
                keys: option.type === 'add' ? [] : option.record.keys,
            }),
            news: option.type === 'add' 
                ? Object.assign(news, defaultRecord) 
                : Object.assign(news, defaultRecord, option.record), // 消息模板中有一些逻辑参数需要在编辑的时候加入编辑记录
            steps: Object.assign(steps, { current: 0 }),
            notice: option.type === 'add'
                ? Object.assign(notice, {})
                : Object.assign(notice, { title: option.record.topic }),
            // 编辑的时候, 信息格式随信息位变化
            select: type === 'edit' && (option.record.type === 6 || option.record.type === 5)
                ? Object.assign(select, { control: [{ key: 3, value: '图片' }] })
                : Object.assign(select, { control: [{ key: 1, value: '图文' }, { key: 2, value: '链接' }] }),
        });
    }
    
    /**
     * 编辑的时候把img数组分配到数据中
     */
    rebuildUploadImg = (record) => {
        let { news } = this.state;
        // 重新排序
        function ascend(val1, val2){
            return val1.imgKey - val2.imgKey;
        }
        record.img = record.img.sort(ascend);
        let arr = [];
        let _temp = []; // 记录已经存在的数组
        record.img.map((item) => {
            if (_temp.indexOf(item.imgKey) < 0) {
                _temp.push(item.imgKey);
                let key = item.imgKey;
                let gArr = record.img.filter((item) => item.imgKey === key );
                arr.push(gArr);
            }
        });
        record.type === 6 ? record.adImgFileList = arr : record.bootImgFileList = arr;
        // record.keys = _temp;
        // record.uploadGroupCount = _temp.length;
        // record.uploadGroupId = _temp.length;
        return record;
    }

    // =========================
    // 表单字段处理 第一步第二步 消息
    // =========================
    newsTopicChnage = (e) => {
        let { news, notice } = this.state;
        this.setState({
            news: Object.assign(news, { topic: e.target.value.trim() }),
            notice: Object.assign(notice, { title: e.target.value.trim() }),
        });
    }

    // 改变消息类型的方法, 选择广告和轮播图时候 消息的control为3 否则为1
    newsTypeChange = (type) => {
        console.log(type)
        console.log(1)
        let { news, select } = this.state;
        if (type === 5 || type === 6) {
            this.setState({
                select: Object.assign(select, {
                    control: [{ key: 3, value: '图片' }],
                }),
                news: Object.assign(news, {
                    control: 3,
                    type: type, // 这句不能少, 不然bug
                }),
            });
        } else {
            this.setState({
                select: Object.assign(select, {
                    control: [
                        { key: 1, value: '图文' },
                        { key: 2, value: '链接' },
                    ],
                }),
                news: Object.assign(news, {
                    control: 1,
                    type: type,
                }),
            });
        }
    }

    newsControlChange = (e) => {
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, { 
                control: e.target.value,
            })
        });
    }

    newsPushNowChange = (e) => {
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, {
                pushNow: e.target.checked,
            }),
        });
    }

    // pushTime: '',           // 发布时间
    newsPushTimeChange = (memont, date) => {
        console.log(date)
        let { news } = this.state;
        news.pushNow 
            ? this.setState({
                news: Object.assign(news, {
                    pushTime: date,
                })
            })
            : this.setState({
                news: Object.assign(news, { 
                    pushTime: date[0],
                    pushEndTime: date[1],
                })
            });
            // news.pushNow ? 
            // this.props.form.setFields({
            //     pushTime: {
            //       value:date,
            //       // errors: [new Error('forbid ha')],
            //     },
            //   })
            // : 
            // this.props.form.setFields({
            //     pushEndTime: {
            //       value:date,
            //       // errors: [new Error('forbid ha')],
            //     },
            //   });
             
    }

    // 是否同步
    newsSyncChange = (e) => {
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, {
                sync: e.target.checked,
            })
        });
    }

    // h5Link 变更
    newsH5LinkChange = (e) => {
        console.log(e.target.value)
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, {
                h5Link: e.target.value,
            })
        });
    }

    // 消息描述变更,
    newsDescriptionChange = (e) => {
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, {
                description: e.target.value,
            }),
        });
    }

    /** 上传这块有点复杂, 加点注解
     * @param e         input 输入控件的事件
     * @param groupId   上传组ID
     * 功能: 上传图片链接变更和上传图片有联动,把对应的输入框内容添加到上传数据当中
     * 不管此上传组有几个上传组件, 图片链接都是一样的
     */
    newsImgToLinkChange = (e, groupId) => {
        let { news } = this.state;
        let arr = news.type === 6 ? news.adImgFileList : news.bootImgFileList;
        let imgData = { imgToUrl: e.target.value.trim() };
        arr[groupId].map(item => Object.assign(item, imgData));
        console.log(this.state); // 调试用的, 上传完成, 变更一下上传链接查看数据
    }

    /**
     * 添加上传组
     * @params type 为消息类型:5 启动页广告，6轮播广告, 接口文档:11.3更新活动接口
     * 每添加一个上传组件, 会对应生成相关的假数据, 此处假数据只有一个属性, 为判断上传组件是否上传过图片
     * 添加了一个上传组件
     * bootImgFileList: [
     *      [{ imgUrl:'' }]
     * ],
     * 添加两个上传组件的数据
     * adImgFileList: [
     *      [{ imgUrl:'' }, { imgUrl:'' }],
     *      [{ imgUrl:'' }, { imgUrl:'' }]
     * ], 
     */
    addUploadItem = (type) => {
        let { news } = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');
        let nextKeys = keys.concat(++news.uploadGroupId);
        let imgData = { imgUrl:'' };    // 假数据, 好判断是否有图标
        
        form.setFieldsValue({ keys: nextKeys, });
        news.uploadGroupCount++;
        // 增加指定数组
        let arr = type === 6 ? news.adImgFileList : news.bootImgFileList;

        type === 6 ? arr.push([{ ...imgData }, { ...imgData }]) : arr.push([{ ...imgData }]);
        
        // 可以不用要! 还是加上吧
        type === 6
            ? this.setState({ news: Object.assign(news, { adImgFileList: arr }) })
            : this.setState({ news: Object.assign(news, { bootImgFileList: arr }) });
    }

    /**
     * @param gid       组id
     * @param type      组类型
     * @param gIndex    数组序列号
     * 功能: 删除上传组, 是按数组序列删除对组件的
     */
    removeUploadItem = ({ gId, type, gIndex }) => {
        let { news, modal } = this.state;
        let { form } = this.props;
        modal.keys = form.getFieldValue('keys');
        if (modal.keys.length === 1) { return; }
        form.setFieldsValue({ keys: modal.keys.filter(key => key !== gId), });
        news.uploadGroupCount--;
        // 删除指定组
        let arr = type === 6 ? news.adImgFileList : news.bootImgFileList;
        arr.splice(gIndex, 1);
        type === 6
            ? this.setState({ news: Object.assign(news, { adImgFileList: arr }) })
            : this.setState({ news: Object.assign(news, { bootImgFileList: arr }) });
    }

    /**
     * 组件图片上传成功方法, 
     * @param res   回包数据 
     * @param gId   组id 
     * @param pId   图片id 
     * @param type  图片类型
     */
    uploadImgSuccess = ({ res, gId, pId, type }) => {
        console.log(res)
        if(res.code==='100000'){
            
        let { news } = this.state;
        let arr = type === 6 ? news.adImgFileList : news.bootImgFileList;
        let imgData = {
            imgUrl: res.data,
            imgType: type === 5 ? 3 : (type === 6 && pId === 0) ? 1 : 2,
            imgKey: gId,
            key: `${gId}_${pId}`,
        }
        arr[gId][pId] = Object.assign(arr[gId][pId], imgData);
        type === 6 
            ? this.setState({ news: Object.assign(news, { adImgFileList: arr }) })
            : this.setState({ news: Object.assign(news, { bootImgFileList: arr }) });
        }else{
            message.warning(res.data)
        }
       
    }

    // https://www.kancloud.cn/wangfupeng/wangeditor3/335782
    WEditorConfig = {
        uploadImgServer: uploadApi,
        uploadImgHeaders: { token: token},
        uploadFileName: 'file',
        uploadImgHooks: {
            fail: function (xhr, editor, result) {
                message.warning('上传图片失败!');
            },
            error: function (xhr, editor) {
                message.warning('上传图片出错!');
            },
            timeout: function (xhr, editor) {
                message.warning('上传图片超时!');
            },
            customInsert: function (insertImg, result, editor) {
                insertImg(result.data);
            }
        },
        onchange: (value) => this.WEditorChange(value)
    }

    WEditorChange = (content) => {
        let { news } = this.state;
        this.setState({
            news: Object.assign(news, {
                message: content,
            })
        });
    }


    // =========================
    // 表单字段处理 第三步 通知
    // =========================
    noticeTitleChange = (e) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                title: e.target.value,
            })
        });
    }

    noticeWayChange = (value) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                way: value,
                mmsType: '',
                message: '',
            })
        });
    }

    noticeMessageCenterChange = (e) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                messageCenter: e.target.checked,
            })
        });
    }

    // 消息位
    noticeMessageDigitChange = (value) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                messageDigit: value,
            }),
        });
    }

    // 立即发送
    noticeDifferentiateChange = (e) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                differentiate: e.target.checked,
            }),
        });
    }

    // 短信模板变化
    noticeNameSelectChange = (value) => {
        let { notice, select } = this.state;
        let mms = value.split('___');
        this.setState({
            notice: Object.assign(notice, {
                mmsType: mms[0],
                name: mms[1],
                message: select.name.filter(item => item.title === mms[1])[0].content,
            }),
        });
    }

    // 消息内容
    noticeMessageChange = (e) => {
        let { notice } = this.state;
        this.setState({
            notice: Object.assign(notice, {
                message: e.target.value,
            })
        });
    }
//去空格
changeValue=(event)=>{
        
    if(event.keyCode=='32'){
        event.preventDefault();
        return false;
    }

}
    // 时间选择
    noticeSelectTimeCahnge = (value, date, gId) => {
        let { notice } = this.state;
        notice.selectTimeArr[gId] = date;
    }

    // 添加时间选择
    addNoticeSelectTimeItem = () => {
        let { notice } = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');
        let nextKeys = keys.concat(++notice.selectTimeId);
        form.setFieldsValue({
            keys: nextKeys,
        });
        notice.selectTimeCount++;
    }

    // 删除时间选择
    removeNoticeSelectTimeItem = (k, index) => {
        let { notice } = this.state;
        let { form } = this.props;
        let keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
        notice.selectTimeCount--;
        notice.selectTimeArr.splice(index, 1);
    }

    // =========================
    // 窗口方法
    // =========================
    cancel = () => {
        let { modal } = this.state;
        this.setState({
            modal: Object.assign(modal, {show: false}),
        });
    }

    prev = () => {
        let { steps } = this.state;
        let currentStep = steps.current;
        this.setState({
            steps: Object.assign(steps, { current: --currentStep }),
        });
    }

    next = () => {
        let { steps } = this.state;
        let currentStep = steps.current;
        this.setState({
            steps: Object.assign(steps, { current: ++currentStep }),
        });
    }

    preview = (record) => {
        console.log(record)
        this.formPreview.showModal(record);
    }

    chenckStepOne = () => {
        let { news, steps } = this.state;
        let fields = news.pushNow ? ['topic', 'type', 'control', 'pushTime'] : ['topic', 'type', 'control', 'pushEndTime']
        this.props.form.validateFields(fields,(err, value) => {
            if(!err) {
                console.log(news);
                this.next();
                // 如果是编辑, 并且类型为图片, 根椐图片数组长度执行几次添加上传组, 会不会很奇葩!
                if (type === 'edit') {
                    if ((news.type === 5 || news.type === 6) && news.control === 3) {
                        let arr = news.type === 6 ? news.adImgFileList : news.bootImgFileList;
                        arr.forEach(() => {
                            this.addUploadItem(news.type);
                        });
                    }
                }
            }
        });
    }

    checkStepTwo = () => {
        this.props.form.validateFields((err, value) => {
            if(!err) {
                this.next();
            }
        });
    }

    // 保存消息 如果modal窗类型为add添加, 否则为升级
    saveMessage = () => {
        const { modal, news } = this.state;
        const { getFieldValue } = this.props.form;
        let fields = ['h5Link'];
        switch (news.control){
            case 1:
                if (news.message === '') {
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
        this.props.form.validateFields(fields, (err, value) => {
            if (!err) {
                // 检测图片是否添加, 把图片数据整合到消息记录里
                if (news.control === 3) {
                    this.mergeUploadImg(news.type);
                }
                // ===============================
                // 如果modal窗类型为add添加, 否则为升级
                if (modal.type === 'edit') {
                    this.updateMessage(news);
                } else {
                    this.addMessage(news);
                }
            }
        });
    }

    // 把上传数据整合的消息记录里的img属性里
    mergeUploadImg = (type) => {
        let { news } = this.state;
        let arr = type === 6 ? news.adImgFileList : news.bootImgFileList;
        let imgArr = [];
        arr.forEach((item) => {
            if (type === 6) {
                imgArr.push(item[0]);
                imgArr.push(item[1]);
            } else {
                imgArr.push(item[0]);                
            }
        });
        this.setState({ news: Object.assign(news, { img: imgArr }) });
    }

    // 保存通知
    saveNotice = () => {
        let { notice } = this.state;
        this.props.form.validateFields((err, value) => {
            console.log(err, value);
            if (!err) {
                let params = Object.assign(notice, {
                    pushType: 1,
                    different: 0,
                    way: notice.way,
                    title: notice.title,
                    messageCenter: notice.messageCenter ? 2 : 1,
                    differentiate: notice.differentiate ? 2 : 1,
                    selectTime: notice.selectTimeArr.join(';'),
                    name: notice.name,
                    message: notice.message,
                });
                this.addNotice({...params});
            }
        });
    }   

    render() {
        let { news, select, steps, notice, modal } = this.state;
        let { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        // let keys = getFieldValue('keys');
        modal.keys =getFieldValue('keys');

        // 表单标签样式
        let formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 6 }, }, wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, }, };
        let formItemLayoutWithOutLabel = { labelCol: { xs: { span: 24 }, sm: { span: 4 }, }, wrapperCol: { xs: { span: 24, }, sm: { span: 20, }, }, };
        let formItemLayoutUploadLabel = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 20, offset: 4 }, }, };
        let formItemLayoutNoticeLabel = { wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 18, offset: 6 }, }, };
        let urlRegExp = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
        // modal页脚stepsActions, 简单点不要太复杂了
        let stepOneButton = [
            <Button key="cancel" onClick={this.cancel} >取消</Button>,
            <Button key="next" type="primary" onClick={this.chenckStepOne} >下一步</Button>,
        ];
        let stepTwoButton = [
            <Button key="prev" type="primary" onClick={this.prev}>上一步</Button>,
            <Button 
                key="next" 
                type="primary" 
                loading={modal.loading} 
                onClick={news.sync ? this.checkStepTwo : this.saveMessage} 
            >
                {news.sync ? '下一步' : '保存'}
            </Button>,
            <Button key="priview" type="primary" onClick={() => { this.preview(news) }}>预览</Button>,
        ];
        let stepThreeButton = [
            <Button key="prev" type="primary" onClick={this.prev} >上一步</Button>,
            <Button key="save" type="primary" onClick={this.saveNotice}>保存</Button>,
        ];
        // {/* 上传组件, 轮播图显示一个, 启动页显示两个 */ }        
        // console.log('getFieldValueKeys:', modal.keys);
        // 需要传一个key值到上传组件里, 数据需要
        let uploadItem = (key) => (
            <Form.Item {...formItemLayoutUploadLabel}>
                <Row gutter={16}>
                    {/* 如果广告图一个上传组件 */}
                    {news.type === 5 &&
                    <Col className="gutter-row" span={6}>
                        <Upload
                            className="man-upload-adimg"
                            accept=".jpg,.jpeg,.png,.gif"
                            fileList={false}
                            data={{fileType:'3'}}
                            listType="picture-card"
                            headers={{ token: token }}
                            onSuccess={(e) => this.uploadImgSuccess({ res: e, gId: key, pId: 0, type: news.type })}
                            action={uploadApi} >
                            {
                                news.bootImgFileList[key] && news.bootImgFileList[key][0] && news.bootImgFileList[key][0].imgUrl !== ''
                                    ? <img src={news.bootImgFileList[key][0] && news.bootImgFileList[key][0].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                                    : <Icon type="plus" style={{ fontSize: '36px', color: '#d9d9d9' }} />
                            }
                        </Upload>
                        <p>375*150</p>
                    </Col>}
                    {/* 如果是首页图多加一个上传组件 */}
                    {news.type === 6 && <Col className="gutter-row" span={6}>
                        <Upload
                            className="man-upload-bootimg"
                            accept=".jpg,.jpeg,.png,.gif"
                            fileList={false}
                            data={{fileType:'1'}}
                            listType="picture-card"
                            headers={{ token: token }}
                            onSuccess={(e) => this.uploadImgSuccess({ res: e, gId: key, pId: 0, type: news.type })}
                            action={uploadApi}>
                            {
                                news.adImgFileList[key] && news.adImgFileList[key][0] && news.adImgFileList[key][0].imgUrl !== ''
                                    ? <img src={news.adImgFileList[key][0] && news.adImgFileList[key][0].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                                    : <Icon type="plus" style={{ fontSize: '36px', color: '#d9d9d9' }} />
                            }
                        </Upload>
                        <p>1242×2208</p>
                    </Col>}
                    {news.type === 6 && <Col className="gutter-row" span={6}>
                        <Upload
                            accept=".jpg,.jpeg,.png,.gif"
                            fileList={false}
                            listType="picture-card"
                            data={{fileType:'2'}}
                            headers={{ token: token }}
                            onSuccess={(e) => { this.uploadImgSuccess({ res: e, gId: key, pId: 1, type: news.type }) }}
                            action={uploadApi}>
                            {
                                news.adImgFileList[key] && news.adImgFileList[key][1] && news.adImgFileList[key][1].imgUrl !== ''
                                    ? <img src={news.adImgFileList[key][1] && news.adImgFileList[key][1].imgUrl} style={{ width: '88px', height: '88px', objectFit: 'cover' }} />
                                    : <Icon type="plus" style={{ fontSize: '36px', color: '#d9d9d9' }} />
                            }
                        </Upload>
                        <p>1242x2688</p>
                    </Col>}
                </Row>
            </Form.Item>
        );
        
        // 此处要做个判断如果步骤为2的才渲染,不然会和第三步的增加的冲突
        let formH5LinkItems = modal.keys.map((gId, index) => (
            steps.current === 1 && <div key={index}>
                <Form.Item
                    {...formItemLayoutWithOutLabel}
                    label={`${index + 1}、链接地址`}
                    required={false}
                    key={gId} >
                    {getFieldDecorator(`imgToUrl_${gId}`, {
                        // rules: [
                        //     { required: true, message: "链接地址不能为空", },
                        //     { pattern: urlRegExp, message: '链接格式不正确', },
                        // ],
                    })(
                        <Input
                            onChange={(e) => { this.newsImgToLinkChange(e, index) }}
                            placeholder="图片跳转链接"
                            style={{ width: '90%', marginRight: 12 }} />
                    )}
                    {modal.keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button" type="minus-circle-o"
                            style={{ fontSize: '20px', verticalAlign: 'middle', cursor: 'pointer' }}
                            disabled={modal.keys.length === 1}
                            onClick={() => this.removeUploadItem({ gId: gId, type: news.type, gIndex: index })}
                        />
                    ) : null}
                </Form.Item>
                {/* 上传组件 */}
                {uploadItem(index)}
            </div>
        ));
        // 第三步 时间选择
        let formNoticeTimeSelectItems = modal.keys.map((k, index) => (
            // 此处要做个判断如果步骤为3的才渲染,不然会和第二步的增加的冲突
            steps.current === 2 &&
            <Form.Item {...formItemLayoutNoticeLabel} required={false} key={k} >
                <Row gutter={16}>
                    <Col span={12} >
                        {getFieldDecorator(`selectTime_${k}`, {
                            rules: [{ required: true, message: "选择推送时间", }],
                        })(
                            <DatePicker showTime onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, index + 1)} format="YYYY-MM-DD HH:mm:ss" />
                        )}
                    </Col>
                    <Col span={12} >
                        <Button type="dashed" icon="minus" onClick={() => this.removeNoticeSelectTimeItem(k, index + 1)} />
                    </Col>
                </Row>
            </Form.Item>
        ));
        return(
            <Modal
                width={640}
                onCancel={this.cancel}
                onOk={this.ok}
                okButtonProps={{ loading: modal.loading }}
                title={`${modal.title}`}
                footer={steps.current === 0 ? stepOneButton : steps.current === 1 ? stepTwoButton : stepThreeButton}
                visible={modal.show}
                destroyOnClose >
                {/* 步骤条 */}
                <Steps current={steps.current} size={'small'} style={{marginBottom: '24px'}}>
                    {steps.label.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <Form className="steps-content" style={{maxHeight: '540px', overflowY: 'auto', overflowX: 'hidden'}}>
                    {/* =============================== */}
                    {/* =============第一步============= */}
                    {/* =============================== */}
                    {steps.current === 0 && <div className="minan-steps">
                        {/* 标题 */}
                        <Form.Item {...formItemLayout} label="标题">
                            {getFieldDecorator('topic', {
                                initialValue: news.topic,
                                rules: [
                                    {required:true,
                                        validator:validatorNewsName}
                                    // { required: true, whitespace: true, message: '标题不能为空' }, 
                                    // { max: 30, message: '输入名称不能大于30字符', }
                                ],
                            })(
                                <Input className="man-width90" onKeyDown={this.changeValue} onChange={this.newsTopicChnage} placeholder="例如: 探险活动" />
                            )}
                        </Form.Item>

                        {/* 信息位 */}
                        <Form.Item {...formItemLayout} label="信息位">
                            {getFieldDecorator('type', {
                                initialValue: news.type,
                                rules: [{ required: true, message: '信息位不能为空', }],
                            })(
                                <Select
                                    style={{ width: 200 }}
                                    onChange={this.newsTypeChange}
                                    placeholder="选择你需要的信息位" >
                                    {select.type.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                                </Select>
                            )}
                        </Form.Item>

                        {/* 信息格式 */}
                        <Form.Item {...formItemLayout} label="信息格式" >
                            {getFieldDecorator('control', {
                                initialValue: news.control,
                                rules: [{ required: true, message: '信息格式不能为空', }],
                            })(
                                <Radio.Group onChange={this.newsControlChange}>
                                    {
                                        select.control.map(item => <Radio key={item.key} value={item.key}>{item.value}</Radio>)
                                    }
                                </Radio.Group>
                            )}
                        </Form.Item>

                        {/* 发布时间 */}
                        <Form.Item {...formItemLayout} label="发布时间">
                            {getFieldDecorator('pushNow', {
                                initialValue: news.pushNow,
                                rules: [{ required: false, message: '立即发布' }],
                            })(
                                <Checkbox
                                    checked={news.pushNow}
                                    onChange={this.newsPushNowChange}>
                                    立即发布
                                </Checkbox>
                            )}
                        </Form.Item>

                        {/* 选择时间 */}
                        {news.pushNow
                            ?
                            <Form.Item {...formItemLayout} label="选择时间">
                                {getFieldDecorator('pushTime', {
                                    initialValue: news.pushTime ?   moment(news.pushTime, 'YYYY/MM/DD'):'',
                                    rules: [{ required: true, message: '发布时间不能为空', }],
                                })(
                                    <DatePicker
                                        showTime
                                        allowClear={false}
                                        onChange={this.newsPushTimeChange}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )}
                            </Form.Item>
                            :
                            <Form.Item {...formItemLayout} label="选择时间">
                                {getFieldDecorator('pushEndTime', {
                                    initialValue: news.pushTime ?   [moment(news.pushTime), moment(news.pushEndTime)]:null,
                                    rules: [{ required: true, message: '发布时间不能为空', }],
                                })(
                                    <RangePicker
                                        showTime
                                        allowClear={false}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder={['开始时间', '结束时间']}
                                        onChange={this.newsPushTimeChange}
                                    />
                                )}
                            </Form.Item>
                        }
                    </div>}
                    {/* =============================== */}
                    {/* =============第二步============= */}
                    {/* =============================== */}
                    {steps.current === 1 && <div className="minan-steps">
                        {/* 富文本编辑器 */}
                        {news.control === 1 && 
                        <div className="steps-box">
                            <WEditor defaultHtml={news.message} config={this.WEditorConfig} />
                        </div>}

                        {/* 消息链接 */}
                        {news.control === 2 && <div className="steps-box">
                            {/* 链接 */}
                            <Form.Item {...formItemLayout} label="链接">
                                {getFieldDecorator('h5Link', {
                                    rules: [
                                        { required: true, message: '链接不能为空', },
                                        { message: '链接格式不正确', pattern: urlRegExp, }
                                    ],
                                })(
                                    <Input onChange={this.newsH5LinkChange} className="man-width90" placeholder="例如: https://www.baidu.com" />
                                )}
                            </Form.Item>
                            {/* 信息介绍 */}
                            <Form.Item {...formItemLayout} label="信息介绍">
                                {getFieldDecorator('description', {
                                    rules: [
                                        { required: false, message: '信息介绍不能为空', },
                                        { max: 300, message: '信息介绍不能大于300字符', },
                                    ],
                                })(
                                    <TextArea
                                        className="man-width90"
                                        onChange={this.newsDescriptionChange}
                                        autosize={{ minRows: 4, maxRows: 6 }}
                                        placeholder="信息介绍"
                                    />
                                )}
                            </Form.Item>
                        </div>}

                        {/* 是否同步添加消息通知 */}
                        {news.control !== 3 && <div className="minan-steps">
                            {/* 发布时间 */}
                            < Form.Item {...formItemLayout} label="同步">
                                {getFieldDecorator('sync', {
                                    // initialValue: state.record.publishNow,
                                    rules: [{
                                        required: false, message: '是否同步添加消息通知',
                                    }],
                                })(
                                    <Checkbox
                                        checked={news.sync}
                                        onChange={this.newsSyncChange}>
                                        是否同步添加消息通知
                                    </Checkbox>
                                )}
                            </Form.Item>
                        </div>}

                        {/* 图片上传预览 */}
                        {news.control === 3 && <div className="steps-box step-upload-list">
                            <section style={{ height: '300px', overflowY: 'auto', border: '1px solid #eee', marginBottom: '24px', padding: '10px' }}>
                                {formH5LinkItems}
                            </section>
                            <Form.Item>
                                {/* // 失效属按计数器来算 */}
                                {`已上传${news.uploadGroupCount}组图片，最多10组`}
                                <Button
                                    disabled={news.uploadGroupCount >= 10}
                                    onClick={() => { this.addUploadItem(news.type) }}
                                    style={{ marginLeft: '20px' }} >
                                    添加文件
                                </Button>
                                <p>
                                    <span style={{color:'red'}}>*</span>
                                    <span style={{color:'red',fontSize:10}}>注意事项：为保证图片质量，请按照规定尺寸上传图片。</span>
                                </p>
                            </Form.Item>

                        </div>}

                        {/* 视频上传,暂时不做,预留 */}
                        {news.control === 4 &&
                            <div className="">视频上传,暂时不做,预留</div>
                        }
                    </div>}
                    {/* =============================== */}
                    {/* =============第三步============= */}
                    {/* =============================== */}
                    {steps.current === 2 && <div className="minan-steps">
                        {/* 标题 */}
                        <Form.Item {...formItemLayout} label="通知类型">
                            <span>及时消息</span>
                        </Form.Item>

                        {/* 推送渠道 */}
                        <Form.Item {...formItemLayout} label="推送渠道">
                            {getFieldDecorator('type', {
                                initialValue: notice.way,
                                rules: [{ required: true, message: '推送渠道不能为空', }],
                            })(
                                <Select onChange={this.noticeWayChange} style={{ width: 200 }} placeholder="选择你需要的推送渠道">
                                    {
                                        select.way.map(item => 
                                        <Option key={item.key} value={item.key}>{item.value}</Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>

                        {/* 消息标题 */}
                        <Form.Item {...formItemLayout} label="消息标题">
                            {getFieldDecorator('title', {
                                initialValue: notice.title,
                                rules: [{ required: true, whitespace: true, message: '消息标题不能为空', }],
                            })(
                                <Input onChange={this.noticeTitleChange} className="man-width90" placeholder="例如: 探险活动" />
                            )}
                        </Form.Item>

                        {/* 保存 */}
                        <Form.Item {...formItemLayout} label="保存">
                            {getFieldDecorator('messageCenter', {
                                rules: [{ required: false, message: '是否保存在消息中心不能为空', }],
                            })(
                                <Checkbox
                                    checked={notice.messageCenter}
                                    onChange={this.noticeMessageCenterChange} >
                                    是否保存在消息中心
                                </Checkbox>
                            )}
                        </Form.Item>

                        {/* 消息位 */}
                        {notice.messageCenter && <div>
                            <Form.Item {...formItemLayout} label="消息位">
                                {getFieldDecorator('messageDigit', {
                                    initialValue: notice.way,
                                    rules: [{ required: true, message: '消息位不能为空', }],
                                })(
                                    <Select style={{ width: 200 }} onChange={this.noticeMessageDigitChange}>
                                        {
                                            select.messageDigit.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </div>}
                        
                        {/* 推送时间 */}
                        <Form.Item {...formItemLayout} label="推送时间">
                            {getFieldDecorator('noticePushNow')(
                                <Checkbox
                                    checked={notice.differentiate}
                                    onChange={this.noticeDifferentiateChange} >
                                    立即发送
                                </Checkbox>
                            )}
                        </Form.Item>

                        {/* 选择推送时间 */}
                        {!notice.differentiate && <Form.Item {...formItemLayoutNoticeLabel}>
                            <Row gutter={16}>
                                <Col span={12} >
                                    {getFieldDecorator('selectTime_0', {
                                        rules: [{ required: true, message: '推送时间不能为空', }],
                                    })(
                                        <DatePicker onChange={(memont, date) => this.noticeSelectTimeCahnge(memont, date, 0)} showTime format="YYYY-MM-DD HH:mm:ss" />
                                    )}
                                </Col>
                                <Col span={12} >
                                    <Button type="dashed" icon="plus" onClick={this.addNoticeSelectTimeItem} disabled={notice.selectTimeCount === 5} />
                                </Col>
                            </Row>
                        </Form.Item>}

                        {steps.current === 2 && !notice.differentiate && formNoticeTimeSelectItems}

                        {/* 消息模板 */}
                        {notice.way === 2 && <div>
                            < Form.Item {...formItemLayout} label="消息模板" >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, whitespace: true, message: '消息模板不能为空', }],
                                })(
                                    <Select onChange={this.noticeNameSelectChange} style={{width: '200px'}}>
                                        {select.name.map((item, index) => <Option key={index} value={`${item.type}___${item.title}`}>{item.title}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </div>}

                        {/* 消息内容 */}
                        <Form.Item {...formItemLayout} label="消息内容">
                            {getFieldDecorator('message', {
                                initialValue: notice.message,
                                rules: [
                                    { required: true, whitespace: true, message: '消息内容不能为空', }, 
                                    { max: 300, min: 10, message: '短信内容最少10个字, 最多300字', }
                                ],
                            })(
                                <TextArea
                                    className="man-width90"
                                    autosize={{ minRows: 4, maxRows: 6 }}
                                    onChange={this.noticeMessageChange}
                                    placeholder="例如: 探险活动"
                                />
                            )}
                        </Form.Item>
                    </div>}
                </Form>

                <MessagePreview
                    wrappedComponentRef={(form) => this.formPreview = form}
                />

                <style>
                {`
                .man-width90{width:90%}
                .ant-form-item-with-help{margin-bottom:24px;}
                .minan-steps{padding-top:24px;}
                .uploadPreview:hover{}
                `}
                </style>
            </Modal>
        )
    }
}

export default Form.create()(messageEdit);