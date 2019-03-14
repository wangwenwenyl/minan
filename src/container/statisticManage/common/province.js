/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import checkedArrow from './../../../img/checkedArrow.png'
import {Modal ,Form,message} from 'antd';
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
class province extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        provinceModal:false,
        provinceArr:[],
        provinceArr2:[],
        weiduFlag:''
    }
    componentDidMount(){
        
    }
    provinceList = () => {
        Axios.get(HttpUrl+'vehicle/open/v1/area').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length;
                let provinceArr=[];
                for(let i=0;i<length;i++){
                    provinceArr.push(<div className='checks' key={res.data.data[i].id} data-id={res.data.data[i].id} id={res.data.data[i].value}
                    style={{border:this.state.provinceArr2.indexOf(res.data.data[i].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.provinceArr2.indexOf(res.data.data[i].value) >=0 ? '#3689FF' : '#333'}}   onClick={ (e) => this.provinceCheck(e)}> 
                    { res.data.data[i].value} 
                    <img src={ this.state.provinceArr2.indexOf(res.data.data[i].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                   </div>)
                }
                if(this.state.weiduFlag === '省份'){
                    provinceArr.unshift(<div className='checks' key='100' data-id='100' id='全国'
                    style={{border:this.state.provinceArr2.indexOf('全国') >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.provinceArr2.indexOf('全国') >=0 ? '#3689FF' : '#333'}}   onClick={ (e) => this.provinceCheck(e)}> 
                    全国
                    <img src={ this.state.provinceArr2.indexOf('全国') >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                </div>)
                }
                this.setState({
                    provinceArr:provinceArr
                })
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //省份选择
    provinceCheck = (e) => {
        new Promise(resolve => {
            let provinceArr2=this.state.provinceArr2
            if(provinceArr2.indexOf(e.target.id)>=0){
                provinceArr2.splice(provinceArr2.indexOf(e.target.id),1)
            }else{
                if(provinceArr2.length<5){
                    provinceArr2.push(e.target.id)
                }
            }
            this.setState({
                provinceArr2:provinceArr2,
            })
            resolve(true)
        }).then(res => {
            if(res){
                this.provinceList()
            }
        })
    }
    provinceEvent = (res,flag) => {
        this.setState({
            provinceModal:true,
            provinceArr2:res,
            weiduFlag:flag,
        })
        this.provinceList()
    }
    cancel = () => {
        this.props.setProvince(this.state.provinceArr2)
        this.setState({
            provinceModal:false,
            provinceArr:[],
            provinceArr2:[],
            weiduFlag:''
        })
    }
    render() {
        const { provinceArr } = this.state
        return (
            <div >
            <Modal
                title=' '
                visible={this.state.provinceModal}
                onCancel={ this.cancel}
                destroyOnClose={true}
                footer={null}
                className='provinceBox'
            >
            <div className='province'>
                { provinceArr }
            </div>
            </Modal>
            <style>
                {`
                    .provinceBox{width:700px !important;}
                    .province .checks{max-width:150px}
                `}
            </style>
        </div>
        )
    }
}

const provinces = Form.create()(province);
export default provinces;