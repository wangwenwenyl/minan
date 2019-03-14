import React from 'react'
import { Modal } from 'antd'
import { getAxiosData } from './../../../util/common'
import sysHttpurl from './../sysHttpurl'
import Table from './../../../component/table/table'
import EditableTable from './modifyTable'


class dataModify extends React.Component {
    constructor() {
        super()
        this.state = {
            columns: [
                { title: '序号', width: 60, dataIndex: 'number' },
                { title: '类型', dataIndex: 'type' },
                { title: '名称', dataIndex: 'name' },
                { title: 'Key', dataIndex: 'key' },
                { title: 'VAL', dataIndex: 'value' },
                { title: '排序', dataIndex: 'sort' },
                { title: '创建时间', dataIndex: 'createTime' },
                { title: '更新时间', dataIndex: 'modifyTime' },
                {
                    title: '操作', dataIndex: 'operation',
                    render: (text, record) => {
                        return (
                            <div className='action'>
                                <span onClick={() => this.edit(record)} ><a style={{ color: "#3689FF" }}>编辑</a></span>&nbsp;
                        </div>
                        )
                    }
                }
            ],
            data: [],
            pageNumber: 1,
            pageSize: 10,
            loading: true,
            total: ''
        }
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    onRef = (ref) => {
        this.childs = ref
    }
    //数据字典列表
    initlist = (id, pageNumber, pageSize, groupName, groupKey) => {
        let params = {
            startPage: pageNumber ? pageNumber : this.state.pageNumber,
            pageSize: pageSize ? pageSize : this.state.pageSize,
            gid: id
        }
        if (groupName) params.name = groupName
        if (groupKey) params.dicKey = groupKey
        getAxiosData(sysHttpurl.modifylist, params, (data) => {
            if (data.code === "100000"){
                for (let i = 0; i < data.data.list.length; i++) {
                    data.data.list[i].number = i + 1 + (params.startPage - 1) * params.pageSize;
                    data.data.list[i].key = i + 1 + (params.startPage - 1) * params.pageSize;
                }
            if (data.data.list.length != params.pageSize && params.startPage == data.data.pages) {
                data.data.list.push({ key: data.data.list.length + 1, gid: id, type: null, name: null, dicKey: null, dicValue: null, sort: null })
            }else if(params.startPage > data.data.pages && data.data.list.length == 0){
                data.data.list.push({ key: data.data.list.length + 1, gid: id, type: null, name: null, dicKey: null, dicValue: null, sort: null })
                this.setState({ total: data.data.total + 1 , pageNumber: params.startPage +1})
            }else if(data.data.list.length == params.pageSize){
                this.setState({ total: data.data.total+1})
            }else{
                this.setState({ total: data.data.total})
            }
            this.setState({ data: data.data.list, loading: false, pageNumber: params.startPage })

        }})
    }
    onChange = (pageNumber) => {
        this.initlist(this.props.record.id, pageNumber)
    }
    searchlist = (groupName, groupKey) => {
        this.initlist(this.props.record.id, '', '', groupName, groupKey)
    }
    resetlist = () => {
        this.childs.resetlistChild()
        this.initlist(this.props.record.id, this.state.pageNumber, this.state.pageSize)
    }
    initState = () => {
        this.setState({ pageNumber: 1 })
    }
    render() {
        return (
            <div>
                <Modal
                    title={"编辑字典:" + this.props.record.groupName}
                    visible={this.props.modifyModal}
                    okText='提交'
                    cancelText="取消"
                    onCancel={() => {
                        this.props.modalStatus('modifyModal')
                        this.initState()
                    }
                    }
                    onOk={this.sureAdd}
                    destroyOnClose={true}
                    footer={null}
                    width="950px"
                >
                    <EditableTable
                        data={this.state.data}
                        initlist={this.initlist}
                        pageNumber={this.state.pageNumber}
                        pageSize={this.state.pageSize}
                        searchlist={this.searchlist}
                        resetlist={this.resetlist}
                        onRefs={this.onRef}
                        onChange={this.onChange}
                        total={this.state.total}
                    >
                    </EditableTable>
                </Modal>
            </div>
        )
    }
}

export default dataModify