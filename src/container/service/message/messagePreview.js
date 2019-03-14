/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/alt-text */
// 预览页面独立出来, 添加和编辑查看页面都可以使用
// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Carousel } from 'antd';
import iphone6 from './img/iphone_6.png';
import iphoneAD from './img/iphone_6_ad.png';

class messagePreview extends Component {
    state = {
        modal:{
            show: false,
            title: '预览',
        },
        record: {},
    }

    okAndCancel = () => {
        let { modal } = this.state;
        this.setState({
            modal: Object.assign( modal, {
                    show: false,
                })
        });
    }

    // 设置预览图
    setPreviewImg = (record) => {
        console.log(record)
        let temp = [];
        let preview = [];
        record.img.map((item) => {
            if (temp.indexOf(item.imgKey) < 0) {
                temp.push(item.imgKey);
                preview.push(item);
            }
        });
        // record.h5Link = ''; // 死数据, 后期删除
        record.preview = preview;
        return record;
    }

    showModal = (option) => {
        let { modal, record } = this.state;
        option = this.setPreviewImg(option);
        this.setState({
            modal: Object.assign( modal, { show: true }),
            record: Object.assign(record, option),
        });
    }

    // 表格查看
    render() {
        const { modal, record } = this.state;
        return (
            <Modal
                onCancel={this.okAndCancel}
                onOk={this.okAndCancel}
                footer={null}
                title={`${modal.title} - ${record.topic}`}
                visible={modal.show}
                destroyOnClose
                className="modal_preview">
                    <div className="phonePreview">
                        {/* 背景图 */}
                        <img src={record.type === 6 && record.control === 3 ? iphoneAD : iphone6} className="phoneImg" />
                        {/* 预览内容 */}
                        <div className="phoneContent">
                            {
                                (record.type !== 5 || record.type !== 6) && record.control === 1 && 
                                <div className="phoneMessage" dangerouslySetInnerHTML={{ __html: record.message }} />
                            }
                            
                            {
                                (record.type !== 5 || record.type !== 6) && record.control === 2 && 
                                <iframe className="phoneIframe" width="100vw" height="100vh" title="phoneIframe" src={record.h5Link} />
                            }
                        
                            {
                                record.type === 5 && record.control === 3 && 
                                <div className="phoneBootImg">
                                    <Carousel autoplay>
                                        {record.preview.map((item, index) => (<img key={index} className="AdImg" src={item.imgUrl} />))}
                                    </Carousel>
                                </div>
                            }

                            {
                                record.type === 6 && record.control === 3 &&
                                <div className="phoneAdImg">
                                    <Carousel autoplay>
                                        {record.preview.map((item, index) => (<img key={index} className="AdImg" src={item.imgUrl} style={{objectFit:'cover',height:'150px'}} />))}
                                    </Carousel>
                                </div>
                            }
                        </div>
                    </div>
                <style>
                    {`
                    .modal_preview .ant-modal-header,.modal_preview .ant-modal-close{display:none;}
                    .modal_preview .ant-modal-content{background-color:transparent;box-shadow:none;}
                    .phonePreview{margin:-150px 0;transform: scale(.8);position:relative;}
                    .phoneContent{position:absolute;width: 375px;height: 670px;overflow-y:auto;top: 120px;margin-left: calc(50% - 2px);transform: translate(-50%,0);}
                    .phoneIframe{width:100%;height:100%;border:0;}
                    .phoneAdImg{position: absolute;top: 69px;width: 376px;height: 150px;overflow:hidden;}
                    .phoneBootImg{width: 375px;height: 670px;overflow:hidden;}
                    .AdImg{width:100%;height:auto;}
                    `}
                </style>
            </Modal>
        );
    }
};

export default Form.create()(messagePreview);
