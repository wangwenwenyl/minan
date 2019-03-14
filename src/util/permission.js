import {message} from 'antd'
export function permission(number){
    return sessionStorage.getItem('buttos').includes(number)
}
export function datas(){
    return (
        this.setState({
            num:5
        })
    )
    
}
export function errorCallback(code){
    if(code === '999999'){
        message.warning('系统内部错误')
    }else if(code === '110001'){
        message.warning('参数错误')
    }else if(code === '110002'){
        message.warning('请先输入统计条件')
    }else if(code === '120001'){
        message.warning('用户未登录')
    }else if(code === '120002'){
        message.warning('token 失效')
    }else if(code === '120004'){
        message.warning('异地登录')
    }else if(code === '120007'){
        message.warning('账号已过期')
    }else if(code === '120008'){
        message.warning('账号已禁用')
    }
}
//按整月计算
export function completeMonth (numMonth) {

    let date=new Date()
    let dateTotal=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000+24*3600*1000)
    
    //开始时间
    date.setMonth(dateTotal.getMonth()-numMonth)
    let dates=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000)
    let year2=dates.getFullYear()
    let month2=dates.getMonth()
    let day2=dates.getDate()
    let hours2=dates.getHours()
    let minutes2=dates.getMinutes()
    let seconds2=dates.getSeconds()

    return{
        startTime:year2+'-'+month2+'-'+day2+' '+hours2+':'+minutes2+':'+seconds2,
        endTime:dateTotal.getFullYear()+'-'+(dateTotal.getMonth()+1)+'-'+ dateTotal.getDate() +' '+ dateTotal.getHours() +':'+ dateTotal.getMinutes() + ':'+ dateTotal.getSeconds()
    }
}
//按随机时间
export function randomDay(randomDays) {
    let date=new Date(randomDays[1])
        let dateTotal=new Date(date.getTime()-date.getHours()*3600*1000-date.getMinutes()*60*1000-date.getSeconds()*1000+24*3600*1000)
        let year=dateTotal.getFullYear()
        let month=dateTotal.getMonth()+1
        let day=dateTotal.getDate()
        let hours=dateTotal.getHours()
        let minutes=dateTotal.getMinutes()
        let seconds=dateTotal.getSeconds()

        let dates2=new Date(randomDays[0])
        let dates=dates2.getTime()-dates2.getHours()*3600*1000-dates2.getMinutes()*60*1000-dates2.getSeconds()*1000
        let date2=new Date(dates)
        let year2=date2.getFullYear()
        let month2=date2.getMonth()+1
        let day2=date2.getDate()
        let hours2=date2.getHours()
        let minutes2=date2.getMinutes()
        let seconds2=date2.getSeconds()
        return {    startTime:year2+'-'+month2+'-'+day2+' '+ hours2 + ':'+ minutes2 + ':' + seconds2,
                    endTime:year+'-'+month+'-'+day +' '+ hours +':'+ minutes+ ':'+seconds
                }
}
//空格的限制
export function keycode(event){
    if(event.keyCode === 32){
        event.preventDefault();
        return false;
    }
}
//黏贴中的空格
export function paste(str){
    console.log(str)
    if(str.indexOf(" ") === -1){
        return false
    }
}
export function transform (date){
    var arr=date.split("T");
    var d=arr[0];
      var darr = d.split('-');
   
      var t=arr[1];
      var tarr = t.split('.000');
      var marr = tarr[0].split(':');
      var dd = parseInt(darr[0])+"-"+parseInt(darr[1])+"-"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
      return dd
}