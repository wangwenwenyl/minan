/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';
import Axios from 'axios';
import {Row,Col,Form,Modal,message,Input,TreeSelect,Select,AutoComplete,Radio,Steps,Tabs,Button,} from 'antd';
import { resolve } from 'url';
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import  Table  from "./../../../component/table/table";
import {deviceText2,informSn,versionCheck,validatorIdNumber, validatorPasswordInfo} from './../../../util/validator'
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Step = Steps.Step;//步骤条
class addEdit extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        
        lastLoginTimeStr:'',
        recordRebind:'',
        userId:'',
        rebingvisible:false,
        pageNumber:1,
        pageSize:10,
        ActiveKeyInner:'1',
        activeKeyOut:'1',
        optionData2:[],
        record:'',
        operation:'',
        addModal:false,
        treeData:[],
        flag:'',
        searchDataSource:[],
        data:[],
        data0:[],
        data1:[],
        data2:[],
        data3:[],
        selectedRowKeys:[],
        ids:[],
        vins:[],
        stepCurent: 0,//步骤条
        vinArr:'',
        vinId:'',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                fixed: 'left',
                width:60,
            }, {
                title: '车牌号',
                dataIndex: 'plateNo',
                
            }, {
                title: 'VIN码',
                dataIndex: 'vin',
              
            },{
                title: '车型-型号',
                dataIndex: 'carTypeModel',
               
            }, {
                title: '电机编号',
                dataIndex: 'engine',
                
            },  {
                title: '购买方名称',
                dataIndex: 'purchaserName',
                
            },{
                title: '状态',
                render: function (text, record) {
                    if (record.vehicleState == '0') {
                        return (<div>创建</div>)
                    } else if (record.vehicleState == '1') {
                        return (<div>已销售</div>)
                    }else if (record.vehicleState == '2') {
                        return (<div>已绑定</div>)
                    }  else  if (record.vehicleState == '3') {
                        return (<div>已解绑</div>)
                    }  else{
                        return (<div></div>)
                    }
                }
            }
        ],
        columns0: [
            {
                title: '序号',
                dataIndex: 'number',
                fixed: 'left',
                width:60,
            }, {
                title: '车牌号',
                dataIndex: 'plateNo',
                
            }, {
                title: 'VIN码',
                dataIndex: 'vin',
              
            },{
                title: '车型-型号',
                dataIndex: 'carTypeModel',
               
            }, {
                title: '电机编号',
                dataIndex: 'engine',
                
            },  {
                title: '设备类型-型号',
                dataIndex: 'snNo',
                
            },{
                title: '状态',
                render: function (text, record) {
                    if (record.onlineState == '0') {
                        return (<div>在线</div>)
                    } else if (record.onlineState == '1') {
                        return (<div>休眠</div>)
                    }else if (record.status == '2') {
                        return (<div></div>)
                    } 
                }
            }
        ],
        columns1: [
            {
                title: '序号',
                dataIndex: 'number',
            }, {
                title: '设备ID',
                dataIndex: 'id',
            }, {
                title: '设备名称',
                dataIndex: 'deviceName',
            },{
                title: '应用版本号',
                dataIndex: 'appVerNum',
                width:60,
            }, {
                title: '手机系统版本',
                dataIndex: 'systemVersion',
                width:60,
            },  {
                title: '手机型号',
                dataIndex: 'model',
                width:60,
            }, {
                title: '网络状态',
                dataIndex: 'netStatus',
            }, {
                title: '上次打开APP时间',
                dataIndex: 'openTime',
            }
        ],
        columns2: [
            {
                title: '序号',
                dataIndex: 'number',
                
            }, {
                title: '车牌号',
                dataIndex: 'plateNo',
                
            }, {
                title: 'VIN码',
                dataIndex: 'vin',
              
            },{
                title: '认证结果',
                dataIndex: 'networkStatus',
               
            }, {
                title: '绑定时间',
                dataIndex: 'createTime',
                
            },  {
                title: '绑定人',
                dataIndex: 'createUser',
                
            },{
                title: '操作',
                className: 'operation',
               
                render: (text, record) =>
                    <span style={{}}>
                        <a href="javascript:" style={{marginRight:15}} onClick={()=>this.reBindCar(record)}>解绑</a>
                       
                    </span>
              } 
        ],
        columns3: [
            {
                title: '序号',
                dataIndex: 'number',
               
            }, {
                title: '车牌号',
                dataIndex: 'plateNo',
                
            }, {
                title: 'VIN码',
                dataIndex: 'vin',
              
            },{
                title: '认证结果',
                dataIndex: 'networkStatus',
               
            }, {
                title: '解绑时间',
                dataIndex: 'createTime',
                
            },  {
                title: '解绑人',
                dataIndex: 'createUser',
                
            },
        ],
    }
    componentDidMount(){
       
    }
    //解绑
    reBindCar=(record)=>{
        this.setState({
            rebingvisible:true,
            recordRebind:record,
        })
    }
    cancelRebind=(record)=>{
        this.setState({
            rebingvisible:false,
            recordRebind:''
        })
    }
    sureRebind=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(1)
            if (!err) {
        let vins=[];
        vins.push(this.state.recordRebind.vin)
        Axios.post('sys/system/user/checkPassword',{
            password:this.props.form.getFieldValue('codeInfo')
        },httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='100000'){
                Axios.post(HttpUrl+"appserv/bind/untiedCar",
                {
                    userId:this.state.userId,
                    vins:vins,
                
                },
                httpConfig).then( res => {
                if(res.status == 200 && res.data.code == '100000'){
                    console.log(res)
                    this.bindCarlistNow(this.state.pageNumber, this.state.pageSize,this.state.userId)
                    this.setState({
                        rebingvisible:false,
                        recordRebind:''
                    })
                }
              })
           }
       }) 
    }})
    }
    onSelect = (value,node,extra) => {
        console.log(node.props.title.split('  '))
        new Promise(resolve => {
            this.setState({
                treeSelectValue:node.props.title.split('  '),
                parentId:node.props.parentId,
                childrenId:value.split(',')[0]
            })
            this.props.form.resetFields()
            resolve(node.props.parentName)
        }).then(res => {
            this.props.form.setFieldsValue({'eqmTypeName':res})
        })
    }

    //绑定列表
    listCar=(pageNumber,pageSize,idCard ,plateNo,vin, engine,purchaserName,ids)=>{
        //  第一步 车辆列表
      Axios.post(HttpUrl+"appserv/bind/getVehicleList",
      {
          startPage:pageNumber,
          pageSize:pageSize,
       idCard:idCard,
       plateNo:plateNo,
       vin:vin,
       engine:engine,
       tbox:purchaserName,
       ids:ids
   },
      httpConfig).then( res => {
       if(res.status == 200 && res.data.code == '100000'){
           console.log(res)
           for (let i = 0; i < res.data.data.page.list.length; i++) {
               res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
               res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
           }
           if(ids){
            this.setState({
                data0: res.data.data.page.list,
                btnList: res.data.data.buttons,
                current: pageNumber,
                total: res.data.data.page.total,
                loading: false
            })
           }else{
                 this.setState({
               data: res.data.data.page.list,
               btnList: res.data.data.buttons,
               current: pageNumber,
               total: res.data.data.page.total,
               loading: false
              })
            }
          
       }
   })
   }
    //要绑车辆翻页
    onChangeToBind=(pageNumber)=>{
        this.listCar(pageNumber,this.state.pageSize,this.state.record.idCard,
            this.props.form.getFieldValue('plateNo') ,this.props.form.getFieldValue('vin') ,
            this.props.form.getFieldValue('engine') ,this.props.form.getFieldValue('t-box'))
    }
    //清除条件

