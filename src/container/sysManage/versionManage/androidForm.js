import React,{ Component } from 'react'
import {Function,Card,Input, Form,Icon,Select,Row, Upload,message,Col,Modal,Tabs,Button,
    Breadcrumb,Popconfirm,Pagination,Radio,DatePicker}from 'antd'
import Axios from 'axios'
import downLoad from './../../../img/imports.png'
import {httpConfig} from '../../../util/httpConfig'
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
class AndroidForm extends React.Component{
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
    render(){
        const { form } = this.props;
        const { getFieldDecorator } = form;    //1、将getFieldDecorator 解构出来，用于和表单进行双向绑定
        return(
    <Form style={{marginLeft:40,marginTop:40,fontSize:16}}>
                                                        
    <FormItem label="最新版本号" labelCol={{span:2}} wrapperCol={{span:17}} >
        { getFieldDecorator('name2',
            {   rules: [{ required: true, message: '请输入版本名称' },
               
            ],})
        (<Input style={{marginLeft: 30, width: 400}} />)}
    </FormItem>
    <FormItem label="选择文件" labelCol={{span:2}} wrapperCol={{span:17}}>
        <div className='uploadItem'>
           
            <Upload {...props} className="uploads">
                <Button  >上传</Button>
            </Upload>
        </div>
    </FormItem>
    <FormItem label="更新描述" labelCol={{span:2}} wrapperCol={{span:17}}>
        {getFieldDecorator('remark2',{
             rules: [{ required: true, message: '请输入版本名称' },],
            initialValue:''})(
            <textarea style={{marginLeft: 30, width: 400,minHeight:100}}
                    autosize={{ minRows: 10 }} maxLength={100}></textarea>)}
    </FormItem>
    <FormItem label="是否强制更新" labelCol={{span:2}} wrapperCol={{span:17}} >
        <RadioGroup onChange={this.onChange2}
                    value={this.state.upDateOrNot}
                    style={{marginLeft:50}}>
            <Radio value={1}>是</Radio>
            <Radio value={2}>否</Radio>
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
const AndroidForm = Form.create()(AndroidForms);
export default AndroidForm  