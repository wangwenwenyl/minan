/**
 * Created by ts on 2018/11/24.
 */
/**
 * Created by ts on 2018/7/19.
 */
/**
 * Created by ts on 2018/7/18.
 */
/**
 * Created by ts on 2018/7/18.
 */
/**
 * Created by ts on 2018/4/25.
 */

import React,{ Component } from 'react'
import {Function,Card,Input, Form,Icon,Select,Row, Upload,message,Col,Modal,Tabs,Button,
    Breadcrumb,Popconfirm,Pagination,Radio,DatePicker}from 'antd'
import Axios from 'axios'
import imports from './../../../img/imports.png'
import {httpConfig, HttpUrl} from '../../../util/httpConfig'
import { permission } from './../../../util/permission';
import  Table  from "./../../../component/table/table";
import moment from 'moment';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const Option = Select.Option;
const BreadcrumbItem=Breadcrumb.Item;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

class BasicForms extends Component {
    constructor(props, context) {
        super(props, context);
        // this.context.router;
    }
    state = {
        //Ios
        id:'',
        versionNum:'',
        updateDesc:'',
        //Android
        id2:'',
        versionNum2:'',
        updateDesc2:'',
        installUrl2:'',

        versionIosLast:'',
        versionAndroidLast:'',
        versionInfoIosLast:{},
        versionInfoAndroidLast:{},
        versionInfoAndroid:[],
        versionInfoIos:[],
        versionIos:'',
        versionIdIos:'',
        fileNameIos:'',
        installationPackageIos:'',
        createtimeIos:'',
        userNameIos:'',
        descriptionIos:'',
        compulsoryIos:'',

        fileName1:'',
        compulsory:'',
        description:'',
        versionId:'',
        installationPackage:'',
        createtime:'',
        userName:'',
        version:'',
        type:1,
        upDateOrNot:1,
        upDateOrNotIos:1,
        editionValue:1,
        fileName:'',
        url:'',
        value:1,
        buttonData:[],
        buttonDataIos:[],
        data:[],
        data2:[],
        defaultCurrent:'1',
        current:1,
        pageSize:10,
        pageNumber:'',
        total:0,
        activekey:1,
        selectedRow:'',
        operationName:'',
        countType:1,
        startTime:null,
        endTime:null,
        arr:true,
        version:'',
        compulsory:'', description:'',
    };
    componentDidMount(){
        Axios.get('sys/version/versionNumList?type='+1,httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='100000'){
                let versionInfoAndroid=[]
                if(res.data.data.android.length>0){
                for(let i=0;i<res.data.data.android.length;i++){
                    versionInfoAndroid.push( <Radio.Button className='btn '
                                               value={String(res.data.data.android[i])} onClick={(e)=>this.changeVersion2(res.data.data.android[i])}
                                         >
                                             {res.data.data.android[i]}
                                         </Radio.Button>
                    )
                }
                 
                this.setState({
                    
                    versionInfoAndroid:versionInfoAndroid,
                    versionAndroidLast:res.data.data.android[res.data.data.android.length-1]
                })
                 this.changeVersion2(res.data.data.android[res.data.data.android.length-1])
            }else{
                this.setState({
                    
                    versionInfoAndroid:versionInfoAndroid,
                    versionAndroidLast:''
                })
            }
            }
        })
        
        
        Axios.get('sys/version/versionNumList?type='+0,httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='100000'){
                let versionInfoIos=[]
                if(res.data.data.ios.length>0){
                    for(let i=0;i<res.data.data.ios.length;i++){
                    versionInfoIos.push( <Radio.Button className='btn '
                                               value={String(res.data.data.ios[i])}
                                                onClick={(e)=>this.changeVersion1(res.data.data.ios[i])}
                                         >
                                             {res.data.data.ios[i]}
                                         </Radio.Button>
                    )
                } 
              
                    this.setState({
                        versionInfoIos:versionInfoIos,
                        versionIosLast:res.data.data.ios[res.data.data.ios.length-1]
                    })
                    console.log(res.data.data.ios[res.data.data.ios.length-1])
                    this.changeVersion1(res.data.data.ios[res.data.data.ios.length-1])
                }else{
                    this.setState({
                        versionInfoIos:[],
                        versionIosLast:''
                    })
                }
                
            }
        })

    }

    //左侧列表IOS
    leftListIos=()=>{
        Axios.get('sys/version/versionNumList?type='+0,httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='100000'){
                let versionInfoIos=[]
                for(let i=0;i<res.data.data.ios.length;i++){
                    versionInfoIos.push( <Radio.Button className='btn '
                                               value={String(res.data.data.ios[i])}
                                                onClick={(e)=>this.changeVersion1(res.data.data.ios[i])}
                                         >
                                             {res.data.data.ios[i]}
                                         </Radio.Button>
                    )
                }
                this.setState({
                    versionInfoIos:versionInfoIos,
                    versionIosLast:res.data.data.ios[res.data.data.ios.length-1]
                })

            }
        })
    }