clearCondition = () => {
    
    
    // this.listCar( this.state.pageNumber,this.state.pageSize,'',

    //     this.props.form.getFieldValue('plateNo2') ,this.props.form.getFieldValue('vin2') ,
    //     this.props.form.getFieldValue('engine2') ,this.props.form.getFieldValue('t-box2'),this.state.ids)

    this.props.form.resetFields()
    this.listCar(this.state.pageNumber, this.state.pageSize,this.state.record.idCard)
}
    //绑车查询
    searchBindcar=()=>{
        this.listCar( this.state.pageNumber,this.state.pageSize,null,
    
            this.props.form.getFieldValue('plateNo') ,this.props.form.getFieldValue('vin') ,
            this.props.form.getFieldValue('engine') ,this.props.form.getFieldValue('t-box'),)
    }
    
  //步骤（1）绑定列表
  bindList=(pageNumber,pageSize,ids)=>{
      console.log(ids)
    Axios.post(HttpUrl+'appserv/bind/getVehicleList',{
       'ids':ids,
       'startPage':pageNumber,
       'pageSize':pageSize
   }).then(res => {
       console.log(res)
       if(res.data.code === '100000'){
           let vins=[];
            for (let i = 0; i < res.data.data.page.list.length; i++) {
                console.log(res.data.data.page.list[i].vin)
                vins.push(res.data.data.page.list[i].vin)
                this.state.vins.push(res.data.data.page.list[i].vin)
               res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
               res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
                }
                // console.log(this.state.vins)
                // console.log(vins)
           this.setState({
               vins:this.state.vins,
               stepCurent:1,
               data0: res.data.data.page.list,
               current: pageNumber,
               total: res.data.data.page.total,
               loading: false
           })
       }else{
           message.warning(res.data.message)
       }
   })
  
}

