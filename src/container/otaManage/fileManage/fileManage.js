/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {Radio,Tabs,message,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import ArrowDown from './../../../img/arrow.png'
import checkedArrow from './../../../img/checkedArrow.png'
import actionimg from './../../../img/actionimg.png'
import add from './../../../img/add.png'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import AddFile from './addFile'
import FileView from './fileView'
import CommonTitle from './../otaCommonTitle'
import {transformDate,btnList} from './../../../util/util'
import moment from 'moment';
import { timingSafeEqual } from 'crypto';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const BreadcrumbItem=Breadcrumb.Item;
const { RangePicker } = DatePicker;
class fileManage extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        remindModal:false,
        remindTitle:'',
        remindText:'',
        loading:true,
        typeMoreNum:false,
        modelMoreNum:false,
        typeArr:[],
        modelArr:[],
        useArr:[],
        time:[],
        tableData:[],
        btnList:'',
        title:'上传文件',
        record:'',
        columns:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '文件名称',dataIndex: 'fileName',className:'clounWidth',fixed: 'left',width:'230px'},
            { title: '设备类型',dataIndex: 'eqmTypeName' ,className:'clounWidth'},
            { title: '设备型号',dataIndex: 'eqmSeriesNames',className:'clounWidth'},
            { title: '支持最低版本号',dataIndex: 'minFromVersion' ,className:'clounWidth'},
            { title: '文件版本号',dataIndex: 'showVersion',className:'clounWidth',
                render:(text,record)=> {
                    return (
                        <div title={record.showVersion} className='overflows'>{record.showVersion}</div>
                    )
                }
            },
            { title: '文件发版时间',dataIndex: 'releaseTime',className:'clounWidth',
                render:(text,record) => {
                    return (
                        <div> {transformDate(text) }</div>
                    )
                }
            },
            { title: '文件大小',dataIndex: 'fileSize',className:'clounWidth',
                render:(text,record) => {
                    return (
                        <div>{record.fileSize}M</div>
                    )
                }
            },
            { title: '使用状态',dataIndex: 'useFlag',className:'clounWidth',
                render:(text,record) => {
                    return(
                        <div>
                            {record.useFlag === 0 ? '未使用' : record.useFlag === 1 ? '已使用' : '禁用'}
                        </div>
                    )
                }
            },
            { title: '备注',dataIndex: 'fileRemark',className:'clounWidth',
                render: (text,record) => {
                    return(
                        <div style={{width:'170px',overflow:'hidden',textOverflow:'ellipsis',height:'30px',whiteSpace:'nowrap',lineHeight:'30px'}}>
                            { record.fileRemark}
                        </div>
                    )
                }
            },
            {title: '操作人',dataIndex:'updateUserName',className:'clounWidth'},
            {title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',className:'operation',
              render: (text,record) => {
                  return (
                      <div className='action'>
                        <span onClick={ () =>  this.view(record)} >查看</span>&nbsp;&nbsp;
                        <span onClick={ () =>  this.editFile(record)} >编辑</span>&nbsp;&nbsp;
                        {
                            <span>
                                {
                                    !this.state.btnList.includes('fileUse')&&!this.state.btnList.includes('downLoad')
                                    ? '' :
                                    <Popover placement="bottom"   zIndex={999}  content={
                                        <span>
                                            <span onClick={ () =>  this.forbid(record)} >
                                                { record.useFlag === 2 ? ( this.state.btnList.includes('fileUse') ?  '启用' : '' ) : ( this.state.btnList.includes('fileNoUse') ?  '禁用' : '' )  }
                                            </span><br/>
                                            {
                                                this.state.btnList.includes('downLoad') ?
                                                <span onClick={ () =>  this.downloadFile(record)} >下载</span>
                                                : ''
                                            }
                                        </span>
                                    } trigger="click" className='popover'>
                                        <img src={actionimg} alt="" />
                                    </Popover>
                                }
                            </span>
                        }
                      </div>
                  )
              }
            },
        ]
    }
    componentDidMount(){
        btnList(this)
    }
    fileList = (typeArr,modelArr,useArr,timeFlag,keyword,time) => {
        this.setState({
            typeArr:typeArr,
            modelArr:modelArr,
            useArr:useArr,
            timeFlag:timeFlag,
            keyword:keyword,
            time:time
        })
        this.list(this.state.pageNumber,this.state.pageSize,typeArr,modelArr,useArr,keyword,time)
    }
    list = (pageNumber,pageSize,typeArr,modelArr,useArr,keyword,time) => {
        Axios.post(HttpUrl+'ota-mag/file/find',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'keyword':keyword || null,
            'eqmTypeIds':typeArr.length>0 ? typeArr : [],
            'eqmSeriesIds':modelArr.length>0 ? modelArr : [],
            'useFlags':useArr.length>0 ? useArr : [],
            'startTime': time ? time[0] : null,
            'endTime':time  ? time[1] : null,
        },httpConfig).then(res => {
            if(res.data.code === '100000'){
                let length
                if(res.data.data.list === null){
                    length=[]
                }else{
                    length=res.data.data.list.length
                }
                for(let i=0;i<length;i++){
                    res.data.data.list[i].number=i+1+(pageNumber-1)*pageSize;
                    res.data.data.list[i].key=i+1+(pageNumber-1)*pageSize;
                }
                this.setState({
                    tableData:res.data.data.list,
                    total:res.data.data.total,
                    current:pageNumber,
                    loading:false
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    addFile = () => {
        this.setState({
            title:'上传文件'
        })
        this.form.openModal('',1)
    }
    //时间选择
    dateChange = (moment,dateStrings,string) => {
        this.setState({
            time:dateStrings
        })
    }
    //查看
    view = (record) => {
        this.form2.view(record)
    }
    //编辑
    editFile = (record) => {
        this.setState({
            record:record
        })
        // 无法编辑，文件已被任务占用
        if(record.useFlag === 1){
            this.setState({
                remindModal:true,
                remindTitle:'提示',
                remindText:'无法编辑，文件已被任务占用'
            })
        }else{
            Axios.post(HttpUrl+'ota-mag/file/findFileById',{
                'fileId':record.fileId
            }).then(res => {
                if(res.data.code === '100000'){
                    this.form.openModal(res.data.data,1)
                }else{
                    message.warning(res.data.message)
                }
            })
            this.setState({
                title:'编辑文件'
            })
        }
    }
    //禁用、启用
    forbid = (record) => {
        this.setState({
            record:record
        })
        if(record.useFlag === 0){
            this.setState({
                remindModal:true,
                remindTitle:'禁用文件提示',
                remindText:'您确定禁用选中的文件吗？'
            })
        }else if(record.useFlag === 1){
            this.setState({
                remindModal:true,
                remindTitle:'提示',
                remindText:<div>无法禁用，文件已被任务占用</div>
            })
        }else{
            this.setState({
                remindModal:true,
                remindTitle:'启用文件提示',
                remindText:'您确定启用选中的文件吗？'
            })
        }
    }
    forbidFunction = (url) => {
        Axios.post(HttpUrl+url,{
            "fileId":this.state.record.fileId
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    remindModal:false
                })
                this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.keyword,this.state.time)
            }else{
                message.warning(res.data.message)
            }
        })
    }
    cancel = () => {
        this.setState({
            remindModal:false
        })
    }
    sure = () => {
        if(this.state.record.useFlag === 1){
            this.setState({
                remindModal:false
            })
        }else if(this.state.record.useFlag === 2 ){
            this.forbidFunction('ota-mag/file/enabled')
        }else{
            this.forbidFunction('ota-mag/file/forbid')
        }
    }
    //下载
    downloadFile = (record) => {
        let token=sessionStorage.getItem('token')
        window.location=HttpUrl+'ota-mag/file/downloadOtaUpgradeFile?fileId='+record.fileId+'&token='+token
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.keyword,this.state.time)
    }
    render() {
        return (
        <div className="content">
            <CommonTitle statusType='1' fileList={ (typeArr,modelArr,useArr,timeFlag,keyword,time) => this.fileList(typeArr,modelArr,useArr,timeFlag,keyword,time)}></CommonTitle>
            <div>
                <div  className='oprateHead'>
                    {
                        this.state.btnList.includes('addFile') ?
                        <Button type="primary" className='btn' ghost onClick={ this.addFile}>
                            <img src={add} alt=""/>
                            新增文件
                        </Button>
                        : ''
                    }
                </div>
                <div className='table' id='table'>
                    <Table
                        scroll={2050}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        loading={this.state.loading}
                        total={this.state.total}
                        current={this.state.current}
                        pageSize={this.state.pageSize}
                        onChange={this.onChange}
                    />
                </div>
            </div>
            <Modal
                title={this.state.remindTitle}
                visible={this.state.remindModal}
                okText="确定"
                cancelText="取消"
                onOk={this.sure}
                onCancel={ this.cancel}
                destroyOnClose={true}  
                className='addBox'
            >
                <div className='remintText'>
                    { this.state.remindText}
                </div>
            </Modal>
            <AddFile wrappedComponentRef={(form) => this.form = form} title={this.state.title} fileList={() => this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr,this.state.useArr) }></AddFile>
            <FileView wrappedComponentRef={(form) => this.form2 = form}></FileView>
            <style>
                {`

                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                    .action span{color:#3689FF;}
                    .action{text-align:left;padding-left:20px;}
                    .popoverBox div,img:hover{cursor: pointer;}
                    .searchType .ant-form-item-label{width:78px;}
                    .ant-form-inline .ant-form-item{margin-right:0px;}
                    .remintText{text-align:center;font-size:16px;}
                    .overflows{width:170px;overflow:hidden !important;text-overflow:ellipsis !important;white-space:nowrap !important;height:38px;line-height:38px;}
                `}
            </style>
        </div>
        )
    }
}

const fileManages = Form.create()(fileManage);
export default fileManages;