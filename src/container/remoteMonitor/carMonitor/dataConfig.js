import React from 'react'
import {Modal,Form,Col,Input, Radio, message} from 'antd'
import {postAxios} from './../../../util/common'
import remoteUrl from './../remoteURL'

const FromItem = Form.Item;
const RadioGroup = Radio.Group;
class dataConfigs extends React.Component{
    constructor(){
        super()
        this.state={

        }
    }
    handleOk=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    setParams:values,
                    vin:this.props.vin
                }
                postAxios(remoteUrl.carMsetparams,params,(data)=>{
                    if(data.code=='100000'){
                        this.props.carConfigCancel()
                        message.success('设置成功！')
                    }else{
                        message.error('设置失败！')
                    }
                })
            }
        });
    }
    render(){
        const { getFieldDecorator }=this.props.form
        return(
            <div>
                <Modal
                width="904px"
                title="参数设置"
                visible={this.props.configVisable}
                cancelText={"取消"}
                okText={"确定"}
                onOk={this.handleOk}
                destroyOnClose
                onCancel={this.props.carConfigCancel}
                >
                <Form layout='inline'>
                    <Col span={12}>
                        <FromItem label="车载终端本地存储时间周期" labelCol={15}>
                        { getFieldDecorator('1'
                        )( 
                            < Input addonAfter="ms"/>
                        )}
                        </FromItem>
                        <FromItem label="报警时信息上报时间周期" labelCol={15}>
                        { getFieldDecorator('3'
                        )( 
                            < Input  addonAfter="ms"/>
                        )}
                        </FromItem>
                        <FromItem label="远程服务与管理平台域名" labelCol={15}>
                        { getFieldDecorator('5'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                        <FromItem label="车载终端心跳发送周期" labelCol={15}>
                        { getFieldDecorator('9'
                        )( 
                            < Input  addonAfter="s"/>
                        )}
                        </FromItem>
                        <FromItem label="平台应答超时时间" labelCol={15}>
                        { getFieldDecorator('11'
                        )( 
                            < Input  addonAfter="s"/>
                        )}
                        </FromItem>
                        <FromItem label="公共平台域名长度" labelCol={15}>
                        { getFieldDecorator('13'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                        <FromItem label="公共平台端口" labelCol={15}>
                        { getFieldDecorator('15'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                    </Col>
                    <Col span={12}>
                    <FromItem label="正常时信息上报时间周期" labelCol={15}>
                        { getFieldDecorator('2'
                        )( 
                            < Input  addonAfter="s"/>
                        )}
                        </FromItem>
                        <FromItem label="远程服务与管理平台域名长度" labelCol={15}>
                        { getFieldDecorator('4'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                        <FromItem label="远程服务与管理平台端口" labelCol={15}>
                        { getFieldDecorator('6'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                        <FromItem label="终端应答超时时间" labelCol={15}>
                        { getFieldDecorator('10'
                        )( 
                            < Input  addonAfter="s"/>
                        )}
                        </FromItem>
                        <FromItem label={"连续三次登入失败后，到下一次登入的间隔时间"} labelCol={15}>
                        { getFieldDecorator('12'
                        )( 
                            < Input  addonAfter="min"/>
                        )}
                        </FromItem>
                        <FromItem label="公共平台域名" labelCol={15}>
                        { getFieldDecorator('14'
                        )( 
                            < Input />
                        )}
                        </FromItem>
                        <FromItem label="是否处于抽样检测中" labelCol={15}>
                        { getFieldDecorator('16'
                        )( 
                            <RadioGroup>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </RadioGroup>
                        )}
                        </FromItem>
                    </Col>
                </Form>
                </Modal>
                <style>
                    {`
                        .ant-modal-body{overflow: auto;}
                        .ant-row{width:100%}
                        .ant-form-item .ant-form-item-label{width:45%!important;,text-align:right;white-space:pre-wrap;vertical-align: bottom!important;}
                        .ant-form-item-control-wrapper{width:35%;vertical-align: bottom!important;margin-left:10px;}
                    `}
                </style>
            </div>
        )
    }
}
const dataConfig = Form.create()(dataConfigs)
export default dataConfig