import React, {Component } from 'react';
import Axios from 'axios';
import {Upload, Button,Modal,message} from 'antd';
import { httpConfig ,HttpUrl} from './../../util/httpConfig';
class Import extends Component {
    constructor(props){
        super(props)
    }
    state={
        loadVisible:false,
        resurreMessage:'',
        file:'',
        fileList:[]
    }
    sendSword = () => {
        this.setState({
            loadVisible:true,
            fileList:[]
        })
    }
    loadCancel = () => {
        this.setState({
            loadVisible:false,
            fileList:[]
        })
    }
     //下载模板
    downTemplate = () => {
        let token=sessionStorage.getItem('token')
        window.location=HttpUrl+this.props.templateUrl+'/'+this.props.type+'?token='+token
    }
    //确认导入
    loadOK = () => {
        if(this.state.fileList.length === 0){
            message.warning('此项必填')
        }else if(!this.state.file.name.split('.').includes('xlsx')&&!this.state.file.name.split('.').includes('xls')){
            message.warning('上传失败！请检查数据项是否正确')
        }else{
            const formData = new FormData();
            formData.append("file", this.state.file);
            Axios.put(HttpUrl+this.props.importUrl,formData, { headers: { 'Content-Type': 'multipart/form-data'}}).then( res => {
                if(res.data.code === "100000"){
                    message.success('导入成功')
                    this.props.importList()
                }else{
                    message.warning(res.data.message)
                }
            }).catch( error => {
                console.log(error)
            })
            this.setState({
                loadVisible:false,
                file:''
            })
        }    
    }
    //导入文件改变
    handleChange = (info) => {
        if(info.fileList.length>0){
            let fileList = [info.file]
            this.setState({fileList})
        }else{
            this.setState({fileList:[]})
        }
    }
    render(){
        const props = {
            beforeUpload: (file) => {
                this.setState({
                    file:file
                })
                return false;
            },
            onChange: this.handleChange
          };
        return (
            <div>
                <Modal
                    title={this.props.title}
                    visible={this.state.loadVisible}
                    okText='提交'
                    cancelText="取消"
                    onOk={this.loadOK}
                    onCancel={this.loadCancel}
                    destroyOnClose={true}
                    maskClosable={false}
                    className='importModal'
                    >
                    <div style={{color:"#999",textAlign:'left'}}>请选择您要上传文件的位置</div>
                    <Upload {...props} className="uploads" fileList={this.state.fileList}>
                        <span style={{color:"#3689FF",verticalAlign:'middle',margin:'0 10px',lineHeight:'30px'}}>浏览</span>
                    </Upload>
                    {
                        this.props.download ?
                        <span style={{color:"#3689FF",position:'relative',top:'-10px',cursor:'pointer'}}  onClick={this.downTemplate}>下载模板</span>
                        : ''
                    }
                </Modal>
                <style>
                    {`
                         .uploads{display:inline-block;margin-top:5px;}
                         .ant-upload{float:right}
                         .ant-upload-list{float:left;width:200px;border:1px solid #D7DDEA;height:30px;line-height:30px;border-radius: 4px;}
                         .ant-upload-list-item{margin-top:0;height:30px;line-height:30px;}
                         .ant-upload-list-item-progress{bottom:-5px;padding-left:0;}
                         .ant-upload-list-item-info .anticon-loading, .ant-upload-list-item-info .anticon-paper-clip{top:8px;}
                         .ant-upload-list-item .anticon-cross{top:5px;}
                         .uploads span:hover{cursor:pointer}
                         .importModal{width:400px !important;}
                    `}
                </style>
            </div>
        )
    }
}
export default Import