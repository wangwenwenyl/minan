/**
 * Created by ts on 2018/11/20.
 */
// 账号管理》一般账号
import React, {Component} from 'react';
import Axios from 'axios'
// import moment from 'moment';
import ArrowDown from './../../../img/arrow.png'
import {httpConfig, HttpUrl} from "./../../../util/httpConfig";
import checkedArrow from './../../../img/checkedArrow.png'
import {validatorMobile, validatorPhone, keycode,validatorIdNumber,validatorPassword,validatorPasswordInfo} from './../../../util/validator';
import  Table  from "./../../../component/table/table";
import actionimg from './../../../img/actionimg.png'
import imports from './../../../img/imports.png'
import exports from './../../../img/exports.png'
import newadd from './../../../img/newadd.png'
import AddEdit from './add'
import  ImportExcel  from "./../../../component/import/importExcel2";
import LabelManage from './labelManagement'
import BindCar from './bindCar'
import ViewModal from './viewModal'
import label from './../../../img/label.png'
import {
    Radio, Card, Form, Input, Tooltip, Collapse, Transfer, Icon, Cascader, Select,Popover, Row, Col, Checkbox, Button, Modal, message,
} from 'antd';
import labelManages from './labelManagement';
const {TextArea} = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Option = Select.Option;
class commonAccounts extends Component {
    constructor(props, context) {
        super(props, context);
        // this.context.router;
    }