//下一步
next=()=> {
    if(this.state.ids.length>0){
        this.bindList(this.state.pageNumber,this.state.pageSize,this.state.ids)
    }else{
        message.warning('没有可绑定的车辆，无法下一步')
    }
  
}
//上一步
prev=()=> {
    this.listCar(this.state.pageNumber,this.state.pageNumber,this.state.record.idCard)
       this.setState({
           stepCurent:0,
       })
  
}
//绑车2部查询

searchBindcar2=()=>{
    
    this.listCar( this.state.pageNumber,this.state.pageSize,'',

        this.props.form.getFieldValue('plateNo2') ,this.props.form.getFieldValue('vin2') ,
        this.props.form.getFieldValue('engine2') ,this.props.form.getFieldValue('t-box2'),this.state.ids)
}
//2部车辆列表翻页
changeList2=(pageNumber)=>{
    this.listCar( pageNumber,this.state.pageSize,'',

        this.props.form.getFieldValue('plateNo2') ,this.props.form.getFieldValue('vin2') ,
        this.props.form.getFieldValue('engine2') ,this.props.form.getFieldValue('t-box2'),this.state.ids)
}
//完成
completeFinsh=()=>{
 
           Axios.post(HttpUrl+'appserv/bind/bindCar',
               {
                   vins:this.state.vins,
                   userId:this.state.record.id,
               }
           ,httpConfig).then(res => {
               if(res.status == 200 && res.data.code === '100000'){
                   message.success('绑定成功')
                   this.setState({
                      
                       stepCurent:0,
                       vins:[],
                       selectedRows:[],
                       ActiveKeyInner:'2'
                   })
                   this.bindCarlistNow(this.state.pageNumber,this.state.pageSize,this.state.userId)
               }else{
                   if(res.data.message){
                       message.warning(res.data.message)
                   }
               }
           })
 
   
}
//第一步
handleSubmitForm1 =  () => {
   this.setState({
       stepCurent:this.state.stepCurent+=1,
   })
}



 
onOk=(value)=> {
   console.log('onOk: ', value);
}


//改变外层
    ChangeItem=(value)=>{
        this.setState({
            activeKeyOut:value
        })
        if(value=='2'){
            this.setState({
                ActiveKeyInner:'2',
            })
            this.bindCarlistNow(this.state.pageNumber,this.state.pageSize,this.state.record.id)
        }else if(value=='1'){
                this.viewInfo(1,10,this.state.record.id)
        }
       
    }
    //当前绑定车辆
    bindCarlistNow = (pageNumber, pageSize,userId) => {
       
        Axios.post(HttpUrl + 'appserv/bind/getBindVehicleList', {
                'startPage': pageNumber,
                'pageSize': pageSize, 
                'userId':userId
        }, httpConfig).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.code === '100000') {
                for (let i = 0; i < res.data.data.page.list.length; i++) {
                    res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
                    res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
                }
                this.setState({
                    data2: res.data.data.page.list,
                    btnList: res.data.data.buttons,
                    current: pageNumber,
                    total: res.data.data.page.total,
                    loading: false
                })
            }
        })
      
    }
    //当前绑定翻页
    onChangeNowBind=(pageNumber)=>{
        this.bindCarlistNow(pageNumber,this.state.pageSize,this.state.userId)
    }
    //绑定历史纪录
    bindCarlistBefore = (pageNumber, pageSize,userId ) => {
        Axios.post(HttpUrl + 'appserv/bind/getBindHistoryList', {
                'startPage': pageNumber,
                'pageSize': pageSize,
                'userId':userId
        }, httpConfig).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.code === '100000') {
                for (let i = 0; i < res.data.data.page.list.length; i++) {
                    res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
                    res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
                }
                this.setState({
                    data3: res.data.data.page.list,
                    btnList: res.data.data.buttons,
                    current: pageNumber,
                    total: res.data.data.page.total,
                    loading: false
                })
            }
        })
      
    }
    //历史纪录翻页
    onChangeHistoryBind=(pageNumber)=>{
        this.bindCarlistBefore(pageNumber,this.state.pageSize,this.state.userId)
    }
    //内层改变
    ChangeItemInner=(value)=>{
        if(value.target.value=='2')
        {this.setState({
            ActiveKeyInner:value.target.value,
        })
            console.log(this.state.record.userId)
            this.bindCarlistNow(1,10,this.state.record.id)
        }else if(value.target.value=='3'){
            this.setState({
                ActiveKeyInner:value.target.value,
            })
            console.log(value)
            this.bindCarlistBefore(1,10,this.state.record.id)
        }else{
            this.setState({
                ActiveKeyInner:value.target.value,
            })
            console.log(value)
            
                this.listCar(this.state.pageNumber,this.state.pageSize,this.state.record.idCard,
                    this.props.form.getFieldValue('plateNo') ,this.props.form.getFieldValue('vin') ,
                    this.props.form.getFieldValue('engine') ,this.props.form.getFieldValue('t-box'))
            
        }
        
    }
    //获取查看信息
    viewInfo=( pageNumber,pageSize,id)=>{
         Axios.post(HttpUrl+'appserv/general/getAccountById',{id:id}, httpConfig).then(res => {
            console.log(res)
            if (res.data.code === '100000') {
                for (let i = 0; i < res.data.data.mobileInfo.list.length; i++) {
                    res.data.data.mobileInfo.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
                    res.data.data.mobileInfo.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
                }
                console.log(res.data.data)
                this.setState({
                    lastLoginTimeStr:res.data.data.userInfo.lastLoginTimeStr,
                    data1: res.data.data.mobileInfo.list,
                    current: pageNumber,
                    total: res.data.data.mobileInfo.total,
                    loading: false,
                })

                console.log(this.state.data1)
            }
        })
       
       
    }
