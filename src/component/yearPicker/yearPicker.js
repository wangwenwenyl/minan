import React from 'react'
import {Select, Icon,Form} from 'antd'


const Option = Select.Option
const FormItem = Form.Item
class yearPickers extends React.Component{
    constructor(props){
        super(props)
        let now = new Date()
        this.state={
            year:now.getFullYear(),
            yearList:''
        }
    }
    componentWillMount(){
        this.initData(this.state.year)
    }
    initData=(year)=>{
        let list = []
        for(let i=year;i>year-5;i--){
            list.push(<Option value={i} key={i}>{i}</Option>)
        }
        list.push(<Option value='left' key='left' disabled><span onClick={this.prevYear} className='yearBtn'>上一页</span> <span className='yearBtn' style={{float:'right'}} onClick={this.nextYear}>下一页</span></Option>)
        this.setState({
            yearList:list
        })
    }
    prevYear=()=>{
       this.setState({
           year:this.state.year+5
       })
       setTimeout(()=>{
        this.initData(this.state.year)
       },500)
    }
    nextYear=()=>{
        this.setState({
            year:this.state.year-5
        })
        setTimeout(()=>{
            this.initData(this.state.year)
        },500)
    }
    render(){
        const { getFieldDecorator }=this.props.form
        return(
            <div>
                <FormItem  className="form_input" label="年款：" labelCol={{span:10}} wrapperCol={{span:14}}>
                    {getFieldDecorator('modelYear',{
                        rules: [{ required: true, message: '请选择年款' }],
                        initialValue:{key:this.props.modelYear}
                    })( <Select labelInValue onChange={this.props.modelyears}>
                    {this.state.yearList}
                </Select>)}
                </FormItem>
                <style>
                 {`
                    .ant-select-dropdown-menu-item-disabled{cursor:pointer!important;color:rgba(0, 0, 0, 0.65)}
                    .ant-select-dropdown-menu-item-disabled:hover{color:rgba(0, 0, 0, 0.65)}
                    .ant-select-dropdown-menu-item-disabled .yearBtn:hover{font-weight:600}
                 `}   
                </style>
            </div>
        )
    }
}

const yearPicker=Form.create()(yearPickers)
export default yearPicker