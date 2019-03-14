/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import Qs from 'qs'
import { Link } from 'react-router-dom';
import {Row,Col,Form,Modal,message} from 'antd';
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import { resolve } from 'url';
import moment from 'moment';
import { HttpUrl } from '../../../util/httpConfig';
import {transformDate,disabledDate} from './../../../util/util'
const FormItem = Form.Item;
class deviceView extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        viewModal:false,
        detail:{}
    }
    componentDidMount(){
        
    }
    view = (record) => {
        this.setState({
            viewModal:true
        })
        Axios.post(HttpUrl+'equip/equipment/getEquipmentById',{
            'equipmentId':record.eqmId
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    detail:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    cancel = () => {
        this.setState({
            viewModal:false
        })
    }
    render() {
        let { detail}=this.state
        return (
        <div className="content" >
            <Modal
                title={'查看详情'}
                visible={this.state.viewModal}
                onCancel={ this.cancel}
                destroyOnClose={true}
                footer={null}
                className='treeBox'
            >
            <div>
                <Row style={{padding:'0px 16px'}}>   
                    <Col span={12}>
                        <div>
                            <span className='label'>设备SN：</span>
                            <span className='itemDetail'>{detail.eqmCode}</span>
                        </div>
                        <div>
                            <span className='label'>设备类型：</span>
                            <span className='itemDetail'>{detail.eqmTypeName}</span>
                        </div>
                        <div>
                            <span className='label'>设备型号：</span>
                            <span className='itemDetail'>{detail.eqmSeriesName}</span>
                        </div>
                        <div>
                            <span className='label'>版本号：</span>
                            <span className='itemDetail'>{detail.versionNow}</span>
                        </div>
                        <div>
                            <span className='label'>固件形式：</span>
                            <span className='itemDetail'>{detail.firmwareModle === 0 ? 'MCU' : '非MCU'}</span>
                        </div>
                        <div>
                            <span className='label'>IMSI：</span>
                            <span className='itemDetail'>{detail.imsi}</span>
                        </div>
                        <div>
                            <span className='label'>IMEI：</span>
                            <span className='itemDetail'>{detail.imei}</span>
                        </div>
                        <div>
                            <span className='label'>运营商：</span>
                            <span className='itemDetail'>{detail.mobileNetworkOperators}</span>
                        </div>
                        <div>
                            <span className='label'>SIM卡号：</span>
                            <span className='itemDetail'>{detail.simNum}</span>
                        </div>
                        <div>
                            <span className='label'>ICCID：</span>
                            <span className='itemDetail'>{detail.iccid}</span>
                        </div>
                        <div>
                            <span className='label'>注册状态：</span>
                            <span className='itemDetail'>{
                                Number(detail.isRegister) === 0 ? '已注册' :
                                Number(detail.isRegister) === 1 ? '未注册' : '注册失败'
                            }</span>
                        </div>
                    </Col>
                    <Col span={12} >
                        <div>
                            <span className='label'>供应商：</span>
                            <span className='itemDetail'>{detail.providerFullName}</span>
                        </div>
                        <div>
                            <span className='label'>生产批次：</span>
                            <span className='itemDetail'>{detail.eqmBatch}</span>
                        </div>
                        <div>
                            <span className='label'>升级形式：</span>
                            <span className='itemDetail'>{ detail.diffModel === 0 ? '整包' : '差分包'}</span>
                        </div>
                        <div>
                            <span className='label'>升级次数：</span>
                            <span className='itemDetail'>{ detail.versionUpdTimes}</span>
                        </div>
                        <div>
                            <span className='label'>最后升级时间：</span>
                            <span className='itemDetail'>{ transformDate(detail.versionUpdTime)}</span>
                        </div>
                        <div>
                            <span className='label'>OS：</span>
                            <span className='itemDetail'>{ detail.os }</span>
                        </div>
                        <div>
                            <span className='label'>VIN：</span>
                            <span className='itemDetail'>{ detail.vin}</span>
                        </div>
                        <div>
                            <span className='label'>绑定车辆：</span>
                            <span className='itemDetail'>{ detail.licenseNo }</span>
                        </div>
                        <div>
                            <span className='label'>绑定账号：</span>
                            <span className='itemDetail'>{ detail.userMobile }</span>
                        </div>
                        <div>
                            <span className='label'>在线状态：</span>
                            <span className='itemDetail'>{
                                detail.eqmStatus
                            }</span>
                        </div>
                    </Col>
                </Row>
            </div>
            </Modal>
            <style>
                {`
                    .treeBox{width:663px !important;height:607px !important;}
                    .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;}
                `}
            </style>
        </div>
        )
    }
}
const deviceViews = Form.create()(deviceView);
export default deviceViews;