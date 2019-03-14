import Axios from 'axios'
import { httpConfig } from "./../util/httpConfig";
import {getRedirectPath} from './../util/util'
 
const ERROR_MSG = 'ERROR_MSG'
const REQUEST_SUCCESS = 'REQUEST_SUCCESS'

//reducer

export function roleList(current,pageSize){
    Axios.get('/role/list?startPage='+current+'&&pageSize='+pageSize,{httpConfig}).then(res=>{
        if(res.data.code==='10000'&&res.data.result==='SUCCESS'){
            console.log(res.data.data.list)
            for(let i=0;i<res.data.data.list.length;i++){
                res.data.data.list[i].number=i+1;
                res.data.data.list[i].key=i;
            }
            this.setState({
                data:res.data.data.list
            })
        }
    })
}