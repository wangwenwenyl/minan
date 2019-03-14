import React from 'react'
import { Button, Form,Input,Icon,Modal,message} from 'antd'
import { getAxiosData, postAxios,deleteAxios } from '../../../util/common'
import sysHttpurl from '../sysHttpurl'
import  Table  from "../../../component/table/table";
import  addFile from './../../../img/addFile.png'
import DataModify from './dataModify'

const FormItem = Form.Item
class DataDictionarys extends React.Component{
    constructor(){
        super()
        this.state={
            columns:[
                { title: '序号', width: 60, dataIndex: 'number'},
                { title: '分组名称', dataIndex: 'groupName'},
                { title: '分组Key', dataIndex: 'groupKey'},
                { title: '字典数量', dataIndex: 'dictionaryCount'},
                { title: '创建时间', dataIndex: 'createTime'},
                { title: '更新时间', dataIndex: 'modifyTime'},
                { title: '操作' , dataIndex:'operation',
                render: (text,record) => {
                    let _t = this
                    return (
                        <div className='action'>
                          {
                            this.state.pageButton && this.state.pageButton.map(function(item){
                                let fn = item.function
                                return(
                                    item.id!=1 &&
                                    <a style={{color:"#3689FF",marginLeft:'10px'}} key = {item.id} onClick={ () =>_t[fn](record)}>
                                        {item.name}
                                    </a>
                                )
                        })}
                        </div>
                    )
                }}
            ],
            tableData:[],
            loading:true,
            pageNumber:1,
            pageSize:10,
            total:'',
            addModal:false,  //新建弹框
            deleteModal:false,//删除
            modifyModal:false, //编辑
            record:'',   //列表行数据
            pageButton:[]
        }
    }
    componentDidMount(){
        this.pagebutton()
        this.initTable(this.state.pageNumber,this.state.pageSize)
    }
    onRef = (ref) => {
        this.child = ref
    }
    // 获取按钮权限
    pagebutton=()=>{
        let params = {
            pageId:this.props.match.params.id
        }
        console.log(this.props.match.params.id)
        getAxiosData(sysHttpurl.pagebutton,params,(data)=>{
            console.log(data)
            if(data.code === "100000"){
                this.setState({pageButton:data.data})
            }
        })
    }
    //初始化列表
    initTable=(pageNumber,pageSize,groupName)=>{
        let params = {
            startPage:pageNumber,
            pageSize:pageSize?pageSize:this.state.pageSize,
        }
        if(groupName)params.groupName=groupName
        getAxiosData(sysHttpurl.dataDictionary,params,(data)=>{
            if(data.code === "100000"){
                for(let i=0;i<data.data.list.length;i++){
                    data.data.list[i].number=i+1+(params.startPage-1)*params.pageSize;
                    data.data.list[i].key=i+1+(params.startPage-1)*params.pageSize;
                }
                this.setState({tableData:data.data.list,loading:false,total:data.data.total})
            }
        })
    }
    //分页
    onChange=(pageNumber)=>{
        this.initTable(pageNumber)
        this.setState({pageNumber:pageNumber})
    }
    //查询
    serach=()=>{
        let groupName = this.props.form.getFieldValue('groupNameSearch')
        if(groupName){
            this.initTable(this.state.pageNumber,this.state.pageSize,groupName)
        }
    }
    //清楚条件
    reset=()=>{
        this.props.form.resetFields()
        this.initTable(this.state.pageNumber,this.state.pageSize)
    }
    //新建弹窗显示
    addGroupName=()=>{
        this.modalStatus("addModal")
    }
    //编辑
    edit=(record)=>{
        this.setState({record,modifyModal:true})
        this.child.initlist(record.id)
    }
    modalStatus = (modal) =>{
        this.setState({[modal]:!this.state[modal],record:''})
        this.initTable(this.state.pageNumber,this.state.pageSize)
    }
    //新建完成
    addSubmit=()=>{
        this.props.form.validateFields((err, values) => {
            if(!err){
                let params=values
                postAxios(sysHttpurl.addGroup,params,(data)=>{
                    if(data.code ==="100000"){
                        this.modalStatus("addModal")
                        this.initTable(this.state.pageNumber,this.state.pageSize)
                    }else if(data.code== '210022'){
                        message.error(data.message)
                    }
                })
            }
        })
    }
    //删除
    delete=(record)=>{
        this.setState({record,deleteModal:true})
    }
    sureDelete=()=>{
        deleteAxios(sysHttpurl.deleteGroup+'/'+this.state.record.id,(data)=>{
            if(data.code === '100000'){
                this.initTable(this.state.pageNumber,this.state.pageSize)
                this.modalStatus('deleteModal')
            }else{
                message.error(data.message)
            }
        })
    }
    render(){
        const { getFieldDecorator }=this.props.form
        let _t = this
        return(
            <div className="content" >
                <div className='content-title'>   
                <Form layout="inline" >
                <div className="searchType">
                    <FormItem label="分组名称" style={{verticalAlign:'middle'}}>
                        {getFieldDecorator('groupNameSearch', {
                            rules: [{ message: '' }],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <Button type="primary" className="btn" style={{marginLeft:'54px'}} onClick={this.serach}>查询</Button>
                    <Button className='btn' onClick={this.reset}>清除条件</Button>
                </div>
                </Form>
                </div>
                <div  className='oprateHead'>
                    {this.state.pageButton && this.state.pageButton.map(function(item){
                        return(
                            item.id==1?
                            <Button key = {item.id} className='btn' ghost type="primary" onClick={_t[item.function]}
                            >
                                <img src={addFile} alt=""/>
                                {item.name}
                            </Button>:''
                        )
                    })}
                    {/* <Button type="primary" className='btn' ghost onClick={this.addGroupName}>
                    <img src={addFile} alt=""/>
                    新建分组</Button> */}
                </div>
                <div className='table'>
                    <Table
                        // scroll={1650}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        loading={this.state.loading}
                        total={this.state.total}
                        current={this.state.pageNumber}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}
                    />
                </div>
                {/* 新建弹框 */}
                <Modal
                    title={'新建分组'}
                    visible={this.state.addModal}
                    okText='确定'
                    cancelText="取消"
                    onCancel={ ()=>{this.modalStatus("addModal")}}
                    onOk={ this.addSubmit}
                    destroyOnClose={true}
                    width="400px"
                >
                <div>
                    <Form layout="inline" style={{textAlign:"center"}} onSubmit={this.addSubmit}>
                        <FormItem label="分组名称" style={{verticalAlign:'middle',marginBottom:"25px"}}>
                            {getFieldDecorator('groupName', {
                                rules: [
                                    {required:true ,message: '请输入分组名称'},
                                    {max:30,message:'分组名称不能超过30字符'}
                            ],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                        <FormItem label="分组KEY" style={{verticalAlign:'middle'}}>
                            {getFieldDecorator('groupKey', {
                                rules: [{required:true,message: '请输入分组KEY'},
                                {max:4,message:'分组KEY不能超过4个字符'}
                            ],
                            })(
                                <Input  />
                            )}
                        </FormItem>
                    </Form>
                </div>
                </Modal>
                {/* 删除 */}
                <Modal
                    title={"删除提示"}
                    visible={this.state.deleteModal}
                    okText='删除'
                    cancelText="取消"
                    onCancel={ ()=>{this.modalStatus('deleteModal')}}
                    onOk={ this.sureDelete}
                    destroyOnClose={true}
                    className='deleteBox'
                    footer={<div>
                    <Button  onClick={()=>{this.modalStatus('deleteModal')}}>取消</Button>
                    <Button style={{background:'#3689FF',color:'#fff',border:'none'}} onClick={this.sureDelete}>删除</Button>
                </div>}
                >
                <div>确定删除该分组下的数据字典吗？</div>
                </Modal>
                <DataModify onRef={this.onRef} modifyModal={this.state.modifyModal} record={this.state.record} modalStatus={this.modalStatus}></DataModify>
                <style>
                    {`
                        .ant-modal-footer div button:first-child{margin-right:40px;}
                        .deleteBox{width:463px !important;height:300px !important;}
                        .deleteBox .ant-form-explain{margin-left:35%;}
                    `}
                </style>
            </div>
        )
    }

}const DataDictionary = Form.create()(DataDictionarys)
export default DataDictionary