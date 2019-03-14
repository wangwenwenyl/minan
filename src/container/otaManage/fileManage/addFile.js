/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import checkedArrow from './../../../img/checkedArrow.png'
import {Modal ,Form,message,Input,Icon,Upload,Button,Tree,Radio} from 'antd';
import {HttpUrl,httpConfig} from './../../../util/httpConfig';
import { resolve } from 'url';
const RadioGroup = Radio.Group;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { TextArea } = Input;
const Search = Input.Search;
const dataList = [];
class addFile extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        fileModal:false,
        verifyModal:false,
        fileList:[],
        fileJudge:false,
        deviceJudge:false,
        chooseDeviceModal:false,
        expandedKeys1: [],
        expandedKeys2: [],
        searchValue1: '',
        searchValue2: '',
        autoExpandParent1: true,
        autoExpandParent2: true,
        record:'',
        treeData:[],
        rightData:[],
        rightData2:[],
        leftnode:'',
        rightnode:'',
        fileDetail:'',
        type:''
    }
    componentDidMount(){
       
    }
    openModal = (record,type) => {
        if(record){
            let arr=[];
            let rightData2=[]
            arr.push({name:record.fileName,uid: "rc-upload-1538016264131-2"})
            rightData2.push(JSON.parse(record.suitJson))
            this.setState({
                fileModal:true,
                record:record,
                rightData2:rightData2,
                fileList:arr,
                type:type
            })
        }else{
            this.setState({
                fileModal:true,
                type:type
            })
        }
    }
    //设备的选择
    chooseDevice = () => {
        if(this.state.fileList.length === 0){
            message.warning('请先上传文件')
        }else{
            this.setState({
                chooseDeviceModal:true
            })
            this.getTreeData()
        }
    }
    //获取升级设备树结构
    getTreeData = () => {
        this.setState({
            obj:this.props.obj
        })
        Axios.get(HttpUrl+'ota-mag/file/getEquipmentTree').then(res => {
            if(res.data.code==='100000'){
                this.setState({
                    treeData:res.data.data
                })
                this.generateList(res.data.data);
            }else{
                console.log(res.data.message)
            }
        })
    }
    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.name;
            dataList.push({ key,title: node.name});
            if (node.content) {
                this.generateList(node.content, node.name);
            }
        }
    };
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.content) {
                if (node.content.some(item => item.name === key)) {
                    parentKey = node.name;
                } else if (this.getParentKey(key, node.content)) {
                    parentKey = this.getParentKey(key, node.content);
                }
            }
        }
        return parentKey;
    };
    onExpand1 = (expandedKeys1) => {
        this.setState({
          expandedKeys1,
          autoExpandParent1: false
        });
    }
    onExpand2 = (expandedKeys2) => {
        this.setState({
          expandedKeys2,
          autoExpandParent2: false
        });
    }
    onChange1 = (e) => {
        const value = e.target.value;
        const expandedKeys1 = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.state.treeData);
            }
            return null;
          }).filter((item, i, self) => item && self.indexOf(item) === i);
          this.setState({
            expandedKeys1,
            searchValue1: value,
            autoExpandParent1: true
        });
    }
    onChange2 = (e) => {
        const value = e.target.value;
        const expandedKeys2 = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return this.getParentKey(item.key, this.state.treeData);
            }
            return null;
          }).filter((item, i, self) => item && self.indexOf(item) === i);
          this.setState({
            expandedKeys2,
            searchValue2: value,
            autoExpandParent2: true
        });
    }
    //树形选择
    treeSelect1 = (selectedKeys,e) => {
        this.setState({
            leftnode:{
                'id':e.node.props.id,
                'name':e.node.props.name,
                'pId':e.node.props.pId,
                'pids': e.node.props.pids ? e.node.props.pids : '_'
            }
        })
    }
    treeSelect2 = (selectedKeys,e) => {
        this.setState({
            rightnode:{
                'id':e.node.props.id,
                'name':e.node.props.name,
                'pId':e.node.props.pId,
                'pids': e.node.props.pids ? e.node.props.pids : '_'
            }
        })
    }
    //数据右移动
    rightRemove = () => {
        Axios.post(HttpUrl+'ota-mag/tree/chooseBranch',{
            'left':this.state.treeData,
            'right':this.state.rightData,
            'node':this.state.leftnode,
            'direction':'ltr'
        }).then(res => {
            if(res.data.code==='100000'){
                this.setState({
                    treeData:res.data.data.left,
                    rightData:res.data.data.right,
                })
                if(res.data.data.right.length === 0){
                    this.setState({
                        deviceJudge:true
                    })
                }else{
                    this.setState({
                        deviceJudge:false
                    })
                }
            }else{
                console.log(res.data.message)
            }
        })
    }
    //左移
    leftRemove = () => {
        if(this.state.rightData.length>0){
            Axios.post(HttpUrl+'ota-mag/tree/chooseBranch',{
                'left':this.state.treeData,
                'right':this.state.rightData,
                'node':this.state.rightnode,
                'direction':'rtl',
            }).then(res => {
                if(res.data.code==='100000'){
                    this.setState({
                        treeData:res.data.data.left,
                        rightData:res.data.data.right,
                    })
                    if(res.data.data.right.length === 0){
                        this.setState({
                            deviceJudge:true
                        })
                    }else{
                        this.setState({
                            deviceJudge:false
                        })
                    }
                }else{
                    console.log(res.data.message)
                }
            })
        }
    }
    
    //确定选择
    sureChoose = () => {
        this.setState({
            chooseDeviceModal:false,
            leftnode:'',
            rightnode:'',
            searchValue1: '',
            searchValue2: '',
            autoExpandParent1: true,
            autoExpandParent2: true,
        })
        Axios.post(HttpUrl+'ota-mag/tree/jsonHandle',{
            'chooseTree':this.state.rightData,
            'showStyle':1
        }).then(res => {
            if(res.data.code === '100000'){
                this.setState({
                    rightData2:JSON.parse(res.data.data)
                })
            }
        })
    }
    //取消选择
    cancelChoose = () => {
        this.setState({
            chooseDeviceModal:false,
            leftnode:'',
            rightnode:'',
            searchValue1: '',
            searchValue2: '',
            autoExpandParent1: true,
            autoExpandParent2: true,
        })
    }
    //确定
    sure = () => {
        this.handleSubmitForm()
    }
    //摘要验证
    keyDown = (event) => {
        if(event.keyCode === 32){
            event.preventDefault();
            return false;
        }else{
            setTimeout(() => {
                if(this.state.fileDetail.fileMD5 === this.props.form.getFieldValue('md5')){
                    this.setState({
                        validation:'通过'
                    })
                }else{
                    this.setState({
                        validation:'失败'
                    })
                }
            }, 100);
        }
    }
    onPaste = (e) => {
        setTimeout(() => {
            if( this.state.fileDetail.fileMD5 == this.props.form.getFieldValue('md5') || this.state.record.fileMD5 == this.props.form.getFieldValue('md5')){
                this.setState({
                    validation:'通过'
                })
            }else{
                this.setState({
                    validation:'失败'
                })
            }
        }, 100);
    }
    handleSubmitForm = () => {
        if(this.state.fileList.length === 0){
            this.setState({
                fileJudge:true
            })
            return false
        }
        if(this.state.rightData2.length === 0){
            this.setState({
                deviceJudge:true
            })
            return false
        }
        if(this.state.validation === '失败'){
            message.warning('摘要验证失败')
            return false
        }
        this.props.form.validateFields((err, values) => { 
            if(!err){
                this.setState({
                    verifyModal:true
                })
            }
        });
    }
    //确认
    sureVerify = () => {
        Axios.post('sys/system/user/checkPassword',{
            password:this.props.form.getFieldValue('password')
        },httpConfig).then( res => {
            if(res.data.code === '100000'){
                let obj=this.props.obj
                let fileDetail=this.state.fileDetail
                let record=this.state.record
                this.setState({
                    verifyModal:false
                })
                Axios.post(HttpUrl+'ota-mag/file/subjoin',{
                    fileId: fileDetail ? fileDetail.fileId : record ? record.fileId : '',
                    eqmJson:this.state.rightData,
                    fileRemark:this.props.form.getFieldValue('fileRemark'),
                    type:this.state.type
                }).then(res => {
                    if(res.data.code === '100000'){
                        if(this.state.type === 2){
                            this.props.showStep2( fileDetail,this.state.rightData2,this.state.minFromVersion)
                        }
                        this.setState({
                            fileModal:false,
                            record:'',
                            treeData:[],
                            rightData:[],
                            rightData2:[],
                            leftnode:'',
                            rightnode:'',
                            searchValue1: '',
                            searchValue2: '',
                            autoExpandParent1: true,
                            autoExpandParent2: true,
                            fileList:[],
                            validation:'',
                            fileDetail:''
                        })
                        if(record){
                            message.success('编辑成功')
                        }else{
                            message.success('新建成功')
                        }
                        this.getTreeData()
                    }else{
                        message.warning(res.data.message)
                    }
                    if(this.state.type === 1){
                        this.props.fileList()
                    }
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    cancelVerify = () => {
        this.setState({
            verifyModal:false
        })
    }
    cancel = () => {
        this.setState({
            fileModal:false,
            fileList:[],
            fileJudge:false,
            deviceJudge:false,
            chooseDeviceModal:false,
            expandedKeys1: [],
            expandedKeys2: [],
            searchValue1: '',
            searchValue2: '',
            autoExpandParent1: true,
            autoExpandParent2: true,
            record:'',
            treeData:[],
            rightData:[],
            rightData2:[],
            leftnode:'',
            rightnode:'',
            fileDetail:'',
            loading:false
        })
    }
    render() {
        const { getFieldDecorator}=this.props.form
        const { searchValue1,searchValue2, expandedKeys1,expandedKeys2, autoExpandParent1,autoExpandParent2,record} = this.state;
        const props = {
            beforeUpload: (file,fileList) => {
                if(file.size/1024/1024>256){
                    message.warning('大小超过限制')
                }else{
                    this.props.form.setFieldsValue({'md5':''})
                    let index1=file.name.lastIndexOf(".")
                    let files=file.name.substring(index1)
                    if(files === '.tar' || files === '.ota' ){
                        let arr=[];
                        let length=fileList.length
                        arr.push(fileList[length-1])
                        this.setState({
                            fileJudge:false,
                            loading:true,
                            fileList:arr
                        })
                        const formData = new FormData();
                        formData.append("mtpFile", file);
                        if(this.state.record){
                            formData.append("fileId", this.state.record.fileId);
                        }
                        Axios.post(HttpUrl+'ota-mag/file/OTAFileUpload',formData,{ headers: { 'Content-Type': 'multipart/form-data'}}).then(res => {
                            if(res.data.code === '100000'){
                                this.setState({
                                    fileDetail:res.data.data,
                                    minFromVersion:res.data.data.minFromVersion,
                                    loading:false
                                })
                            }else{
                                message.warning(res.data.message)
                            }
                        })
                    }else{
                        message.warning('上传文件必须为tar或ota文件')
                        
                    }
                    return false
                }
            },
            onRemove: () => { 
                this.setState({
                    fileList:[]
                })
             },
          };
          const loop1 = data => data.map((item) => {
            const index = item.name.indexOf(searchValue1);
            const beforeStr = item.name.substr(0, index);
            const afterStr = item.name.substr(index + searchValue1.length);
            const title = index > -1 ? (
                <span>
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue1}</span>
                  {afterStr}
                </span>
              ) : <span>{item.name}</span>;
              if (item.content) {
                return (
                  <TreeNode key={item.name} title={title} name={item.name} id={item.id} pId={item.pId} pIds={item.pIds}>
                    {loop1(item.content)}
                  </TreeNode>
                )
              }
              return <TreeNode key={item.name} title={title} id={item.id} name={item.name} pId={item.pId} pIds={item.pIds} />;
          });
          const loop2 = data => data.map((item) => {
            const index = item.name.indexOf(searchValue2);
            const beforeStr = item.name.substr(0, index);
            const afterStr = item.name.substr(index + searchValue2.length);
            const title = index > -1 ? (
                <span>
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue2}</span>
                  {afterStr}
                </span>
              ) : <span>{item.name}</span>;
              if (item.content) {
                return (
                  <TreeNode key={item.name} title={title} name={item.name} id={item.id} pId={item.pId} pIds={item.pIds}>
                    {loop2(item.content)}
                  </TreeNode>
                )
              }
              return <TreeNode key={item.name} title={title} id={item.id} name={item.name} pId={item.pId} pIds={item.pIds} />;
          });
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
            <div >
            <Modal
                title={this.props.title}
                visible={this.state.fileModal}
                okText="提交"
                cancelText="取消"
                onOk={this.sure}
                onCancel={ this.cancel}
                destroyOnClose={true}  
                className='addBox'
            >
                <div>   
                    <Form layout="inline" onSubmit={this.handleSubmitForm}>
                        <div className='uploadItem' style={{position:'relative'}}>
                            <Icon type={ this.state.loading ? 'loading' : ''} style={{fontSize:'28px',position:'absolute',left:'50%',top:'30%'}}></Icon>
                            <span className='ant-form-item-required' style={{position:'relative',top:'-10px',display:'inline-block',width:'120px',textAlign:'right'}}>选择文件：</span>
                            <Upload {...props} className="uploads" fileList={ this.state.fileList} >
                                <span style={{color:"#3190F5",marginLeft:'5px',lineHeight:'28px'}} className='skip'>浏览</span>
                            </Upload>
                            <div style={{color:'#999999',marginLeft:'120px',fontSize:'12px'}}>只识别.tar或.ota文件，文件大小不可超过256M</div>
                            {
                                this.state.fileJudge ? <span style={{color:'red',marginLeft:'120px',fontSize:'12px',position:'absolute'}}>请选择上传文件</span> : ''
                            }
                        </div>
                        <FormItem label="文件版本号" className='uploadItem'>
                            { getFieldDecorator('minFromVersion',{
                                rules:[{
                                    required:true
                                }],
                                initialValue: this.state.fileDetail ? this.state.fileDetail.showVersion : record ? record.showVersion :  ''
                            })( 
                                <Input placeholder='上传文件带入该版本号' readOnly />
                            )}
                        </FormItem><br/>
                        <br/>
                        <div>   
                            <span className='ant-form-item-required' style={{width:'120px',fontSize:'13px',color:'#333',display:'inline-block',textAlign:'right'}}>支持最低版本号：</span>
                            <span>{ this.state.fileDetail ? this.state.fileDetail.minFromVersion : record ? record.minFromVersion :  '' }</span>
                        </div>
                        <FormItem label="摘要" className='uploadItem'>
                             { getFieldDecorator('md5',{
                                rules:[{
                                    required:true,
                                    message:"请输入升级包摘要"
                                }],
                                initialValue:  record ? record.fileMD5 : ''
                            })( <Input   placeholder='请核对无误后输入升级包摘要' rows={2} onKeyDown={this.keyDown} onPaste={ this.onPaste } autoComplete='off'/>)}
                        </FormItem>
                        <div style={{color:'#999999',marginLeft:'120px',fontSize:'12px'}}>请核对摘要:{ record ? record.fileMD5 : this.state.fileDetail ?  this.state.fileDetail.fileMD5 : ''}</div>
                        <div className='uploadItem'>
                            <span className='ant-form-item-required' style={{position:'relative',display:'inline-block',width:'120px',textAlign:'right'}}>升级设备：</span>
                            <Button onClick={this.chooseDevice} style={{marginLeft:'0px',border:'1px solid #3689FF',color:"#3689FF",height:'28px'}}>选择</Button>
                            {
                                this.state.record ? '' :
                                (this.state.deviceJudge ? <div style={{color:'red',marginLeft:'120px',position:'absolute'}}>请选择设备</div> : '')
                            }
                            <div style={{marginTop:'18px'}}>
                            {
                                this.state.rightData2.length>0 ? <div style={{marginLeft:'120px'}}>已选择型号</div> : ''
                            }
                            {
                                this.state.rightData2.length>0 ?
                                <div style={{marginLeft:'102px'}}>
                                    <Tree>
                                    {
                                        loop(this.state.rightData2)
                                    }
                                    </Tree>
                                </div>
                                : ''
                            }
                            </div>
                        </div>
                        <FormItem label="备注" className='uploadItem'>
                            { getFieldDecorator('fileRemark',{
                                rules:[{
                                    message:'请输入备注'
                                }],
                                initialValue: record ? record.fileRemark : ''
                            })( <TextArea rows={ 10 }  maxLength='300'/>)}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
            <Modal
                title="选择升级设备"
                wrapClassName="vertical-center-modal"
                visible={this.state.chooseDeviceModal}
                okText="保存"
                cancelText="取消"
                onOk={ this.sureChoose}
                onCancel={ this.cancelChoose}
                maskClosable={false}
                className='treeBox'
                >
                <div className='treeData' >
                    <div style={{width:'40%',float:'left',border:'1px solid #ddd',padding:'5px',height:'300px',overflow:'scroll',borderRadius:'5px'}}>
                        <Search style={{ marginBottom:8}}   onChange={this.onChange1} />
                        <Tree
                            onExpand={this.onExpand1}
                            expandedKeys={expandedKeys1}
                            autoExpandParent={autoExpandParent1}
                            onSelect={this.treeSelect1}
                            >
                            {
                                loop1(this.state.treeData)
                            }
                        </Tree>
                    </div>
                    <div style={{width:'40%',float:'right',border:'1px solid #ddd',padding:'5px',height:'300px',overflow:'scroll'}}>   
                        <Search style={{ marginBottom: 8 }}  onChange={this.onChange2}/>
                        <Tree
                            onExpand={this.onExpand2}
                            expandedKeys={expandedKeys2}
                            autoExpandParent={autoExpandParent2}
                            onSelect={this.treeSelect2}
                            >
                            {
                                loop2(this.state.rightData)
                            }
                        </Tree>
                    </div>
                    <div className='treeBtn' style={{float:'right',marginRight:'5%'}}>
                        <Button  onClick={ this.rightRemove}> <Icon type="double-right"/> </Button><br/>
                        <Button  onClick={ this.leftRemove } style={{marginTop:'20px'}}> <Icon type="double-left"  /> </Button>
                    </div>
                </div>
            </Modal>
            <Modal
                 title='登录密码验证'
                 visible={this.state.verifyModal}
                 okText="提交"
                 cancelText="取消"
                 onOk={ this.sureVerify }
                 onCancel={ this.cancelVerify }
                 maskClosable={false}
                 destroyOnClose={true}
                 className='verifyModal'
            >
                <Form layout="inline">  
                    <FormItem >
                    <div style={{textAlign:'center',marginBottom:'5px'}}> 请输入当前登录账户的密码</div>
                    {
                        getFieldDecorator('password')(
                            <Input type="password"/>
                        )
                    }
                    </FormItem>
                </Form>
            </Modal>
            <style>
                {`
                    .ant-modal-footer .ant-btn:not(:last-child){margin-right:50px;}
                    Button{margin-left:12px;}
                    .uploads{display:inline-block;}
                    .ant-upload{float:right}
                    .ant-upload-list{float:left;width:230px;border:1px solid #D7DDEA;height:30px;line-height:30px;border-radius: 4px;}
                    .ant-upload-list-item{margin-top:0;height:30px;line-height:30px;}
                    .uploadItem{margin-top:20px;}
                    .uploadItem .ant-form-item-label{width:120px;}
                    .uploadItem .ant-form-item-control-wrapper{width:230px;}
                    .treeLeft,.treeBtn,.treeRight{float:left;}
                    .treeBtn{margin:100px 12px;}
                    .treeLeft,.treeRight{height:250px;border:1px solid #ddd;margin-top:20px;overflow-Y:scroll;width:225px;}
                    .treeData:after{display:table;content:'';clear:both;}
                    .treeData{height:350px !important;overflow:scroll;}
                    .treeBox{width:700px !important;}
                    .addBox{width:480px !important;}
                    textarea.ant-input{height:110px !important;}
                    .skip:hover{cursor:pointer}
                    .verifyModal{text-align:center;}
                `}
            </style>
        </div>
        )
    }
}

const addFiles = Form.create()(addFile);
export default addFiles;