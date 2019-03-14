/*设备管理>车辆信息管理*/
import React, { Component } from 'react';
import Axios from 'axios';
import checkedArrow from './../../../img/checkedArrow.png'
import {Modal ,Form,Button,message} from 'antd';
import {HttpUrl,httpConfig} from './../../../util/httpConfig'
class city extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        cityModal:false,
        cityArr:'',
        cityArr2:[],
        province:[],
        provinceArr:[]
    }
    componentDidMount(){
        
    }
    updateTaskLastMile = (args) =>{
        return new Promise((resolve, reject) => {
            Axios.get(HttpUrl+'vehicle/open/v1/area/'+args.id+'/subset').then(res => {
            let cityArr=[]
                if(res.data.code === '100000'){
                    let length=res.data.data.length
                    for(let j=0;j<length;j++){
                        let div
                        if(args.id === '110000'){
                            div=(<div className='checks' key={res.data.data[j].id} data-id={res.data.data[j].id} id={'北京市'+res.data.data[j].value} onClick={ (e) => this.cityCheck(e)}
                                style={{border:this.state.cityArr2.indexOf('北京市'+res.data.data[j].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.cityArr2.indexOf('北京市'+res.data.data[j].value) >=0 ? '#3689FF' : '#333'}} > 
                                {'北京市'+ res.data.data[j].value} 
                                <img src={ this.state.cityArr2.indexOf('北京市'+res.data.data[j].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                        }else if(args.id === '120000'){
                            div=(<div className='checks' key={res.data.data[j].id} data-id={res.data.data[j].id} id={'天津市'+res.data.data[j].value} onClick={ (e) => this.cityCheck(e)}
                                style={{border:this.state.cityArr2.indexOf('天津市'+res.data.data[j].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.cityArr2.indexOf('天津市'+res.data.data[j].value) >=0 ? '#3689FF' : '#333'}} > 
                                {'天津市'+ res.data.data[j].value} 
                                <img src={ this.state.cityArr2.indexOf('天津市'+res.data.data[j].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                        }else if(args.id === '310000'){
                            div=(<div className='checks' key={res.data.data[j].id} data-id={res.data.data[j].id} id={'上海市'+res.data.data[j].value} onClick={ (e) => this.cityCheck(e)}
                                style={{border:this.state.cityArr2.indexOf('上海市'+res.data.data[j].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.cityArr2.indexOf('上海市'+res.data.data[j].value) >=0 ? '#3689FF' : '#333'}} > 
                                {'上海市'+ res.data.data[j].value} 
                                <img src={ this.state.cityArr2.indexOf('上海市'+res.data.data[j].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                        }else if(args.id === '500000'){
                            div=(<div className='checks' key={res.data.data[j].id} data-id={res.data.data[j].id} id={'重庆市'+res.data.data[j].value} onClick={ (e) => this.cityCheck(e)}
                                style={{border:this.state.cityArr2.indexOf('重庆市'+res.data.data[j].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.cityArr2.indexOf('重庆市'+res.data.data[j].value) >=0 ? '#3689FF' : '#333'}} > 
                                {'重庆市'+ res.data.data[j].value} 
                                <img src={ this.state.cityArr2.indexOf('重庆市'+res.data.data[j].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                        }else{
                             div=(<div className='checks' key={res.data.data[j].id} data-id={res.data.data[j].id} id={res.data.data[j].value} onClick={ (e) => this.cityCheck(e)}
                                style={{border:this.state.cityArr2.indexOf(res.data.data[j].value) >=0 ? '1px solid #3689FF' : '1px solid #fff',color:this.state.cityArr2.indexOf(res.data.data[j].value) >=0 ? '#3689FF' : '#333'}} > 
                                {res.data.data[j].value} 
                                <img src={ this.state.cityArr2.indexOf(res.data.data[j].value) >=0 ? checkedArrow : ''} alt="" style={{position:'absolute',right:'0px',bottom:'0px'}}/>
                            </div>)
                        }
                        if(length === 1){
                            cityArr.push(<div className='checks' key={'title'+res.data.data[j].id} style={{border:'none',fontSize:'14px',fontWeight:'bold',color:"#333"}}>{ args.value }</div>)
                            cityArr.push(div)
                            cityArr.push(<br key={'br'+res.data.data[j].id}/>)
                        }else{
                            if(j === 0){
                                cityArr.push(<div className='checks' key={'title'+res.data.data[j].id} style={{border:'none',fontSize:'14px',fontWeight:'bold',color:"#333"}}>{ args.value }</div>)
                                cityArr.push(div)
                            }else if(j === length-1){
                                cityArr.push(div)
                                cityArr.push(<br key={'br'+res.data.data[j].id}/>)
                            }else{
                                cityArr.push(div)
                            }
                        }
                    }
                    resolve(cityArr)
                }else{
                    message.warning(res.data.message)
                }
            })
        });
    }
    cityList = async () => {
        const provinceArr = this.state.provinceArr;
        const promises = provinceArr.map(b => this.updateTaskLastMile(b));
        const cityArr = await Promise.all(promises);
        this.setState({
            cityArr:cityArr
        })
    }
     provinceList = () => {
        return Axios.get(HttpUrl+'vehicle/open/v1/area').then(res => {
            if(res.data.code === '100000'){
                let length=res.data.data.length
                let provinceArr=[]
                for(let i=0;i<length;i++){
                    if(this.state.province.includes(res.data.data[i].value)){
                        provinceArr.push(res.data.data[i])
                    }
                }
                this.setState({
                    provinceArr:provinceArr
                })
                return true
            }else{
                message.warning(res.data.message)
            }
        })
    }
    //地市选择
    cityCheck = (e) => {
        console.log(e.target.id)
        let cityArr2=this.state.cityArr2
        if(cityArr2.indexOf(e.target.id)>=0){
            cityArr2.splice(cityArr2.indexOf(e.target.id),1)
        }else{
            if(cityArr2.length<5){
                cityArr2.push(e.target.id)
            }
        }
        console.log(cityArr2)
        this.setState({
            cityArr2:cityArr2
        })
        this.cityList()
    }
    cityEvent = (res,city) => {
        this.setState({
            cityModal:true,
            province:res,
            cityArr2:city
        })
        new Promise(resolve => {
            let v=this.provinceList()
            resolve(v)
        }).then(v => {
            if(v){
                this.cityList()
            }
        })
    }
    cancel = () => {
        this.props.setCity(this.state.cityArr2)
        this.setState({
            cityModal:false,
            cityArr:[],
            cityArr2:[],
            province:[],
            provinceArr:[]
        })
    }
    render() {
        const { cityArr } = this.state
        return (
            <div>
            <Modal
                title=' '
                visible={this.state.cityModal}
                onCancel={ this.cancel}
                destroyOnClose={true}
                footer={null}
                className='provinceBox cityBox'
            >
            <div className='city'>
                { cityArr }
            </div>
            </Modal>
            <style>
                {`
                    .cityBox .ant-modal-content{height:590px !important;}
                    .city{max-height:530px;overflow:scroll;}
                `}
            </style>
        </div>
        )
    }
}

const citys = Form.create()(city);
export default citys;