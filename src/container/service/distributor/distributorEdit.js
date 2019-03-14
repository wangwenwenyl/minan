// 查看维保详情
import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { Map, Marker } from 'react-amap';

const FormItem = Form.Item;
const Search = Input.Search;

class distributorEdit extends Component {
    state = {
        show: false,
        title: '添加新的经销商',
        type: 'add',
        loading: false,

        // AMap 变量
        mapKey: '71477380fc31e5291f93952b10091bf6',
        mapZoom: 16,
        mapStyle: "amap://styles/whitesmoke",
        mapCenter: { longitude: 0, latitude: 0 },
        markerPosition: { longitude: 0, latitude: 0 },
        geocoder: null,

        record: { },
    }

    componentDidMount() {
        // console.log(this);
    }

    // modal 按钮
    cancel = () => {
        this.setState({ show: false });
    }

    ok = () => {
        let state = this.state;
        this.props.form.validateFields((err, values) => {
            if(!err) {
                if (state.type === 'edit') {
                    this.update(Object.assign(state.record, values));
                } else {
                    this.add(Object.assign(state.record, values));
                }
            }
        });
    }

    // 提交添加
    add = (record) => {
        this.setState({ loading: true });
        this.props.add({...record})
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
                show: false,
            });
        });
    }

    update = (record) => {
        this.setState({ loading: true });
        this.props.update({ ...record })
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
                    show: false,
                });
            });
    }

    // 表单变更
    nameChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                name: e.target.value
            })
        });
    }

    phoneChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                phone: e.target.value
            })
        });
    }

    distributorCodingChange = (e) => {
        this.setState({
            record: Object.assign(this.state.record, {
                distributorCoding: e.target.value
            })
        });
    }

    addressChange = (e) => {
        let delayTime = 1500;
        if (e.target.value !== '' || e.target.value !== null) {
            setTimeout(this.searchAddress, delayTime);
            this.setState({
                record: Object.assign(this.state.record, {
                    address: e.target.value
                })
            });
        }
    }
  
markerEvent={
   
    created:(marker)=>{
         marker.on('dragend', ()=> {
            let lngNew=marker.getPosition().lng;
             let latNew=marker.getPosition().lat;
             let state = this.state;
            console.log(lngNew,latNew)
             this.setState({
                  record: Object.assign(state.record, {
                    province: state.record.province,
                    city: state.record.city,
                    area: state.record.district,
                    longitude: '0',
                    dimension: '0',
                    lat: latNew + '',
                    lon: lngNew + '',
            }),
                
             })
         })
        
    },
}


    // 搜索地址
    searchAddress = () => {
        let state = this.state;
        this.props.form.validateFields(['address'], (err, value) => {
            if (!err) {
                // console.log(AMap);
                AMap.plugin('AMap.Geocoder', () => {
                    let geocoder = new AMap.Geocoder({});
                    geocoder.getLocation(value.address, (status, result) => {
                        if (status === 'complete' && result.info === 'OK') {
                            // result中对应详细地理坐标信息
                            let position = result.geocodes[0].location;
                            let address = result.geocodes[0].addressComponent;
                            this.setState({
                                mapCenter: { 
                                    longitude: position.lng + '', 
                                    latitude: position.lat + '',
                                },
                                markerPosition: { 
                                    longitude: position.lng + '', 
                                    latitude: position.lat + '', 
                                },
                                record: Object.assign(state.record, {
                                    province: address.province,
                                    city: address.city,
                                    area: address.district,
                                    longitude: '0',
                                    dimension: '0',
                                    lat: position.lat + '',
                                    lon: position.lng + '',
                                })
                            });
                        }
                    });
                });
            }
        });
    }

    // 显示窗口
    showModal = (option) => {
        let record = option.record;
        let beijing = {
            longitude: 116.407526,
            latitude: 39.90403,
        }
        console.log(option)
        this.setState({
            show: true,
            type: option.type,
            record: option.type === 'add' ? {} : Object.assign(this.state.record, option.record),
            mapCenter: option.type === 'add' ? {...beijing} : Object.assign(this.state.mapCenter, { longitude: record.lon, latitude: record.lat }),
            markerPosition: option.type === 'add' ? { ...beijing } :  Object.assign(this.state.markerPosition, { longitude: record.lon, latitude: record.lat }),
        });
    }

    // 表格查看
    render() {
        const state = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { sm: { span: 6 }, },
            wrapperCol: { sm: { span: 16 }, },
        };
        return (
            <Modal 
                onCancel={this.cancel}
                onOk={this.ok}
                title={state.type === 'add' ? state.title : `编辑记录`}
                visible={state.show}
                okButtonProps={{ loading: state.loading }}
                destroyOnClose 
                className="ModalAdd" >
                <Form>
                    <FormItem label="经销商名称" {...formItemLayout}>
                        {getFieldDecorator('name', {
                            initialValue: state.record.name,
                            rules: [
                                { required: true, whitespace: true, message: '经销商名称不能为空', },
                                { pattern: /[a-zA-z0-9\u4E00-\u9FA5]+$/, message: '经销商名称不能有特殊字符' },
                                { max: 100, message: '经销商名称限制在100字符及以内' },
                            ],
                        })(
                            <Input onChange={this.nameChange}/>
                        )}
                    </FormItem>
                    <FormItem label="经销商编码" {...formItemLayout}>
                        {getFieldDecorator('distributorCoding', {
                            initialValue: state.record.distributorCoding,
                            rules: [
                                { required: true, whitespace: true, message: '经销商编码不能为空', },
                                { pattern: /[a-zA-z0-9]+$/, message: '英文大小写、数字或字符' },
                                { max: 30, message: '经销商名称限制在30字符及以内' },
                            ],
                        })(
                            <Input onChange={this.distributorCodingChange} />
                        )}
                    </FormItem>
                    <FormItem label="联系电话" {...formItemLayout}>
                        {getFieldDecorator('phone', {
                            initialValue: state.record.phone,
                            rules: [
                                { required: true, whitespace: true, message: '联系电话不能为空', },
                                { pattern: /[0-9]+$/, message: '联系电话只能是数字' },
                                { max: 13, message: '联系电话限制在13字符及以内' },
                            ],
                        })(
                            <Input onChange={this.phoneChange} />
                        )}
                    </FormItem>

                    <Form.Item {...formItemLayout} label="经销商地址">
                        {getFieldDecorator('address', {
                            initialValue: state.record.address,
                            rules: [
                                { required: true, whitespace: true, message: '经销商地址不能为空', },
                                { pattern: /[a-zA-z0-9\u4E00-\u9FA5]+$/, message: '中文、英文大小写、数字或字符' },
                                { max: 200, message: '经销商地址限制在200字符及以内' },
                            ],
                        })(
                            <Search
                                placeholder="例如:北京市朝阳区阜荣街10号"
                                enterButton="查询"
                                onChange={this.addressChange}
                                onSearch={() => { this.searchAddress(state.address) }}
                            />
                        )}
                    </Form.Item>
                </Form>
                {/* map https://elemefe.github.io/react-amap/components/about */}
                <div style={{ width: '100%', height: 200, border: '1px solid #d9d9d9' }}>
                    <Map
                        useAMapUI={true}
                        // events={this.AMapEvents}
                        amapkey={state.mapKey}
                        zoom={state.mapZoom}
                        center={state.mapCenter}
                        mapStyle={state.mapStyle} >
                        <Marker
                        events={this.markerEvent}
                        position={state.markerPosition}
                        draggable={true}
                         />
                    </Map>
                </div>

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

export default Form.create()(distributorEdit);