//查看
    view=(record)=>{
        console.log(record)
        this.viewInfo(1,10,record.id)
        this.setState({
            userId:record.id,
            addModal:true,
            record:record,
            operation:'1',
            flag:'',
        })
    }
//编辑
    edit=(record)=>{
        Axios.get('sys/dictionary/dictionaryList?groupName=车辆管理&type=规约', httpConfig).then(res => {
            console.log(res)
            if (res.data.code === '100000' ) {
                for (let i = 0; i < res.data.data.list.length; i++) {
                   
                    var name = res.data.data.list[i].dicValue
                    this.state.optionData2.push(<Option value={res.data.data.list[i].dicValue} key={i}>{name}</Option>)
                }
            }
        })
        console.log(record)
        this.setState({
            addModal:true,
            operation:'2',
            flag:'1',
            record: record,
        })
    }
    addSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(1)
            if (!err) {
                console.log(12)
                console.log(this.state.operation)
                if(this.state.operation=='1'){     //新增
                    console.log(14)
                    Axios.post(HttpUrl+'sys/transmit/addTransmit',{
                        'id':this.state.record.id,
                        'receiverName':this.props.form.getFieldValue('receiverName') || null,
                        'address':this.props.form.getFieldValue('address') || null,
                        'port':this.props.form.getFieldValue('port') || null,
                        'username':this.props.form.getFieldValue('username') || null,
                        'password':this.props.form.getFieldValue('password') || null,
                        'protocol':this.props.form.getFieldValue('protocol') || null,
                        'status':this.props.form.getFieldValue('status') || null,
                        'editor':this.state.record.editor,
                        'remark':this.props.form.getFieldValue('remark') || null,
                    }).then(res => {
                        console.log(res)
                        if(res.data.code === '100000'){
                            this.setState({
                                addModal:false,
                            })
                            this.props.list()
                        }else{
                            message.warning(res.data.message)
                        }
                    })
                }else{  //编辑
                    console.log(13)
                        Axios.put(HttpUrl+'sys/transmit/editTransmit',{
                            'id':this.state.record.id,
                            'receiverName':this.props.form.getFieldValue('receiverName') || null,
                            'address':this.props.form.getFieldValue('address') || null,
                            'port':this.props.form.getFieldValue('port') || null,
                            'username':this.props.form.getFieldValue('username') || null,
                            'password':this.props.form.getFieldValue('password') || null,
                            'protocol':this.props.form.getFieldValue('protocol') || null,
                            'status':this.props.form.getFieldValue('status') || null,
                            'editor':this.state.record.editor,
                            'remark':this.props.form.getFieldValue('remark') || null,
                        }).then(res => {
                            console.log(res)
                            if(res.data.code === '100000'){
                                this.setState({
                                    addModal:false,
                                })
                                this.props.list()
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                }
            }
        })
    }
    sureAdd = () => {
        this.addSubmit()
    }
    //点击放大图片
    preview1=()=>{
        this.setState({
            previewVisible1:true,
        })
    }
    preview2=()=>{
        this.setState({
            previewVisible2:true,
        })
    }
    //取消放大
    handleCancel=()=>{
        this.setState({
            previewVisible1:false,
            previewVisible2:false,
        })
    }
    cancelAdd = () => {
        this.setState({
            activeKeyOut:'1',
            addModal:false,
            detail:'',
            treeSelectValue:[],
            treeData:[],
            flag:'',
            searchDataSource:[],
            vinArr:'',
            vinId:'',
            ids:[],
            selectedRowKeys: [],
        })
    }
    render() {
        const { getFieldDecorator}=this.props.form
        const { selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                this.state.ids = [];
                
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                    // this.state.vins.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.ids = [];
               
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                    // this.state.vins.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onChange :(selectedRowKeys) => {
                this.setState({ selectedRowKeys });
            }
        };
        return (
            <div className="content" >
                <Modal
                   
                    visible={this.state.addModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={ this.cancelAdd}
                    onOk={ this.sureAdd}
                    destroyOnClose={true}
                    maskClosable={false}
                    className='viewBox'
                    footer={null}
                   
                >
                    <div  className="viewModal">
                    <Tabs 
                     
                      onChange={this.ChangeItem}
                      activeKey={this.state.activeKeyOut}
                    >
                        <TabPane tab="查看信息" key="1">
                        <div className="viewInfo" style={{padding: '0px 30px'}}>
                        <Row>
                    <Col span={24} style={{borderBottom:'1px solid #F1F1F1 ' }}>
                        <Row className="tit-row">
                            <span></span><b>基本信息</b>
                        </Row>
                        <Form>
                        <Row style={{marginTop:'20px',marginLeft:40}}>
                            <Col span={14}> 
                                <FormItem className="form_input" label="车主姓名：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.name}</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                            <FormItem className="form_input" label="车主性别：" labelCol={{span:6}} wrapperCol={{span:18}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.sex=='0'?'男':'女'}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginLeft:40}}>
                            
                            <Col span={14}>
                            <FormItem className="form_input" label="手机号（账号)：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.mobile}</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                            <FormItem className="form_input" label="出生日期：" labelCol={{span:6}} wrapperCol={{span:18}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.birthdayStr}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{marginLeft:40}}>
                            <Col span={14}>
                            <FormItem className="form_input" label="身份证号：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.idCard}</span>
                                </FormItem>
                            </Col>
                            <Col span={10}>
                            <FormItem className="form_input" label="状态：" labelCol={{span:6}} wrapperCol={{span:18}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.status==null?'':this.state.record.status=='0'?'启用':'禁用'}{this.state.record.realNameAudit==null?'':this.state.record.realNameAudit=='0'?'-未认证':'-已认证'}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={14} className="formInfoWrapper" style={{marginLeft:40}}>
                            <FormItem className="form_input" label="用户标签：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.userLabel}</span>
                                </FormItem>
                           
                            <FormItem className="form_input" label="注册地址：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.province+this.state.record.city+this.state.record.area}</span>
                                </FormItem>
                           
                            <FormItem className="form_input" label="详细地址：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.address}</span>
                                </FormItem>
                          
                            <FormItem className="form_input" label="注册渠道：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.record.registeredChannels==0?'平台账号':'第三方授权'}</span>
                                </FormItem>
                            
                            <FormItem className="form_input" label="最后登录APP时间：" labelCol={{span:8}} wrapperCol={{span:16}} style={{paddingRight:'15px'}}>
                                <span  autoComplete='off'  >{this.state.lastLoginTimeStr}</span>
                                </FormItem>
                            </Col>
                            
                            
                            
                        </Row>
                         <div style={{marginLeft: 40,marginBottom:30}}>
                               <div className="photoImg" onClick={this.preview1}><img src={this.state.record.idCardPhotoFront} /></div>
                               <div className="photoImg" onClick={this.preview2}><img src={this.state.record.idCardPhotoContrary} /></div>
                            </div>
                            <Modal visible={this.state.previewVisible1} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%'}} src={this.state.record.idCardPhotoFront} />
                            </Modal>
                            <Modal visible={this.state.previewVisible2} footer={null} onCancel={this.handleCancel}>
                                <img alt="example" style={{ width: '100%'  }} src={this.state.record.idCardPhotoContrary} />
                            </Modal>
                        </Form>
                    </Col>
                   
                
                  
                    <Col span={24} className="table-wid" style={{borderBottom:'1px solid #F1F1F1 ' ,marginTop:10}}>
                        <Row className="tit-row" style={{marginBottom:20}}>
                            <span></span><b>手机终端信息</b>
                        </Row>
                        <div className="table tableInfo">
                          <Table
                            columns={this.state.columns1}
                            dataSource={this.state.data1}
                            loading={this.state.loading}
                            total={this.state.total}
                            current={this.state.current}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}
                          
                        
                        />
                        </div>
                      
                    </Col>
                    
                        
                </Row>
                        </div>
                                    
                        </TabPane>
                        <TabPane tab="绑定车辆" key="2"  style={{margin:'0 36px',width:800}}>
                            <Radio.Group defaultValue="2" onChange={this.ChangeItemInner} style={{ marginBottom: 16,width: '100%', }} buttonStyle="solid" className="buttonInner">
                                    <Radio.Button   value="1">绑车</Radio.Button>
                                    <Radio.Button style={{float:'right'}} value="3">历史绑定车辆</Radio.Button>
                                    <Radio.Button style={{float:'right'}} value="2">当前绑定车辆</Radio.Button>
                                    
                            </Radio.Group>
                            {this.state.ActiveKeyInner=='1'?
                            <div>
                                <div className="content" >
                                        <div>
                                            <div className='stepBox'>
                                                <Steps current={this.state.stepCurent}>
                                                    <Step title="选择车辆"/>
                                                    <Step title="绑定确认" />
                                                </Steps>
                                            </div>
                                            <div className='editStep' >
                                                { this.state.stepCurent==0 ?
                                                //style={{height:430,overflowY:'scroll'}}
                                                    <Form >
                                                        <Row>
                                                    <Col span={24}> 
                                                        <Row style={{marginTop:'20px'}}>
                                                            <Col span={8}> 
                                                                <FormItem className="form_input" label="车牌号：" labelCol={{span:6}} wrapperCol={{span:18}}>
                                                                {getFieldDecorator('plateNo',{
                                                                       
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                            
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="t-box" labelCol={{span:7}} wrapperCol={{span:17}}>
                                                                {getFieldDecorator('t-box',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                            
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="VIN：" labelCol={{span:6}} wrapperCol={{span:18}} >
                                                                {getFieldDecorator('vin',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="电机编号：" labelCol={{span:7}} wrapperCol={{span:17}} >
                                                                {getFieldDecorator('engine',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Button className='btn ' type="primary"   style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.searchBindcar}>查询</Button>
                                                                <Button className='btn ' type="primary"     style={{marginLeft: 20}} ghost onClick={this.clearCondition}>清除条件</Button>
                                                
                                                            </Col>
                                                        </Row>  
                                                    </Col>
                                                    <Col span={24}>
                                                        <Row style={{marginTop:'20px'}}>
                                                            <Col span={24}> 
                                                            
                                                                <div className='table tableInfo' id='table'>
                                                                <Table
                                                                    rowSelection={rowSelection}
                                                                    columns={this.state.columns}
                                                                    dataSource={this.state.data}
                                                                    loading={this.state.loading}
                                                                    total={this.state.total}
                                                                    current={this.state.current}
                                                                    pageSize={this.state.pageSize}
                                                                    onChange={this.onChangeToBind}
                                                                    onShowSizeChange={this.onShowSizeChange}
                                                                />
                                                            </div>
                                                       
                                                                
                                                            </Col>
                                                        </Row>
                                                    </Col>   
                                                </Row>
                                                </Form>:'' }
                                            </div>
                                            <div className='editStep twoeditStep'>
                                                { this.state.stepCurent==1 ?
                                                    <Col span={24}>
                                                        
                                                    <Row style={{marginTop:'20px'}}>
                                                    <Col span={24}> 
                                                        <Row style={{marginTop:'20px'}}>
                                                            <Col span={8}> 
                                                                <FormItem className="form_input" label="车牌号：" labelCol={{span:6}} wrapperCol={{span:18}}>
                                                                {getFieldDecorator('plateNo2',{
                                                                       
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                            
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="t-box" labelCol={{span:7}} wrapperCol={{span:17}}>
                                                                {getFieldDecorator('t-box2',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                            
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="VIN：" labelCol={{span:6}} wrapperCol={{span:18}} >
                                                                {getFieldDecorator('vin2',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <FormItem  className="form_input" label="电机编号：" labelCol={{span:7}} wrapperCol={{span:17}} >
                                                                {getFieldDecorator('engine2',{
                                                                        
                                                                    })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                                </FormItem>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Button className='btn ' type="primary"   style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.searchBindcar2}>查询</Button>
                                                                <Button className='btn ' type="primary"     style={{marginLeft: 20}} ghost onClick={this.clearCondition}>清除条件</Button>
                                                
                                                            </Col>
                                                        </Row>  
                                                    </Col>
                                                        <Col span={24}> 
                                                            <div className='table tableInfo' id='table'>
                                                                <Table
                                                                    rowSelection={rowSelection}
                                                                    columns={this.state.columns0}
                                                                    dataSource={this.state.data0}
                                                                    loading={this.state.loading}
                                                                    total={this.state.total}
                                                                    current={this.state.current}
                                                                    pageSize={this.state.pageSize}
                                                                    onChange={this.changeList2}
                                                                    onShowSizeChange={this.onShowSizeChange}
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col> :''}
                                            </div>
                                            <Col span={24}>
                                                <Form  className="stepFoot" style={{background:'#ffffff',zIndex:9999,width:'95%',marginLeft:'50%',marginTop:30,}}>
                                                    {this.state.stepCurent==0 ? <Button  className='btn cielStep' type="primary"   onClick={this.edithideModal} style={{width:75,color:'#999999',marginLeft:-95,}}>取消</Button> : ''}
                                                    {this.state.stepCurent==1 ? <Button  style={{width:75,marginLeft:-95,}} className='btn' onClick={this.prev}>上一步</Button> : ''}
                                                    {this.state.stepCurent==0 ? <Button  style={{width:75,marginLeft:40}} className='btn' type="primary"   onClick={this.next}>下一步</Button> : ''}
                                                    {this.state.stepCurent==1 ? <Button  style={{width:75,marginLeft:40}} className='btn' type="primary"   onClick={this.completeFinsh}>完成</Button> : ''}
                                                </Form>
                                            </Col>
                                            
                                        </div>
                                    <style>{`
                                    .ant-radio-button-wrapper:focus{
                                       background:#1890ff!important;
                                       color:#ffffff!important;
                                   }
                                    .viewInfo{margin:0px 30px}
                                     .viewInfo .ant-col-12{ height:100%}
                                            .label{color:#999;  width:120px;  text-align: left; line-height:45px;
                                                font-size:13px;    display:inline-block;}
                                            .itemDetail{color:#333;}
                                            .ant-select-selection{height:28px;border-radius:2px;}
                                            .ant-select{width:100%}
                                            .editModel .ant-calendar-picker{width:180px!important}
                                            .editModel{width:850px!important;}
                                            .stepBox .ant-steps{width:77%!important;padding-left:18%}
                                            .editModel .tit-row{padding-left:10px;}
                                            .editModel .tit-row span{left:0}
                                            .editModel .tit-row{margin-top:30px}
                                            .editModel .tit-row{font-size:14px;color:#3689FF;position: relative;margin-left:15px;}
                                            .editModel .tit-row span{width:2px;height:14px;background:#3689FF;position: absolute;left:-8px;top:4px;}
                                            
                                            .editModel .btn{width: 85px;height: 28px !important;margin-right: 20px; text-align: center;}
                                            .editStep .ant-input{width:180px;}
                                            .editModel .ant-select-selection{width:180px;}
                                            .editModel  .ant-btn-primary:hover,.editModel   .ant-btn-primary:focus{background:#ffffff!important;border:1px solid #40a9ff!important;color:#40a9ff!important}
                                         
                                           .cielStep{background:#ffffff!important;border-color:#cccccc!important}
                                        `}</style>
                                </div>

                            </div>:''}
                            {this.state.ActiveKeyInner=='2'?
                            <div>
                                <Col span={24}> 
                                    <div className='table tableInfo' id='table'>
                                        <Table
                                            columns={this.state.columns2}
                                            expandedRowRender={
                                                (record) =>{
                                                  return(
                                                    <div className="expandTable">
                                                    <table>
                                                    <tbody>
                                                        <tr>
                                                            <td></td>
                                                            <td>电机编号</td>
                                                            <td>{record.engine}</td>
                                                            <td>车型-型号</td>
                                                            <td>{record.carTypeModel}</td>
                                                        </tr>
                                                       
                                                        <tr>
                                                            <td></td>
                                                            <td>设备SN</td>
                                                            <td>{record.eqmCode}</td>
                                                            <td>设备类型-型号</td>
                                                            <td>{record.eqmSeriesName}</td>
                                                        </tr>
                                                        
                                                        </tbody>
                                                    </table>
                                                    </div>
                                                   )}
                                                 }
                                            dataSource={this.state.data2}
                                            loading={this.state.loading}
                                            total={this.state.total}
                                            current={this.state.current}
                                            pageSize={this.state.pageSize}
                                            onChange={this.onChangeNowBind}
                                            onShowSizeChange={this.onShowSizeChange}
                                        />
                                    </div>
                                </Col>
                            </div>:''}
                            {this.state.ActiveKeyInner=='3'?
                            <div>
                                <Col span={24}> 
                                    <div className='table tableInfo' id='table'>
                                        <Table
                                            columns={this.state.columns3}
                                           
                                            expandedRowRender={
                                                (record) =>{
                                                  return(
                                                    <div className="expandTable">
                                                    <table>
                                                    <tbody>
                                                        <tr>
                                                            <td></td>
                                                            <td>电机编号</td>
                                                            <td>{record.engine}</td>
                                                            <td>车型-型号</td>
                                                            <td>{record.carTypeModel}</td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td>设备SN</td>
                                                            <td>{record.eqmCode}</td>
                                                            <td>设备类型-型号</td>
                                                            <td>{record.eqmSeriesName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td>绑定时间</td>
                                                            <td>{record.bindTime}</td>
                                                            <td>绑定人</td>
                                                            <td>{record.operator}</td> 
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    </div>
                                                   )}
                                                 }
                                            dataSource={this.state.data3}
                                            loading={this.state.loading}
                                            total={this.state.total}
                                            current={this.state.current}
                                            pageSize={this.state.pageSize}
                                            onChange={this.onChangeHistoryBind}
                                            onShowSizeChange={this.onShowSizeChange}
                                        />
                                    </div>
                                </Col>
                            </div>:''}
                        </TabPane>
                        
                    </Tabs>,
                        
                    </div>
                </Modal>
                <Modal
                            title="解绑"
                            visible={this.state.rebingvisible}
                            okText="确定"
                            cancelText="取消"
                            onOk={ this.sureRebind}
                            onCancel={ this.cancelRebind}
                            maskClosable={false}
                            destroyOnClose={true}
                            zIndex='1001'
                            width='380px'
                            height='236px'
                        >
                        <div style={{margin:'0 auto',width:306}}>
                            <p style={{textAlign: 'center',}}><strong>确定解绑该车辆吗？</strong></p>
                            <div style={{marginLeft:32 }}>
                            <Form>
                                <FormItem>
                                    { getFieldDecorator('codeInfo',{
                                        rules: [
                                            { required: true ,validator:validatorPasswordInfo}
                                        ]})(

                                <Input type="password" style={{  width:240,  }} autoComplete="off"/>
                                )}
                                </FormItem>
                            </Form>
                             
                               
                            </div>
                            
                        </div>
                            
                        </Modal>
                <style>
                    {`
                     .tableInfo table td{ 
                        max-width:260px; 
                        word-wrap:break-word; 
                        text-overflow:ellipsis; 
                        white-space:nowrap; 
                        overflow:hidden; 
                    }
                    .expandTable table tr{
                        height:36px;
                        width:80px;
                        border:1px solid #fff;
                        background:##F1F2F4 ;
                  }
                  .expandTable table {
                     
                    height:150px;
                    width:650px;
                    border:1px solid #fff;
                    
              }
                    .expandTable table td{
                          height:36px;
                          width:120px;
                          border:1px solid #fff;
                          background:##F1F2F4 ;
                    }
                    .formInfoWrapper .ant-form-item-control-wrapper{
                        margin-left:-5px;
                    }
                    .viewInfo .ant-form-item {
                        margin-bottom:10px;
                    }
                    .table-wid .ant-table-thead > tr > th{
                        padding: 11px 14px !important;
                    }
                    
                    .photoImg img{
                        width:180px;
                        height:100px;
                    }
                     .photoImg{
                        height:100px;
                        width:180px;
                        margin-right:50px;
                        display:inline-block;
                    }
                    .viewInfo .ant-form-item-label{
                        text-align:left;
                    }
                    .viewModal .ant-tabs-nav .ant-tabs-tab{
                        padding: 12px 7px;
                    }
                    .viewBox .ant-modal-body{
                         padding: 0px; 
                    }
                    .viewModal .ant-tabs-bar{
                         border-bottom: none; 
                        margin: 0px 0px 20px 20px;
                    }
                    .width-info{ width:360px!important;}
                    .width-info1{ width:200px!important;}
                    .viewBox{width:880px !important;height:593px !important;}
                    .label{color:#999;width:91px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;}
                    .ant-select-tree{height:300px;overflow:scroll;}
                    .addBox .ant-row .ant-form-item{margin-bottom:15px}
                    .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    .inputRead{margin-bottom:15px;}
                    .ant-select-tree{height:200px !important;}
                `}
                </style>
            </div>
        )
    }
}
const addEdits = Form.create()(addEdit);
export default addEdits;