//左侧列表Android
leftListAndroid=()=>{
 //android
 Axios.get('sys/version/versionNumList?type='+1,httpConfig).then(res=>{
    console.log(res)
    if(res.data.code==='100000'){
        let versionInfoAndroid=[]
        for(let i=0;i<res.data.data.android.length;i++){
            versionInfoAndroid.push( <Radio.Button className='btn '
                                       value={String(res.data.data.android[i])} onClick={(e)=>this.changeVersion2(res.data.data.android[i])}
                                 >
                                     {res.data.data.android[i]}
                                 </Radio.Button>
            )
        }
        this.setState({
            versionInfoAndroid:versionInfoAndroid,
            versionAndroidLast:res.data.data.android[res.data.data.android.length-1]
        })
    }
})
}


    upLoad=()=>{
        Axios.post('/uploadSoftWare',httpConfig).then(res=>{
            console.log(res)
            if(res.data.code==='10000'&& res.data.msg==='成功'){
                this.setState({
                    url:res
                })
            }
        })
    }
    
    logList=(pageNumber, pageSize,betweenTime,betweenType,vin,startTime,endTime,activekey)=>{
        Axios.post('/droppedEquipmentList',{
            pageStart: pageNumber,
            pageSize: pageSize,
            betweenTime:betweenTime,
            betweenType:betweenType,
            countType:activekey,
            vin:vin,
            startTime:startTime,
            endTime:endTime,
        },httpConfig).then(res=>{
            console.log(res)
            if (res.data.code === '10000' && res.data.msg === '成功') {
                for (let i = 0; i < res.data.data.dataList.length; i++) {
                    res.data.data.dataList[i].number = i + 1 + (pageNumber - 1) * 10;
                    res.data.data.dataList[i].key = i + 1 + (pageNumber - 1) * 10;
                }
            }
        })
    }
 
    //Tabs切换
    changeTable=(key)=>{
        console.log(this.state.versionInfoIos,this.state.versionInfoAndroid)
        console.log(key)
        if(key=== '2'){

            Axios.get('sys/version/versionNumList?type='+1,httpConfig).then(res=>{
                console.log(res)
                if(res.data.code==='100000'){
                    let versionInfoAndroid=[]
                    if(res.data.data.android.length>0){
                    for(let i=0;i<res.data.data.android.length;i++){
                        versionInfoAndroid.push( <Radio.Button className='btn '
                                                   value={String(res.data.data.android[i])} onClick={(e)=>this.changeVersion2(res.data.data.android[i])}
                                             >
                                                 {res.data.data.android[i]}
                                             </Radio.Button>
                        )
                    }
                     
                    this.setState({
                        versionInfoAndroid:versionInfoAndroid,
                    })
                     this.changeVersion2(res.data.data.android[res.data.data.android.length-1])
                }else{
                    this.setState({
                        versionInfoAndroid:versionInfoAndroid,
                        versionAndroidLast:''
                    })
                }
                }
            })
            
            
            Axios.get('sys/version/versionNumList?type='+0,httpConfig).then(res=>{
                console.log(res)
                if(res.data.code==='100000'){
                    let versionInfoIos=[]
                    if(res.data.data.ios.length>0){
                        for(let i=0;i<res.data.data.ios.length;i++){
                        versionInfoIos.push( <Radio.Button className='btn '
                                                   value={String(res.data.data.ios[i])}
                                                    onClick={(e)=>this.changeVersion1(res.data.data.ios[i])}
                                             >
                                                 {res.data.data.ios[i]}
                                             </Radio.Button>
                        )
                    } 
                        this.setState({
                            versionInfoIos:versionInfoIos,
                        })
                        this.changeVersion1(res.data.data.ios[res.data.data.ios.length-1])
                    }else{
                        this.setState({
                            versionInfoIos:[],
                            versionIosLast:''
                        })
                    }
                    
                }
            })
            
            
           
           
        }else {

        }
    }