    state = {
        token:sessionStorage.getItem('token'),
        promptInfo:'',
        titleInfo:'',
        warningInfo:'',
        codeVisible:false,
        typeArr:[],
        typeArr1:[],
        selectedRowKeys: [],
        pageNumber: 1,
        defaultCurrent: 1,
        current: 1,
        pageSize: 10,
        record:'',
        total: '',
        collapseStatus: false,
        typeMoreNum: false,
        modelMoreNum: false,
        connectModal: false,
        noConnectData: [],
        targetKeys: [],
        vins: [],
        userId: '',
        unbindData: '',
        columns: [
            {
                title: '序号',
                dataIndex: 'number',
                fixed: 'left',
                width:60,
            }, {
                title: '账号',
                dataIndex: 'mobile',
                
            }, {
                title: '姓名',
                dataIndex: 'name',
              
            },{
                title: '用户标签',
                dataIndex: 'userLabel',
               
            }, {
                title: '注册时间',
                dataIndex: 'createTimeStr',
                
            }, {
                title: '状态',
                render: function (text, record) {
                    if (record.accountStatus == '0') {
                        return (<div>启用-已认证</div>)
                    } else if (record.accountStatus == '1') {
                        return (<div>禁用-已认证</div>)
                    } else if (record.accountStatus == '2') {
                        return (<div>已注销-已认证</div>)
                    } else if (record.accountStatus == '3'){
                        return (<div>已注销-未认证</div>)
                    } else if (record.accountStatus == '4'){
                        return (<div>启用-未认证</div>)
                    } else if (record.accountStatus == '5'){
                        return (<div>禁用-未认证</div>)
                    } else {
                        return (<div></div>)
                    }
                }
            }, {
                title: '车辆数量',
                dataIndex: 'vehicleCount',
               
            },{
                title: '操作',
                className: 'operation',
                fixed: 'right',
                width: '140px',
                render: (text, record) =>
                    <span style={{}}>
                         <a href="javascript:" style={{marginRight:15}} onClick={()=>this.viewList(record)}>查看</a>
                       {record.status=='2'?'':<a href="javascript:" style={{marginRight:15}} onClick={()=>this.editInform(record)}>编辑</a>}
                        {record.status=='2'?'':<span>
                            <Popover placement="bottom"  zIndex={999}  content={
                                <span>
                                    {record.accountStatus=='0'?<p className="toggleStyle"><a href="javascript:" onClick={()=>this.bindCar(record)}>绑定车辆</a></p>:''}
                                    {record.status=='2'? '':record.status=='0'?<p className="toggleStyle"><a href="javascript:"  onClick={()=>this.unuse(record)}>禁用</a></p>:
                                    <p className="toggleStyle"><a href="javascript:"  onClick={()=>this.toUse(record)}>启用</a></p>}
                                    {record.status=='2'?'': <p className="toggleStyle"><a href="javascript:" onClick={()=>this.writtenOff(record)}>注销</a></p>}
                                    {record.status=='0'? <p className="toggleStyle"><a href="javascript:"  onClick={()=>this.resetCode(record)}>密码重置</a></p>:''}
                                    {record.status=='0'?<p className="toggleStyle"><a href="javascript:" onClick={()=>this.resetPinCode(record)}>PIN码重置</a></p>:''}
                                        </span> 
                                } trigger="click" className='popover'>
                                    <img src={actionimg} alt="" />
                            </Popover>
                        </span>}
                    </span>
              } 
        ],
        data: [],
    };
        //启用
        toUse=(record)=>{
            this.setState({
                operateType:'0',
                record:record,
                codeVisible:true,
                titleInfo:'启用',
                warningInfo:'账号启用后，APP端可以登录，同时该账号可用于注册新的账号',
                promptInfo:'确定启用该账号吗？'
            })
        }
        //禁用
        unuse=(record)=>{
            this.setState({
                operateType:'0',
                record:record,
                codeVisible:true,
                titleInfo:'禁用',
                warningInfo:'账号禁用后，APP端无法登录，需通过后台系统重新启用，同时该账号无法用于注册新的账号',
                promptInfo:'确定禁用该账号吗？'
            })
        }
        //注销
        writtenOff=(record)=>{
            this.setState({
                operateType:'1',
                record:record,
                codeVisible:true,
                titleInfo:'注销',
                warningInfo:'账号注销后，该账号永久失效，APP端用户可用该账号注册新的账号，新账号不保留之前账号中的的数据',
                promptInfo:'确定注销该账号吗？'
            })
        }
    //密码重置
    resetCode=(record)=>{
        this.setState({
            operateType:'2',
            record:record,
            codeVisible:true,
            titleInfo:'密码重置',
            warningInfo:'密码重置后，将会以短信方式，将新密码发给用户',
            promptInfo:'确定重置该账号密码吗？'
        })
    }
    //PIN码重置
    resetPinCode=(record)=>{
        this.setState({
            operateType:'3',
            record:record,
            codeVisible:true,
            titleInfo:'PIN码重置',
            warningInfo:'密码重置后，将会以短信方式，将新PIN码发给用户',
            promptInfo:'确定重置该账号的PIN码吗？'
        })
    }
    //  确认修改
    sureChange=()=>{
        this.props.form.validateFields((err, values) => {
            console.log(1)
            if (!err) {
        Axios.post('sys/system/user/checkPassword',{
            password:this.props.form.getFieldValue('codeInfo')
        },httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='100000'){
                
                if( this.state.operateType=='0'|| this.state.operateType=='1'||this.state.operateType=='5'){
            Axios.post('appserv/general/updateAccountById', {
                'id': this.state.record.id,
                'mobile': this.state.record.mobile,
                'operateType': this.state.operateType,
            }, httpConfig).then(res => {
                if (res.data.code === '100000') {
                   message.warning('操作成功')
                   this.setState({
                    codeVisible:false,
                   })
                    this.list(this.state.current, this.state.pageSize, this.props.form.getFieldValue('mobile') || null,this.state.typeArr)
                }
            })
        }else{
            Axios.post('appserv/general/updateAccountPwdById', {
            'id': this.state.record.id,
            'mobile': this.state.record.mobile,
            'operateType': this.state.operateType
        }, httpConfig).then(res => {
            if (res.data.code === '100000') {
               message.warning('操作成功')
               this.setState({
                codeVisible:false,
               })
                this.list(this.state.current, this.state.pageSize, this.props.form.getFieldValue('mobile') || null,this.state.typeArr)
            }
        })
        }
            }else{
                message.warning(res.data.message)
            }
        })
        
        
    }

    })
}
    //查看
    viewList=(record)=>{
        this.viewForm.view(record)
    }
    componentDidMount() {
        new Promise(resolve => {
            this.setState({
                menuid: this.props.match.params.menuid
            })
            resolve(true)
        }).then(v => {
            this.list(this.state.defaultCurrent, this.state.pageSize, '',[])
        })
    }

    importList = () => {
        this.commonList(this.state.defaultCurrent, this.state.pageSize, this.state.menuid)
    }
    //分页获取数据
    onChange = (pageNumber) => {
        this.list(pageNumber, this.state.pageSize,this.props.form.getFieldValue('searchType') || null,this.state.typeArr)
    }
      
    //编辑
    editInform=(record)=>{
        this.addFormRef.edit(record)
    }
    //新建
    add = () => {
        this.addFormRef.add();
    }
    //查看
    view = (record) => {
        console.log(record)
        this.form.check(record, 1);
        this.setState({
            userId: record.id
        })
    }
