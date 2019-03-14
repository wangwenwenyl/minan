
import React, {Component } from 'react';
import { Table } from 'antd';
class Tables extends Component {
    constructor(props){
        super(props)
    }
    state={
        loadVisible:false,
        activeIndex:1,
        turnIndex:0
    }
    componentDidMount(){
       
       
    }
    click=(record,rowkey)=>{
        
    }
    render(){
        return (
            <div>
                <Table
                    locale={{emptyText:''}}
                    scroll={{ x: this.props.scroll }}
                    expandedRowRender={this.props.expandedRowRender}
                    rowSelection={this.props.rowSelection} 
                    columns={this.props.columns} 
                    dataSource={this.props.dataSource}
                    loading={this.props.loading}      
                    onRow={(record,rowkey) => {//表格行点击事件                  
                        return {                    
                            onClick : this.click.bind(this,record,rowkey)    //点击行 record 指的本行的数据内容，rowkey指的是本行的索引               
                        };                
                    }}
                    expandedRowRender={this.props.expandedRowRender}
                    pagination={{
                        showQuickJumper:true,
                        // showSizeChanger:true,
                        size:this.props.size  || '',
                        pageSizeOptions:this.props.pageSizeOptions,
                        current:this.props.current,
                        total:this.props.total,
                        pageSize:this.props.pageSize,
                        showTotal:(total,range) => `第${this.props.current}/${Math.ceil(total/this.props.pageSize)}页  共${total}条`,
                        onChange:this.props.onChange,
                        // onShowSizeChange:this.props.onShowSizeChange
                    }}
                />
                <style>
                    {`
                        .ant-table-thead > tr > th{white-space:nowrap;padding:11px 20px !important; }
                        table{overflow:hidden}
                        .ant-table-wrapper{overflow:hidden;}
                        .ant-pagination{padding-right:10px;color:#333333}
                        .ant-pagination-total-text{padding-left:10px;position:absolute;left:10px;}
                        .ant-table{overflow-y:auto;}
                    `
                    }
                </style>
            </div>
        )
    }
}
export default Tables