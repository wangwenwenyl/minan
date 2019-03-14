import Axios from 'axios'
import { httpConfig,HttpUrl } from './httpConfig';

export function getAxios(url,callback){
    if(url){
        Axios.get(url,httpConfig).then(res=>{
            if(res.status == 200){
                callback(res.data)
            }else{
                
            }
        })
    }
}

export function getAxiosData(url,data,callback){
    if(url){
        Axios.get(HttpUrl+url,{params:data}).then(res=>{
            if(res.status == 200){
                callback(res.data)
            }else{
                
            }
        })
    }
}

export function postAxios(url,params,callback){
    if(url){
        Axios.post(url,params,httpConfig).then(res=>{
            if(res.status == 200){
                callback(res.data)
            }else{
                
            }
        })
    }
}
export function deleteAxios(url,callback){
    if(url){
        Axios.delete(url,httpConfig).then(res=>{
            if(res.status == 200){
                callback(res.data)
            }else{
                
            }
        })
    }
}

export function putAxios(url,params,callback){
    if(url){
        Axios.put(url,params,httpConfig).then(res=>{
            if(res.status == 200){
                callback(res.data)
            }else{
                
            }
        })
    }
}