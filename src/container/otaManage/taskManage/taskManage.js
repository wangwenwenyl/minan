/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import {Radio,Tabs,message,Collapse ,Form, Input, Icon, Select, Button,Breadcrumb, Popover,Pagination,Modal ,DatePicker } from 'antd';
import  Table  from "./../../../component/table/table";
import releasetask from './../../../img/releasetask.png'
import CommonTitle from './../otaCommonTitle'
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
import ReleaseTask from './releaseTask'
import {btnList} from './../../../util/util'
const FormItem = Form.Item;
class taskManage extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        pageNumber:1,
        current:1,
        pageSize:10,
        total:"",
        loading:true,
        collapseStatus:false,
        typeMoreNum:false,
        modelMoreNum:false,
        verifyModal:false,
        typeArr:[],
        useArr:[],
        tableData:[],
        btnList:'',
        record:'',
        columns:[
            { title: '序号', width: 60, dataIndex: 'number', fixed: 'left' },
            { title: '任务名称',dataIndex: 'taskName',className:'clounWidth',fixed: 'left',
                render:(text,record) => {
                    return (
                        <div title={record.taskName} className='overflowHandle' >
                            { record.taskName}
                        </div>
                    )
                }
            },
            { title: '设备类型',dataIndex: 'eqmTypeName' ,className:'clounWidth'},
            { title: '更新模式',dataIndex: 'updateModel',className:'clounWidth',
                render:(text,record) => {
                    return (
                        <div>
                            { record.updateModel === 1 ? '静默升级' : record.updateModel === '2' ? '提示升级' : ''}
                        </div>
                    )
                }
            },
            { title: '升级设备数',dataIndex: 'upgradeSum',className:'clounWidth'},
            { title: '升级开始时间',dataIndex: 'setStartTime',className:'clounWidth',
                render:(text,record) => {
                    let pointPosition=record.setStartTime.indexOf('.')
                    return(
                        <div>{record.setStartTime.slice(0,pointPosition)}</div>
                    )
                }
            },
            { title: '升级结束时间',dataIndex: 'setEndTime',className:'clounWidth',
                render:(text,record) => {
                    let pointPosition=record.setEndTime.indexOf('.')
                    return(
                        <div>{record.setEndTime.slice(0,pointPosition)}</div>
                    )
                }
            },
            { title: '状态',dataIndex: 'taskStatusStr',className:'clounWidth'},
            { title: '说明',dataIndex: 'successRateStr',className:'clounWidth'},
            {title: '操作',dataIndex:'operation',fixed: 'right',width:'160px',className:'operation',
              render: (text,record) => {
                  return (
                      <div className='action'>
                        {
                            this.state.btnList.includes('taskDetail') ?
                            <span onClick={ () => this.view(record)} >查看 &nbsp;&nbsp;</span>
                            : ''
                        }
                        { record.taskStatusStr === '任务已结束' ? '' : ( this.state.btnList.includes('stop') ? <span onClick={ () => this.stop(record)} >终止</span> : '' )}
                      </div>
                  )
              }
            }
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
        this.list(this.state.pageNumber,this.state.pageSize,typeArr,modelArr,useArr,timeFlag,keyword,time)
    }
    list = (pageNumber,pageSize,typeArr,modelArr,useArr,timeFlag,keyword,time) => {
        Axios.post(HttpUrl+'ota-mag/task/find',{
            'startPage':pageNumber,
            'pageSize':pageSize,
            'keyword':keyword || null,
            'timeFlag':Number(timeFlag),
            'eqmTypeIds':typeArr.length>0 ? typeArr : [],
            'eqmSeriesIds':modelArr.length>0 ? modelArr : [],
            'statusFlags':useArr.length>0 ? useArr : [],
            'startTime': time ? time[0] : null,
            'endTime':time  ? time[1] : null
        },httpConfig).then(res => {
            if(res.data.code === '100000'){
                let length
                if(!res.data.data){
                    length=[]
                    this.setState({
                        tableData:[],
                        total:'',
                        current:pageNumber,
                        loading:false
                    })
                }else{
                    length=res.data.data.list.length;
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
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    passwordSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if(!err){
                Axios.post('sys/system/user/checkPassword',{
                    password:this.props.form.getFieldValue('password')
                },httpConfig).then( res => {
                    if(res.data.code ==='100000'){
                        Axios.post(HttpUrl+'ota-mag/task/stopTask',{
                            'taskId':this.state.record.taskId
                        }).then(res => {
                            if(res.data.code==='100000'){
                                this.setState({
                                    verifyModal:false
                                })
                                this.list(this.state.pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.keyword,this.state.time)
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }else {
                        message.warning(res.data.message)
                    }
                })
            }
        })
    }
    view = (record) => {
        const menuid2=this.props.match.params.id
        this.props.history.push('/page/taskManage/jobDetail/'+menuid2,{query:{record:record.taskId,taskStatusStr:record.taskStatusStr}})
    }
    stop = (record) => {
        this.setState({
            verifyModal:true,
            record:record
        })
    }         
    //确认
    sureVerify = () => {
        this.passwordSubmit()
    }
    cancelVerify = () => {
        this.setState({
            verifyModal:false
        })
    }
    release = () => {
        this.form.release()
    }
    //分页
    onChange = (pageNumber) => {
        this.list(pageNumber,this.state.pageSize,this.state.typeArr,this.state.modelArr,this.state.useArr,this.state.timeFlag,this.state.keyword,this.state.time)
    }
    render() {
        const { getFieldDecorator }=this.props.form
        const {useArr}=this.state
        return (
        <div className="content" >
        <CommonTitle statusType='2' fileList={ (typeArr,modelArr,useArr,timeFlag,keyword,time) => this.fileList(typeArr,modelArr,useArr,timeFlag,keyword,time)}></CommonTitle>
            <div>
                <div  className='oprateHead'>
                    <Button type="primary" className='btn' ghost onClick={ this.release}>
                    <img src={releasetask} alt=""/>
                    发布任务</Button>
                </div>
                <div className='table' id='table'>
                    <Table
                        scroll={1650}
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
                title='登录密码验证'
                visible={this.state.verifyModal}
                okText="提交"
                cancelText="取消"
                onOk={ this.sureVerify }
                onCancel={ this.cancelVerify }
                maskClosable={false}
                destroyOnClose={true}
                style={{textAlign:'center'}}
            > 
                <Form layout="inline" onSubmit={ this.passwordSubmit}>  
                    <FormItem >
                    <div style={{textAlign:'center',marginBottom:'5px'}}> 请输入当前登录账户的密码</div>
                    {
                        getFieldDecorator('password',{
                            rules:[{
                                required:true,
                                message:'请输入当前登录账户的密码'
                            }]
                        })(
                            <Input type="password"/>
                        )
                    }
                    </FormItem>
                </Form>
            </Modal>
            <ReleaseTask wrappedComponentRef={(form) => this.form = form} taskList={() => this.list(this.state.pageNumber,this.state.pageSize,[],[],[])}></ReleaseTask>
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
                    .overflowHandle{width:170px;overflow:hidden;textOverflow:ellipsis;height:30px;whiteSpace:nowrap;line-height:30px}
                `}
            </style>
        </div>
        )
    }
}

const taskManages = Form.create()(taskManage);
export default taskManages;

