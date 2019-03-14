// 大屏监控----------------------------cq
// /largeScreenMonitoring/largeScreen            /page/distribution/distribution/350
import React, { Component } from 'react';
import Axios from 'axios';
import './largeScreen.css'     // 缩小五倍    小
// import './bigLarge.css'     //正式的大小   大
import { Link } from 'react-router-dom';
import {message,Form,} from 'antd';
import {HttpUrl,httpConfig} from '../../util/httpConfig';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
// 引入饼图
import  'echarts/lib/chart/pie';
// 引入地图
import  'echarts/map/js/china.js';
const date = new Date();
const timess=date.toLocaleString('chinese', { hour12: false });
class largeScreen extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        columns:[{ 
            title: 'VIN',
            dataIndex: 'vin',
        },{ 
            title: '行驶里程',
            dataIndex: 'amount' 
        }],
        powerWeek:[],//柱形图横轴
        powerPower:[],//柱形数据
        reductionName:[],//碳减排数量
        reductionValue:[],//碳减排数量
        reductionData:[],//地图接口数据
        reductionSum:[],//累计碳减排
        reductionMax:[],//累计碳减排最大
        reductionMin:[],//累计碳减排最小
        sumKm:'',//总里程
        online:'',//当前在线
        amount:'',//登记总数
        loginAmount:[],//在线数量
        loginDate:[],//统计时间
        vins:[],//行驶里程vin
        amounts:[],//行驶里程
        warnName:[],//故障-名
        warnValue:[],//故障-值
        warnData:[],//故障-data
        nowTimes:'',//刷新时间
    }
    
    componentDidMount(){
        // this.text()
        this.allList()
        // setInterval(()=>{this.text()},5000)
        setInterval(()=>{this.allList()},900000)
    }
    allList=()=>{
        const date = new Date();
        this.timess=date.toLocaleString('chinese', { hour12: false });
        this.distance()// 左上
        this.power()//左下
        this.login()//中下
        this.reductionList()//中上
        this.sumList()//右上
        this.warn()//右下
        this.leftBottom()
        this.centerTop()
        this.contentBot()
        this.rbCont()
        
        this.setState({
            powerWeek:[],//柱形图横轴
            powerPower:[],//柱形数据
            reductionName:[],//碳减排数量
            reductionValue:[],//碳减排数量
            reductionData:[],//地图接口数据
            reductionSum:[],//累计碳减排=================
            reductionMax:[],//累计碳减排最大
            reductionMin:[],//累计碳减排最小
            sumKm:'',//总里程
            online:'',//当前在线
            amount:'',//登记总数
            loginAmount:[],//在线数量
            loginDate:[],//统计时间
            vins:[],//行驶里程vin
            amounts:[],//行驶里程
            warnName:[],//故障-名
            warnValue:[],//故障-值
            warnData:[],//故障-data
            nowTimes:'',//刷新时间
       })
    }
    //仅测试数字滚动效果
    // text=()=>{
    //     Axios.get(HttpUrl+'data/screen/get',httpConfig).then(res=>{
    //         console.log(res)
    //         if(res.status == 200 && res.data.code == '100000'){
    //             //数字滚动
    //             var size = 36;
    //             var columns = Array.from(document.getElementsByClassName('column'));
    //             var d = undefined,
    //                 c = undefined;
    //             var classList = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
    //             function getClass(n, i2) {
    //                 return classList.find(function (class_, classIndex) {
    //                     return i2 - classIndex === n || i2 + classIndex === n;
    //                 }) || '';
    //             }
        
    //             c = res.data.data.time;
    //             console.log( res.data.data.time)
    //             columns.forEach(function (ele, i) {
    //                 var n = +c[i];
    //                 var offset = -n * size;
    //                 ele.style.transform = 'translateY(calc(' + offset + 'px ))';
    //                 Array.from(ele.children).forEach(function (ele2, i2) {
    //                     ele2.className = 'num ' + getClass(n, i2);
    //                 });
    //             });
    //         }
    //     })
    // }

    //左上
    distance=()=>{
        Axios.get(HttpUrl+'data/screen/distance',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                var vin=''
                var amount=''
                for (let i = 0; i < res.data.data.length; i++) {
                    vin+='<li>'+res.data.data[i].vin+'</li>';
                }
                document.getElementsByClassName("vinss")[0].innerHTML=vin
                for (let k = 0; k < res.data.data.length; k++) {
                    amount+='<li>'+res.data.data[k].amount+'km</li>'
                }
                document.getElementsByClassName("amountss")[0].innerHTML=amount
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
                console.log(vin)
                console.log(this.state.amount)
                console.log(this.state.vins)
                console.log(this.state.amounts)
        })
    }
    //左下
    power=()=>{
        Axios.get(HttpUrl+'data/screen/power',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for (let i = 0; i < res.data.data.length; i++) {
                    this.state.powerWeek.push(res.data.data[i].week);
                    this.state.powerPower.push(res.data.data[i].power)
                }
                console.log(this.state.powerWeek)
                console.log(this.state.powerPower)
                if(res.data.data.length==0){
                    document.getElementById('lbcont').innerHTML='<div class="noneDatas">暂无数据</div>'
                }
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
            this.leftBottom()
        })
    }
    // 柱形图
    leftBottom=()=>{
        var myChart = echarts.init(document.getElementById('lbcont'));
        myChart.setOption({
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#00E8FF' // 0% 处的颜色
                }, {
                    offset: 1, color: '#046DC5' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            },
            tooltip : {
                formatter: "{b}: {c}",
                position: function (pt) {
                    return [pt[0], '10%'];
                },
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '6%',
                right: '4%',
                bottom: '6%',
                containLabel: true
            },
            xAxis : [
                {
                    axisLine:{     
                        lineStyle:{
                            color:'#878D93',
                            // width:8 ,    //大
                            width:2     //小
                        }
                    },
                    axisLabel: {         
                        show: true,
                        textStyle: {
                            // fontSize:'60',   //大
                            fontSize:'14'   //小
                        }
                    },
                    type : 'category',
                    data : this.state.powerWeek,
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis : [
                {
                    axisLine:{
                        lineStyle:{
                            color:'#878D93',
                            // width:8,     //大
                            width:2      //小
                        }
                    },
                    axisLabel: { 
                        show: true,
                        textStyle: {
                            // fontSize:'60' ,      //大
                            fontSize:'14'       //小

                        }
                    },
                    type : 'value',
                    splitLine:{
                　　　　show:false  //辅助线不显示
                    },
                }
            ],
            series : [
                {
                    // name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:this.state.powerPower
                }
            ]
        })
    }
    // 地图
    centerTop=(reductionMax,reductionMin)=>{
        console.log(reductionMax)
        var myChart = echarts.init(document.getElementById('ctCont'));
        var geoCoordMap = {
            "上海市":[121.48,31.22],
            "福建省":[119.3,26.08],
            "山西省":[112.53,37.87],
            "辽宁省":[123.38,41.8],
            "吉林省":[125.35,43.88],
            "宁夏":[106.27,38.47],
            "内蒙古":[111.65,40.82],
            "陕西省":[108.95,34.27],
            "江苏省":[118.78,32.04],
            "北京市":[116.46,39.92],
            "新疆":[87.68,43.77],
            "浙江省":[120.19,30.26],
            "山东省":[117,36.65],
            "甘肃省":[103.73,36.03],
            "天津市":[117.2,39.13],
            "河南省":[113.65,34.76],
            "黑龙江省":[126.63,45.75],
            "河北省":[114.48,38.03],
            "安徽省":[117.27,31.86]
        };
        
        var convertData = function (data) {
            console.log(data)
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
       var option={
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    console.log(params)
                    return params.name + ' : ' + params.value[2];
                }
            },
            // 圈的颜色
            visualMap: {
                inRange: {
                    color: ['#5BF2FB']
                },
                show: false   //图例不显示
            },
            geo: {
                map: 'china',
                roam :true,
                zoom:1.2,
                scaleLimit:{
                    min:0.7
                },
                itemStyle:{
                    areaColor : '#114382',
                    borderColor:'#2D7FBD',
                    // borderWidth :7,            //大
                    borderWidth :2,           //小
                    
                },
                emphasis: {   // 高亮选中时
                    borderWidth:1,          //小
                    // borderWidth:4,          //大
                    borderColor:'#fff',
                    areaColor: '#14ACFF',
                    label: {     //高亮后的地图块
                        show: false,
                        color:'#ffffff',      
                        fontSize:20,      //小
                        // fontSize:100,      //大
                    },
                    itemStyle:{
                        areaColor : '#0486FF',     //高亮后的地图块
                        // borderWidth :4,            //大
                        borderWidth :2,           //小
                        
                    },
                 }   ,
                label:{
                    fontSize:20,     //小
                    // fontSize:100,    //大
                    color:'#ffffff',
                    rich:{
                        textBorderWidth :'#ffffff'
                    },
                    textStyle: {
                        color: '#ffffff'
                    }
                }
            },
            
            series: [
                {
                    // name: 'pm2.5',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: convertData(this.state.reductionData),
                    symbolSize: function (val) {   //圈的范围大小
                        console.log(val)
                        console.log(reductionMax)
                        // return val[2];        //大
                        return (val[2] )/(reductionMax-reductionMin)*50;       //小
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#f4e925',
                            shadowBlur: 10,
                            shadowColor: '#333'
                        },
                        emphasis: {
                            borderColor: '#fff',
                            borderWidth: 1
                        }
                    },
                    zlevel: 1
                }
            ]
            
        }
        myChart.setOption(option)
    }
    // 中上
    reductionList=()=>{
       
        Axios.get(HttpUrl+'data/screen/reduction',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                new Promise(resolve => {   //暂注累计碳排量
                    this.setState({
                        reductionSum:res.data.data.sum,
                        reductionMax:res.data.data.max,
                        reductionMin:res.data.data.min
                    })
                    resolve(true)
                })
                
                //数字滚动
                var size = 36;         //小
                // var size=180;              //大
                var columns = Array.from(document.getElementsByClassName('column'));
                var d = undefined,
                    c = undefined;
                var classList = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
                function getClass(n, i2) {
                    return classList.find(function (class_, classIndex) {
                        return i2 - classIndex === n || i2 + classIndex === n;
                    }) || '';
                }
        
                c = this.state.reductionSum;
                console.log( this.state.reductionSum)
                columns.forEach(function (ele, i) {
                    var n = +c[i];
                    var offset = -n * size;
                    ele.style.transform = 'translateY(calc(' + offset + 'px ))';
                    Array.from(ele.children).forEach(function (ele2, i2) {
                        ele2.className = 'num ' + getClass(n, i2);
                    });
                });
                //地图中的数据
                for(let i=0;i<res.data.data.list.length;i++){
                    res.data.data.list[i].name=res.data.data.list[i].province;
                    res.data.data.list[i].value=res.data.data.list[i].reduction;
                    
                    this.state.reductionName.push( res.data.data.list[i].name)
                    this.state.reductionValue.push(res.data.data.list[i].value)
                    this.state.reductionData.push({name:res.data.data.list[i].province,value:res.data.data.list[i].reduction})
                }
                console.log(this.state.reductionMax)
                this.centerTop(this.state.reductionMax,this.state.reductionMin)
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
        })
    }
    //中下
    login=()=>{
        Axios.get(HttpUrl+'data/screen/login',httpConfig).then(res=>{
            console.log(res)
            if(res.data.data.date.length==0&&res.data.data.amount.length==0){
                document.getElementById('cbCont').innerHTML='<div class="noneDatas">暂无数据</div>'
            }
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    loginDate:res.data.data.date,
                    loginAmount:res.data.data.amount
                })
                this.contentBot()
                console.log(res)
                console.log(res.data.data.amount)
                
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
            
        })
    }
    // 折线图
    contentBot=()=>{
        var myChart = echarts.init(document.getElementById('cbCont'));
        myChart.setOption({
            color: {
                type: 'linear',
                
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: '#0098FF ' // 0% 处的颜色
                }, {
                    offset: 0.98, color:' rgba(0,160,233,0.08) '// 100% 处的颜色
                }],
                globalCoord: false, // 缺省为 false
            },
            tooltip: {
                formatter: "{b}: {c}",
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                splitNumber :14,
                axisLine:{
                    lineStyle:{
                        color:'#878D93',
                        // width:8,      //大
                        width:2,      //小
                    }
                },
                axisLabel: { 
                    show: true,
                    textStyle: {
                        // fontSize:'60' ,      //大
                        fontSize:'14' ,      //小
                    }
                },
                type: 'category',
                boundaryGap: false,
                data: this.state.loginDate
            },
            yAxis: {
                axisLine:{
                    lineStyle:{
                        color:'#878D93',
                        // width:8 ,    //大
                        width:2 ,    //小
                    }
                },
                axisLabel: {   
                    show: true,
                    textStyle: {
                        // fontSize:'60' ,    //大
                        fontSize:'14' ,    //小
                    }
                },
                type: 'value',
                splitLine:{
                    　　　　show:false  //辅助线不显示
                        },
                data: [0, 300, 600,900, 1200,  1500]
            },
            series: [{
                data: this.state.loginAmount,
                type: 'line',
                smooth:true,
                areaStyle: {},
                // symbolSize:20,   //拐角大小     大
                symbolSize:5,   //拐角大小     小
                lineStyle:{
                    normal:{ 
                        // width:12, //线条的颜色及宽度     大
                        width:3, //线条的颜色及宽度     小
                     }
                },
            }]
        })
    }
    //右下
    warn=()=>{
        Axios.get(HttpUrl+'data/screen/warn',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                for(let i=0;i<res.data.data.length;i++){
                    res.data.data[i].value=res.data.data[i].amount
                    this.state.warnName.push( res.data.data[i].name)
                    this.state.warnValue.push(res.data.data[i].value)
                    this.state.warnData.push({value:res.data.data[i].value,name:res.data.data[i].name})

                }
                if(res.data.data.length==0){
                    document.getElementById('rbCont').innerHTML='<div class="noneDatas">暂无数据</div>'
                }
                console.log(this.state.warnName)
                console.log(this.state.warnValue)
                console.log(this.state.warnData)
                this.rbCont()
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
        })
    }
    //饼图
    rbCont=()=>{
        var myChart = echarts.init(document.getElementById('rbCont'));
        myChart.setOption({
            // tooltip: {
            //     trigger: 'item',
            //     formatter: "{b}: {c} ({d}%)"
            // },
            color:['#6EBA5C', '#FF7865','#33C1F4','#FC9845','#6D84EF'],
            legend: {
                // itemHeight :80,    //图例色块       大
                // itemWidth :130,     //图例色块      大
                // itemGap :100,    //图例行之间位置    大

                itemHeight :16,    //图例色块       小
                itemWidth :26,     //图例色块      小
                itemGap :20,    //图例行之间位置    小
                left:'3%',
                top:'center',
                orient: 'vertical',
                x: 'left',
                data:this.state.warnName,
                // textStyle:{             //大
                //     color:'#ffffff',
                //     fontSize:75
                // },
                textStyle:{            //小
                    color:'#ffffff',
                    fontSize:15
                },
                
            },
            series: [
                {
                    center:['67%','center'],//调整饼图位置
                    // name:'访问来源',
                    type:'pie',
                    radius: ['38%', '63%'],//饼图大小
                    avoidLabelOverlap: true,//引导线后的数据不重叠
                    label: {    
                        normal: {
                            show: true,
                            position: 'outside',
                            color:'#ffffff',
                            fontSize:16,   //小
                            // fontSize:80,     //大
                            formatter: '{d}%'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: 20,       //小
                                // fontSize:86,     //大
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,  //显示引导线
                            length :10,          //小
                            length2 :10,          //小
                            // length :50,           //大
                            // length2 :50,         //大
                        }
                    },
                    data:this.state.warnData,
                    itemStyle:{ 
                        normal:{ 
                              label:{ 
                                show: true, 
                                formatter: '{b} : {c} ({d}%)' 
                            }, 
                            labelLine :{show:true} 
                        } 
                    } 
                    
                }
            ]
        })
    }
    // 右上
    sumList=()=>{
        Axios.get(HttpUrl+'data/screen/sum',httpConfig).then(res=>{
            console.log(res)
            if(res.status == 200 && res.data.code == '100000'){
                this.setState({
                    amount:res.data.data.amount,
                    online:res.data.data.online,
                    sumKm:res.data.data.sumKm
                })
                this.toThousands(this.state.amount,this.state.online,this.state.sumKm)
                if(res.data.data.amount==''){
                    document.getElementsByClassName('rtCont1')[0].innerHTML='<b>0</b><span>辆</span>';
                }else{
                     document.getElementsByClassName('rtCont1')[0].innerHTML='<b>'+this.state.amount+'</b><span>辆</span>';
                }
                if(res.data.data.online==''){
                    document.getElementsByClassName('rtCont2')[0].innerHTML='<b>0</b><span>辆</span>';
                }else{
                    document.getElementsByClassName('rtCont2')[0].innerHTML='<b>'+this.state.online+'</b><span>辆</span>';
                }
                if(res.data.data.sumKm==''){
                    document.getElementsByClassName('rtCont3')[0].innerHTML='<b>0</b><span>km</span>';
                }else{
                    document.getElementsByClassName('rtCont3')[0].innerHTML='<b>'+this.state.sumKm+'</b><span>km</span>';
                }
            }else{
                message.warning('数据请求失败，请重新刷新')
            }
        })
    }
    //三位加逗号
    toThousands=(value,value1,value2)=> {
        var str1 = this.numToString(value);
        console.log(this.state.amount)
        var str2 = this.numToString(value1);
        var str3 = this.numToString(value2);
        this.setState({
            amount:str1,
            online:str2,
            sumKm:str3,

        })
        console.log(str1)
        console.log(str2)
        console.log(str3)
    }
    numToString=(num)=>{
        num = ""+num;
        var nums = num.split(".");
        var arr = new Array();
        var j = 0;
        var aaa = "asdf";
        var msg = ""+nums[0]
        console.log(msg)
        for(var i = msg.length;i >= 0;i -=3){
            if(i-3>0){
                arr[j] = msg.substring(i-3,i);
            }else{
                arr[j] = msg.substring(0,i);
            }
            j++;
        }
        var result = arr[arr.length-1];
        console.log(result)
        for(var k = arr.length-2;k >=0;k--){
            if(result.length > 0){
            result+=",";}
            result+=arr[k];
        }
        if(nums.length == 2){
            result = result + "."+nums[1];
        }
        return result;
    }
    render() {
        return (
            <div className="largeScreenWrap" >
                <div className='wraptitle'>
                    <h1>敏安汽车大数据</h1>
                </div>
                <div className='wrapContent'>
                    {/* 左部分内容 */}
                    <div className='contLeft'>
                        {/* 左上部分 */}
                        <div className='leftTop'>
                            <div className='ltTitle'>近7日累计行驶里程排行TOP10</div>
                            <div className='ltcont'>
                                <div className='largeMenuTit'>
                                    <span>排行</span>
                                    <span>VIN</span>
                                    <span>行驶里程</span>
                                </div>
                                <div className='largeMenuCot'>
                                    <ul className='numbersTop'>
                                        <li><span>1</span></li><li><span>2</span></li><li><span>3</span></li><li><span>4</span></li><li><span>5</span></li><li><span>6</span></li><li><span>7</span></li><li><span>8</span></li><li><span>9</span></li><li><span>10</span></li>
                                    </ul>
                                    <ul className='vinss'>
                                        {/* {this.state.vins} */}
                                    </ul>
                                    <ul className='amountss'>
                                        {/* {this.state.amounts} */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* 左下部分 */}
                        <div className='leftBottom'>
                            <div  className='lbTitle'><b>近7日全国能耗统计</b><span>单位：kw*h</span></div>
                            <div className='lbcont' id='lbcont'>

                            </div>
                        </div>
                        
                    </div>
                    {/* 中部分 */}
                    <div className='contCenter'>
                        {/* 中上 */}
                        <div className='centerTop'>
                            <div className='ctTitle'>全国碳减排分布</div>
                            <div className='ctConts'>
                                <div className='ctcTit'>
                                    <div className='leijiTan'> 累计碳减排</div>
                                    <div className='numsTan'>
         {/* -----------------小----------------- --------------------------*/}
                                    <div className='backgroundPosition'>
                                        <div></div><div></div><div style={{marginRight:14}}></div><div></div><div></div><div style={{marginRight:13}}></div><div></div><div></div><div></div>
                                        <b style={{fontWeight:300,fontSize:20,paddingLeft:15}}>kg</b>
                                    </div>
       {/* -------------------大--------------------- -------------------------*/}
                                    {/* <div className='backgroundPosition'>
                                        <div></div><div></div><div style={{marginRight:70}}></div><div></div><div></div><div style={{marginRight:65}}></div><div></div><div></div><div></div>
                                        <b style={{fontWeight:300,fontSize:100,paddingLeft:75}}>kg</b>
                                    </div> */}
                                    <div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="colon">,</div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="colon">,</div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        <div class="column">
                                            <div class="num">0</div>
                                            <div class="num">1</div>
                                            <div class="num">2</div>
                                            <div class="num">3</div>
                                            <div class="num">4</div>
                                            <div class="num">5</div>
                                            <div class="num">6</div>
                                            <div class="num">7</div>
                                            <div class="num">8</div>
                                            <div class="num">9</div>
                                        </div>
                                        </div>
                                   </div>
                                </div>   
                                <div className='nowTimes'>{this.timess}</div>
                                {console.log(this.timess)}
                                {/* 地图 */}
                                <div id='ctCont'>
                                    
                                </div>
                            </div>
                        </div>
                        {/* 中下 */}
                        <div className='centerBottom'>
                            <div className='cbTitle'><b>近7日车辆在线数量分析</b><span>单位：辆</span></div>
                            <div className='cbCont' id='cbCont'>

                            </div>
                        </div>
                    </div>
                    {/* 右部分 */}
                    <div className='contRight'>
                         {/* 右上部分 */}
                        <div className='leftTop'>
                            <div>
                                <div className='rtTitle'>全国登记车辆总数</div>
                                <div className='rtCont'>
                                    <div className='reContImg1'></div>
                                    <div className='rtCont1'></div>
                                </div>
                            </div>
                            <div>
                                <div className='rtTitle rtTits'>当前在线车辆总数</div>
                                <div className='rtCont'>
                                    <div className='reContImg2'></div>
                                    <div className='rtCont2'></div>
                                </div>
                            </div>
                            <div>
                                <div className='rtTitle rtTits'>累计行驶里程</div>
                                <div className='rtCont'>
                                    <div className='reContImg3'></div>
                                    <div className='rtCont3'><b>{this.state.sumKm}</b><span>km</span></div>
                                </div>
                            </div>
                            
                        </div>
                        {/* 右下部分 */}
                        <div className='leftBottom rightBottom'>
                            <div  className='rbTitle'><b>近7日全国常见故障占比</b></div>
                            <div className='rbCont' id='rbCont'>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )}
}

const largeScreens = Form.create()(largeScreen);
export default largeScreens;