//删除
    deleteFileIos=()=>{
       Axios.delete(HttpUrl+'sys/version/deleteVersion?id='+this.state.id,httpConfig).then(res=>{
            console.log(res)
            console.log(this.state.versionIosLast)
            if(res.data.code==='100000'){
                Axios.get('sys/version/versionNumList?type='+0,httpConfig).then(res=>{
                    console.log(res)
                    if(res.data.code==='100000'){
                        let versionInfoIos=[]
                        for(let i=0;i<res.data.data.ios.length;i++){
                            versionInfoIos.push( <Radio.Button className='btn '
                                                       value={String(res.data.data.ios[i])}
                                                        onClick={(e)=>this.changeVersion1(res.data.data.ios[i])}
                                                 >
                                                     {res.data.data.ios[i]}
                                                 </Radio.Button>
                            )
                        }
                        this.setState({
                            versionInfoIos:versionInfoIos,
                            versionIosLast:res.data.data.ios[res.data.data.ios.length-1]
                        })
                       this.changeVersion1(res.data.data.ios[res.data.data.ios.length-1])
                    }
                })
                
                
                message.warning('删除成功')
            }
                })

    }
    deleteFileAndroid=()=>{
        Axios.delete(HttpUrl+'sys/version/deleteVersion?id='+this.state.id2,httpConfig).then(res=>{
            console.log(res)
            console.log(this.state.versionId)
            if(res.data.code==='100000'){

                

                Axios.get('sys/version/versionNumList?type='+1,httpConfig).then(res=>{
                    console.log(res)
                    if(res.data.code==='100000'){
                        let versionInfoAndroid=[]
                        for(let i=0;i<res.data.data.android.length;i++){
                            versionInfoAndroid.push( <Radio.Button className='btn '
                                                       value={String(res.data.data.android[i])} onClick={(e)=>this.changeVersion2(res.data.data.android[i])}
                                                 >
                                                     {res.data.data.android[i]}
                                                 </Radio.Button>
                            )
                        }
                        this.setState({
                            versionInfoAndroid:versionInfoAndroid,
                            versionAndroidLast:res.data.data.android[res.data.data.android.length-1]
                        })

                        this.changeVersion2(res.data.data.android[res.data.data.android.length-1])
                    }
                })

                
                  message.warning('删除成功')
            }
        })

    }
    changeVersion1=(e)=>{
        console.log(999)
        if(e===undefined){
            this.setState({
                id:null,
                versionNum:'',
                updateDesc:'',
                ifForcedUpdate:'',
                // versionInfoIos:e,
            })
        }else{
              Axios.get('sys/version/versionDetails?type='+0+'&versionNum='+e,httpConfig).then(res=>{
                    console.log(res)
                    if(res.data.code==='100000'){
                        if(res.data.data){
                        this.setState({
                            id:res.data.data.id,
                            versionNum:res.data.data.versionNum,
                            updateDesc:res.data.data.updateDesc,
                            ifForcedUpdate:res.data.data.ifForcedUpdate,
                            versionIosLast:e
                            // versionInfoIos:e,
                        })
                    }
                    }
                })
        }
      
    }
    changeVersion2=(e)=>{
        console.log(888)
        console.log(e)
        if(e===undefined){
            this.setState({
                id2:null,
                versionNum2:'',
                updateDesc2:'',
                installUrl2:'',
                ifForcedUpdate2:'',
                // versionInfoIos:e,
            })
        }else{
            Axios.get('sys/version/versionDetails?type='+1+'&versionNum='+e,httpConfig).then(res=>{
                console.log(res)
                if(res.data.code==='100000'){
                if(res.data.data===null){
                    
                }else{
                    this.setState({
                        id2:res.data.data.id,
                        versionNum2:res.data.data.versionNum,
                        updateDesc2:res.data.data.updateDesc,
                        installUrl2:res.data.data.installUrl,
                        ifForcedUpdate2:res.data.data.ifForcedUpdate,
                        versionAndroidLast:e
                        // versionInfoAndroid:e,
                    })
                }
                    

                }
            })
        }
    }
    render (){
        const { getFieldDecorator }=this.props.form
        const{url,fileName}=this.state
       
        return(
            <div className="content">
                
                <div className="content-title1">
                    <Card bordered={false}>
                        <Tabs type="card"
                                className="remoteTab"
                                onChange={this.changeTable}>
                            <TabPane tab="最新版本管理" key="1" >
                            <div style={{marginLeft:20}} className='searchType'>

                            
                            <Row className="tit-row">
                                <span></span><b>IOS</b>
                            </Row>
                            <IosForm
                                    wrappedComponentRef={(form) => this.formRef = form}    
                                    submission={this.submissionIos}   //5、使用wrappedComponentRef 拿到子组件传递过来的ref（官方写法）
                                ></IosForm>                            
                                <Row className="tit-row">
                                    <span></span><b>Android</b>
                                </Row>
                                <AndroidForm
                                    wrappedComponentRef={(form) => this.formRef = form}  
                                    submission={this.submission}     //5、使用wrappedComponentRef 拿到子组件传递过来的ref（官方写法）
                                ></AndroidForm>  
                                    </div>
                                <style>
                                    {`

                                    .tit-row{padding-left:10px;}
                                        .tit-row span{left:0}
                                        .tit-row{margin-top:30px}
                                        .tit-row{font-size:14px;color:#3689FF;position: relative;margin-left:15px;}
                                        .tit-row span{width:2px;height:14px;background:#3689FF;position: absolute;left:-8px;top:4px;}
                                    
                                    .uploads{display:inline-block;}
                                    .ant-upload{float:right}
                                    .ant-upload-list{float:left;width:319px;margin-left: 29px; border:1px solid #D7DDEA;height:30px;line-height:30px;border-radius: 4px;}
                                    .ant-upload-list-item{margin-top:0;height:30px;line-height:30px;}
                                    .ant-upload-list-item-progress{bottom:-5px;padding-left:0;}
                                    .ant-upload-list-item-info .anticon-loading, .ant-upload-list-item-info .anticon-paper-clip{top:8px;}
                                    .ant-upload-list-item .anticon-cross{top:5px;}
                                    .ant-form-item {
                                        font-size: 15px!important;
                                        }
                                        Button{margin-left:12px;}
                                        .link{color:#fff !important; margin-left:8px}
                                        .inputContainer{ display:inline-block;margin-right:20px;}
                                        .btn_click{margin-right:11px;float:right;}
                                        .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-nav-container {
                                        height: 36px!important;
                                        }
                                        .ant-form-item-label label:after{
                                        content:'';
                                        }
                                        .ant-select-selection--single{
                                        height:30px;
                                        }
                                        .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{line-height:36px}
                                        .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{
                                        margin-right:-2px;border-radius:4px 4px 0px 0px
                                        }
                                        .ant-card-body{
                                            padding:15px 0!important
                                        }
                                        .ant-tabs-nav-wrap{padding-left:10px}
                                    `}
                                </style>
                            </TabPane>
                            <TabPane tab="历史版本管理" key="2">
                            <div style={{marginLeft:20}} className='searchType'>
                                        <div> 
                                            <Col span={24} className="versionTop">
                                            <Row className="tit-row">
                                                <span></span><b>IOS</b>
                                            </Row>
                                            </Col>
                                            <Col xxl={4} xl={5} lg={6} md={8}>
                                                    <div  className="versionContainer">
                                                    { this.state.versionInfoIos.length!=0?
                                                   <Radio.Group value={String(this.state.versionIosLast)} buttonStyle="solid">
                                                   
                   
                                                       {this.state.versionInfoIos}
                                                   
                                                    </Radio.Group>
                                                    
                                                       :''}
                                                </div>
                                            </Col>
                                            <Col xxl={20} xl={19} lg={18} md={16}>
                                            <div>
                                                <Form style={{marginLeft:5,marginTop:5,fontSize:16}}>
                                                        <FormItem label="最新版本号：" labelCol={{span:3}} wrapperCol={{span:21}}>
                                                            <span style={{marginLeft: 30}}>{this.state.versionNum}</span>
                                                        </FormItem>
                                                        <FormItem label="更新描述：" labelCol={{span:3}} wrapperCol={{span:21}}>

                                                            <span style={{marginLeft: 30}}>{this.state.updateDesc}</span>
                                                        </FormItem>
                                                        <FormItem label="强制更新：" labelCol={{span:3}} wrapperCol={{span:21}}>

                                                            <span style={{marginLeft: 30}}>{
                                                            this.state.ifForcedUpdate==1?'否':'是'}
                                                            </span>
                                                        </FormItem>
                                                        <FormItem >
                                                            <Button onClick={this.deleteFileIos}>删除</Button>
                                                        </FormItem>
                                                </Form>
                                            </div>
                                            </Col>
                                </div>
                                    <div>
                                    <Col span={24} className="versionTop">
                                            <Row className="tit-row">
                                                <span></span><b>Android</b>
                                            </Row>
                                            </Col>
                                    <Col xxl={4} xl={5} lg={6} md={8}>
                                        <div className="versionContainer"  >
                                            {this.state.versionInfoAndroid.length!=0?
                                                <Radio.Group value={this.state.versionAndroidLast} buttonStyle="solid">
                                                   
                   
                                                {this.state.versionInfoAndroid}
                                            
                                             </Radio.Group>
                                             :''}
                                        </div>
                                    </Col>
                                    <Col xxl={20} xl={19} lg={18} md={16}>
                                        <div>
                                            <Form style={{marginLeft:5,marginTop:5,fontSize:16}} >
                                                <FormItem label="最新版本号：" labelCol={{span:3}} wrapperCol={{span:21}}>
                                                <span style={{marginLeft: 30}}>{this.state.versionNum2}</span>
                                                </FormItem>
                                                <FormItem label="安装包路径：" labelCol={{span:3}} wrapperCol={{span:21}}>
                                                <span style={{marginLeft: 30}}>{this.state.installUrl2}</span>
                                                {this.state.installUrl2?
                                                <span style={{marginLeft: 5}}><a href={this.state.installUrl2}>
                                                <img src={imports}/></a></span>:''}
                                                </FormItem>
                                                <FormItem label="更新描述：" labelCol={{span:3}} wrapperCol={{span:21}}>
                                                <span style={{marginLeft: 30}}>{this.state.updateDesc2}</span>
                                                </FormItem>
                                                <FormItem label="强制更新：" labelCol={{span:3}} wrapperCol={{span:21}}>
                                                <span style={{marginLeft: 30}}>{this.state.ifForcedUpdate?
                                                           this.state.ifForcedUpdate2=='1'?'否':'是':''}</span>
                                                </FormItem>
                                                <FormItem >
                                                    <Button onClick={this.deleteFileAndroid}>删除</Button>
                                                    
                                                </FormItem>
                                            </Form>
                                        </div>
                                    </Col>
                                </div>
                            </div>
                            </TabPane>
                        </Tabs>
                        <style>
                            {`
                            .versionTop{
                                margin-bottom:25px;
                            }
                            .versionContainer{
                                
                                width:90px;
                                margin-left:5px;
                                // border-left:1px solid #999999;
                                // border-top:1px solid #999999;
                                // border-right:1px solid #999999;
                            }
                            .versionStyle{ 
                                width:90px;
                                height:28px;
                                border:none;
                                text-align:center;

                            }
                            .versionStyle .btn{
                                margin:0px;
                                
                                width:88px;
                                border: none;
                                border-bottom: 1px solid;
                                margin-left: -2px;
                            }
                            .versionStyle .btn:focus {
                                background:#3689FF;
                                color:#ffffff;
                            }
                                .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active{
                                background:#409EFF;color:#fff;}
                            `}
                        </style>
                    </Card>
                </div>
                <style>
                    {`
                    .content-title1 {
                        background: #fff;
                        border: 1px solid #EBEDF8;
                        /* padding: 30px 31px 20px 31px; */
                        width: 100%;
                        box-shadow: 0 2px 4px 0 rgba(216,216,216,0.50);
                    }
                    {/*.ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab{*/}
                    {/*line-height:36px;*/}
                    {/*}*/}
                    .ant-tabs.ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active{
                    background:#409EFF;color:#fff;}
                    .ant-card-body{padding:15px 0 !important}
                    .table_list .ant-table-tbody tr:hover > td:last-child{background: #50A7FF!important;color:#fff;}
                    `}
                </style>
                  
            </div>
        )
    }
}
const BasicForm = Form.create()(BasicForms);
export default BasicForm;

