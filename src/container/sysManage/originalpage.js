/**
 * Created by ts on 2018/11/28.
 */
import React, { Component } from 'react';

import {Row,Col} from 'antd';
import pictureLeft from './../../img/constructing.png';



class original extends Component {
    constructor(props, context) {
        super(props, context);
    }
    state = {
        number:{
            value:''
        },
        
       
    }
    componentDidMount(){
           
    }

    render() {
    
       
        return (
            <div className="content" >
                
                    <div className="pic">
                        
                        <img src={pictureLeft}/>
                           <div style={{marginLeft:73,marginTop:20,display:'inline-block'}}>
                               <div><span style={{fontSize:28}}>页面正在建设中...</span></div>
                               <div><span style={{fontSize:18,color:'#599CFC'}}>COMEING SOON</span></div>
                               <div><span style={{fontSize:14}}>即将开发，敬请期待！</span></div>
                           </div>
                            
                    </div>
                    <div>
                        
                        
                           
                            
                    </div>
               
                <style>
                    {`
                 .pic {    margin-left: 12%;margin-top: 12%;}

                `}
                </style>
            </div>
        )
    }
}

export default original;