import moment from 'moment';
import Axios from 'axios';
import {HttpUrl} from './httpConfig'
export function getRedirectPath(type){
    //根据用户信息返回不同的地址
    let url = ''
    if(type == 'LOGIN_SUCCESS'){
        url = 'page/1'
    }else if(type == 'LOGOUT_SUCCESS'){
        url = ''
    }else if(type == 'ERROR_MSG'){
        url = ''
    }
    return url
}
export function transformDate(date) {
    if(!date){
        return '--'
    }else{
        const d=new Date(date)
        const year= d.getFullYear()
        const month=( (d.getMonth()+1)>9 ? (d.getMonth()+1) :'0'+(d.getMonth()+1) )
        const day=d.getDate()>9 ? d.getDate():'0'+d.getDate();
        const h=d.getHours()>9 ? d.getHours() : '0' + d.getHours()
        const minus=d.getMinutes()>9 ?d.getMinutes() : '0' +d.getMinutes()
        const second=d.getSeconds()>9 ? d.getSeconds() : '0' +d.getSeconds()
        return (year+'-'+month+'-'+day + ' ' + h + ':' + minus + ':' + second)
    }
}
export function disabledDate(current) {
    return current < moment('0000-01-01')
}
    //获取权限按钮
export function btnList(_this){
        let length=_this.props.location.pathname.split('/').length
        let pageId=_this.props.location.pathname.split('/')[length-1]
        Axios.get(HttpUrl+ 'sys/system/resource/pageButton?pageId='+pageId).then(res => {
            if(res.data.code === '100000'){
                let length2=res.data.data.length
                let btnList=[]
                for(let i=0;i<length2;i++){
                    btnList.push(res.data.data[i].function)
                }
                _this.setState({
                    btnList:btnList
                })
                console.log(btnList)
            }else{
                message.warning(res.data.message)
            }
        })
    }
// 统计分析tabkey==2时的导出    
export function statisticExport(res) {
    let fileName=decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1].split('.')[0])
    let url = window.URL.createObjectURL(new Blob([res.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName +'.xls')
    document.body.appendChild(link)
    link.click()
}    