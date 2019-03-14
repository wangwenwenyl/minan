import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col, Checkbox, Button,Breadcrumb, Popover,Pagination,Modal,Spin,DatePicker,Steps,Upload} from 'antd';
import {informSn,informTbox,validatorMobile} from '../../../util/validator'
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png';
import {httpConfig, HttpUrl} from '../../../util/httpConfig'
import { stringify } from 'querystring';
import nodata1 from './../../../img/nodata1.png'
import nodata2 from './../../../img/nodata2.png'
import nodata3 from './../../../img/nodata3.png'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const format = 'YYYY-MM-DD';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
class onbindInform extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state={
        columnsBind:[{
            title: '手机号',
            dataIndex: 'mobile',
          }, {
            title: '车主姓名',
            dataIndex: 'name',
        }, {
            title: '车主身份证号',
            dataIndex: 'idcard',
        }, {
            title: '账号状态',
            dataIndex: 'state',
        }],
        data : [],
        pageSize:10,
        pageNumber:1,
        defaultCurrent:1,
        current:1,
        onbundVisible:false,
        selectedRowKeys:'',//选中的项
        selectedRows:'',
        vin:'',
        idcard:'',
        names:'',
        mobiles:'',
        idCard:'',
        dataStatus:1,
        loading:true,
    }
    onbundList=(record,vin,idCard)=>{
        console.log(record)
        console.log(vin)
        console.log(idCard)
        this.setState({
            onbundVisible:true,
            vin:vin,
            idCard:idCard
        })
        this.queryList(this.state.pageNumber,this.state.pageSize,idCard)
    }
    query=()=>{
        this.queryList(this.state.pageNumber,this.state.pageSize,this.state.idCard)
    }
    queryList=(pageNumber,pageSize,idCard)=>{
        this.setState({
            dataStatus:2
        })
        Axios.post(HttpUrl+"vehicle/vehicle/action/selectUserMessage",{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'name':this.props.form.getFieldValue('name')?this.props.form.getFieldValue('name'):null,
            'mobile':this.props.form.getFieldValue('mobile')?this.props.form.getFieldValue('mobile'):null,
            'idCard':idCard,
        },httpConfig).then( res => {
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.list.length;i++){
                    console.log(res.data.data.list[i].id)
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=res.data.data.list[i].id;
                }
                this.setState({
                    data:res.data.data.list,
                    pageNumber:pageNumber,
                    total:res.data.data.total,
                    loading:false
                })
                if(res.data.data.list.length === 0){
                    this.setState({
                        dataStatus:3
                    })
                }
                else{
                    this.setState({
                        dataStatus:''
                    })
                }
            }
        })
    }
    onbundEquip=()=>{
        var str=stringify(this.state.selectedRowKeys)
        var userId=str.split("=")[1]
        Axios.post(HttpUrl+"vehicle/vehicle/action/bindingUser",{
            'userId':userId,
            'vin':this.state.vin,
            'idcard':this.state.idcard,
            // 'name':this.state.names,
            // 'mobile':this.state.mobiles
        },httpConfig).then( res => {
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                message.success('绑定成功');
                this.setState({
                    onbundVisible:false
                })
                this.props.informList()
            }else{
                message.warning(res.data.message);
            }
        })
    }
    onbund=()=>{
        this.setState({
            onbundVisible:false
        })
    }
    //分页获取数据
    onChange = (pageNumber) =>{
        this.setState({
            selectedRowKeys:[]
        })
        this.queryList(pageNumber,this.state.pageSize,this.state.idCard)
    }
     //每页数量改变
    onShowSizeChange=(current,size)=>{
        this.setState({
            pageSize:size,
            pageNumber:current
        })
        this.queryList(current,size,this.state.idCard)
        
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
    render() {
        const { previewVisible,previewVisible1, previewImage,previewImage1, fileList,fileLists } = this.state;
        const uploadButton = (
          <div>
            <Icon type="plus-circle" />
          </div>
        );

        const { getFieldDecorator }=this.props.form
        const {typeArr}=this.state;
        const { selectedRowKeys } = this.state;
        const { steps } = this.state;
        const { stepCurent } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange :(selectedRowKeys,selectedRows) => {
        //         this.setState({ 
        //             selectedRowKeys
        //         });
        //         console.log(selectedRowKeys)
        //     }
    
    
        // };
        const rowSelection = {
            type:'radio',
            // selectedRows='',
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                    idcard:selectedRows[0].idcard,
                    names:selectedRows[0].name,
                    mobiles:selectedRows[0].mobile
                })
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
        let record=this.state.record;
        let _t = this
        return (
        <div className="content" >
            <Modal
                title="绑定"
                visible={this.state.onbundVisible} 
                onOk={this.onbundEquip} 
                onCancel={this.onbund}
                okText="绑定"
                cancelText="取消"
                destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                maskClosable={false}
                centered={true}
                className=" onbundModel"
                >
                <Form layout="inline" style={{marginBottom:20}}>
                    <FormItem className="form_input" label="手机号：">
                        { getFieldDecorator('mobile',{
                            validator:validatorMobile
                        })(<Input  onKeyDown={this.keycode} type="text" autoComplete='off' style={{width:120}}/>)}
                    </FormItem>
                    <FormItem className="form_input" label="车主姓名：">
                        { getFieldDecorator('name')(<Input type="text" onKeyDown={this.keycode} autoComplete='off' style={{width:120}}/>)}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.query} style={{width:70,height:26,marginLeft:24}}>查询</Button>
                    </FormItem>
                </Form>
                <Table
                    // scroll={1420}
                    rowSelection={rowSelection}
                    columns={this.state.columnsBind}
                    dataSource={this.state.data}
                    loading={this.state.loading}
                    total={this.state.total}
                    current={this.state.pageNumber}
                    pageSize={this.state.pageSize}
                    onChange={this.onChange}
                    onShowSizeChange={this.onShowSizeChange}
                />
                {
                    this.state.dataStatus === 1 ?
                    <div className='dataStatus' >
                            <img src={nodata1} alt=""/>
                            <div >温馨提示：请输入条件进行查询</div>
                    </div>
                    : this.state.dataStatus === 2 ? 
                    <div className='dataStatus' >
                            <img src={nodata2} alt=""/>
                            <div >查询中，请稍后...</div>
                    </div>
                    : this.state.dataStatus === 3 ? 
                    <div className='dataStatus' >
                            <img src={nodata3} alt=""/>
                            <div>哎呀，没有找到符合条件的数据</div>
                    </div>
                    : ''
                    
                }
            </Modal>
            <style>
                {`
                .onbundModel .dataStatus{z-index:999;left:40%!important}
                // .onbundModel .ant-table-placeholder{min-height:300px}
                .onbundModel .ant-table-body{min-height:300px}
                `}
                </style>
        </div>
        )
    }
}
const onbindInforms = Form.create()(onbindInform);
export default onbindInforms;