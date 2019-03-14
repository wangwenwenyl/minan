/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import Qs from 'qs'
import { Link } from 'react-router-dom';
import {Row,Col,Form,Modal,message,Tree} from 'antd';
import moment from 'moment';
import { HttpUrl } from '../../../util/httpConfig';
import {transformDate,disabledDate} from './../../../util/util'
import { relative } from 'path';
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
class fileView extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        viewModal:false,
        detail:{},
        treeData:[]
    }
    componentDidMount(){
        
    }
    view = (record) => {
        this.setState({
            viewModal:true
        })
        Axios.post(HttpUrl+'ota-mag/file/findFileById',{
            'fileId':record.fileId
        }).then(res => {
            if(res.data.code === '100000'){
                if(res.data.data){
                    let arr=[];
                    arr.push(JSON.parse(res.data.data.suitJson))
                    this.setState({
                        detail:res.data.data,
                        treeData:arr
                    })
                }
            }else{
                message.warning(res.data.message)
            }
        })
    }
    cancel = () => {
        this.setState({
            viewModal:false,
            detail:{},
            treeData:[]
        })
    }
    render() {
        let { detail}=this.state
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                  <TreeNode key={item.key} title={item.title} name={item.value}>
                    {loop(item.children)}
                  </TreeNode>
                )
              }
              return <TreeNode key={item.key} title={item.title} name={item.value} />;
          });
        return (
        <div className="content" >
            <Modal
                title={'查看详情'}
                visible={this.state.viewModal}
                onCancel={ this.cancel}
                destroyOnClose={true}
                footer={null}
                className='treeBox'
            >
            <div>
                <Row style={{padding:'0px 16px'}}>   
                    <Col span={12}>
                        <div>
                            <span className='label'>文件名称：</span>
                            <span className='itemDetail'>{detail.fileName}</span>
                        </div>
                        <div>
                            <span className='label'>文件发版时间：</span>
                            <span className='itemDetail'>{ detail.releaseTime}</span>
                        </div>
                        <div>
                            <span className='label'>上传者：</span>
                            <span className='itemDetail'>{ detail.createUserName}</span>
                        </div>
                        <div>
                            <span className='label'>使用状态：</span>
                            <span className='itemDetail'>{ 
                                detail.delFlag === 0 ? '未使用' : detail.delFlag === 1 ?  '升级中' : detail.delFlag === 2 ? '升级后' : ''
                            }</span>
                        </div>
                    </Col>
                    <Col span={12} >
                        <div>
                            <span className='label'>支持最低版本号：</span>
                            <span className='itemDetail'  title={detail.minFromVersion}>{ detail.minFromVersion}</span>
                        </div>
                        <div>
                            <span className='label'>文件版本号：</span>
                            <span className='itemDetail' title={detail.fileCode}>{detail.fileCode}</span>
                        </div>
                        <div>
                            <span className='label'>文件大小：</span>
                            <span className='itemDetail'>{detail.fileSize}M</span>
                        </div>
                        <div>
                            <span className='label'>上传时间：</span>
                            <span className='itemDetail'>{transformDate(detail.createTime)}</span>
                        </div>
                        <div  style={{zIndex:'1',position:'relative',height:'62px',overflow:'hidden',textOverflow:'ellipsis',webkitLineClamp:'2',webkitBoxOrient:'vertical',display:'-webkit-box'}}>
                            <span className='label'>备注：</span>
                            <span title={detail.fileRemark} >{detail.fileRemark}</span>
                        </div>
                    </Col>
                </Row>
                <div style={{position:"relative",top:'-45px',marginLeft:'15px',zIndex:'0'}}>
                    <span> 更多 </span>
                    <div style={{marginLeft:'20px',}}>
                        <Tree>  
                            {
                                loop(this.state.treeData)
                            }
                        </Tree>
                    </div>
                </div>
                
            </div>
            </Modal>
            <style>
                {`
                    .treeBox{width:663px !important;height:607px !important;}
                    .label{color:#999;width:104px;text-align:left;line-height:45px;font-size:13px;display:inline-block;}
                    .itemDetail{color:#333;display:inline-block;width:170px;overflow:hidden;text-overflow:ellipsis;height:30px;line-height:45px;white-space:nowrap;}
                `}
            </style>
        </div>
        )
    }
}
const fileViews = Form.create()(fileView);
export default fileViews;