class IosForm extends React.Component{
    constructor(props, context) {
        super(props, context);
        // this.context.router;
    }
    state = {
        versionInfoAndroid:[],
        versionInfoIos:[],
        versionIos:'',
        versionIdIos:'',
        fileNameIos:'',
        installationPackageIos:'',
        createtimeIos:'',
        userNameIos:'',
        descriptionIos:'',
        compulsoryIos:'',

        fileName1:'',
        compulsory:'',
        description:'',
        versionId:'',
        installationPackage:'',
        createtime:'',
        userName:'',
        version:'',
        type:1,
        
        upDateOrNotIos:1,

    };
    onChange1= (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            upDateOrNotIos: e.target.value,
        });
    }
  
//IOS提交
submissionIos=()=>{
    this.props.form.validateFields((err, values) => {
        if (!err) {
        Axios.post('sys/version/addVersion',{
            ifForcedUpdate:this.state.upDateOrNotIos,
            type:0,
            updateDesc: this.props.form.getFieldValue("remark1"),
            versionNum:this.props.form.getFieldValue("name1"),
         
        },httpConfig).then(res=>{
           if(res.data.code==='100000'){
                  message.warning(res.data.message)
           }else{
               message.warning(res.data.message)
           }
        })
    }
})
    }



    render(){
        // const { form } = this.props;
        const { getFieldDecorator }=this.props.form
        // const { getFieldDecorator } = form;    //1、将getFieldDecorator 解构出来，用于和表单进行双向绑定
        return(
            
            <Form style={{marginLeft:40,marginTop:40,fontSize:16}}>
                                                    
            <FormItem label="最新版本号：" labelCol={{span:2}} wrapperCol={{span:17}} style={{marginBottom:25}} >
                { getFieldDecorator('name1',
                    {   rules: [{ required: true, message: '请输入最新版本号' }],
                     })
                (<Input style={{marginLeft: 30, width: 400}} />)}
            </FormItem>
            <FormItem label="更新描述：" labelCol={{span:2}} wrapperCol={{span:17}}>
                {getFieldDecorator('remark1',{
                     rules: [{ required: true, message: '请输入更新描述' },],
                    initialValue:''})(
                    <textarea style={{marginLeft: 30, width: 400,minHeight:100}}
                              autosize={{ minRows: 10 }} maxLength={100}></textarea>)}
            </FormItem>
            <FormItem label="是否强制更新：" labelCol={{span:2}} wrapperCol={{span:17}} >
                <RadioGroup onChange={this.onChange1}
                            value={this.state.upDateOrNotIos}
                            style={{marginLeft:50}}>
                    <Radio value={0}>是</Radio>
                    <Radio value={1}>否</Radio>
                </RadioGroup>
            </FormItem>
            <Col style={{paddingLeft:120}}>
                <Button className='btn' type="primary"
                        onClick={this.submissionIos}>提交</Button>
              
            </Col>
    </Form> 
            
        )
    }
}
IosForm=Form.create({})(IosForm)


