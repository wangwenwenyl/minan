import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import Qs from 'qs'
import {message ,Form, Input, Modal,Table,InputNumber} from 'antd';
// import  Table  from "./../../../component/table/table";
import { httpConfig,HttpUrl } from '../../../util/httpConfig';

const data = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//   });
// }
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType == 'number') {
      console.log(this.props.inputType)
      return <InputNumber />;
    }
    return <Input maxLength={12}/>;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      // 好像是编辑时显示input的代码
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      // message: `不超过12位，区分大小写`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
class CarsortModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        data, 
        editingKey: '',
        carVisible:false,
        records:'',
        deleteModal:false,
        btnList:[]
     };
    this.columns = [
      {
        title: '车辆分类',
        dataIndex: 'carSortName',
        editable: true,
      },
     
      {
        title:'操作',
        className:'caozuo',
        width:200,
        render: (text, record) => {
          const editable = this.isEditing(record);
          const {btnList}=this.state
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.carSortId)}
                        style={{ marginRight: 8 }}
                      >
                        确定
                      </a>
                    )}
                  </EditableContext.Consumer>
                    <a onClick={() => this.cancel(record.carSortId)}>取消</a>
                </span>
              ) : (
                <span>
                  {  btnList.includes('adds') ? 
                    <a href="javascript:;" style={{marginRight:15}} onClick={()=>this.adds(record)}>添加</a>
                  :''}
                  {  btnList.includes('editss') ? 
                  <a href="javascript:;" style={{marginRight:15}} onClick={() => this.editss(record)}>编辑</a>
                  :''}
                  {  btnList.includes('delets') ? 
                  <a href="javascript:;" style={{marginRight:5}} onClick={() => this.delets(record)}>删除</a>
                  :''}
                </span>
              )}
            </div>
          );
        },
      },
    ];
  }
carsortList=(record,btnList)=>{
  console.log(btnList)
    this.treesList()
    this.setState({
        carVisible:true,
        btnList:btnList
    })
    console.log(this.state.btnList)
}
treesList=()=>{
    Axios.post(HttpUrl+'vehicle/carSort/findCarSortList',{
        startPage:-1
    },httpConfig).then(res=>{
        console.log(res)
        if(res.status == 200 && res.data.code === '100000'){
            for(let i=0;i<res.data.data.length;i++){
                res.data.data[i].key=res.data.data[i].carSortId;
               
                console.log(this.state.data)
            }
            this.setState({
              data:res.data.data,
          })
          console.log(document.querySelectorAll('.fenleis .ant-table-row-level-0 a')[1].style)
          var firstDom=document.querySelector('.fenleis .ant-table-row-level-0 a')
          document.querySelectorAll('.fenleis .ant-table-row-level-0 a')[1].style.display='none'
          document.querySelectorAll('.fenleis .ant-table-row-level-0 a')[2].style.display='none'
        }

    })
}
unAdd=()=>{
    this.setState({
        carVisible:false
    })
}
//点击添加
adds=(record)=>{
    this.props.form.resetFields()
    console.log(record)
    this.setState({
        record:record
    })
    document.getElementsByClassName('tablesAlert')[0].childNodes[0].style.display='inline-block'
    document.getElementsByClassName('tablesAlert')[0].childNodes[1].style.display='inline-block'
}
//添加-确认
addSure=()=>{
  console.log(this.props.form.getFieldValue('carSortName'),)
    this.props.form.validateFields((err, values) => {
      // if(this.props.form.getFieldValue('carSortName')==undefined){
      //   message.warning('请输入内容')
      // }else{
      if(!err){
       
        Axios.post(HttpUrl+'vehicle/carSort/saveCarSort',{
            carSortName:this.props.form.getFieldValue('carSortName'),
            parentId:this.state.record.carSortId
        },httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
                message.success('添加成功')
                this.props.form.resetFields()
                document.getElementsByClassName('tablesAlert')[0].childNodes[0].style.display='none'
                document.getElementsByClassName('tablesAlert')[0].childNodes[1].style.display='none'
                this.treesList()
            }else if(res.data.code=='220029'){
                this.props.form.resetFields()
                message.warning(res.data.message)
            }
        })
         
      }
    // }
    })
    
}
//取消添加
addCancel=()=>{
    document.getElementsByClassName('tablesAlert')[0].childNodes[0].style.display='none'
    document.getElementsByClassName('tablesAlert')[0].childNodes[1].style.display='none'
}
  isEditing = record => record.carSortId === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };
