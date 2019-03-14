


import React, { Component } from 'react';
import Axios from 'axios';
import {Table,Radio,Tabs,message, Collapse ,Form, Input, Icon, Select, Row, Col,InputNumber,Popconfirm, Checkbox, Button,Breadcrumb,
     Popover,Pagination,Modal,Spin,DatePicker,TreeSelect,A} from 'antd';

import { httpConfig,HttpUrl } from '../../../util/httpConfig';
// import  Table  from "./../../../component/table/table";
import EditableTable from './labeltable';
import {carTypeNames,carNoticeModel,extensionMileage,carNoticeBatch,fastChargeTime,
    fastPercentage,dimensions,displacement,cylinderNumber,maximumPower} from '../../../util/validator';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { MonthPicker, RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
  //
class labelManage extends Component {
    constructor(props, context) {
        super(props, context);
  }
    state = {
        pageNumber:1,
        pageSize:100,
        editingKey: '',
        pages:1,
        current: '1',
        pageSize:10,
        currentPage:1,
        total: '',
        loading: false,
        carVisible:false,
        editable:'',  
           data:[],
        record:[],
        columns:[
            {
            title:'编号',
            dataIndex:'number'
        },{
            title:'名称',
            dataIndex:'name'
        },{
            title:'用户数量',
            dataIndex:'userCount'
        },{
            title:'操作',
            className:'caozuo',
            width:200,
            render: (text,record) => 
               {console.log(record)
                   return(
                   <div>
                       {
                           String(record.name) =='所有用户'?'':<span>
              <a href="javascript:;" style={{marginRight:15}}onClick={() => this.edit(form, record.key)}>编辑</a>
                         <a href="javascript:;" style={{marginRight:15}}>删除</a></span>}
                  </div>
                   )
                   }           
        }]
     };
     onRef = (ref) => {
        this.childs = ref
    }
    labelList=(pageNumber,pageSize,name)=>{
        Axios.post(HttpUrl+'appserv/label/getLabelList',{
             startPage:pageNumber,
             pageSize:pageSize,
             name:name
        },httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code === '100000'){
                for(let i=0;i<res.data.data.page.list.length;i++){
                    res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
                    res.data.data.page.list[i].key=i + (pageNumber - 1) * pageSize;
                }
                                console.log(parseInt(res.data.data.page.total/10)+1)
                if(pageNumber==parseInt(res.data.data.page.total/10)+1){
                    res.data.data.page.list.push({key:res.data.data.page.total+1,name:null,userCount:null})
                }
                

                this.setState({
                        pages:res.data.data.page.pages,
                        data:res.data.data.page.list,
                        current: pageNumber,
                        total: res.data.data.page.total,
                        loading: false
                    })
            }
           
        })
    }
    //清除条件
    clearCondition = () => {
        this.childs.resetlistChild()
      
        this.labelList(this.state.currentPage, this.state.pageSize,'')
    }
    //查询
    searchList1=(name)=>{
        this.labelList(this.state.currentPage,this.state.pageSize,name)
    }
    view=()=>{
        this.setState({
            carVisible:true
        })
        this.labelList(this.state.currentPage,this.state.pageSize,this.props.form.getFieldValue('name'))
    }
    unAdd=()=>{
        this.setState({
            carVisible:false,
        })
    }
    onChange=(pageNumber)=>{
        this.labelList(pageNumber,this.state.pageSize,this.props.form.getFieldValue('name'))
        }
  
    render() {
        const { getFieldDecorator }=this.props.form
        const {typeArr,record}=this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
              console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log(selected, selectedRows, changeRows);
            },
          };
        return (
            <div className="content" >
                <Modal
                    title="标签管理"
                    visible={this.state.carVisible} 
                    onOk={this.editModelsviv} 
                    onCancel={this.unAdd}
                    destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
                    maskClosable={false}
                    className="labelManage"
                    destroyOnClose={true}
                    footer={false}
                    >
                
                    
                    <EditableTable 
                        data={this.state.data} 
                        initlist={this.labelList} 
                        pageNumber={this.state.pageNumber}
                        pageSize={this.state.pageSize}
                        searchlist={this.searchList1}
                        resetlist={this.clearCondition}
                        total={this.state.total}
                        current={this.state.current}
                        onChange={this.onChange}
                        onRefs={this.onRef}
                        >
                    </EditableTable>
                    
                    
                    </Modal>
                    <style>{`
                    .labelManage{width:750px!important}
                        .tablesAlert{height:38px;width:574px;border:1px solid #e8e8e8;border-top:none;text-align:center;font-size:13px;line-height:38px;}
                        .tablesAlert .ant-form-item-control{line-height:28px}
                        .ant-table-tbody td{text-align:left!important}
                        .ant-table-row .caozuo{text-align:center!important}
                         `}
                    </style>
            </div>
        )
    }
}
const labelManages = Form.create()(labelManage);
export default labelManages;