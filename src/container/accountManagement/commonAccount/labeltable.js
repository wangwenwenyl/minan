import React from 'react'
import { Table, Input,message, InputNumber, Popconfirm, Form, Modal, Button } from 'antd';
import Axios from 'axios'
import {httpConfig, HttpUrl} from "./../../../util/httpConfig";
import { putAxios, postAxios, deleteAxios } from './../../../util/common'
import {informSn,informTbox,validatorMobile,validatorLabelName} from '../../../util/validator'
import { TextDecoder } from 'util';
// import  Table  from "./../../../component/table/table";
const sysHttpurl = {
    dataDictionary:'sys/dictionary/groupList',   //数据字典列表
    addGroup:'sys/dictionary/addGroup',     //新建分组
    deleteGroup:"sys/dictionary/deleteGroup",
    modifylist:'sys/dictionary/dictionaryList',  //编辑--数据字典列表
    editDictionary:'sys/dictionary/editDictionary',  //编辑--修改数据字典
    addDictionary:'sys/dictionary/addDictionary',  //编辑--新建数据字典
    deleteDictionary:'sys/dictionary/deleteDictionary' //编辑--删除数据字典
}
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  // getInput = () => {
  //   if (this.props.inputType === 'number') {
  //     return <InputNumber />;
  //   } else if (this.props.dataIndex === 'type' || this.props.dataIndex === 'name' || this.props.dataIndex == 'dicValue') {
  //     return <Input maxLength={12} />;
  //   } else if (this.props.dataIndex === 'dicKey') {
  //     return <InputNumber maxLength={4} />;;
  //   }
  //   return <Input />;
  // };
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
                      validator:validatorLabelName
                    }],
                    initialValue: record[dataIndex],
                  })(<Input />)}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: '', deleteModal: false, record: '' };
    this.columns = [
      { title: '序号', width: 120, dataIndex: 'number' },
      { title: '名称', dataIndex: 'name', editable: true ,width: 200,
      render:(text,record)=>{
        return(
          <span className="table_text" title={text}>{text}</span>
        )
      }
    },
      { title: '用户数量', dataIndex: 'userCount', width: 180,
        render:(text,record)=>{
          return(
            <span className="table_text" title={text}>{text}</span>
          )
        }
    },
      
      {
        title: '操作', dataIndex: 'operation', width: 200,
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {record.name=="所有用户"?'':
                  editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => { (record.id != undefined) ? this.save(form, record) : this.addSave(form, record) }}
                        style={{ marginRight: 8 }}
                      >
                        保存
                          </a>
                    )}
                  </EditableContext.Consumer>
                  <a onClick={() => this.cancelData(record.key)}>取消</a>
                </span>
              ) : record.id != null ? (
                <span>
                  <a onClick={() => this.editData(record)}>编辑</a>
                  <a onClick={() => this.deleteData(record)} style={{ marginLeft: "8px" }}>删除</a>
                </span>
              ) : (
                    <span>
                      <a onClick={() => this.addData(record)}>新建</a>
                    </span>
                  )}
            </div>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.props.onRefs(this)
    
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  editData(record) {
    this.setState({ editingKey: record.key });
  }
  //新建
  addData = (record) => {
    this.setState({ editingKey: record.key });
  }
  addSave = (form, record) => {
    form.validateFields((error, row) => {
      console.log(row)
      if (error) {
        return;
      }
      let params = row
      
      postAxios('appserv/label/addUserLabel', params, (data) => {
        console.log(data)
        if (data.code === '100000') {
          this.props.initlist( this.props.pageNumber, this.props.pageSize)
          this.setState({ editingKey: '' });
        }else{
            message.warning(data.data)
        }
        
      })
    })
  }
  save(form, record) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      let params = row
      params.id = record.id
      params.status='0'
      Axios.post(HttpUrl+'appserv/label/updateUserLabel', params).then(res => {
        if (res.data.code === '100000') {
          this.props.initlist( this.props.pageNumber, this.props.pageSize)
          this.setState({ editingKey: '' });
        }else{
         
         message.warning(res.data.data)
      }
      })
    });
  }
  //删除
  deleteData = (record) => {
    this.setState({ deleteModal: true, record: record })
  }
  cancelData = () => {
    this.setState({ editingKey: '' });
  };
  cancelModal = () => {
    this.setState({ deleteModal: false, record: '' })
  }
  sureDelete = () => {
    postAxios('appserv/label/updateUserLabel',{id:this.state.record.id,status:'1'}, (data) => {
      if (data.code === '100000') {
        this.props.initlist(this.props.pageNumber, this.props.pageSize)
        this.cancelModal()
      }
    })
  }
  resetlistChild = () => {
    this.props.form.resetFields()
  }
  render() {
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
          inputType: col.dataIndex === 'sort' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form layout="inline" >
          <div className="searchModify">
            <FormItem label="标签" >
                { getFieldDecorator('name',{
                    
                    initialValue:this.state.flag ? this.state.record.receiverName : ''
                })( < Input   autoComplete="off" />)}
            </FormItem>
            
            <Button type="primary" className="btn" style={{ marginLeft: '54px' ,height:28,marginTop:4}} 
                 onClick={() => {this.props.searchlist(this.props.form.getFieldValue('name'))}}>查询
            </Button>
            <Button className='btn' style={{ marginLeft: '20px', height:28,marginTop:4}} 
               onClick={this.props.resetlist}>清除条件
            </Button>
          </div>
        </Form>
        <Table
          // onChange={this.props.onChange}
          components={components}
          pageSize={this.props.pageSize}
          total={this.props.total}
          current={this.props.current}
          dataSource={this.props.data}
          columns={columns}
          rowClassName="editable-row"
          className="modify_table"
          pagination={{
            showQuickJumper:true,
            // showSizeChanger:true,
            // size:this.props.size  || '',
            // pageSizeOptions:this.props.pageSizeOptions,
            current:this.props.current,
            total:this.props.total,
            // pageSize:this.props.pageSize,
            showTotal:(total,range) => `第${this.props.current}/${Math.ceil(total/10)}页  共${total}条`,
            onChange:this.props.onChange,
            // onShowSizeChange:this.props.onShowSizeChange
        }}
        />
        <Modal
          title={"删除提示"}
          visible={this.state.deleteModal}
          okText='删除'
          cancelText="取消"
          onCancel={this.cancelModal}
          onOk={this.sureDelete}
          destroyOnClose={true}
          className='deleteBox'
          footer={<div>
            <Button onClick={this.cancelModal}>取消</Button>
            <Button style={{ background: '#3689FF', color: '#fff', border: 'none' }} onClick={this.sureDelete}>删除</Button>
          </div>}
        >
          <div>确定删除该标签吗？</div>
        </Modal>
        <style>
          {`
            .ant-table-row >td:first-child{border-left:1px solid #e8e8e8}
            .modify_table table{border:none!important;display: block;padding-bottom: 20px;word-break:keep-all}
            .searchModify .ant-form-item-label{width:auto}
            .searchModify{margin-bottom:20px}
            .table_text{    
              display: block;
              width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 38px;
              padding:0 5px;
            }
          `}
        </style>
      </div>
    );
  }
}
const EditableTable = Form.create()(EditableTables)
export default EditableTable