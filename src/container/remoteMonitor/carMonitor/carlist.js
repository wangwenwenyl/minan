import React from 'react'
import {Form,Button,Input,Select,Collapse} from 'antd'
import {postAxios} from './../../../util/common'
import remoteUrl from './../remoteURL'
import Table from './../../../component/table/table'
import checkedArrow from './../../../img/checkedArrow.png'

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
class carLists extends React.Component{
    constructor(){
        super()
        this.state={
            columns:[
                { title: '序号', width: 60, dataIndex: 'number'},
                { title: 'VIN', width: 150, dataIndex: 'vin'},
                { title: '车牌号', dataIndex: 'plateNo'},
                { title: '车型', dataIndex: 'carType'},
                { title: '关联主账号', dataIndex: 'mobile'},
                { title: '状态', dataIndex: 'status',
                render:(text)=>{
                    return text?text=="1"?"在线":"离线":''
                }},
                { title: '操作' , dataIndex:'operation',
                render: (text,record) => {
                    return (
                        <div className='action'>
                          <span onClick={ () => this.monitor(record)} ><a style={{color:"#3689FF"}}>监控</a></span>
                        </div>
                    )
                }},
            ],
            tableData:[],
            loading:true,
            total:'',
            pageSize:10,
            pageNumber:1,
            online:false,
            outline:false,
            collapseStatus:false
        }
        this.statusArr = []
    }
    componentDidMount(){
        this.getList(this.state.pageNumber,this.state.pageSize)
    }
    getList=(pageNumber,pageSize,searchData)=>{
        let params ={
            startPage:pageNumber,
            pageSize:pageSize>0?pageSize:this.state.pageSize
        }
        let arr = []
        if(this.state.online)arr.push(1)
        if(this.state.outline)arr.push(0)
        if(searchData)params = {...searchData,...params}
        params.status = arr
        postAxios(remoteUrl.carMonitorList,params,(data)=>{
            if(data.code == "100000"){
                for(let i=0;i<data.data.list.length;i++){
                    data.data.list[i].number=i+1+(params.startPage-1)*params.pageSize;
                    data.data.list[i].key=i+1+(params.startPage-1)*params.pageSize;
                }
                this.setState({tableData:data.data.list,loading:false,total:data.data.total,pageNumber})
            }
        })
    }
    onChange=(pageNumber)=>{
        let searchData = this.props.form.getFieldsValue()
        this.getList(pageNumber,'',searchData)
    }
    serach=()=>{
        let searchData = this.props.form.getFieldsValue()
        this.getList(1,10,searchData)
    }
    reset=()=>{
        let _t = this;
        this.props.form.resetFields()
        this.setState({
            online:false,
            outline:false 
        },()=>{
            _t.getList(this.state.pageNumber,this.state.pageSize)
        })
        
    }
    //监控
    monitor=(record)=>{
        window.open("../../.././carMonitor/"+record.vin, "_blank", "height=500,width=1010,scrollbars=yes,resizable=0,modal=false,toolbar:yes,alwaysRaised=no")
    }
    modelCheck=(id)=>{
        id==1?this.setState({online:!this.state.online},()=>{
            this.serach()
        }):this.setState({outline:!this.state.outline},()=>{
            this.serach()
        })
    }
    collapseChange = () => {
        this.setState({
            collapseStatus:!this.state.collapseStatus
        })
    }
    render(){
        const { getFieldDecorator }=this.props.form
        return(
            <div className="content">
                <div className='content-title'>   
                <Form layout="inline">
                <div className="searchType">
                    <FormItem label="关键字搜索" style={{verticalAlign:'middle'}}>
                        {getFieldDecorator('name', {
                            rules: [{ message: '' }],
                        })(
                            <Input placeholder="车牌号、VIN、终端SN" />
                        )}
                    </FormItem>
                    <FormItem label="关联主账号" style={{verticalAlign:'middle'}}>
                        {getFieldDecorator('mobile', {
                            rules: [{ message: '' }],
                        })(
                            <Input  />
                        )}
                    </FormItem>
                    <Button type="primary" className="btn" style={{marginLeft:'54px'}} onClick={this.serach}>查询</Button>
                    <Button className='btn' onClick={this.reset}>清除条件</Button>
                </div>
                <Collapse bordered={false} onChange={this.collapseChange} className='toggle'>
                        <Panel header={this.state.collapseStatus ? <span>收起</span> : <span>更多</span>} key="1">
                            <div className='searchType'>
                                <div className='typeTitle' >状态：</div>
                                <div className='moreBox' style={{height:this.state.modelMoreNum ? 'auto' : '50px',}}>
                                   <div className='checks'
                                    style={{border:this.state.online? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.online ? '#3689FF' : '#999'}}   onClick={ () => this.modelCheck(1)}> 
                                    在线
                                   <img src={ this.state.online ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                   </div>
                                   <div className='checks'
                                   style={{border:this.state.outline ? '1px solid #3689FF' : '1px solid #E4E4E4',color:this.state.outline ? '#3689FF' : '#999'}}   onClick={ () => this.modelCheck(0)}> 
                                    离线
                                  <img src={ this.state.outline ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                                  </div>
                                </div>
                            </div>
                        </Panel>
                    </Collapse>
                </Form>
                </div>
                <div className='table' style={{marginTop:"40px"}}>
                <Table 
                    columns={this.state.columns}
                    dataSource={this.state.tableData}
                    loading={this.state.loading}
                    total={this.state.total}
                    current={this.state.pageNumber}
                    pageSize={this.state.pageSize}
                    onChange={this.onChange}
                />
                </div>
            </div>
        )
    }
}
const carList = Form.create()(carLists)
export default carList