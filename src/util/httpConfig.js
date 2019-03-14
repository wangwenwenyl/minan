import Qs from 'qs'
import {message} from 'antd'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json';

export const httpConfig = {
        //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
    url: '',

    // 请求方法同上
    method: 'get', // default
    // 基础url前缀

    baseURL: 'http://42.159.92.113/api/',
    　　
    　　　　
    transformRequest: [function (data) {
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    　  data = JSON.stringify(data)
        return data;
    }],

    transformResponse: [function (data) {
        // 这里提前处理返回的数据
        return data;
    }],

    // 请求头信息
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    },

    //parameter参数
    params: {
        
    },
    // paramsSerializer: function(params) {
    //     console.log(params)
    //     return Qs.stringify(params, {arrayFormat: 'brackets'})
    // },
    //post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
    data: {
        // firstName: 'Fred'
    },

    //设置超时时间
    timeout: 10000,
    withCredentials: false,
    //返回数据类型
    responseType: 'json', // default
}
// Add a request interceptor

axios.interceptors.request.use(
    config =>{
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers = {
                'token':token,
                "Content-Type": "application/json;charset=utf-8"
            }
        }
        return config
     },
     err =>{
        message.error('请求超时!')
        return Promise.reject(err)
    }
);
export const HttpUrl='http://42.159.92.113/api/'
export const webSocketUrl = 'ws://42.159.92.113:8801/ws'
export const webSocketUrl1 = 'ws://42.159.92.113:8808/ctrl/ws-command/web/v1/?'

// export const HttpUrl='http://192.168.22.226:8751/api/' //佳庆
// export const HttpUrl='http://192.168.86.101:8805/api/' //京新
// export const HttpUrl='http://192.168.86.201:8810/api/' //宇龙