//确认编辑
  save=(form, key)=> {
    form.validateFields((error, row) => {
        if (error) {
            return;
        }
        console.log(key)
        Axios.post(HttpUrl+'vehicle/carSort/updateCarSort',{
            carSortName:row.carSortName,
            carSortId:this.state.editingKey
        },httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
                const newData = [...this.state.data];
                const index = newData.findIndex(item => key === item.carSortId);
                console.log(index)
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                    ...item,
                    ...row,
                    });
                    this.setState({ data: newData, editingKey: '' });
                } else {
                    this.treesList()
                    message.success('编辑成功')
                    this.setState({ data: newData, editingKey: '' });
                }
            }
        })
    });
  }

  editss=(record)=> {
      console.log(record)
    this.setState({ editingKey: record.carSortId });
  }
 
    //删除
    delets=(record)=>{
        this.setState({
            deleteModal:true,
            records:record
        })
    }
    deletesList=()=>{
        console.log(this.state)
        Axios.delete(HttpUrl+'vehicle/carSort/deleteCarSort/'+this.state.records.carSortId,httpConfig).then(res=>{
            if(res.status == 200 && res.data.code === '100000'){
                this.setState({
                    deleteModal:false
                })
                message.success('删除成功')
                this.treesList()
            }else if( res.data.code === '220001'){
                message.warning('存在子类，不允许删除')
            }
        })
    }
    unDelet=()=>{
        this.setState({
            deleteModal:false
        })
    }
    keycode = (event) => {
        if(event.keyCode=='32'){
            event.preventDefault();
            return false;
        }
    }
  render() {
    const { getFieldDecorator }=this.props.form
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
      
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex  ,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
        <div className="content" >
        <Modal
            title="分类管理"
            visible={this.state.carVisible} 
            onCancel={this.unAdd}
            destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
            maskClosable={false}
            className="fenleis editModel"
            destroyOnClose={true}
            footer={false}
            >
           <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            pagination={false} 
            // defaultExpandedRowKeys='1'
        />
            <div className='tablesAlert'>
                <div style={{ display:'none',width:372,borderRight:'1px solid #e8e8e8',height:'100%'}}>
                <Form>
                    <FormItem>
                        { getFieldDecorator('carSortName',{
                            rules: [{ required: true ,message:'该项为必填项，请重新输入'}]
                        })(<Input onKeyDown={this.keycode} maxLength={12} style={{display:'inline-block'}}/>)}
                    </FormItem>
                </Form>
                </div>
                <div style={{display:'none',width:198,height:'100%'}}>
                    <a href="javascript:;" style={{marginRight:15}} onClick={this.addSure}>确认</a><a href="javascript:;" style={{marginRight:15}} onClick={this.addCancel}>取消</a>
                </div>
            </div>
            
            </Modal>
            <Modal
             title="分类管理-删除"
             visible={this.state.deleteModal} 
             okText="确认"
            cancelText="取消"
             onOk={this.deletesList} 
             onCancel={this.unDelet}
             destroyOnClose={true}// 关闭弹窗时销毁弹窗中的信息
             maskClosable={false}
             className="deletsModal"
             >
                确认删除该分类？
            </Modal>
            <style>{`
                .tablesAlert{height:38px;width:574px;border:1px solid #e8e8e8;border-top:none;text-align:center;font-size:13px;line-height:38px;}
                .tablesAlert .ant-form-item-control{line-height:28px;text-align:left}
                .fenleis .ant-table-tbody td{text-align:left!important}
                .fenleis .ant-table-row .caozuo{text-align:center!important}
                .fenleis .ant-table-row-level-0>td{padding-left:10px!important}
                .deletsModal .ant-modal-body{padding:42px}
                .deletsModal{width:400px!important}
                .fenleis .ant-form-item-children{margin-left:19px!important}
                .fenleis .ant-form-item-control-wrapper .ant-input, .fenleis .ant-form-item-control-wrapper .ant-select{width:180px!important}
                .fenleis .ant-form-explain{display:inline-block;line-height:28px;padding-left:20px}
            `}
                </style>
    </div>
      
    );
  }
}

const CarsortModels = Form.create()(CarsortModel);
export default CarsortModels;
