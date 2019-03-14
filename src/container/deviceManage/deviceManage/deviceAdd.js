/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import Qs from 'qs'
import { Link } from 'react-router-dom';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete} from 'antd';
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import {deviceText2,versionCheck,validatorPasswordInfo,simNum,iccidNum} from './../../../util/validator'
import {keycode} from './../../../util/permission'
const Option = Select.Option;
const FormItem = Form.Item;


class deviceAdd extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        addModal:false,
        detail:'',
        record:'',
        treeSelectValue:[],
        treeData:[],
        flag:'',
        searchDataSource:[],
        vinArr:'',
        vinId:'',
        extendType:''
    }
    componentDidMount(){
        
    }
    onSelect = (value,node,extra) => {
        new Promise(resolve => {
            this.setState({
                treeSelectValue:node.props.title.split('>'),
                parentId:node.props.parentId,
                childrenId:value.split(',')[0],
                extendType:node.props.extendType,
            })
            this.props.form.resetFields()
            resolve(node.props.parentName)
        }).then(res => {
            this.props.form.setFieldsValue({'eqmTypeName':res})
        })
    }
    //添加设备
    deviceAdd = () => {
        this.setState({
            addModal:true
        })
        this.getTreeData()
    }
    //编辑设备
    deviceEdit = (record,flag) => {
        this.setState({
            record:record,
            addModal:true,
            flag:flag
        })
        this.getTreeData()
        Axios.post(HttpUrl+'equip/equipment/getEquipmentById',{
            'equipmentId':record.eqmId
        }).then(res => {
            if(res.data.code === '100000'){
                if(res.data.data.eqmTypeName){
                    this.setState({
                        extendType:36
                    })
                }
                this.setState({
                    detail:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //vin失去焦点事件
    onBlur = () => {
        if(!this.state.vinId){
            this.props.form.setFieldsValue({'vin':this.state.searchDataSource[0]})
        }
    }
    //vin自动补全
    handleSearch = (value) => {
        let token=sessionStorage.getItem('token')
        Axios.get(HttpUrl+'equip/equipment/getUsableVin?vin='+value+'&token='+token).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let arr=[]
                for(let i=0;i<length;i++){
                    arr.push(res.data.data[i].val)
                }
                this.setState({
                    searchDataSource:arr,
                    vinArr:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    //vin选中
    vinSelect = (value) => {
        this.state.vinArr.map(item => {
            if(item.val === String(value)){
                this.setState({
                    vinId:item.id
                })
            }
        })
    }
    //获取树数据
    getTreeData = () => {
        Axios.post(HttpUrl+'equip/equipment/getEqmTree',{
            'treeType':2
        }).then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                for(let i=0;i<length;i++){
                    Object.assign(res.data.data[i],{disabled:true})
                }
                this.setState({
                    treeData:res.data.data
                })
            }else if(res.data.code !== '120002'){
                message.warning(res.data.message)
            }
        })
    }
    deviceSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.state.flag === '编辑'){
                    Axios.post(HttpUrl+'equip/equipment/editEquipment',{
                        'equipmentId':this.state.detail.eqmId,
                        'eqmExtendId':this.state.detail.eqmExtendId,
                        'eqmCode':this.props.form.getFieldValue('eqmCode') || null,
                        'versionNow':this.props.form.getFieldValue('versionNow') || null,
                        'carId':this.state.vinId,//vin换成carId
                        'simNum':this.props.form.getFieldValue('simNum') || null,
                        'iccid':this.props.form.getFieldValue('iccid') || null,
                        'imsi':this.props.form.getFieldValue('imsi') || null,
                        'imei':this.props.form.getFieldValue('imei') || null,
                        'mobileNetworkOperators':this.props.form.getFieldValue('mobileNetworkOperators') || null,
                        'os':this.props.form.getFieldValue('os') || null,
                        'firmwareModle':this.props.form.getFieldValue('firmwareModle') || null,
                        'diffModel':this.props.form.getFieldValue('diffModel') || null,
                    }).then(res => {
                        if(res.data.code === '100000'){
                            this.setState({
                                addModal:false,
                                record:'',
                                detail:'',
                                treeSelectValue:[],
                                treeData:[],
                                flag:'',
                                searchDataSource:[],
                                vinArr:'',
                                vinId:'',
                                extendType:''
                            })
                            this.props.list()
                        }else if(res.data.code !== '120002'){
                            message.warning(res.data.message)
                        }
                    })
                }else if(this.state.flag === '审核通过'){
                    this.checkPassword().then(res => {
                        if(res){
                            Axios.post(HttpUrl+'equip/equipment/registerCheckPass',{
                                'equipmentId':this.state.detail.eqmId,
                                'eqmExtendId':this.state.detail.eqmExtendId,
                                'eqmTypeId':this.state.parentId || this.state.detail.eqmTypeId,
                                'eqmSeriesId':this.state.childrenId || this.state.detail.eqmSeriesId,
                                'eqmCode':this.props.form.getFieldValue('eqmCode') || null,
                                'versionNow':this.props.form.getFieldValue('versionNow') || null,
                                'carId':this.state.vinId,//vin换成carId
                                'simNum':this.props.form.getFieldValue('simNum') || null,
                                'iccid':this.props.form.getFieldValue('iccid') || null,
                                'imsi':this.props.form.getFieldValue('imsi') || null,
                                'imei':this.props.form.getFieldValue('imei') || null,
                                'mobileNetworkOperators':this.props.form.getFieldValue('mobileNetworkOperators') || null,
                                'os':this.props.form.getFieldValue('os') || null,
                                'firmwareModle':this.props.form.getFieldValue('firmwareModle') || null,
                                'diffModel':this.props.form.getFieldValue('diffModel') || null,
                            }).then(res => {
                                if(res.data.code === '100000'){
                                    this.setState({
                                        addModal:false,
                                        record:'',
                                        detail:'',
                                        treeSelectValue:[],
                                        treeData:[],
                                        flag:'',
                                        searchDataSource:[],
                                        vinArr:'',
                                        vinId:'',
                                        extendType:''
                                    })
                                    this.props.list()
                                }else if(res.data.code !== '120002'){
                                    message.warning(res.data.message)
                                }
                            })
                        }else{
                            message.warning('管理员密码输入错误')
                        }
                    })
                }else{
                    Axios.post(HttpUrl+'equip/equipment/addEquipment',{
                        'eqmTypeId':this.state.parentId,
                        'eqmSeriesId':this.state.childrenId,
                        'eqmCode':this.props.form.getFieldValue('eqmCode') || null,
                        'versionNow':this.props.form.getFieldValue('versionNow') || null,
                        'carId':this.state.vinId,//vin换成carId
                        'simNum':this.props.form.getFieldValue('simNum') || null,
                        'iccid':this.props.form.getFieldValue('iccid') || null,
                        'imsi':this.props.form.getFieldValue('imsi') || null,
                        'imei':this.props.form.getFieldValue('imei') || null,
                        'mobileNetworkOperators':this.props.form.getFieldValue('mobileNetworkOperators') || null,
                        'os':this.props.form.getFieldValue('os') || null,
                        'firmwareModle':this.props.form.getFieldValue('firmwareModle') || null,
                        'diffModel':this.props.form.getFieldValue('diffModel') || null,
                    }).then(res => {
                        if(res.data.code === '100000'){
                            this.setState({
                                addModal:false,
                                record:'',
                                detail:'',
                                treeSelectValue:[],
                                treeData:[],
                                flag:'',
                                searchDataSource:[],
                                vinArr:'',
                                vinId:'',
                                extendType:''
                            })
                            this.props.list()
                        }else if(res.data.code !== '120002'){
                            message.warning(res.data.message)
                        }
                    })
                }
            }
        });
    }
    sureAdd = () => {
        if(this.state.flag === '审核通过'){
            if(this.props.form.getFieldValue('password')){
                this.deviceSubmit()
            }else{
                message.warning('请输入管理员密码')
            }
        }else{
            this.deviceSubmit()
        }
    }
    cancelAdd = () => {
        this.setState({
            addModal:false,
            record:'',
            detail:'',
            treeSelectValue:[],
            treeData:[],
            flag:'',
            searchDataSource:[],
            vinArr:'',
            vinId:'',
            extendType:'',
            expandedKeys:[]
        })
    }
    //密码验证
    checkPassword = () => {
        return Axios.post('sys/system/user/checkPassword',{
            'password':this.props.form.getFieldValue('password')
        },httpConfig).then(res => {
            if(res.data.code === '100000'){
                return Promise.resolve(true);
            }else{
                message.warning(res.data.message)
                return Promise.resolve(false);
            }
        })
    }
    paste = (e) => {
       
    }
    render() {
        const { getFieldDecorator}=this.props.form
        const {treeSelectValue}=this.state
        return (
        <div className="content" >
            <Modal
                title={ this.state.flag === '编辑' ?  '编辑' :  this.state.flag === '审核通过' ? '审核通过' : '新建设备'}
                visible={this.state.addModal}
                okText={this.state.flag === '审核通过' ? '通过' : '提交'}
                cancelText="取消"
                onCancel={ this.cancelAdd}
                onOk={ this.sureAdd}
                destroyOnClose={true}
                className='treeBox addBox'
            >
            <div>
                <Form layout="inline" onSubmit={ this.deviceSubmit}>
                    <Row style={{padding:'0px 16px'}}>   
                        <Col span={12}>
                            <FormItem label="设备类型">
                            { getFieldDecorator('eqmTypeName',{
                                rules:[{
                                    required:true,
                                    message:'请选择设备类型'
                                }],
                                initialValue:this.state.detail ? this.state.detail.eqmTypeName  : ''
                            })( < TreeSelect 
                             allowClear
                             style={{width:'175px'}} 
                             treeData={this.state.treeData}
                             dropdownStyle={{width:'175px'}}
                             onSelect={this.onSelect}
                             disabled={ this.state.flag === '编辑' ? true  : false}
                             getPopupContainer={triggerNode => triggerNode.parentNode}
                             />)
                            }
                            </FormItem>
                            <div className='inputRead'>
                                <label className='ant-form-item-required' style={{display:'inline-block',width:'78px',textAlign:'right',color:"#333"}}>型号：</label>
                                <span>
                                    { treeSelectValue[1] || (this.state.detail ? this.state.detail.eqmSeriesName : '')}
                                </span>
                            </div>
                            <FormItem label="设备SN">
                            { getFieldDecorator('eqmCode',{
                                rules:[{
                                    required:true,
                                    validator:deviceText2
                                }],
                                initialValue:this.state.flag ? this.state.detail.eqmCode : ''
                            })( < Input placeholder='不超过24位、区分大小写' onKeyDown={keycode} onPaste={ this.paste } readOnly={ this.state.detail.vin || String(this.state.detail.isRegister) === '0' ? true :false } autoComplete='off'/>)}
                            </FormItem>
                            {
                                this.state.flag === '编辑' || this.state.flag === '审核通过' ?
                                <FormItem label="VIN">
                                { getFieldDecorator('vin',{
                                    initialValue:this.state.flag ? this.state.detail.vin : ''
                                })( < AutoComplete placeholder='17位、数字、英文、区分大小写' 
                                        dataSource={ this.state.searchDataSource}
                                        onSelect={this.vinSelect}
                                        onSearch={this.handleSearch}
                                        onBlur={this.onBlur}
                                        disabled={true}
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        autoComplete='off'
                                />)}
                                </FormItem>
                                : ''
                            }
                            
                            {
                                this.state.flag === '编辑' ?
                                <FormItem label="OS">
                                { getFieldDecorator('os',{
                                    initialValue:this.state.flag ? this.state.detail.os ? this.state.detail.os : '无' : ''
                                })( < Select style={{width:'170px'}} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        <Option value=''>无</Option>
                                        <Option value='Linux'>Linux</Option>
                                        <Option value='Android'>Android</Option>
                                </ Select>)}
                                </FormItem>
                                : ''
                            }
                            
                        </Col>
                        <Col span={12} >
                            <div className='inputRead' style={{lineHeight:'40px'}}>
                                <label className='ant-form-item-required' style={{display:'inline-block',width:'78px',textAlign:'right',color:"#333"}}>供应商：</label>
                                <span>
                                    { treeSelectValue[0] || (this.state.detail ? this.state.detail.providerFullName : '')}
                                </span>
                            </div>
                            <div className='inputRead' >
                                <label className='ant-form-item-required' style={{display:'inline-block',width:'78px',textAlign:'right',color:"#333"}}>生产批次：</label>
                                <span>
                                    { treeSelectValue[2] || (this.state.detail ? this.state.detail.eqmBatch : '')}
                                </span>
                            </div>
                            <FormItem label="版本号">
                            { getFieldDecorator('versionNow',{
                                rules:[{
                                    required:true,
                                    validator:versionCheck
                                }],
                                initialValue:this.state.flag ? this.state.detail.versionNow : ''
                            })( < Input placeholder='X.X.X，数字' autoComplete='off'/>)}
                            </FormItem>
                            {
                                this.state.flag === '编辑'? 
                                <div>
                                    <FormItem label="升级形式">
                                    { getFieldDecorator('diffModel',{
                                        initialValue:this.state.detail.diffModel === null ?  '0' : String(this.state.detail.diffModel)
                                    })(  < Select style={{width:'170px'}} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        <Option value='0'>整包</Option>
                                        <Option value='1'>差分包</Option>
                                    </ Select>)}
                                    </FormItem>
                                    <FormItem label="固件形式">
                                    { getFieldDecorator('firmwareModle',{
                                        initialValue:this.state.detail.firmwareModle === null ? '0' : String(this.state.detail.firmwareModle) 
                                    })( < Select style={{width:'170px'}} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        <Option value='0'>MCU</Option>
                                        <Option value='1'>非MCU</Option>
                                    </Select>)}
                                    </FormItem>
                                </div>
                                : ''
                            }
                        </Col>
                    </Row>
                    <Row>
                    <div >设备扩展信息</div>
                    <div style={{display:'inline-block',border:'1px solid #f5f5f5',width:'75%',position:'relative',top:'-24px',left:'100px'}}></div>
                        <Col span={12}>
                            {
                                this.state.extendType  || this.state.flag === '编辑'?
                                <div>
                                    <FormItem label="SIM卡号">
                                    { getFieldDecorator('simNum',{
                                        rules:[{
                                            required:true,
                                            validator:simNum
                                        }],
                                        initialValue:this.state.flag ? this.state.detail.simNum : ''
                                    })( < Input placeholder='11位、数字' autoComplete='off'/>)}
                                    </FormItem>
                                    <FormItem label="IMEI">
                                    { getFieldDecorator('imei',{
                                        rules:[{
                                            message:'15位、数字',
                                            pattern:/^[0-9]{15}$/
                                        }],
                                        initialValue:this.state.flag ? this.state.detail.imei : ''
                                    })( < Input placeholder='15位、数字' autoComplete='off'/>)}
                                    </FormItem>
                                    <FormItem label="运营商">
                                    { getFieldDecorator('mobileNetworkOperators',{
                                        rules:[{
                                            message:'输入格式错误，请重新输入',
                                        }],
                                        initialValue:this.state.flag ? this.state.detail.mobileNetworkOperators : ''
                                    })( <Select style={{width:'170px'}} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                        <Option value='0'>移动</Option>
                                        <Option value='1'>联通</Option>
                                        <Option value='2'>电信</Option>
                                    </Select>)} 
                                    </FormItem>
                                    {
                                        this.state.flag === '审核通过' ?
                                        <div style={{marginLeft:'78px'}} className='shenhe'>
                                            <FormItem label="">
                                            { getFieldDecorator('password',{
                                                rules:[{
                                                    message:'6-16位，数字/英/符号组合(至少两种)',
                                                    validator: validatorPasswordInfo
                                                }]
                                            })( < Input type='password'/>)}
                                            </FormItem>
                                            {
                                                this.props.form.getFieldValue('password') ? '' :
                                                <div style={{color:'red',marginTop:'-15px',fontSize:'12px'}}>请输入管理员密码</div>
                                            }
                                        </div>
                                        : ''
                                    }
                                </div>
                                : ''
                            }
                        </Col>
                        <Col span={12}>
                                {
                                    this.state.extendType || this.state.flag === '编辑'?
                                    <div>
                                        <FormItem label="ICCID">
                                        { getFieldDecorator('iccid',{
                                            rules:[{
                                                required:true,
                                                validator:iccidNum
                                            }],
                                            initialValue:this.state.flag ? this.state.detail.iccid : ''
                                        })( < Input placeholder='20位、数字、字母' autoComplete='off'/>)}
                                        </FormItem>
                                        <FormItem label="IMSI">
                                        { getFieldDecorator('imsi',{
                                            rules:[{
                                                message:'不超过15位、数字',
                                                pattern:/^[0-9]{1,15}$/
                                            }],
                                            initialValue:this.state.flag ? this.state.detail.imsi : ''
                                        })( < Input placeholder='不超过15位、数字' autoComplete='off'/>)}
                                        </FormItem>
                                    </div>
                                    : ''
                                }
                        </Col>
                    </Row>
                </Form>
            </div>
            </Modal>
            <style>
                {`
                    .treeBox{width:663px !important;height:607px !important;}
                    .treeBox .ant-form-item-label{width:78px;}
                    .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;}
                    .ant-select-tree{height:300px;overflow:scroll;}
                    .addBox .ant-row .ant-form-item{margin-bottom:15px}
                    .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    .inputRead{margin-bottom:15px;}
                    .ant-select-tree{height:200px !important;}
                    .shenhe .ant-form-explain{position:relative !important;}
                `}
            </style>
        </div>
        )
    }
}
const deviceAdds = Form.create()(deviceAdd);
export default deviceAdds;