class AndroidForm extends React.Component{
    constructor(props, context) {
        super(props, context);
        // this.context.router;
    }
    state = {
        token:sessionStorage.getItem('token'),
        versionInfoAndroid:[],
        versionInfoIos:[],
        versionIos:'',
        versionIdIos:'',
        fileNameIos:'',
        installationPackageIos:'',
        createtimeIos:'',
        userNameIos:'',
        descriptionIos:'',
        compulsoryIos:'',
        fileList:'',
        fileName1:'',
        compulsory:'',
        description:'',
        versionId:'',
        installationPackage:'',
        createtime:'',
        userName:'',
        version:'',
        type:1,
        upDateOrNot:1,
        installUrl:'',
        

    };
    onChange2= (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            upDateOrNot: e.target.value,
        });
    }
    handleChange =(fileList)=> {
        console.log(this.state.token)
        console.log(fileList)
            this.setState({
                fileList:fileList,
                
            })
          
        }
    

    submission=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
            Axios.post('sys/version/addVersion',{
                ifForcedUpdate:this.state.upDateOrNot,
                type:1,
                installUrl:this.state.installUrl,
                updateDesc: this.props.form.getFieldValue("remark2"),
                versionNum:this.props.form.getFieldValue("name2"),
                
            },httpConfig).then(res=>{
                console.log(res)
                if(res.data.code==='100000'){
                    message.warning(res.data.message)
                }else{
                    message.warning(res.data.message)
                }
            })
        }
    })
        }

    render(){
        // const { form } = this.props;
        const { getFieldDecorator }=this.props.form
        // const { getFieldDecorator } = form;    //1、将getFieldDecorator 解构出来，用于和表单进行双向绑定
        const props = {
            beforeUpload: (file,fileList) => {
                if(file.size/1024/1024>100){
                    message.warning('大小超过限制')
                }else{
                    this.props.form.setFieldsValue({'md5':''})
                    let index1=file.name.lastIndexOf(".")
                    let files=file.name.substring(index1)
                    if(files === '.apk'){
                        let arr=[];
                        let length=fileList.length
                        arr.push(fileList[length-1])
                        this.setState({
                            fileJudge:false,
                            loading:true,
                            fileList:arr
                        })
                        const formData = new FormData();
                        formData.append("file", file);
                        if(this.state.record){
                            formData.append("fileId", this.state.record.fileId);
                        }
                        Axios.post(HttpUrl+'sys/version/uploadApk',formData,{ headers: { 'Content-Type': 'multipart/form-data'}}).then(res => {
                           console.log(res)
                            if(res.data.code === '100000'){
                                console.log(res)
                                this.setState({
                                    
                                    installUrl:res.data.data,
                                    loading:false
                                })
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }else{
                        message.warning('上传文件必须为.apk文件')
                        
                    }
                    return false
                }
            },
            onRemove: () => { 
                this.setState({
                    installUrl:'',
                    fileList:[]
                })
             },
           
            // name: 'file',
            // action: '//42.159.92.113/api/sys/version/uploadApk',
            // headers: {
            //     authorization: 'authorization-text',
            //     token: this.state.token
            // },
            // onChange: this.handleChange,
            // beforeUpload: (file)=> {
              
            //     console.log(file.name.substring(file.name.lastIndexOf(".")))
            //     const isJPG =  file.name.substring(file.name.lastIndexOf("."))=== '.apk';
            //     // const isJPG =  file.type === 'image/jpeg'=== 'file/apk';
                
            //     if (!isJPG) {
            //       message.error('只能上传.apk格式文件');
            //       this.props.form.resetFields([file2])
            //       this.props.form.setFields({
            //         file2: {
            //           value: '',
            //           // errors: [new Error('forbid ha')],
            //         },
            //       });
            //     }
               
            //     return isJPG ;
            //   }
        };
        return(
        
    <Form style={{marginLeft:40,marginTop:40,fontSize:16}}>
                                                        
    <FormItem label="最新版本号：" labelCol={{span:2}} wrapperCol={{span:17}} style={{marginBottom:25}}>
        { getFieldDecorator('name2',
            {   rules: [{ required: true, message: '请输入最新版本号' },
               
            ],})
        (<Input style={{marginLeft: 30, width: 400}} />)}
    </FormItem>
    <FormItem label="安装包路径" labelCol={{span:2}} wrapperCol={{span:17}} style={{marginBottom:25}}>
    { getFieldDecorator('versionPath',
            {   rules: [{ required: true, message: '请导入文件' },
               
            ],})
        (<Upload {...props} className="uploads" fileList={ this.state.fileList} >
            <span style={{color:"#3190F5",marginLeft:'5px',lineHeight:'28px'}} className='skip'><Button>浏览</Button></span>
        </Upload>)}
       
   
    </FormItem>
    {/* <FormItem label="选择文件" labelCol={{span:2}} wrapperCol={{span:17}}>
        <div className='uploadItem'>
        { getFieldDecorator('file2',
            {   rules: [{ required: true, message: '请输入最新版本号' },
               
            ],})
            (<Upload
             {...props} className="uploads">
                <Button  >上传</Button>
            </Upload>)}
        </div>
    </FormItem> */}
    <FormItem label="更新描述：" labelCol={{span:2}} wrapperCol={{span:17}}>
        {getFieldDecorator('remark2',{
             rules: [{ required: true, message: '请输入更新描述' },],
            initialValue:''})(
            <textarea style={{marginLeft: 30, width: 400,minHeight:100}}
                    autosize={{ minRows: 10 }} maxLength={100}></textarea>)}
    </FormItem>
    <FormItem label="是否强制更新：" labelCol={{span:2}} wrapperCol={{span:17}} >
        <RadioGroup onChange={this.onChange2}
                    value={this.state.upDateOrNot}
                    style={{marginLeft:50}}>
            <Radio value={0}>是</Radio>
            <Radio value={1}>否</Radio>
        </RadioGroup>
    </FormItem>
    <Col style={{paddingLeft:120}}>
        <Button className='btn' type="primary"
                onClick={this.submission}>提交</Button>
    
    </Col>
</Form>



           
  )
}
}
AndroidForm=Form.create({})(AndroidForm)