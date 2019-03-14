import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,Steps,Upload} from 'antd';
import {informSn,informTbox,validatorMobile,invoice,purchaserName,idcard} from '../../../util/validator'
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png';
import {httpConfig, HttpUrl} from '../../../util/httpConfig'
import { stringify } from 'querystring';
import moment from 'moment';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const format = 'YYYY-MM-DD';
const formats='YYYY-MM-DD HH:mm:ss'
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const Step = Steps.Step;//步骤条
var obj1={}
var obj2={}
var obj3={}
var objs1={}//总融合
class editInform extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state={
        vins:[],
        pageSize:10,
        pageNumber:1,
        defaultCurrent:1,
        current:1,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        typeTargetValue:'',
        typeArr:[],
        modelArr:[],
        // editVisible:false,
        selectedRowKeys:[],
        ids:[],
        carModelId:'',
        findSnId:'',
        record:'',
        downlineDate:'',
        outFactoryTime:'',
        operatData:'',
        stepCurent: 0,//步骤条
       
        
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
    }
    componentDidMount(){

    }
//查询车辆
searchList=()=>{
    this.listCar(this.state.pageNumber,this.state.pageNumber,this.state.record.id,
        this.props.form.getFieldValue('plateNo') || null,
        this.props.form.getFieldValue('vin') || null,
        this.props.form.getFieldValue('engine') || null,
        this.props.form.getFieldValue('purchaserName') || null,)
}

//清除条件
clearCondition = () => {
    
    this.props.form.resetFields()
    this.listCar(this.state.pageNumber, this.state.pageSize,this.state.record.id)
}
     //绑定列表
     listCar=(pageNumber,pageSize,idCard ,plateNo,vin, engine,purchaserName,)=>{
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
   },
      httpConfig).then( res => {
       if(res.status == 200 && res.data.code == '100000'){
           console.log(res)
           for (let i = 0; i < res.data.data.page.list.length; i++) {
               res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
               res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
           }
           this.setState({
               data: res.data.data.page.list,
               btnList: res.data.data.buttons,
               current: pageNumber,
               total: res.data.data.page.total,
               loading: false
           })
       }
   })
   }
   //要绑车辆翻页
   onChangeToBind=(pageNumber)=>{
    this.listCar(pageNumber,this.state.pageSize,this.state.record.idCard,
        this.props.form.getFieldValue('plateNo') ,this.props.form.getFieldValue('vin') ,
        this.props.form.getFieldValue('engine') ,this.props.form.getFieldValue('t-box'))
}
    //编辑
    editList=(record)=>{
      this.listCar(this.state.pageNumber,this.state.pageNumber,record.idCard)
        this.setState({
            editVisible:true,
            record:record,
        })
    }
    edithideModal=()=>{
        this.setState({
            editVisible:false,
            stepCurent:0,
        })
    }
    
       //清除条件
    clearCondition = () => {
        this.setState({
            

        })
        this.listCar( this.state.pageNumber,this.state.pageSize,'',

        this.props.form.getFieldValue('plateNo2') ,this.props.form.getFieldValue('vin2') ,
        this.props.form.getFieldValue('engine2') ,this.props.form.getFieldValue('t-box2'),this.state.ids)
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
              console.log(this.state.vins)
              console.log(vins)
         this.setState({
             vins:vins,
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
                            editVisible:false,
                            stepCurent:0,
                            vins:[],
                            selectedRows:[],
                        })
                        
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
  
handleChange=(info)=>{
    let fileList = info.fileList;
    fileList = fileList.slice(-1);
}

onChange1=(date, dateString)=>{
    console.log( dateString);
    this.setState({
        operatData:dateString
    })
}
keycode = (event) => {
    if(event.keyCode=='32'){
        event.preventDefault();
        return false;
    }
}
    render() {
        const uploadButton = (
          <div>
            <Icon type="plus-circle" />
          </div>
        );

        const { getFieldDecorator }=this.props.form
        
        const { selectedRowKeys } = this.state;
        const { steps } = this.state;
        const { stepCurent } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onChange :(selectedRowKeys) => {
                this.setState({ selectedRowKeys });
            }
        };
      
        let record=this.state.record;
        let editData=this.state.editData;
        let _t = this
        return (
        <div className="content" >
        <Modal
                title="绑定车辆"
                visible={this.state.editVisible} 
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                footer={null}
                onCancel={this.edithideModal}
                centered={true}
                className=" editModel"
                >
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
                                                <div className='table' id='table'>
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
                                    </Form>
                                :'' }
                                { this.state.stepCurent==1 ?
                                    <Form>
                                        <Row>
                                            <Col span={24}> 
                                                <Row style={{marginTop:'20px'}}>
                                                    <Col span={8}> 
                                                        <FormItem className="form_input2" label="车牌号：" labelCol={{span:6}} wrapperCol={{span:18}}>
                                                        {getFieldDecorator('plateNo',{
                                                            
                                                            })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                    
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={8}>
                                                        <FormItem  className="form_input2" label="t-box" labelCol={{span:7}} wrapperCol={{span:17}}>
                                                        {getFieldDecorator('t-box',{
                                                            })(<Input type="text"  autoComplete='off'  onKeyDown={this.keycode}/>)}
                                                    
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={8}>
                                                        <FormItem  className="form_input2" label="VIN：" labelCol={{span:6}} wrapperCol={{span:18}} >
                                                        {getFieldDecorator('vin',{
                                                                
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
                                                <div className='table' id='table'>
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
                                    </Form>
                                :''}
                            </div>
                            <div>  
                                <Form  className="stepFoot" style={{background:'#ffffff',zIndex:9999,marginLeft:'50%',marginTop:30,}}>
                                    {this.state.stepCurent==0 ? <Button  className='btn cielStep' type="primary"   onClick={this.edithideModal} style={{width:75,color:'#999999',marginLeft:-95,}}>取消</Button> : ''}
                                    {this.state.stepCurent==1 ? <Button  style={{width:75,marginLeft:-95,}} className='btn' onClick={this.prev}>上一步</Button> : ''}
                                    {this.state.stepCurent==0 ? <Button  style={{width:75,marginLeft:40}} className='btn' type="primary"   onClick={this.next}>下一步</Button> : ''}
                                    {this.state.stepCurent==1 ? <Button  style={{width:75,marginLeft:40}} className='btn' type="primary"   onClick={this.completeFinsh}>完成</Button> : ''}
                                </Form>
                            </div>   
                        </div>               
                    </div>                    
                </div>
            </Modal>
            <style>{`
                    
                    
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
                    
                   
                    .editStep .ant-input{width:180px;}
                    .editModel .ant-select-selection{width:180px;}
                    .editModel  .ant-btn-primary:hover,.editModel   .ant-btn-primary:focus{background:#ffffff!important;border:1px solid #40a9ff!important;color:#40a9ff!important}
                    
                    .cielStep{background:#ffffff!important;border-color:#cccccc!important}
                `}</style>
        </div>
        )
    }
}
const editInforms = Form.create()(editInform);
export default editInforms;