//标签管理
labelmanage=()=>{
    this.labelFormRef.view()
}
    //绑定车辆
    bindCar = (record) => {
        this.bindFormRef.editList(record)
    }
    cancelConnect = () => {
        this.setState({
            connectModal: false,
            targetKeys: '',
            vins: [],
            unbindvins: [],
            userId: '',
            unbindData: '',

        })
    }
    //查询
    searchList = () => {
        this.list(this.state.defaultCurrent, this.state.pageSize, this.props.form.getFieldValue('mobile') || null,this.state.typeArr)
    }
    //查询列表
    list = (pageNumber, pageSize, mobile,statusList) => {
        var statusList1=null;
        if(statusList.length!==0){
            statusList1=statusList
        }
        Axios.post(HttpUrl + 'appserv/general/getAccountList', {
                'startPage': pageNumber,
                'pageSize': pageSize,
                'mobile': mobile,
                'statusList': statusList1,   
                "sortName":'create_time',
                "sortNum":'0',
        }, httpConfig).then(res => {
            console.log(res)
            if (res.status == 200 && res.data.code === '100000') {
                for (let i = 0; i < res.data.data.page.list.length; i++) {
                    res.data.data.page.list[i].number = i + 1 + (pageNumber - 1) * pageSize;
                    res.data.data.page.list[i].key = i + 1 + (pageNumber - 1) * pageSize;
                }
                this.setState({
                    data: res.data.data.page.list,
                    btnList: res.data.data.buttons,
                    current: pageNumber,
                    total: res.data.data.page.total,
                    loading: false
                })
            }
        })
      
    }

    //禁用
    forbid = (record, status) => {
        Axios.post('/app-admin/general/action/edit-status', {
            'id': record.id,
            'status': status
        }, httpConfig).then(res => {
            if (res.status == 200 && res.data.code === '10000') {
                
                this.list(this.state.defaultCurrent, this.state.pageSize, this.state.menuid)
            }
        })
    }
    //选择框控制
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
    }
  //类型
  typeCheck = (value) => {
      console.log(this.state.typeArr)
    let typeArr=this.state.typeArr
    if(typeArr.indexOf(String(value))>=0){
        typeArr.splice(typeArr.indexOf(String(value)),1)
    }else{
        typeArr.push(String(value))
    }
    console.log(typeArr)
    this.setState({
        typeArr:typeArr
    })
    this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('mobile') || null,this.state.typeArr)
}
    //清除条件
    clearCondition = () => {
        this.setState({
            typeArr:[],
            typeArr1:[],

        })
        this.props.form.resetFields()
        this.list(this.state.pageNumber, this.state.pageSize,'',[])
    }
    //展开
    typeMore = () => {
        this.setState({
            typeMoreNum: !this.state.typeMoreNum
        })
    }
    cancel=()=>{
        this.setState({
            codeVisible:false,
        })
    }
        //导出
        exportExcel=()=>{
            let token=sessionStorage.getItem('token')
       console.log(this.state.token)
            window.location =HttpUrl+'appserv/general/exportExcel?mobile='+(this.props.form.getFieldValue('mobile')||'')
            +'&token='+this.state.token+'&statusList='+(this.state.typeArr)
        
        
    }
     //导入
     importExcel = () => {
        this.refs.import.sendSword()
    }
    render() {
        const {selectedRowKeys} = this.state;
        const {getFieldDecorator} = this.props.form
        const menuid = this.props.match.params.menuid
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                this.state.ids = [];
                for (let i = 0; i < selectedRows.length; i++) {
                    this.state.ids.push(selectedRows[i].id)
                }
                this.setState({
                    deleteRowId: this.state.ids
                })
            },
            onChange :(selectedRowKeys) => {
                this.setState({ selectedRowKeys });
            }
        };
        let _t = this
        return (
            <div className="content" >
                <div className='content-title' style={{paddingLeft:0}}>
                    <Form layout="inline">
                        <div className='searchType'>
                            <FormItem label="账号">
                            { getFieldDecorator('mobile')(
                                <Input placeholder='账号、姓名' autoComplete="off" style={{    marginLeft: 2}}/>
                                )}
                            </FormItem>
                                <Button className='btn ' type="primary"   style={{marginLeft:'54px',marginTop:'5px'}} onClick={this.searchList}>查询</Button>
                                <Button className='btn ' type="primary"  ghost onClick={this.clearCondition}>清除条件</Button>
                        </div>
                            <Collapse bordered={false} onChange={this.collapseChange}
                                    className='toggle'>
                            <Panel header={this.state.collapseStatus ? <span>收起</span>: <span>更多</span>} key="1">
                                <div className='searchType'>
                                    <div className='typeTitle' >状态：</div>
                                    <div className='moreBox' >
                                    <div className='checks' key='0' title='' id='0'
                                           style={{border:this.state.typeArr.indexOf('0')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('0') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck('0')}>
                                                  启用-已认证
                                           <img src={ this.state.typeArr.indexOf('0') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='1' title='' id='1'
                                           style={{border:this.state.typeArr.indexOf('1')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('1') >=0 ? '#3689FF' : '#999'}} onClick={ (e) => this.typeCheck('1')}>
                                                  禁用-已认证
                                           <img src={ this.state.typeArr.indexOf('1') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='2' title='' id='2'
                                           style={{border:this.state.typeArr.indexOf('2')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('2') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck('2')}>
                                                  已注销-已认证
                                           <img src={ this.state.typeArr.indexOf('2') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='3' title='' id='3'
                                           style={{border:this.state.typeArr.indexOf('3')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('3') >=0 ? '#3689FF' : '#999'}} onClick={ (e) => this.typeCheck('3')}>
                                                  已注销-未认证
                                           <img src={ this.state.typeArr.indexOf('3') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='4' title='' id='4'
                                           style={{border:this.state.typeArr.indexOf('4')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('4') >=0 ? '#3689FF' : '#999'}}   onClick={ (e) => this.typeCheck('4')}>
                                                  启用-未认证
                                           <img src={ this.state.typeArr.indexOf('4') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                        <div className='checks' key='5' title='' id='5'
                                           style={{border:this.state.typeArr.indexOf('5')>=0 ? 
                                           '1px solid #3689FF' : '1px solid #E4E4E4',
                                           color:this.state.typeArr.indexOf('5') >=0 ? '#3689FF' : '#999'}} onClick={ (e) => this.typeCheck('5')}>
                                                  禁用-未认证
                                           <img src={ this.state.typeArr.indexOf('5') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </Collapse>
                    </Form>
               </div>
                    <div>
                        <div className='oprateHead'>
                            <Button type="primary" className='btn' ghost onClick={this.add}><img  src={newadd} alt=""/>新建</Button>
                            <Button type="primary" className='btn' ghost onClick={this.importExcel}> <img src={imports} alt=""/>导入</Button>
                            <Button type="primary" className='btn' ghost onClick={this.exportExcel}> <img src={exports} alt=""/>导出</Button>
                            <Button type="primary" className='btn' ghost onClick={this.labelmanage}><img src={label} alt=""/>标签管理</Button>

                        </div>
                        <div className='table tableInfo' id='table'>
                        <Table
                            scroll={1120}
                            // rowSelection={rowSelection}
                            columns={this.state.columns}
                            dataSource={this.state.data}
                            loading={this.state.loading}
                            total={this.state.total}
                            current={this.state.current}
                            pageSize={this.state.pageSize}
                            onChange={this.onChange}
                            onShowSizeChange={this.onShowSizeChange}
                        />
                        </div>
                    </div>       
                        <ViewModal wrappedComponentRef={(form) => this.viewForm = form} title={this.state.title}  importList={this.importList} unbindCar={this.unbindCar}></ViewModal>
                        
                        
                        <Modal
                            title={this.state.titleInfo}
                            visible={this.state.codeVisible}
                            okText="确定"
                            cancelText="取消"
                            onOk={ this.sureChange}
                            onCancel={ this.cancel}
                            maskClosable={false}
                            destroyOnClose={true}
                            zIndex='1001'
                            width='380px'
                            height='236px'
                        >
                        <div style={{margin:'0 auto',width:306}}>
                            <p style={{textAlign: 'center',}}><strong>{this.state.promptInfo}</strong></p>
                            <div style={{marginLeft:32 }}>
                            <Form>
                                <FormItem>
                                    { getFieldDecorator('codeInfo',{
                                        rules: [
                                            { required: true ,validator:validatorPasswordInfo}
                                        ]})(

                                <Input type="password" style={{  width:240,  }} autoComplete="off"/>
                                )}
                                </FormItem>
                            </Form>
                                
                                <div style={{marginTop:18}}>
                                    <p style={{fontSize:12}}>{this.state.warningInfo}</p>
                                </div>
                                
                            </div>
                            
                        </div>
                            
                        </Modal>
                        <AddEdit wrappedComponentRef={(form) => this.addFormRef = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></AddEdit>
                        <LabelManage wrappedComponentRef={(form) => this.labelFormRef = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></LabelManage>
                        <BindCar wrappedComponentRef={(form) => this.bindFormRef = form} list={ () => this.list(this.state.pageNumber,this.state.pageSize,this.props.form.getFieldValue('account')||'',this.props.form.getFieldValue('organization')||'',this.props.form.getFieldValue('name')||'') }></BindCar>
                        <ImportExcel ref='import' title='导入账户' templateUrl='tsp-app-image/template/importTmUser.xlsx'  importUrl='appserv/general/importUserByExcel' type='equip' importList={ this.importList}></ImportExcel>

               
                <style>
                    {`
                     .tableInfo table td{ 
                        max-width:260px; 
                        word-wrap:break-word; 
                        text-overflow:ellipsis; 
                        white-space:nowrap; 
                        overflow:hidden; 
                    }
                    .ant-popover-inner-content{
                        padding:12px 0
                    }
                    .toggleStyle{height:24px;width:100%; text-align:center;padding:0 10px }
                    .toggleStyle a{color:#666666;}
                    .toggleStyle:hover{background:#E6F7FF;}
                      .ant-table-tbody td{
                        text-align: center!important;
                      }
                    .ant-layout-footer{
                        padding:0px !important;
                        color:#fff !important;
                    }
                    .clounWidth{width:170px;}
                    .action span:hover{cursor: pointer;}
                    .action span{color:#3689FF;}
                    .popoverBox div,img:hover{cursor: pointer;}
                    .searchType .ant-form-item-label{width:78px;}
                `}
                </style>
            </div>
        )
    }
}
const commonAccount = Form.create()(commonAccounts)
export default commonAccount;
