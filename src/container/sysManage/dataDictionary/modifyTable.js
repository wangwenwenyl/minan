import React from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Modal, Button,message } from 'antd';
import { putAxios, postAxios, deleteAxios } from './../../../util/common'
import sysHttpurl from './../sysHttpurl'
import { TextDecoder } from 'util';


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
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    } else if (this.props.dataIndex === 'type' || this.props.dataIndex === 'name' || this.props.dataIndex == 'dicValue') {
      return <Input maxLength={30} />;
    } else if (this.props.dataIndex === 'dicKey') {
      return <InputNumber maxLength={4} />;;
    }
    return <Input />;
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
                      message: `请输入${title}!`,
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

class EditableTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editingKey: '', deleteModal: false, record: '' };
    this.columns = [
      { title: '序号', width: 60, dataIndex: 'number' },
      {
        title: '类型', dataIndex: 'type', editable: true,
        render: (text, record) => {
          return (
            <span className="table_text" title={text}>{text}</span>
          )
        }
      },
      {
        title: '名称', dataIndex: 'name', editable: true,
        render: (text, record) => {
          return (
            <span className="table_text" title={text}>{text}</span>
          )
        }
      },
      { title: 'Key', dataIndex: 'dicKey', editable: true },
      {
        title: 'VAL', dataIndex: 'dicValue', editable: true,
        render: (text, record) => {
          return (
            <span className="table_text" title={text}>{text}</span>
          )
        }
      },
      { title: '排序', dataIndex: 'sort', editable: true },
      { title: '创建时间', dataIndex: 'createTime', width: 150 },
      { title: '更新时间', dataIndex: 'modifyTime', width: 150 },
      {
        title: '操作', dataIndex: 'operation', width: 100,
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
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
    console.log(this.props)
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
      params.gid = record.gid
      postAxios(sysHttpurl.addDictionary, params, (data) => {
        if (data.code === '100000') {
          this.props.initlist(record.gid, this.props.pageNumber, this.props.pageSize)
        } else if (data.code == '210024') {
          message.error(data.message)
        }
        this.setState({ editingKey: '' });
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
      params.gid = record.gid
      putAxios(sysHttpurl.editDictionary, params, (data) => {
        if (data.code === '100000') {
          this.props.initlist(record.gid, this.props.pageNumber, this.props.pageSize)
        } else if (data.code == '210024') {
          message.error(data.message)
        }
        this.setState({ editingKey: '' });
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
    deleteAxios(sysHttpurl.deleteDictionary + '/' + this.state.record.id, (data) => {
      if (data.code === '100000') {
        this.props.initlist(this.state.record.gid, this.props.pageNumber, this.props.pageSize)
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
            <FormItem label="名称" style={{ verticalAlign: 'middle' }}>
              {getFieldDecorator('groupName', {
                rules: [{ message: '' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="KEY" style={{ verticalAlign: 'middle' }}>
              {getFieldDecorator('groupKey', {
                rules: [{ message: '' }],
              })(
                <Input />
              )}
            </FormItem>
            <Button type="primary" className="btn" style={{ marginLeft: '54px' }} onClick={() => {
              this.props.searchlist(this.props.form.getFieldValue('groupName'),
                this.props.form.getFieldValue('groupKey')
              )
            }}>查询</Button>
            <Button className='btn' style={{ marginLeft: '20px' }} onClick={this.props.resetlist}>清除条件</Button>
          </div>
        </Form>
        <Table
          components={components}
          bordered
          dataSource={this.props.data}
          columns={columns}
          rowClassName="editable-row"
          className="modify_table"
          pagination={{
            current: this.props.pageNumber,
            pageSize: this.props.pageSize,
            total: this.props.total,
            onChange: this.props.onChange,
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
          <div>确定删除该数据字典吗？</div>
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